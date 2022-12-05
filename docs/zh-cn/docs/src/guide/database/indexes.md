# 使用索引优化查询 {#use-indexes}

通过在数据库中建立索引，可以让数据库在查询时直接检索到对应字段，从而显著提升查询效率。如果没有索引，即使最简单的查询也需要扫描表中的每一条记录，当数据量庞大时还会因为触发慢查询而导致操作失败。

::: tip 建议
一般来说，当记录数小于 10000 时，索引对性能影响较小。因此，当预计某个数据表中的记录数会超过 10000，建议对每个查询均建立索引。
:::

## 创建索引 {#create-indexes}

在控制台的「Database」区域中，选中对应数据表，并切换到「Indexes」页，可以看到当前表的所有索引。

点击右侧的添加索引按钮，在弹出窗口中可以输入要创建的索引信息。

__索引字段（必填）__

选择或输入要建立索引的字段。下拉框中仅会显示一级字段，若想为子字段建立索引请自行输入，例如 `info.location` 代表对 `info` 的 `location` 子字段建立索引。

__索引类型（必选）__

每个字段都需要设置索引类型，包含以下三种：

- ASC：升序索引，即从小到大
- DESC：降序索引，即从大到小
- 2DSPHERE：地理位置索引，参考[基于地理位置查询](/guide/database/geo.html)

__名称（可选）__

为索引设置一个名称，若未设置则会由系统自动生成一个。

__高级选项（可选）__

- UNIQUE：创建为唯一索引，参考[唯一索引](#unique)

点击弹出窗口的「Create」按钮完成创建，成功后可以看到列表中出现了刚才创建的索引。此时相关的查询操作就会经过索引而得到性能优化。

## 单字段索引 {#single-field}

对单一字段建立的 `ASC/DESC` 索引即为「单字段索引（Single Field Indexes）」，例如系统默认的 `{ _id: 'ASC' }` 索引。建立单一索引后，对该字段的查询以及排序操作会被优化。

假设我们有一个记录用户信息的表 `PersonsTable`，包含 `age` 字段。当建立 `{ age: 'ASC' }` 索引后，类似于以下的查询条件都将获得优化：

```js
// Equal conditions
PersonsTable.where({ age: 20 }).find();
// Comparison
PersonsTable.where({ age: db.gt(30) }).find();
// Sort
PersonsTable.where().sort({ age: 1 }).find();
```

::: tip 提示
对于单一索引，`ASC` 和 `DESC` 是等效的，因为索引可以反向读取。因此建立 `{ age: 'ASC' }` 后无需再创建 `{ age: 'DESC' }`。
:::

## 复合索引 {#compound}

通过多个字段组合建立的索引，称为「复合索引（Compound Indexes）」。复合索引一般用来优化多个条件的查询操作，或者多个字段的组合排序。

例如有一个名为 `PersonsTable` 的表，包含 `name` 和 `age` 两个字段。当建立 `{ name: 'ASC', age: 'ASC' }` 的索引后，类似于以下的查询条件将获得优化：

```js
// Equal conditions
PersonsTable.where({ name: 'Micheal', age: 20 }).find();
// Comparison
PersonsTable.where({ name: 'Micheal', age: db.gt(30) }).find();
// Sort
PersonsTable.where().sort({ name: 1, age: 1 }).find();
```

### 复合索引的排序规则 {#compound-sort-order}

复合索引对于字段顺序很敏感，排序的字段顺序必须与索引的字段顺序完全一致。例如对于 `{ name: 'ASC', age: 'ASC' }` 这个索引：

- 可以优化 `sort({ name: 1, age: 1 })`
- **不能**优化 `sort({ age: 1, name: 1 })`

另外，索引是升序还是降序也会影响到是否能优化。例如对于 `{ name: 'ASC', age: 'DESC' }` 这个索引：

- 可以优化 `sort({ name: 1, age: -1 })` 和 `sort({ name: -1, age: 1})`
- **不能**优化 `sort({ name: 1, age: 1})` 和 `sort({ name: -1, age: -1 })`

### 复合索引的前缀规则 {#compound-prefixes}

复合索引可以按前缀截取使用，例如对于 `{ name: 'ASC', age: 'ASC', location: 'ASC' }` 复合索引，可以当作如下三个索引使用：

- `{ name: 'ASC' }`，即可以优化针对 `name` 字段的查询
- `{ name: 'ASC', age: 'ASC' }`，即可以优化针对 `name` 与 `age` 字段的组合查询
- `{ name: 'ASC', age: 'ASC', location: 'ASC' }`，即可以优化针对 `name`、`age` 与 `location` 三个字段的组合查询

前缀截取规则是从左开始的，也就是上述的索引**不能**作为 `{ age: 'ASC', location: 'ASC' }` 使用。

## 唯一索引 {#unique}

「唯一索引（Unique Indexes）」可以保证被索引的字段在全表中值是唯一的，任何导致值重复的插入或更新都会抛出异常。例如系统默认为 `_id` 字段建立的索引就是唯一索引。

::: tip 重要提示
唯一索引会显著降低数据库的插入和更新效率，建议只在类似于「主键」这种具有排他性的字段中使用。
:::

在创建索引的对话框中，展开高级选项并勾选「UNIQUE」，就可以创建一个唯一索引。

::: warning 注意
在创建唯一索引时，需要保证表中已有数据满足唯一性条件，否则会导致创建失败。
:::

### 单字段的唯一索引 {#unique-on-single-field}

对于一个 `{ name: 'ASC' }` 的唯一索引，以下操作都会因为破坏了唯一性而返回错误：

- 表中包含一条 `name` 为 `'Micheal'` 的记录，再插入一条 `name` 为 `'Micheal'` 的记录
- 表中包含一条 `name` 为 `'Micheal'` 的记录，更新另一条记录将 `name` 改为 `'Micheal'`
- 表中包含一条没有 `name` 字段的记录，再插入一条没有 `name` 字段的记录，两条空值也会造成唯一性的破坏

### 唯一复合索引 {#unique-compound}

唯一索引也可以用在[复合索引](#compound)上，这时数据库会保证这些多个字段值的组合起来具有唯一性。

例如对于 `{ name: 'ASC', age: 'ASC' }` 的唯一复合索引，必须 `name` 字段和 `age` 字段的值都相同才会失败。而类似 `{ name: 'Micheal', age: 20 }` 和 `{ name: 'Micheal', age: 30 }` 的两条记录，因为 `age` 字段值不同则可以同时存在。

## 正则查询的索引优化 {#regex}

当使用正则表达式来对某个字段进行查询时，仅当表达式以 `^` 开头时可以使用索引来优化。

例如对于 `{ name: 'ASC' }` 的索引，以下查询可以被优化：

- `PersonsTable.where({ name: /^M/ }).find()`，即查询所有以 `'M'` 开头的记录

而以下查询无法被优化：

- `PersonsTable.where({ name: /foo/ }).find()`，即查询所有包含 `'foo'` 的记录
- `PersonsTable.where({ name: /bar$/ }).find()`，即查询所有以 `'bar'` 结尾的记录

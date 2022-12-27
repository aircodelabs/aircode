# 数据库 API {#api}

本文展示了 `aircode.db` 下的所有 API 说明及其示例。

[[toc]]

## Table {#table}

### `db.table(tableName)`

```js
const PersonsTable = aircode.db.table('persons');
```

根据 `tableName` 获取到对应的 `Table` 对象。

__参数__

- `{string} tableName`：要获取的数据表的名称

__返回__

- `{Table}`：数据表对象

### `Table.save(record | arrayOfRecords)`

```js
const PersonsTable = aircode.db.table('persons');
const record = await PersonsTable.save({
  name: 'Micheal',
  age: 28
});
```

将传入的记录保存到数据库中。若参数中包含 `_id` 字段且在数据库中存在，则执行更新操作，否则执行插入操作。`save` 方法是异步操作，需要用 `await` 来等待其完成。

__参数__

- `{Object} record`：要保存的记录，形式为 `{ field: value, ... }`
- `{Array} arrayOfRecords`：若传入的是一个对象数组，则会一次性保存多条记录

__返回__

- `{Promise<Object | Array>}`：保存后的对象或对象数组

__参考教程__

- [插入数据](/guide/database/insert.html)
- [更新数据](/guide/database/update.html)

---

### `Table.delete(record | arrayOfRecords)`

```js
const PersonsTable = aircode.db.table('persons');
const record = await PersonsTable.where({ name: 'Micheal' }).findOne();
await PersonsTable.delete(record);
```

将传入的记录从数据库中删除，要删除的记录是根据传入参数中的 `_id` 字段来决定的。`delete` 方法是异步操作，需要用 `await` 来等待其完成。

__参数__

- `{Object} record`：要删除的记录，必须包含 `_id` 字段
- `{Array} arrayOfRecords`：若传入的是一个对象数组，则会根据每个对象的 `_id` 字段一次性删除多条记录

__返回__

- `{Promise<Object>}`：删除结果，包含 `deletedCount` 字段，代表被删除的记录数，例如：

```js
{
  deletedCount: 15
}
```

__参考教程__

- [删除数据](/guide/database/delete.html)

---

### `Table.where([conditions])`

```js
const PersonsTable = aircode.db.table('persons');
const records = PersonsTable.where({ name: 'Micheal' }).find();
```

通过 `where` 可以设置查询操作的条件。每个查询都必须以 `Table.where` 开始，这个方法会返回一个 `Query` 对象，后续可以通过链式操作附加其他条件。

`where` 中支持传递 0 到多个参数。传递多个条件时这些条件的关系为「与」，即查询时需要同时满足，例如：

```js
// name = 'Micheal' and age = 20 and location = 'New York'
Table.where({ name: 'Micheal', age: 20 }, { location: 'New York' })
```

__参数__

- `{...Object} [conditions]`：查询条件，形式为 `{ field: value, ... }`

__返回__

- `{Query}`：`Query` 对象，可以附加链式表达式来添加更多查询条件，也可以使用 [Query 指令](#query-commands)来执行操作

__参考教程__

- [查询数据](/guide/database/find.md)

## Query 指令 {#query-commands}

### `Query.find()`

```js
const PersonsTable = aircode.db.table('persons');
const records = await PersonsTable.where().find();
```

根据 `Query` 指定的查询条件获取所有匹配的记录。`find` 方法是异步操作，需要用 `await` 来等待其完成。

__参数__

无

__返回__

- `{Promise<Array>}`：查询结果的数组，若无匹配记录则为 `[]`

__参考教程__

- [查询数据 - 获取所有记录](/guide/database/find.md#find)

---

### `Query.findOne()`

```js
const PersonsTable = aircode.db.table('persons');
const record = await PersonsTable.where({ name: 'Micheal' }).findOne();
```

根据 `Query` 指定的查询条件获取**第一条**匹配的记录。`findOne` 方法是异步操作，需要用 `await` 来等待其完成。

__参数__

无

__返回__

- `{Promise<Object | null>}`：查询到的记录，若无匹配则返回 `null`

__参考教程__

- [查询数据 - 获取单条记录](/guide/database/find.md#findOne)

---

### `Query.count()`

```js
const PersonsTable = aircode.db.table('persons');
const count = await PersonsTable.where().count();
```

根据 `Query` 指定的查询条件获取匹配的记录总条数，不会返回具体的记录值。`count` 方法是异步操作，需要用 `await` 来等待其完成。

__参数__

无

__返回__

- `{Promise<number>}`：查询到的记录总条数

__参考教程__

- [查询数据 - 返回查询结果总条数](/guide/database/find.md#count)

### `Query.save()`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ score: db.lt(60) })
  .set({ pass: false })
  .save();
```

根据 `Query` 指定的条件直接在数据库中执行更新，需要配合 `set` 等[更新链式](#update-chain)使用。整个操作是在数据库中一次性完成的，因此具有原子性，效率也较高。`save` 方法是异步操作，需要用 `await` 来等待其完成。

例如，上述示例会找到 `persons` 数据表中所有 `score` 小于 `60` 的记录，并将其 `pass` 字段设置为 `false`。

__参数__

无

__返回__

- `{Promise<Object>}`：更新结果，包含 `updatedCount` 字段，代表被更新的记录数，例如：

```js
{
  updatedCount: 15
}
```

__参考教程__

- [更新数据 - 直接执行更新](/guide/database/update.html#set-and-save)

### `Query.delete()`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: db.exists(false) })
  .delete();
```

根据 `Query` 指定的条件直接在数据库将对应记录删除。整个操作是在数据库中一次性完成的，因此具有原子性，效率也较高。`delete` 方法是异步操作，需要用 `await` 来等待其完成。

例如，上述示例会将 `persons` 数据表中所有不包含 `name` 字段的记录删除。

__参数__

无

__返回__

- `{Promise<Object>}`：删除结果，包含 `deletedCount` 字段，代表被删除的记录数，例如：

```js
{
  deletedCount: 5
}
```

## 排序和分页链式 {#sort-and-pagination-chain}

### `Query.sort(conditions)`

```js
const PersonsTable = aircode.db.table('persons');
const records = await PersonsTable.where().sort({ age: 1 }).find();
```

为查询添加按字段的排序条件。

__参数__

- `{Object} condtions`：排序条件，形式为 `{ field: order, ... }`，其中 `order` 可以为
  - `1` 或 `asc`，代表正序，即从小到大排序
  - `-1` 或 `desc`，代表倒序，即从大到小排序

__返回__

- `{Query}`：`Query` 对象本身

__参考教程__

- [查询数据 - 排序和分页](/guide/database/find.md#sort-and-pagination)

---

### `Query.skip(n)`

```js
const PersonsTable = aircode.db.table('persons');
const curPage = 2;
const pageSize = 100;
const records = await PersonsTable
  .where({ location: 'Tokyo' })
  .sort({ age: 1 })
  .skip((curPage - 1) * pageSize)
  .limit(pageSize)
  .find();
```

指定查询时跳过 `n` 条记录，一般与 `sort` 和 `limit` 配合使用实现分页查询。

__参数__

- `{number} n`：要跳过的记录数

__返回__

- `{Query}`：`Query` 对象本身

__参考教程__

- [查询数据 - 排序和分页](/guide/database/find.md#sort-and-pagination)

---

### `Query.limit(n)`

```js
const PersonsTable = aircode.db.table('persons');
const curPage = 2;
const pageSize = 100;
const records = await PersonsTable
  .where({ location: 'Tokyo' })
  .sort({ age: 1 })
  .skip((curPage - 1) * pageSize)
  .limit(pageSize)
  .find();
```

限制单次查询返回的记录总条数，一般与 `sort` 和 `skip` 配合使用实现分页查询。

::: tip 重要提示
为了确保查询过程的稳定性，对于查询结果的最大条数有一定限制，即使 `limit` 设置超过这个最大值也不会生效，具体限制请参考：[资源限制 - 数据库 - 查询限制](/about/limits.html#database-find)。
:::

__参数__

- `{number} n`：限制的总条数

__返回__

- `{Query}`：`Query` 对象本身

__参考教程__

- [查询数据 - 排序和分页](/guide/database/find.md#sort-and-pagination)

## 字段筛选链式 {#projection-chain}

### `Query.projection(conditions)`

```js
const PersonsTable = aircode.db.table('persons');
const records = await PersonsTable.where()
  .projection({ name: 1, age: 1 })
  .find();
```

指定查询结果只包含特定的字段。

__参数__

- `{Object} conditions`：字段筛选的条件，形式为 `{ field: value, ... }`，其中 `value` 可以为：
  - `1`，代表结果只包含该字段，其余字段竣备忽略，`_id` 字段为特例，默认会返回
  - `0`，代表忽略该字段，返回其他字段

__结果__

- `{Query}`：`Query` 对象本身

__参考教程__

- [查询数据 - 指定结果只包含特定字段](/guide/database/find.md#projection)

## 更新链式 {#update-chain}

### `Query.set(conditions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ score: db.lt(60) })
  .set({ pass: false, failTime: db.inc(1) })
  .save();
```

用于指定更新时进行的操作，需要在最后使用[指令 `save`](#query-save) 来执行更新。

在 `set` 的参数中，可以有两种方式指定要更新的数据：
- 直接指定要设置的值，例如示例中的 `pass: false` 代表将 `pass` 字段设置为 `false`
- 通过[更新操作符](#update-operators)指定操作，例如示例中的 `failTime: db.inc(1)` 代表将 `failTime` 字段的值增加 `1`

__参数__

- `{Object} conditions`：更新操作，形式为 `{ field: value, ... }`

__返回__

- `{Query}`：`Query` 对象本身

__参考教程__

- [更新数据 - 直接执行更新](/guide/database/update.html#set-and-save)

---

### `Query.upsert([boolean=true])`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: 'Micheal', age: 28 })
  .set({ favorites: [ 'Ski', 'Hiking', 'Sushi' ] })
  .upsert(true)
  .save();
```

用于指定 Upsert 操作，也就是当没有根据条件查询到记录时新创建一个。

例如，在上述示例中：

- 如果匹配到了 `name` 为 `'Micheal'`，`age` 为 `28` 的记录，则会将其 `favorites` 设置为 `[ 'Ski', 'Hiking', 'Sushi' ]`
- 如果没有匹配到，则会创建一个新记录
  ```js
  {
    name: 'Micheal',
    age: 28,
    favorites: [ 'Ski', 'Hiking', 'Sushi' ]
  }
  ```

通过设置 `upsert(true)`，我们能确保更新操作执行完成后，数据库中至少会有一条满足我们条件的记录存在。

__参数__

- `{boolean} [boolean=true]`：指定是否开启 Upsert 操作，默认为 `true`

__返回__

- `{Query}`：`Query` 对象本身

__参考教程__

- [更新数据 - 更新或插入数据（Upsert）](/guide/database/update.html#upsert)

---

### `Query.setOnInsert(object)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: 'Micheal', age: 28 })
  .set({ favorites: [ 'Ski', 'Hiking', 'Sushi' ] })
  .setOnInsert({ score: 0 })
  .upsert(true)
  .save();
```

用于指定 Upsert 在执行插入操作时要设置的值。`setOnInsert` 必须配合 `upsert(true)` 使用，否则将不生效。

例如，在上述示例中：

- 如果匹配到了 `name` 为 `'Micheal'`，`age` 为 `28` 的记录，则会将其 `favorites` 设置为 `[ 'Ski', 'Hiking', 'Sushi' ]`。此时因为没有触发插入操作，`setOnInsert` 不生效
- 如果没有匹配到，则会创建一个新记录
  ```js
  {
    name: 'Micheal',
    age: 28,
    favorites: [ 'Ski', 'Hiking', 'Sushi' ],
    score: 0
  }
  ```

通过使用 `setOnInsert`，我们能在新创建对象时设置一些默认值，而在执行更新时则不会影响已经存在的值。

__参数__

- `{Object} object`：执行插入操作时要设置的值，形式为 `{ field: value, ... }`

__返回__

- `{Query}`：`Query` 对象本身

__参考教程__

- [更新数据 - 更新或插入数据（Upsert）](/guide/database/update.html#upsert)

## 逻辑链式 {#logical-chain}

### `Query.and(...filters)`

```js
// f1 && f2
Table.where(f1).and(f2);
// f1 && (f2 && f3)
Table.where(f1).and(f2, f3);
```

通过链式的方式为多个查询条件添加「与」的关系。

__参数__

- `{Object} ...filters`：查询条件，至少包含一个

__返回__

- `{Query}`：`Query` 对象本身

__参考教程__

- [查询数据 - 使用逻辑操作符组合多个查询条件](/guide/database/find.html#logical-operator)

---

### `Query.or(...filters)`

```js
// f1 || f2
Table.where(f1).or(f2);
// f1 || (f2 || f3)
Table.where(f1).or(f2, f3);
```

通过链式的方式为多个查询条件添加「或」的关系。

__参数__

- `{Object} ...filters`：查询条件，至少包含一个

__返回__

- `{Query}`：`Query` 对象本身

__参考教程__

- [查询数据 - 使用逻辑操作符组合多个查询条件](/guide/database/find.html#logical-operator)

---

### `Query.nor(...filters)`

```js
// !(f1 || f2)
Table.where(f1).nor(f2);
// !(f1 || !(f2 || f3))
Table.where(f1).nor(f2, f3);
```

通过链式的方式为多个查询条件添加「或非」的关系，也就是所有条件都为 `false`。

__参数__

- `{Object} ...filters`：查询条件，至少包含一个

__返回__

- `{Query}`：`Query` 对象本身

__参考教程__

- [查询数据 - 使用逻辑操作符组合多个查询条件](/guide/database/find.html#logical-operator)

## 对比操作符 {#comparison-operators}

### `db.gt(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable.where({ age: db.gt(20) }).find();
```

用于设置查询时某个字段的值大于（>）指定的 `value`。

__参数__

- `{*} value`：查询时要大于的值

__返回__

- `{Object}`：查询条件，指定到具体字段上

__参考教程__

- [查询数据 - 按大于、小于等比较条件查询](/guide/database/find.md#comparison)
- [查询数据 - 按时间区间查询](/guide/database/find.md#date)

---

### `db.gte(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable.where({ age: db.gte(20) }).find();
```

用于设置查询时某个字段的值大于或等于（>=）指定的 `value`。

__参数__

- `{*} value`：查询时要大于或等于的值

__返回__

- `{Object}`：查询条件，指定到具体字段上

__参考教程__

- [查询数据 - 按大于、小于等比较条件查询](/guide/database/find.md#comparison)
- [查询数据 - 按时间区间查询](/guide/database/find.md#date)

---

### `db.lt(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable.where({ age: db.lt(50) }).find();
```

用于设置查询时某个字段的值小于（<）指定的 `value`。

__参数__

- `{*} value`：查询时要小于的值

__返回__

- `{Object}`：查询条件，指定到具体字段上

__参考教程__

- [查询数据 - 按大于、小于等比较条件查询](/guide/database/find.md#comparison)
- [查询数据 - 按时间区间查询](/guide/database/find.md#date)

---

### `db.lte(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable.where({ age: db.lte(50) }).find();
```

用于设置查询时某个字段的值小于或等于（<=）指定的 `value`。

__参数__

- `{*} value`：查询时要小于或等于的值

__返回__

- `{Object}`：查询条件，指定到具体字段上

__参考教程__

- [查询数据 - 按大于、小于等比较条件查询](/guide/database/find.md#comparison)
- [查询数据 - 按时间区间查询](/guide/database/find.md#date)

---

### `db.ne(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable.where({ blocked: db.ne(true) }).find();
```

用于设置查询时某个字段的值不等于指定的 `value`。

另外如果某条记录不包含该字段，也会被查询到。例如对于记录：

```js
{
  name: Micheal,
  location: 'New York'
}
```

使用如下条件查询：

```js
where({
  blocked: db.ne(true)
})
```

由于该记录中不存在 `blocked` 字段，则也满足 `db.ne` 的条件，因此该记录会被查询到。

__参数__

- `{*} value`：查询时字段不等于的值

__返回__

- `{Object}`：查询条件，指定到具体字段上

__参考教程__

- [查询数据 - 按大于、小于等比较条件查询](/guide/database/find.md#comparison)

---

### `db.in(array)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ name: db.in([ 'Micheal', 'Mary' ]) })
  .find();
```

用于设置查询时，某个字段的值与 `array` 中的任意元素相等。

如果被查询的字段本身的值也是数组，则只需要这个字段的数组中任意一个元素存在于 `array` 即可。例如，对于如下记录：

```js
{
  name: 'Micheal',
  favorites: [ 'Ski', 'Hiking', 'Sushi' ]
}
```

使用如下条件查询：

```js
where({
  favorites: db.in([ 'Ski', 'Football' ])
})
```

由于该记录 `favorites` 数组的 `'Ski'` 存在于 `db.in` 条件的数组中，因此该记录会被查询到。

__参数__

- `{Array} array`：用于查询的数组条件

__返回__

- `{Object}`：查询条件，指定到具体字段上

__参考教程__

- [查询数据 - 按大于、小于等比较条件查询](/guide/database/find.md#comparison)

---

### `db.nin(array)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ location: db.nin([ 'Tokyo', 'London' ]) })
  .find();
```

用于设置查询时，某个字段的值满足以下条件之一：

- 该字段的值不在指定 `array` 中
- 该记录不包含此字段

如果被查询的字段本身的值也是数组，则需要满足这个字段的数组中**没有一个**元素存在于 `array`。例如，对于如下记录：

```js
{
  name: 'Micheal',
  favorites: [ 'Ski', 'Hiking', 'Sushi' ]
}
```

使用如下条件查询：

```js
where({
  favorites: db.nin([ 'Ski', 'Football' ])
})
```

由于该记录 `favorites` 数组的 `'Ski'` 存在于 `db.nin` 条件的数组中，因此该记录**不会**被查询到。

__参数__

- `{Array} array`：用于查询的数组条件

__返回__

- `{Object}`：查询条件，指定到具体字段上

__参考教程__

- [查询数据 - 按大于、小于等比较条件查询](/guide/database/find.md#comparison)

## 元素操作符 {#element-operators}

### `db.exists(boolean)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ name: db.exists(true) })
  .find();
```

用于设置查询时，某个字段在记录中是否存在：

- 若 `boolean` 为 `true`，则查询所有包含该字段的记录，包括字段值为 `null` 的记录
- 若 `boolean` 为 `false`，则查询所有不包含该字段的记录

__参数__

- `{boolean} boolean`：指定是否包含该字段

__返回__

- `{Object}`：查询条件，指定到具体字段上

---

### `db.type(typeString)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ tags: db.type('array') })
  .find();
```

用于设置查询时，某个字段的值类型是指定的 `typeString`。

__参数__

- `{string} typeString`：类型字符串，可用的类型见下表

  | 类型 | `typeString` |
  | ---- | ---- |
  | Number | `'number'` |
  | String | `'string'` |
  | Object | `'object'` |
  | Array | `'array'` |
  | Binary data | `'binData'` |
  | Boolean | `'bool'` |
  | Date | `'date'` |
  | Null | `'null'` |
  | Regular Expression | `'regex'` |
  | JavaScript | `'javascript'` |
  | 32-bit integer | `'int'` |
  | 64-bit integer | `'long'` |
  | Double | `'double'` |
  | Decimal128 | `'decimal'` |
  | Timestamp | `'timestamp'` |

__返回__

- `{Object}`：查询条件，指定到具体字段上

## 评估操作符 {#evaluation-operators}

### `db.mod(divisor, remainder)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ age: db.mod(5, 0) })
  .find();
```

用于设置查询时，某个字段的值除以 `divisor` 后余数为 `remainder`。其中 `divisor` 和 `remainder` 都必须是整数，否则会执行出错。

__参数__

- `{number} divisor`：除数，必须是整数
- `{number} remainder`：余数，必须是整数

__返回__

- `{Object}`：查询条件，指定到具体字段上

## 数组操作符 {#array-operators}

### `db.all(array)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ favorites: db.all([ 'Ski', 'Hiking' ]) })
  .find();
```

用于设置查询时，某个字段的值是数组类型，且包含 `array` 中的所有元素。

例如在这个示例中：
- 若某个记录的 `favorites` 为 `[ 'Ski', 'Hiking', 'Sushi' ]`，则会被查询到
- 若某个记录的 `favorites` 为 `[ 'Ski', 'Football' ]`，则由于不包含 `'Hiking'` 而不会被查询到

::: tip 提示
如果希望任意元素在条件中都能被查询到，可以使用 [`db.in`](#db-in-array) 操作符。
:::

__参数__

- `{Array} array`：用于查询的数组条件

__返回__

- `{Object}`：查询条件，指定到具体字段上

---

### `db.elemMatch(conditions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ results: db.elemMatch(db.gt(60).lt(80)) })
  .find();
```

用于设置查询时，某个字段的值是数组类型，且数组里面至少有一个元素满足 `conditions` 指定的所有条件。

上述示例就是查询 `results` 数组中至少有一个值大于 `60`，小于 `80` 的记录。例如对于以下三条记录：

```js
{ name: 'Micheal', results: [ 30, 50, 90 ] }
{ name: 'Mary', results: [ 20, 70, 100 ] }
{ name: 'Isabel', results: [ 50, 100, 120 ] }
```

则会查询到如下记录，因为其 `results` 中包含一个 `70` 介于 `60` 和 `80` 之间：

```js
{ name: 'Mary', results: [ 20, 70, 100 ] }
```

__设置子字段匹配__

若数组中的元素是 `Object`，`elemMatch` 方法还可以指定其子字段的匹配条件。例如对于如下记录：

```js
{
  item: 'iPhone',
  inventories: [
    { location: 'Beijing', qty: 100 },
    { location: 'New York', qty: 30 },
    { location: 'Tokyo', qty: 120 },
  ]
}
{
  item: 'MacBook',
  inventories: [
    { location: 'London', qty: 20 },
    { location: 'New York', qty: 200 },
    { location: 'Sidney', qty: 60 },
  ]
}
{
  item: 'iPad',
  inventories: [
    { location: 'Beijing', qty: 80 },
    { location: 'London', qty: 25 },
    { location: 'Tokyo', qty: 90 },
  ]
}
```

使用如下查询条件：

```js
where({
  inventories: db.elemMatch({
    location: 'New York',
    qty: db.gt(100)
  })
})
```

会返回如下记录，因为其 `inventories` 中包含一个元素，`location` 是 `'New York'` 且 `qty` 大于 `100`：

```js
{
  item: 'MacBook',
  inventories: [
    { location: 'London', qty: 20 },
    { location: 'New York', qty: 200 },
    { location: 'Sidney', qty: 60 },
  ]
}
```

__参数__

- `{Object} conditions`：指定数组中元素要匹配的条件

__返回__

- `{Object}`：查询条件，指定到具体字段上

---

### `db.size(n)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ favorites: db.size(2) })
  .find();
```

用于设置查询时，某个字段的值是数组类型，且数组元素的个数是 `n`。

__参数__

- `{number} n`：指定数组的元素个数

__返回__

- `{Object}`：查询条件，指定到具体字段上

## 位操作符 {#bitwise-operators}

### `db.bitsAllClear(positions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ age: db.bitsAllClear([ 1, 5 ]) })
  .find();
```

用于设置查询时，某个字段的值是数字或二进制数据，且其二进制值中对应于 `positions` 指定的位置都是 `0`。

二进制数据的位置是如下确定的，注意最低位是**第 0 位**：

| Bit Value | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Position | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |

对于示例中的查询条件，则要求第 1 位和第 5 位为 `0`。例如：

- `age` 为 `20` 时，其二进制值为 `00010100`，满足条件
- `age` 为 `22` 时，其二进制值为 `00010110`，不满足条件

__参数__

- `{Array} positions`：指定二进制数据中要满足条件的位置

__返回__

- `{Object}`：查询条件，指定到具体字段上

---

### `db.bitsAllSet(positions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ age: db.bitsAllSet([ 1, 5 ]) })
  .find();
```

用于设置查询时，某个字段的值是数字或二进制数据，且其二进制值中对应于 `positions` 指定的位置都是 `1`。

二进制数据的位置是如下确定的，注意最低位是**第 0 位**：

| Bit Value | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Position | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |

对于示例中的查询条件，则要求第 1 位和第 5 位为 `1`。例如：

- `age` 为 `38` 时，其二进制值为 `00100110`，满足条件
- `age` 为 `6` 时，其二进制值为 `00000110`，不满足条件

__参数__

- `{Array} positions`：指定二进制数据中要满足条件的位置

__返回__

- `{Object}`：查询条件，指定到具体字段上

---

### `db.bitsAnyClear(positions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ age: db.bitsAnyClear([ 1, 5 ]) })
  .find();
```

用于设置查询时，某个字段的值是数字或二进制数据，且其二进制值中对应于 `positions` 指定的位置有任意一个是 `0`。

二进制数据的位置是如下确定的，注意最低位是**第 0 位**：

| Bit Value | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Position | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |

对于示例中的查询条件，则要求第 1 位和第 5 位中任意一位为 `0`。例如：

- `age` 为 `52` 时，其二进制值为 `00110100`，满足条件
- `age` 为 `22` 时，其二进制值为 `00010110`，满足条件
- `age` 为 `54` 时，其二进制值为 `00110110`，不满足条件

__参数__

- `{Array} positions`：指定二进制数据中要满足条件的位置

__返回__

- `{Object}`：查询条件，指定到具体字段上

---

### `db.bitsAnySet(positions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ age: db.bitsAnyClear([ 1, 5 ]) })
  .find();
```

用于设置查询时，某个字段的值是数字或二进制数据，且其二进制值中对应于 `positions` 指定的位置有任意一个是 `1`。

二进制数据的位置是如下确定的，注意最低位是**第 0 位**：

| Bit Value | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Position | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |

对于示例中的查询条件，则要求第 1 位和第 5 位中任意一位为 `1`。例如：

- `age` 为 `52` 时，其二进制值为 `00110100`，满足条件
- `age` 为 `22` 时，其二进制值为 `00010110`，满足条件
- `age` 为 `20` 时，其二进制值为 `00010100`，不满足条件

__参数__

- `{Array} positions`：指定二进制数据中要满足条件的位置

__返回__

- `{Object}`：查询条件，指定到具体字段上

## 地理位置对象 {#geospatial-objects}

地理位置对象是符合一定格式的 JavaScript 对象，可以用于[地理位置查询](/guide/database/geo.html)。

每个地理位置对象都包含以下两个字段：

- `type`：指定这个对象的类型，具体支持的类型见下方文档
- `coordinates`：指定这个对象的地理坐标

::: tip 重要提示
当用经纬度来表示坐标时，__经度在前，纬度在后__。
- 经度值为 -180 到 180，正数代表东经，负数代表西经
- 纬度值为 -90 到 90，正数代表北纬，负数代表南纬
:::

### `Point`

代表地理位置中的一个点，例如：

```js
{ type: 'Point', coordinates: [ 40, 5 ] }
```

---

### `LineString`

代表由两个点确定的一条线段，例如：

```js
{ type: 'LineString', coordinates: [ [ 40, 5 ], [ 41, 6 ] ] }
```

---

### `Polygon`

代表一个多边形，分为两种。

__只有一个闭环的多边形对象：__

```js
{
  type: 'Polygon',
  coordinates: [ [ [ 0, 0 ], [ 3, 6 ], [ 6, 1 ], [ 0, 0  ] ] ]
}
```

__包含多个闭环的多边形对象：__

```js
{
  type: 'Polygon',
  coordinates: [
    [ [ 0, 0 ], [ 3, 6 ], [ 6, 1 ], [ 0, 0 ] ],
    [ [ 2, 2 ], [ 3, 3 ], [ 4, 2 ], [ 2, 2 ] ]
  ]
}
```

---

### `MultiPoint`

代表多个点对象的集合，例如：

```js
{
  type: 'MultiPoint',
  coordinates: [
    [ -73.9580, 40.8003 ],
    [ -73.9498, 40.7968 ],
    [ -73.9737, 40.7648 ],
    [ -73.9814, 40.7681 ]
  ]
}
```

---

### `MultiLineString`

代表多条线段的集合，例如：

```js
{
  type: 'MultiLineString',
  coordinates: [
    [ [ -73.96943, 40.78519 ], [ -73.96082, 40.78095 ] ],
    [ [ -73.96415, 40.79229 ], [ -73.95544, 40.78854 ] ],
    [ [ -73.97162, 40.78205 ], [ -73.96374, 40.77715 ] ],
    [ [ -73.97880, 40.77247 ], [ -73.97036, 40.76811 ] ]
  ]
}
```

---

### `MultiPolygon`

代表多个多边形的集合，例如：

```js
{
  type: 'MultiPolygon',
  coordinates: [
    [ [ [ -73.958, 40.8003 ], [ -73.9498, 40.7968 ], [ -73.9737, 40.7648 ], [ -73.9814, 40.7681 ], [ -73.958, 40.8003 ] ] ],
    [ [ [ -73.958, 40.8003 ], [ -73.9498, 40.7968 ], [ -73.9737, 40.7648 ], [ -73.958, 40.8003 ] ] ]
  ]
}
```

---

### `GeometryCollection`

地理集合对象，包含了多个不同类型的地理对象的集合，例如：

```js
{
  type: 'GeometryCollection',
  geometries: [
    {
      type: 'MultiPoint',
      coordinates: [
        [ -73.9580, 40.8003 ],
        [ -73.9498, 40.7968 ],
        [ -73.9737, 40.7648 ],
        [ -73.9814, 40.7681 ]
      ]
    },
    {
      type: 'MultiLineString',
      coordinates: [
        [ [ -73.96943, 40.78519 ], [ -73.96082, 40.78095 ] ],
        [ [ -73.96415, 40.79229 ], [ -73.95544, 40.78854 ] ],
        [ [ -73.97162, 40.78205 ], [ -73.96374, 40.77715 ] ],
        [ [ -73.97880, 40.77247 ], [ -73.97036, 40.76811 ] ]
      ]
    }
  ]
}
```

## 地理操作符 {#geospatial-operators}

### `db.geoIntersects(conditions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({
    position: db.geoIntersects({
      $geometry: {
        type: 'Polygon',
        coordinates: [ [ [ 0, 0 ], [ 3, 6 ], [ 6, 1 ], [ 0, 0  ] ] ]
      }
    })
  }).find();
```

用于设置查询时，某个字段的地理位置与 `conditions` 指定的地理对象有交集。

__参数__

- `{Object} conditions`：地理查询条件，其中 `$geometry` 的值为[地理位置对象](#geospatial-objects)

__返回__

- `{Object}`：查询条件，指定到具体字段上

__参考教程__

- [基于地理位置查询](/guide/database/geo.html)

---

### `db.geoWithin(conditions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({
    position: db.geoWithin({
      $geometry: {
        type: 'Polygon',
        coordinates: [ [ [ 0, 0 ], [ 3, 6 ], [ 6, 1 ], [ 0, 0  ] ] ]
      }
    })
  }).find();
```

用于设置查询时，某个字段的地理位置完全位于 `conditions` 指定的地理对象内部。

__参数__

- `{Object} conditions`：地理查询条件，其中 `$geometry` 的值为[地理位置对象](#geospatial-objects)

__返回__

- `{Object}`：查询条件，指定到具体字段上

__参考教程__

- [基于地理位置查询](/guide/database/geo.html)

---

### `db.near(conditions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({
    position: db.near({
      $geometry: {
        type: 'Point',
        coordinates: [ -73.9855, 40.7580 ]
      },
      $maxDistance: 2000, // in meters
      $minDistance: 100   // in meters
    })
  }).find();
```

用于设置查询时，某个字段的地理位置位于 `conditions` 指定的地理对象附近一定**平面**距离。

__参数__

- `{Object} conditions`：地理查询条件，其中：
  - `$geometry` 的值为[地理位置对象](#geospatial-objects)
  - `$maxDistance` 的值为最大距离，单位是米
  - `$minDistance` 的值为最小距离，单位是米

__返回__

- `{Object}`：查询条件，指定到具体字段上

__参考教程__

- [基于地理位置查询](/guide/database/geo.html)

---

### `db.nearSphere(conditions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({
    position: db.nearSphere({
      $geometry: {
        type: 'Point',
        coordinates: [ -73.9855, 40.7580 ]
      },
      $maxDistance: 2000, // in meters
      $minDistance: 100   // in meters
    })
  }).find();
```

用于设置查询时，某个字段的地理位置位于 `conditions` 指定的地理对象附近一定**球面**距离。与 `near` 最大的不同是 `nearSphere` 在计算距离时会使用球面几何的算法，从而更接近在地球上的真实表面距离。

__参数__

- `{Object} conditions`：地理查询条件，其中：
  - `$geometry` 的值为[地理位置对象](#geospatial-objects)
  - `$maxDistance` 的值为最大距离，单位是米
  - `$minDistance` 的值为最小距离，单位是米

__返回__

- `{Object}`：查询条件，指定到具体字段上

__参考教程__

- [基于地理位置查询](/guide/database/geo.html)

## 更新操作符 {#update-operators}

### `db.inc(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: 'Micheal' })
  .set({ score: db.inc(5) })
  .save();
```

用于 [`set`](#query-set-conditions) 方法中，指定更新时将对应字段的值增加 `value`。如果对应字段不存在，则会创建这个字段并将其值设置为 `value`。

::: tip 提示
如果 `value` 值为负数，则相当于减少对应字段的值。
:::

__参数__

- `{number} value`：指定要增加的值

__返回__

- `{Object}`：更新条件，指定到具体字段上

---

### `db.mul(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: 'Micheal' })
  .set({ score: db.mul(2.5) })
  .save();
```

用于 [`set`](#query-set-conditions) 方法中，指定更新时将对应字段的值乘以 `value`。如果对应字段不存在，则会创建这个字段并将其值设置为 `0`。

__参数__

- `{number} value`：指定要乘以的值

__返回__

- `{Object}`：更新条件，指定到具体字段上

---

### `db.min(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: 'Micheal' })
  .set({ score: db.min(60) })
  .save();
```

用于 [`set`](#query-set-conditions) 方法中，指定更新时选取当前字段值与 `value` 中较小的值。即：

- 当 `value` 小于当前字段值时，将当前字段设置为 `value`
- 否则，不变更

如果对应字段不存在，则会创建这个字段并将其值设置为 `value`。

__参数__

- `{any} value`：指定用于对比的值

__返回__

- `{Object}`：更新条件，指定到具体字段上

---

### `db.max(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: 'Micheal' })
  .set({ score: db.max(120) })
  .save();
```

用于 [`set`](#query-set-conditions) 方法中，指定更新时选取当前字段值与 `value` 中较大的值。即：

- 当 `value` 大于当前字段值时，将当前字段设置为 `value`
- 否则，不变更

如果对应字段不存在，则会创建这个字段并将其值设置为 `value`。

__参数__

- `{any} value`：指定用于对比的值

__返回__

- `{Object}`：更新条件，指定到具体字段上

---

### `db.rename(name)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where()
  .set({ cell: db.rename('mobile') })
  .save();
```

用于 [`set`](#query-set-conditions) 方法中，指定将对应字段的名称更改为参数 `name` 指定的名称。

例如，上述示例就是将所有记录的 `cell` 字段重命名为 `mobile`。

__参数__

- `{string} name`：要更改为的名称

__返回__

- `{Object}`：更新条件，指定到具体字段上

---

### `db.unset()`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where()
  .set({ position: db.unset() })
  .save();
```

用于 [`set`](#query-set-conditions) 方法中，指定将对应字段删除。

例如，上述示例就是将所有记录的 `position` 字段删除。

__参数__

无

__返回__

- `{Object}`：更新条件，指定到具体字段上

---

### `db.currentDate()`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where()
  .set({ lastModified: db.currentDate() })
  .save();
```

用于 [`set`](#query-set-conditions) 方法中，指定更新时将对应字段的值设置为当前时间，类型是 `Date`。

__参数__

无

__返回__

- `{Object}`：更新条件，指定到具体字段上

## 逻辑操作符 {#logical-operators}

### `db.and(...filters)`

```js
// f1 || (f2 && f3)
Table.where(f1).or(db.and(f2, f3));
```

主要用于链式无法解决的复杂逻辑组合中，表示几个查询条件的「与」关系。

__参数__

- `{Object} ...filters`：查询条件，至少包含两个

__返回__

- `{Object}`：逻辑条件，可以被用作其他逻辑操作符的条件参数

__参考教程__

- [查询数据 - 使用逻辑操作符组合多个查询条件](/guide/database/find.html#logical-operator)


---

### `db.or(...filters)`

```js
// (f1 || f2) && (f3 && f4)
Table.where(db.or(f1, f2)).and(f3, f4);
```

主要用于链式无法解决的复杂逻辑组合中，表示几个查询条件的「或」关系。

__参数__

- `{Object} ...filters`：查询条件，至少包含两个

__返回__

- `{Object}`：逻辑条件，可以被用作其他逻辑操作符的条件参数

__参考教程__

- [查询数据 - 使用逻辑操作符组合多个查询条件](/guide/database/find.html#logical-operator)

---

### `db.nor(...filters)`

```js
// !(f1 || f2) && (f3 && f4)
Table.where(db.nor(f1, f2)).and(f3, f4);
```

主要用于链式无法解决的复杂逻辑组合中，表示几个查询条件的「或非」关系。

__参数__

- `{Object} ...filters`：查询条件，至少包含两个

__返回__

- `{Object}`：逻辑条件，可以被用作其他逻辑操作符的条件参数

__参考教程__

- [查询数据 - 使用逻辑操作符组合多个查询条件](/guide/database/find.html#logical-operator)

---

### `db.not(condition)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({
    score: db.not(db.gt(2.5))
  })
  .find();
```

用于设置查询时，某个字段的值不满足 `condition` 指定的条件，这也包含了这条记录没有该字段的情况。

例如上述示例会查询到：
1. `score` 小于等于 `2.5` 的记录
2. 不包含 `score` 字段的记录

这也是与 `db.lte(2.5)` 的主要区别，因为 `db.lte(2.5)` 要求记录必须包含 `score` 字段。

__参数__

- `{any} condition`：指定不满足的条件

__返回__

- `{Object}`：查询条件，指定到具体字段上


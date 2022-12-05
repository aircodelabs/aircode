# 查询数据 {#intro}

AirCode 的数据库支持传入不同的条件来查询数据，并且对查询结果进行处理。本文档将通过示例说明如何通过 `aircode.db` 在云函数中执行查询，包括：

[[toc]]

为了便于演示，我们假定有一张名为 `inventory` 的数据表，包含以下数据：

```js
[
  { item: 'MacBook Air', qty: 15, info: { location: 'Beijing', color: 'Black' } },
  { item: 'MacBook Pro', qty: 35, info: { location: 'Tokyo', color: 'Silver' } },
  { item: 'iPhone 14', qty: 80, info: { location: 'New York', color: 'Blue' } },
  { item: 'iPhone SE', qty: 120, info: { location: 'London', color: 'Red' } },
  { item: 'iPad mini', qty: 95, info: { location: 'Beijing', color: 'Pink' } }
]
```

## 获取所有记录 {#find}

通过 `where({ field: value }).find()` 查询所有匹配的记录，结果为数组。若 `where` 中不传入值，则会返回该表的所有记录。

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');
  // Find matched records
  const matchedRecords = await InventoryTable
    .where({ item: 'MacBook Air' })
    .find();
  // Find all records in the table
  const allRecords = await InventoryTable
    .where()
    .find();

  return {
    matchedRecords,
    allRecords,
  };
}
```

为了确保查询过程的稳定性，对于查询结果的最大条数和数据量大小均有限制，请参考：[资源限制 - 数据库 - 查询限制](/about/limits.html#database-find)。

## 获取单条记录 {#find-one}

使用 `findOne()` 可以只返回满足条件的第一条记录，结果为 `Object` 类型，如果没有满足条件的则返回 `null`。

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');
  // Use `findOne` to get the first matched record
  const firstRecord = await InventoryTable
    .where({ item: 'iPhone 14' })
    .findOne();

  return {
    firstRecord,
  };
}
```

## 按正则表达式查询 {#regex}

通过在查询语句中传入正则表达式，可以实现正则匹配的查询，这一般用来实现模糊匹配或者内容搜索。

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');
  // Use a regex to search all MacBooks
  const result = await InventoryTable
    .where({ item: /^MacBook/ })
    .find();

  return {
    result,
  };
}
```

特别的，当正则表达式以 `^` 开头时，还可以利用已经建立的索引来优化查询效率，更多可参考[使用索引优化查询](/guide/database/indexes.html)。

## 按大于、小于等比较条件查询 {#comparison}

除了全等匹配外，还可以通过 `aircode.db` 中提供的查询操作符来实现大于、小于等比较条件的查询。

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // All operators are nested in `aircode.db`
  const { db } = aircode;
  // Use `db.table` to get a table
  const InventoryTable = db.table('inventory');
  // Use query operators to specific conditions
  const gtResult = await InventoryTable
    .where({ qty: db.gt(90) })
    .find();
  const inResult = await InventoryTable
    .where({ item: db.in([ 'MacBook Pro', 'iPad Mini' ]) })
    .find();

  return {
    gtResult,
    inResult,
  };
}
```

完整的查询操作符定义请参考：[数据库 API - 对比操作符](/reference/server/database-api.html#comparison-operators)。

## 按时间区间查询 {#date}

使用时间区间来设置查询条件的方式和使用大于、小于是相同的，但需要注意传递的参数应该为 `Date` 类型。

例如，查询最近 24 小时之内插入的所有数据：

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // All operators are nested in `aircode.db`
  const { db } = aircode;
  // Use `db.table` to get a table
  const InventoryTable = db.table('inventory');
  
  // Use `Date` object as the conditions
  const from = new Date();
  const to = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  const result = await InventoryTable
    .where({ createdAt: db.gt(from).lte(to) })
    .find();

  return {
    result,
  };
}
```

## 使用内嵌字段查询 {#nesting-field}

当数据库中的某个字段是 `Object` 类型时，使用 `.` 连接符可以设置内嵌字段的查询条件。例如 `where({ 'a.b': value })` 会根据 `a` 的子字段 `b` 的值类查询。使用多个 `.` 来连接时，还可以支持多层嵌套。

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');
  // Use `.` to set condition for nesting field
  const result = await InventoryTable
    .where({ 'info.location': 'Beijing' })
    .find();

  return {
    result,
  };
}
```

::: warning 注意
根据 JavaScript 的语法限制，使用 `.` 连接时键值必须添加引号。
:::

## 使用逻辑操作符组合多个查询条件 {#logical-operator}

AirCode 支持「与」、「或」、「或非」三种逻辑关系，也可以通过组合形成更复杂的逻辑条件。

### 「与」关系 {#logical-and}

向 `where` 方法中传入多个条件时，各个条件之间是「与」的关系。也可以使用 `and` 链式调用来表示。

```js
// f1 && f2
Table.where(f1, f2);
Table.wehre(f1).and(f2);
```

### 「或」关系 {#logical-or}

在 `where` 方法后接上 `or` 方法的链式调用，则表示「或」的关系。

```js
// f1 || f2
Table.where(f1).or(f2);
```

### 「或非」关系 {#logical-nor}

在 `where` 方法后接上 `nor` 方法的链式调用，则表示「或非」的关系。

```js
// !(f1 || f2)
Table.where(f1).nor(f2)
```

### 组合关系 {#composition-logical-conditions}

当需要将多个逻辑关系组合起来时，可以通过链式调用的形式来实现。链式调用的顺序及括号逻辑都与表达式保持一致。

```js
// (f1 && f2) || (f2 || f3) && (f4 && f5)
Table.where(f1, f2).or(f3, f4).and(f5, f6)
```

然而，有些时候逻辑表达式可能更复杂，无法单独用链式表达来解决。因此我们还在 `aircode.db` 对象上也提供了 `and`、`or`、`nor` 三个方法，用来表达这些条件。

```js
// (f1 || f2) && !(f3 || f4) || (f5 && f6)
const { db } = aircode;
Table.where(db.or(f1, f2)).and(db.nor(f3, f4)).or(db.and(f5, f6));
```

## 返回查询结果总条数 {#count}

使用 `count()` 时，可以只获取符合条件的记录的总条数，而不返回具体的数据内容。

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');
  // Use `count` to get the count of records
  const count = await InventoryTable
    .where({ 'info.location': 'Beijing' })
    .count();

  return {
    count,
  };
}
```

## 排序和分页 {#sort-and-pagination}

有时候，要查询的记录条数太多，我们可能希望对结果进行排序并分页返回，这时候需要使用到 `sort`、`skip` 和 `limit`。

- 使用 `sort({ field: order })` 指定按某个字段排序
  - `order` 为 `1` 或 `'asc'`，代表正序，即从小到大排序
  - `order` 为 `-1` 或 `'desc'`，代表倒序，即从大到小排序
- 使用 `skip(n)` 跳过 `n` 条记录
- 使用 `limit(n)` 指定只返回 `n` 条记录

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');

  // use `page` and `pageSize` to filter to result
  const pageSize = 3;
  const page = 2;

  const result = await InventoryTable
    .where()
    .sort({ qty: -1 })  // sort by `qty` in desc order
    .skip((page - 1) * pageSize)  
    .limit(pageSize)
    .find();

  return {
    result,
  };
}
```

::: tip 提示
`sort` 还支持按照多个字段排序，此时会按照字段传递的顺序会非常重要。

例如 `sort({ foo: 1, bar: -1 })` 会先按照 `foo` 字段正序排列，对于 `foo` 字段值相同的记录，再按照 `bar` 字段逆序排列。
:::

## 指定结果只包含特定字段 {#projection}

默认情况下查询结果会包含这个记录的所有字段，如果希望省略某些无关的字段，可以使用 `projection({ field: value })` 来指定。

- `value` 为 `1` 时，代表仅包含该字段，其余字段均被忽略，`_id` 字段为特例，默认会返回
- `value` 为 `0` 时，代表忽略该字段，返回其余字段

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');

  // Return fields include `_id` and `item`
  const includeResult = await InventoryTable
    .where()
    .projection({ item: 1 })
    .find();

  // Return fields exclude `qty` and `info.location`
  const excludeResult = await InventoryTable
    .where()
    .projection({ qty: 0, 'info.location': 0 })
    .find();

  return {
    includeResult,
    excludeResult,
  };
}
```

为了便于查询之后的操作，默认情况下返回结果都会包含 `_id` 字段。若希望过滤掉 `_id` 字段，需要显示地设置 `_id: 0`。

::: warning 注意
若返回结果无 `_id` 字段，则无法在后续代码中使用 `save` 或 `delete` 来执行更新或删除操作。
:::

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');

  // Set `_id: 0` to exclude it
  const resultWithoutId = await InventoryTable
    .where()
    .projection({ item: 1, _id: 0 })
    .find();

  // Record without id can not be passed to `delete`
  // The following code will cause an error
  // await InventoryTable.delete(resultWithoutId);

  return {
    resultWithoutId
  };
}
```

## 更多查询条件 {#advanced}

完整的数据库查询条件及操作符请参考[数据库 API](/reference/server/database-api.html)。

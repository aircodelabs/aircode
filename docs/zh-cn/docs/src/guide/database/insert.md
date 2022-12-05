# 插入数据 {#intro}

- 通过 `aircode.db.table(tableName)` 获取要插入数据的数据表
- 通过 `await Table.save(record | arrayOfRecords)` 一次性插入一条或多条记录

## 插入单条记录 {#insert-one}

向 `save` 函数传递一个 `Object` 对象可以在数据库中插入单条记录。

::: tip 提示
`save` 是一个 `async` 函数，因此需要使用 `await` 来确保其执行结束。
:::

例如：

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const PersonsTable = aircode.db.table('persons');
  // The record is a JavaScript object
  const personItem = {
    name: 'Micheal',
    age: 28,
  };
  // Use `Table.save` to insert this record
  const result = await PersonsTable.save(personItem);
  return {
    result,
  };
}
```

为了保证数据库的稳定性，对于单条插入记录的数据量大小会有限制，超过时会插入失败，请参考：[资源限制 - 数据库 - 插入限制](/about/limits.html#database-insert)。

## 插入多条记录 {#insert-multiple}

向 `save` 函数传递一个对象数组则可以实现一次性批量插入多条记录，其执行效率与插入单条记录是相同的。

例如：

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const PersonsTable = aircode.db.table('persons');
  // Batch insert multiple records by passing an array
  const result = await PersonsTable.save([
    { name: 'Mary', age: 22 },
    { name: 'Isabel', age: 24 },
  ]);
  return {
    result,
  };
}
```

为了保证数据库的稳定性，对于一次性插入的记录条数会有限制，超过时会插入失败，请参考：[资源限制 - 数据库 - 插入限制](/about/limits.html#database-insert)。

## 系统默认字段 {#default-fields}

在插入新记录时，AirCode 会新增三个默认字段：

- `{string} _id`：全局唯一的标示符
- `{Date} createdAt`：记录创建的时间
- `{Date} updatedAt`：记录更新的时间，新创建时和 `createdAt` 值相同

例如上述插入的记录，其完整数据为：

```js
{
  _id: '634a7ee414f88207c91ec6db',
  name: 'Micheal',
  age: 28,
  createdAt: Date('2022-10-15T09:35:32.639Z'),
  updatedAt: Date('2022-10-15T09:35:32.639Z')
}
```

## 数据字段的类型 {#schema-of-fields}

AirCode 的数据库是 Schema Free 的，意味着你可以插入任意的字段和数据类型，而无需提前配置。这种机制使得应用的开发更简单便捷，同时具有非常高的灵活性。

此外，AirCode 会在某个字段第一次被插入时，自动识别其类型，并用于在网页的「Database」区域中展示数据。

::: tip 提示
字段类型仅用于在页面中展示数据时的格式化，在代码中通过 `save` 插入数据时不会受此限制，也不会自动进行类型转换。
:::

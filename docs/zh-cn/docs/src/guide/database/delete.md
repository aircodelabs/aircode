# 删除数据 {#intro}

AirCode 提供两种方法来删除数据：

1. 将数据查询出来后，传入 `Table.delete(record | arrayOfRecords)` 删除
2. 使用 `Table.where(...).delete()` 直接删除所有符合条件的记录

::: warning 注意
删除数据是不可撤回的，请谨慎操作。
:::

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

## 删除一条或多条记录 {#simple-delete}

通过 `findOne` 或 `find` 从数据表中获取到记录后，再将结果传入 `delete` 方法可以将对应记录删除。

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // All operators are nested in `aircode.db`
  const { db } = aircode;
  // Use `db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');

  // Use `find` to get records
  const records = await InventoryTable
    .where({ qty: db.gt(90) })
    .projection({ _id: 1 })
    .find();

  // delete these records from table
  const result = await InventoryTable.delete(records);

  return {
    result,
  };
}
```

在执行删除操作时，本质上是根据传入记录的 `_id` 从数据表中寻找并删除。示例中通过 `projection` 让查询的结果中只包含 `_id` 字段，从而减少了数据量。

为了保证数据库的稳定性，对于单次删除的记录条数会有限制，超过时会更新失败，请参考：[资源限制 - 数据库 - 删除限制](/about/limits.html#database-delete)。

## 直接执行删除 {#delete-directly}

如果希望直接根据查询条件执行删除，可以通过 `Table.where(...).delete()` 实现。这种方法的执行效率更高，但因为返回值仅包含删除条目数，因此无法知晓具体被删除记录的 `_id`。

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');

  // Use `delete` to delete records match the query criteria
  const result = await InventoryTable
    .where({ item: /^MacBook/ })
    .delete();

  return {
    result,
  };
}
```

::: warning 注意
如果 `where` 方法中没有传入查询条件，例如 `InventoryTable.where().delete()`，则会将整个表的记录全部删除，请谨慎操作。
:::

# 更新数据 {#intro}

AirCode 提供两种方法来更新数据：

1. 将数据查询出来并修改后，通过 `await Table.save(record | arrayOfRecords)` 保存修改
2. 使用 `await Table.where(...).set({ field: value }).save()` 直接执行更新

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

## 更新单条记录 {#update-one}

通过 `findOne` 查询出一条记录后，对其进行修改，再调用 `save` 方法将修改后的值保存到数据库。

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');

  // Use `findOne` to get one record
  const record = await InventoryTable
    .where({ item: 'MacBook Air' })
    .projection({ item: 1, qty: 1 })
    .findOne();
  
  // Update its `qty` by adding 10
  record.qty += 10;

  // Use `save` to save the modification
  await InventoryTable.save(record);

  return {
    record,
  };
}
```

为了保证数据库的稳定性，对于单条记录的数据量大小会有限制，当超过时会更新失败。因此查询时建议使用 `projection` 来指定仅包含要更新的字段，以减少数据量。具体的数据量大小限制请参考：[资源限制 - 数据库 - 更新限制](/about/limits.html#database-update)。

## 更新多条记录 {#update-multiple}

如果向 `save` 传递的是对象数组，则会一次性更新所有数组中的记录。一般来说做法是先通过 `find` 将记录查出，使用 `for` 循环遍历修改数据，最后再统一 `save`。

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // Use `aircode.db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');

  // Find all records located in Beijing
  const records = await InventoryTable
    .where({ 'info.location': 'Beijing' })
    .find();
  
  // Use for loop to update them
  for (const record of records) {
    record.qty += 20;
  }

  // Use `save` to save the modification
  await InventoryTable.save(records);

  return {
    records,
  };
}
```

为了保证数据库的稳定性，对于单次更新的记录条数会有限制，超过时会更新失败，请参考：[资源限制 - 数据库 - 更新限制](/about/limits.html#database-update)。

## save 方法的原理 {#the-principle-of-save}

`save` 方法即可以用来[插入数据](/guide/database/insert.html)也可以用来[更新数据](#update-data)，其最大区别是传入的记录是否包含数据库中存在的 `_id` 字段。

- 若传入的记录包含 `_id` 字段且数据库中有该条记录，则会执行更新操作
- 否则，会执行插入操作，并自动生成全局唯一的 `_id` 字段

## 直接执行更新 {#set-and-save}

有些时候，我们并不需要将数据都查询出来，而是直接根据条件执行更新。可以使用 `set` 来指定更新条件，并调用 `save` 完成更新。

这种方式会在数据库中直接完成操作，因此执行效率较高且具有原子性，特别适用于应对数据量较大或并发较高的场景。

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // All update operators are nested in `aircode.db`
  const { db } = aircode;
  // Use `db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');

  // Use `set` to specific conditions, then use `save` to update
  const result = await InventoryTable
    .where({ 'info.location': 'Beijing' })
    .set({
      'info.location': 'Shanghai',
      qty: db.inc(10),  // increment `qty` by 10
    })
    .save();

  return {
    result,
  };
}
```

示例中的 `db.inc` 是更新操作符，代表将对应字段的值进行增加。这些更新操作符都在 `aircode.db` 对象下，完整的更新操作符可参考：[数据库 API - 更新操作符](/reference/server/database-api.html#update-operators)。

## 更新或插入数据（Upsert） {#upsert}

通过使用 `upsert(true)`，可以实现在没有查询到记录时执行插入操作，具体规则如下：

- 如果根据查询条件找到了记录，则按照 `set` 对这些记录执行更新
- 如果未查询到任何记录，则会综合 `where`、`set`、`setOnInsert` 条件插入一条新记录

例如：

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // All update operators are nested in `aircode.db`
  const { db } = aircode;
  // Use `db.table` to get a table
  const InventoryTable = aircode.db.table('inventory');

  // Use `upsert` to insert a record when no record mathches the query
  const result = await InventoryTable
    .where({ item: 'iMac', qty: db.lt(50) })
    .set({ qty: 100 })
    .setOnInsert({
      info: { location: 'Singapore', color: 'Yellow' },
    })
    .upsert(true)
    .save();

  return {
    result,
  };
}
```

在这个示例中，会尝试查询 `item` 为 `'iMac'`、`qty` 小于 `50` 的记录：

__1. 若查询到了__

则按照 `set` 的条件将 `qty` 字段的值设置为 `100`。此时因为没有触发插入操作，因此 `setOnInsert` 不会起作用。

__2. 若未查询到__

则按照以下顺序插入一条新记录：

- 根据 `where` 条件创建一条新记录，注意因为 `{ qty: db.lt(50) }` 是比较操作符，所以会被忽略，此时的数据为
  ```js
  {
    item: 'iMac'
  }
  ```
- 应用 `set` 中的条件，此时数据变为
  ```js
  {
    item: 'iMac',
    qty: 100
  }
  ```
- 应用 `setOnInsert` 中的条件，此时记录值为
```js
{
  item: 'iMac',
  qty: 100,
  info: {
    location: 'Singapore',
    color: 'Yellow'
  }
}
```
- 添加系统默认字段，并将记录插入数据库中，最终的数据为
```js
{
  _id: '63568b39c0262f27ae28d5f7',
  item: 'iMac',
  qty: 100,
  info: {
    location: 'Singapore',
    color: 'Yellow'
  },
  createdAt: Date('2022-10-15T12:48:11.528Z')
  updatedAt: Date('2022-10-15T12:48:11.528Z')
}
```

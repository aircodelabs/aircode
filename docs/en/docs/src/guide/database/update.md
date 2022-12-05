# Update Data {#intro}

AirCode provides two ways to update data:

1. After querying and modifying the data, save the modification by `await Table.save(record | arrayOfRecords)`
2. Use `await Table.where(...).set({ field: value }).save()` to perform the update directly

For easy illustration, let's assume that there is a table named `inventory`, which contains the following data:

```js
[
  { item: 'MacBook Air', qty: 15, info: { location: 'Beijing', color: 'Black' } },
  { item: 'MacBook Pro', qty: 35, info: { location: 'Tokyo', color: 'Silver' } },
  { item: 'iPhone 14', qty: 80, info: { location: 'New York', color: 'Blue' } },
  { item: 'iPhone SE', qty: 120, info: { location: 'London', color: 'Red' } },
  { item: 'iPad mini', qty: 95, info: { location: 'Beijing', color: 'Pink' } }
]
```

## Update a Record {#update-one}

After querying a record through `findOne`, modify it, and then call the `save` method to save the modified value to the database.

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

In order to ensure the stability, there is a limit on the data size of a single record, and the update will fail when it exceeds the limit. Therefore, it is recommended to use `projection` to specify only the fields to be updated when querying to reduce the size. For specific data size limits, please refer to: [Resource Limits - Database - Update Limits](/about/limits.html#database-update).

## Update Records {#update-multiple}

If an array of objects is passed to `save`, all records in the array will be updated at once. Generally speaking, first found the record through `find`, then use a `for` loop to iterate and modify the data, and finally `save` the records.

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

In order to ensure the stability, there is a limit on the number of records for a single update. The update will fail if it exceeds the limit. See: [Resource Limits - Database - Update Limits](/about/limits.html#database-update).

## Principle of Save {#the-principle-of-save}

`save` method can be used to [insert](/guide/database/insert.html) data or [update](#update-data) data, the biggest difference is whether the record contains `_id` field.

- If the record contains the `_id` field, and the record exists in the database, the update operation will be performed
- Otherwise, an insert is performed and a globally unique `_id` is automatically generated

## Set and Save {#set-and-save}

Sometimes, we don't need to query all the data, but directly perform updates based on conditions. You can use `set` to specify the update conditions, and call `save` to complete the update.

This method will directly complete the operation in the database, so the execution is atomic and efficiency is high, and it is especially suitable for scenarios with a large amount of data or high concurrency.

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
      qty: db.inc(10), // increment `qty` by 10
    })
    .save();

  return {
    result,
  };
}
```

`db.inc` in the example is an update operator, which means to increase the value of the corresponding field. These update operators are all under the `aircode.db` object. For complete update operators, please refer to: [Database API - Update Operators](/reference/server/database-api.html#update-operators).

## Upsert {#upsert}

By using `upsert(true)`, you can perform an insert operation when no records are queried. The rules are:

- If records are found according to the query conditions, perform an update on those records according to `set`
- If no record is found, a new record will be inserted by combining `where`, `set`, `setOnInsert` conditions

E.g:

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

In this example, it will try to query the records where `item` is `'iMac'` and `qty` is less than `50`:

__1. If found__

Set the value of the `qty` field to `100` according to the condition of `set`. At this point, `setOnInsert` will have no effect because the insert operation is not triggered.

__2. If not found__

Insert a new record in the following order:

- Create a new record based on the `where` condition, note that because `{ qty: db.lt(50) }` is a comparison operator, it will be ignored, and now the data is
  ```js
  {
    item: 'iMac'
  }
  ```
- Apply the condition in `set`, at which point the data becomes
  ```js
  {
    item: 'iMac',
    qty: 100
  }
  ```
- Apply the condition in `setOnInsert`, then the data is
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
- Add system default fields and insert records into the database, the final data is
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

# Delete Data {#intro}

AirCode provides two ways to delete data:

1. After querying the data, pass `Table.delete(record | arrayOfRecords)` to delete
2. Use `Table.where(...).delete()` to directly delete all eligible records

::: warning Note
Deletion of data is irreversible, please be cautious.
:::

For the easy illustration, let's assume that there is a table named `inventory`, which contains the following data:

```js
[
  { item: 'MacBook Air', qty: 15, info: { location: 'Beijing', color: 'Black' } },
  { item: 'MacBook Pro', qty: 35, info: { location: 'Tokyo', color: 'Silver' } },
  { item: 'iPhone 14', qty: 80, info: { location: 'New York', color: 'Blue' } },
  { item: 'iPhone SE', qty: 120, info: { location: 'London', color: 'Red' } },
  { item: 'iPad mini', qty: 95, info: { location: 'Beijing', color: 'Pink' } }
]
```

## Delete Records {#simple-delete}

After obtaining the records from the data table through `findOne` or `find`, pass the result to the `delete` method to delete the corresponding ones.

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

When performing a deletion, it is basically finding and deleting from the table based on the `_id` of the record. In the example above, `projection` is used to make the query result only contains the `_id` field, thereby reducing the size of data.

In order to ensure the stability, there is a limit on the number of records that can be deleted at once. The update will fail if it exceeds the limit. See: [Resource Limits - Database - Delete Limits](/about/limits.html#database-delete).

## Direct Deletion {#delete-directly}

If you want to delete records directly based on query conditions, you can use `Table.where(...).delete()`. This method is more efficient, but since the return value only contains the number of deleted records, it is impossible to know the `_id` of the deleted record.

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

::: warning Note
If no query conditions are passed in the `where` method, such as `InventoryTable.where().delete()`, all records in the table will be deleted, please be cautious.
:::

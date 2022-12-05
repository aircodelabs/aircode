# Insert Data {#intro}

- Obtain a table to insert data through `aircode.db.table(tableName)`
- Insert one or more records at once via `await Table.save(record | arrayOfRecords)`

## Insert a Record {#insert-one}

Pass an `Object` object to the `save` function to insert a single record in the database.

::: tip Tips
`save` is an `async` function, so it needs to use `await` to ensure that the execution ends.
:::

E.g:

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

In order to ensure the database's stable running, there is a limit on the size of a single inserted record. If it times out, the insertion will fail. See: [Resource Limits - Database - Insert Limits](/about/limits.html#database-insert).

## Insert Records {#insert-multiple}

Passing an object array to the `save` function can implement a batch insertion of multiple records at once, and the execution efficiency equals to that of inserting a single record.

E.g:

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

In order to ensure the database's stable running, there is a limit on the size of a batch inserted records. If it times out, the insertion will fail. See: [Resource Limits - Database - Insert Limits](/about/limits.html#database-insert).

## Default Fields {#default-fields}

When inserting a new record, AirCode adds three default fields:

- `{string} _id`: a globally unique identifier
- `{Date} createdAt`: time when the record was created
- `{Date} updatedAt`: time when the record was updated, which is the same value as `createdAt` when it is newly created

For example, for the record inserted above, the full data is:

```js
{
  _id: '634a7ee414f88207c91ec6db',
  name: 'Micheal',
  age: 28,
  createdAt: Date('2022-10-15T09:35:32.639Z'),
  updatedAt: Date('2022-10-15T09:35:32.639Z')
}
```

## Schema of Fields {#schema-of-fields}

AirCode's database is Schema Free, which means you can insert arbitrary fields and data types without prior configuration. This makes the development convenient and easier, and meanwhile has high flexibility.

In addition, AirCode will automatically identify the type of fields when a record is inserted for the first time, and use it to display data in the "Database" area of the web page.

::: tip Tips
The field type is only used for formatting when displaying data on the page. When inserting data through `save` in your code, it will not be subject to this restriction, and type conversion will not be performed automatically either.
:::

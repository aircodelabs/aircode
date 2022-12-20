# Database Introduction {#intro}

AirCode provides a set of out-of-the-box database functions, just use `aircode.db` to access data in cloud functions.

## Objectives {#objectives}

- Learn to use `const MyTable = aircode.db.table(tableName)` to get a table
- Learn to use `await MyTable.save(records)` to save records
- Learn to use `const records = await MyTable.where().find()` to query records
- Learn to use `await MyTable.delete(records)` to delete records

## Use `save` to Insert Records {#insert}

A new record can be inserted by calling the `save` method by passing in an object, or an array of objects.

For example, we insert a record with `name` as `'Micheal'` and `age` as `28` into the `persons` table:

```js
const aircode = require('aircode');

module.exports = async function (params, context) {
  // Use `aircode.db.table` to get a table
  const PersonsTable = aircode.db.table('persons');
  // Use `save` to add a new record
  const result = await PersonsTable.save({
    name: 'Micheal',
    age: 28,
  });

  return {
    result,
  };
}
```

Click **Debug**, you can see the following results in the **Response** area:

```json
{
  "result": {
    "_id": "636cd38ae5d303058101488f",
    "name": "Micheal",
    "age": 28,
    "createdAt": "2022-11-10T10:33:46.424Z",
    "updatedAt": "2022-11-10T10:33:46.424Z"
  }
}
```

This indicates that the new record was successfully inserted, where `_id`, `createdAt` and `updatedAt` are automatically generated.

::: tip Tips
When using `save` to insert records, there is no need to create a table in advance, AirCode will automatically create one if it does not exist.
:::

In the **Database** area below, select the `persons` table, and you can see the new data.

<ACImage src="/_images/1671508034400.png" mode="light" />
<ACImage src="/_images/1671508051952.png" mode="dark" />

## Use `find` to Find Records {#find}

Pass the query conditions through the `where` method, then you can use `find` to get all matching records.

For example, we can query the records inserted in the previous step:

```js
const aircode = require('aircode');

module.exports = async function (params, context) {
  // Use `aircode.db.table` to get a table
  const PersonsTable = aircode.db.table('persons');
  // Find all the records whose name is Micheal
  const result = await PersonsTable.where({ name: 'Micheal' }).find();

  return {
    result,
  };
}
```

Click **Debug**, then you can see the following results in the **Response** area:

```json
{
  "result": [
    {
      "_id": "636cd38ae5d303058101488f",
      "name": "Micheal",
      "age": 28,
      "createdAt": "2022-11-10T10:33:46.424Z",
      "updatedAt": "2022-11-10T10:33:46.424Z"
    }
  ]
}
```

::: tip Tips
Besides `find`, you can also use `findOne` to get the first matching record.
:::

## Use `save` to Update Records {#update}

After querying the record and modifying its data, use `save` to update record.

Let's first find the record named `Micheal` and save the update after incrementing its age:

```js
const aircode = require('aircode');

module.exports = async function (params, context) {
  // Use `aircode.db.table` to get a table
  const PersonsTable = aircode.db.table('persons');
  // Find the first one whose name is Micheal
  const micheal = await PersonsTable.where({ name: 'Micheal' }).findOne();
  // Add 1 year to his age
  micheal.age += 1;
  // Then save it
  const result = await PersonsTable.save(micheal);

  return {
    result,
  };
}
```

Click **Debug**, then you can see the following results in the **Response** area:

```json
{
  "result": {
    "_id": "636cd38ae5d303058101488f",
    "name": "Micheal",
    "age": 29,
    "createdAt": "2022-11-10T10:33:46.424Z",
    "updatedAt": "2022-11-10T10:36:25.430Z"
  }
}
```

Indicates that the record in the database has been updated.

## Use `delete` to Delete Records {#delete}

Records can be deleted from the database by calling the `delete` method.

For example, let's delete the new added record in this example:

```js
const aircode = require('aircode');

module.exports = async function (params, context) {
  // Use `aircode.db.table` to get a table
  const PersonsTable = aircode.db.table('persons');
  // Find the first one whose name is Micheal
  const micheal = await PersonsTable.where({ name: 'Micheal' }).findOne();
  // Delete it from the table
  const result = await PersonsTable.delete(micheal);

  return {
    result,
  };
}
```

Click **Debug**, then you can see the following results in the **Response** area:

```json
{
  "result": {
    "deletedCount": 1
  }
}
```

## What's Next? {#next}

Congratulations, you have learned the basic of using a database in AirCode, let's see how to upload a file with one line of code.

<ListBoxContainer>
  <ListBox
    title="File Storage Introduction"
    link="/getting-started/files.html"
    description="One-line code to upload files and get a CDN-accelerated access address"
    single
  />
</ListBoxContainer>

Wish to know more about the usage of database? check out [Database Overview](/guide/database/).

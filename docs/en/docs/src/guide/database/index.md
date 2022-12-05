# Database Overview {#intro}

AirCode provides an out-of-the-box database, which can be accessed and operated directly through `aircode.db` in the cloud function, and there is no need for separated purchase, configuration, and connection steps:

```js
const MyTable = aircode.db.table('myTable');
const item = await MyTable.save({
  name: 'Macbook Air',
  quantities: 25,
});
```

In addition, the underlying layer of the database is Schema Free. This means that you don't need to construct the schema fields in advance, you only need to store the data directly, and AirCode will automatically identify the schema information.

::: details Haven't used a database in AirCode yet?
If you have never used a database before, or are unfamiliar with the way of using a database in AirCode, it is recommended to follow [Database Introduction](/getting-started/database.html) to get started quickly.
:::

## Essential {#essentials}

<ListBoxContainer>
<ListBox
  link="/guide/database/insert.html"
  title="Insert Data"
  description="Insert a record directly into the database without constructing schemas, or insert multiple records at a time"
/>
<ListBox
  link="/guide/database/find.html"
  title="Find Data"
  description="Learn how to obtain records according to different query conditions, and perform advanced operations such as paging and sorting on query results"
/>
<ListBox
  link="/guide/database/update.html"
  title="Update Data"
  description="Modify the data and save to update the record, or perform the update operation directly through the SET statement to improve performance"
/>
<ListBox
  link="/guide/database/delete.html"
  title="Delete Data"
  description="Delete one or more records at one time, or directly delete all matching records according to the query conditions"
/>
</ListBoxContainer>

## API Definition {#api}

<ListBoxContainer>
<ListBox
  link="/reference/server/database-api.html"
  title="Database API"
  description="API definitions on aircode.db"
/>
</ListBoxContainer>

## Advanced Usage {#advanced}

- [Geo-based query](/guide/database/geo.html)
- [Using Indexes](/guide/database/indexes.html)

## Limit {#limits}

- [Resource Limit - Database](/about/limits.html#database)

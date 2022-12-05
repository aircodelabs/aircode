# Find Data {#intro}

AirCode's database supports to pass different conditions to query data and process the results. In this doc, we will use examples to illustrate how to execute queries in cloud functions through `aircode.db`, including:

[[toc]]

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

## Find Records {#find}

Find all matching records through `where({ field: value }).find()`, and the result is an array. If no value is passed in `where`, all records of the table will be returned.

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

In order to ensure the stability of the query process, there are restrictions on the maximum number of query results and the size of the data, see: [Resource Limits - Database - Query Limits](/about/limits.html#database-find).

## Find a Record {#find-one}

Use `findOne()` to return only the first record that meets the condition, and the result is of type `Object`, and `null` is returned if there is no match.

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

## Query by Regex {#regex}

Regular expression queries can be realized by passing regex in the query statement, which is generally used to realize fuzzy matching or content search.

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

In particular, when the regex begins with `^`, you can also use the established index to optimize query efficiency. For more information, see [Use Indexes](/guide/database/indexes.html).

## Query by Comparison Operators {#comparison}

In addition to identical matching, you can also use the query operators provided in `aircode.db` to implement queries with comparison conditions such as '>' and '<'.

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

For complete query op definitions, see: [Database API - Comparison Operators](/reference/server/database-api.html#comparison-operators).

## Query by Time Interval {#date}

Using the time interval to set the query condition is the same as using comparison operators, but it should be noted that the passed parameter should be of `Date` type.

For example, to query all data inserted within the last 24 hours:

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

## Query by Nested Fields {#nesting-field}

When a field in the database is of type `Object`, you can use the `.` connector to set query conditions for embedded fields. For example, `where({ 'a.b': value })` will query based on the value type of `a`'s subfield `b`. It can also support multi-level nesting using multiple `.`.

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

::: warning Note
According to the syntax restrictions of JavaScript, quotation marks must be added to the key value when using `.` connection.
:::

## Query by Logical Operators {#logical-operator}

AirCode supports logical operators of "AND", "OR", and "NOR", and can also be combined to form more complex logical conditions.

### AND {#logical-and}

When multiple conditions are passed into the `where` method, the relationship between each condition is "AND". It can also be expressed using `and` chains.

```js
// f1 && f2
Table.where(f1, f2);
Table.wehre(f1).and(f2);
```

### OR {#logical-or}

The chained invocation of a `where` method followed by a `or` means an "OR" relationship.

```js
// f1 || f2
Table.where(f1).or(f2);
```

### NOR {#logical-nor}

The chained invocation of a `where` method followed by a `nor` means an "NOR" relationship.

```js
// !(f1 || f2)
Table.where(f1).nor(f2)
```

### Composition {#composition-logical-conditions}

When multiple logical relationships need to be combined, it can be implemented in the form of chained invocations. The order of chained calls and the logic of parentheses are consistent with expressions.

```js
// (f1 && f2) || (f2 || f3) && (f4 && f5)
Table.where(f1, f2).or(f3, f4).and(f5, f6)
```

However, sometimes logical expressions may be more complex and cannot solely be solved by chain expressions. Therefore, we also provide three methods of `and`, `or`, and `nor` on the `aircode.db` object to express these conditions.

```js
// (f1 || f2) && !(f3 || f4) || (f5 && f6)
const { db } = aircode;
Table.where(db.or(f1, f2)).and(db.nor(f3, f4)).or(db.and(f5, f6));
```

## Return Count {#count}

When using `count()`, you can only get the total number of eligible records without returning the particular data.

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

## Sort and Pagination {#sort-and-pagination}

Sometimes, there are too many records to be queried, and we may want to sort the results and return them in pages. At this time, we need to use `sort`, `skip` and `limit`.

- Use `sort({ field: order })` to sort by a field
- When `order` is `1` or `'asc'`, it means ascending order - sort from small to large
- When `order` is `-1` or `'desc'`, it means descending order - sort from large to small
- Use `skip(n)` to skip `n` records
- Use `limit(n)` to only return `n` records

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

::: tip Tips
`sort` also supports sorting by multiple fields, where the order that fields are passed matters.

For example, `sort({ foo: 1, bar: -1 })` will first sort the `foo` field asc, and then sort the `bar` field desc for records with the same value in the `foo` field.
:::

## Projection {#projection}

By default, the query result will include all fields of this record. If you want to omit some irrelevant fields, you can use `projection({ field: value })`.

- When `value` is `1`, it means that only this field is included, and other fields are ignored. The `_id` field is a special case and will be returned by default
- When `value` is `0`, it means ignore this field and return other fields

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

In order to facilitate the operation after the query, the returned results will contain the `_id` field by default. If you want to filter out the `_id` field, you need to explicitly set `_id: 0`.

::: warning Note
If the returned result has no `_id` field, you cannot use `save` or `delete` to perform the update or delete operations in subsequent code logic.
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

## Advanced Queries {#advanced}

For complete information about database query conditions and operators, see [Database API](/reference/server/database-api.html).

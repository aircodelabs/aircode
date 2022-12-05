# Database API {#api}

This article shows all API descriptions and examples under `aircode.db`.

[[toc]]

## Table {#table}

### `db.table(tableName)`

```js
const PersonsTable = aircode.db.table('persons');
```

Get the corresponding `Table` object by `tableName`.

__parameter__

- `{string} tableName`: the name of the table

__return__

- `{Table}`: the data table object

### `Table.save(record | arrayOfRecords)`

```js
const PersonsTable = aircode.db.table('persons');
const record = await PersonsTable.save({
  name: 'Micheal',
  age: 28
});
```

Save the record to the database. If the parameter contains the `_id` field, and it exists in the database, it performs an update operation, otherwise performs an insert operation. The `save` method is an asynchronous operation and requires `await` to wait for its completion.

__parameter__

- `{Object} record`: the record to save, in the form of `{ field: value, ... }`
- `{Array} arrayOfRecords`: If an object array is passed in, multiple records will be saved at once

__return__

- `{Promise<Object | Array>}`: the saved object or array of objects

__Guide__

- [Insert Data](/guide/database/insert.html)
- [Update Data](/guide/database/update.html)

---

### `Table.delete(record | arrayOfRecords)`

```js
const PersonsTable = aircode.db.table('persons');
const record = await PersonsTable.where({ name: 'Micheal' }).findOne();
await PersonsTable.delete(record);
```

Delete the record from the database. The record to be deleted is determined according to the `_id` field in the parameter. The `delete` method is an asynchronous operation and requires `await` to wait for its completion.

__parameter__

- `{Object} record`: the record to delete, must contain `_id` field
- `{Array} arrayOfRecords`: If an array of objects is passed in, multiple records will be deleted at once according to the `_id` field of each object

__return__

- `{Promise<Object>}`: delete result, including `deletedCount` field, representing the number of deleted records, for example:

```js
{
  deletedCount: 15
}
```

__Guide__

- [Delete Data](/guide/database/delete.html)

---

### `Table.where([conditions])`

```js
const PersonsTable = aircode.db.table('persons');
const records = PersonsTable.where({ name: 'Micheal' }).find();
```

You can set the conditions of the query through `where`. Every query must start with `Table.where`, this method will return a `Query` object, and other conditions can be added through chained operations.

`where` accepts 0 or more parameters. When passing multiple conditions, the relationship between these conditions is "and", that is, all the conditions needs to be satisfied at the same time, for example:

```js
// name = 'Micheal' and age = 20 and location = 'New York'
Table.where({ name: 'Micheal', age: 20 }, { location: 'New York' })
```

__parameter__

- `{...Object} [conditions]`: query conditions in the form of `{ field: value, ... }`

__return__

- `{Query}`: `Query` object, you can add chained expressions to have more query conditions, you can also use [Query Commands](#query-commands), [Update Commands](#update-commands), [Delete Commands](#delete-commands) to perform the action

__Guide__

- [Find Data](/guide/database/find.md)

## Query Commands {#query-commands}

### `Query.find()`

```js
const PersonsTable = aircode.db.table('persons');
const records = await PersonsTable.where().find();
```

Get all matching records according to the query condition specified by `Query`. The `find` method is an asynchronous operation and requires `await` to wait for its completion.

__parameter__

none

__return__

- `{Promise<Array>}`: an array of query results, or `[]` if there is no matching record

__Guide__

- [Find Data - Find Records](/guide/database/find.md#find)

---

### `Query.findOne()`

```js
const PersonsTable = aircode.db.table('persons');
const record = await PersonsTable.where({ name: 'Micheal' }).findOne();
```

Get the **first** matching record according to the query condition specified by `Query`. The `findOne` method is an asynchronous operation and requires `await` to wait for its completion.

__parameter__

none

__return__

- `{Promise<Object | null>}`: the queried record, if there is no match, return `null`

__Guide__

- [Find Data - Find a Record](/guide/database/find.md#find-one)

---

### `Query.count()`

```js
const PersonsTable = aircode.db.table('persons');
const count = await PersonsTable.where().count();
```

Get the total number of matching records according to the query condition specified by `Query`, and will not return specific record values. The `count` method is an asynchronous operation and requires `await` to wait for its completion.

__parameter__

none

__return__

- `{Promise<number>}`: the total number of records queried

__Guide__

- [Find Data - Return Count](/guide/database/find.md#count)

### `Query.save()`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ score: db.lt(60) })
  .set({ pass: false })
  .save();
```

Perform updates directly in the database according to the conditions specified by `Query`, and need to be used with [Update Chain](#update-chain) operators such as `set`. The entire operation is completed at once, so it is atomic and efficient. The `save` method is an asynchronous operation and requires `await` to wait for its completion.

For example, the above example will find all records in the `persons` table with a `score` less than `60` and set their `pass` field to `false`.

__parameter__

none

__return__

- `{Promise<Object>}`: update result, including `updatedCount` field, representing the number of updated records, for example:

```js
{
  updatedCount: 15
}
```

__Guide__

- [Update Data - Set and Save](/guide/database/update.html#set-and-save)

### `Query.delete()`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: db.exists(false) })
  .delete();
```

Delete the corresponding records directly in the database according to the conditions specified by `Query`. The entire operation is completed in the database at once, so it is atomic and efficient. The `delete` method is an asynchronous operation and requires `await` to wait for its completion.

For example, the above example will delete all records in the `persons` table that do not contain a `name` field.

__parameter__

none

__return__

- `{Promise<Object>}`: delete result, including `deletedCount` field, representing the number of deleted records, for example:

```js
{
  deletedCount: 5
}
```

## Sort and Pagination Chain {#sort-and-pagination-chain}

### `Query.sort(conditions)`

```js
const PersonsTable = aircode.db.table('persons');
const records = await PersonsTable.where().sort({ age: 1 }).find();
```

Add a sort condition by fields to the query.

__parameter__

- `{Object} condtions`: sorting conditions, in the form of `{ field: order, ... }`, where `order` can be
  - `1` or `asc`, stands for ascending order, that is, sort from small to large
  - `-1` or `desc`, stands for descending order, that is, sort from big to small

__return__

- `{Query}`: the `Query` object itself

__Guide__

- [Find Data - Sort and Pagination](/guide/database/find.md#sort-and-pagination)

---

### `Query.skip(n)`

```js
const PersonsTable = aircode.db.table('persons');
const curPage = 2;
const pageSize = 100;
const records = await PersonsTable
  .where({ location: 'Tokyo' })
  .sort({ age: 1 })
  .skip((curPage - 1) * pageSize)
  .limit(pageSize)
  .find();
```

Skip `n` records when specifying a query, generally used in conjunction with `sort` and `limit` to implement paging queries.

__parameter__

- `{number} n`: number of records to skip

__return__

- `{Query}`: the `Query` object itself

__Guide__

- [Find Data - Sort and Pagination](/guide/database/find.md#sort-and-pagination)

---

### `Query.limit(n)`

```js
const PersonsTable = aircode.db.table('persons');
const curPage = 2;
const pageSize = 100;
const records = await PersonsTable
  .where({ location: 'Tokyo' })
  .sort({ age: 1 })
  .skip((curPage - 1) * pageSize)
  .limit(pageSize)
  .find();
```

Limit the total number of records returned by a single query, generally used in conjunction with `sort` and `skip` to implement paging queries.

::: tip Tips
In order to ensure the stability of the query process, there is a certain limit on the maximum number of query results. Even if `limit` is set to exceed this maximum value, it will not take effect. For specific restrictions, see: [Resource Limits - Database - Query Limits](/about/limits.html#database-find).
:::

__parameter__

- `{number} n`: the total number of restrictions

__return__

- `{Query}`: the `Query` object itself

__Guide__

- [Find Data - Sort and Pagination](/guide/database/find.md#sort-and-pagination)

## Projection Chain {#projection-chain}

### `Query.projection(conditions)`

```js
const PersonsTable = aircode.db.table('persons');
const records = await PersonsTable.where()
  .projection({ name: 1, age: 1 })
  .find();
```

It is used to specify that the query results contain only specific fields.

__parameter__

- `{Object} conditions`: conditions for the field filtering, in the form of `{ field: value, ... }`, where `value` can be:
  - `1`, which means that the result only contains this field, and the rest of the fields are completely ignored. The `_id` field is a special case and will be returned by default
  - `0`, means ignore this field and return other fields

__result__

- `{Query}`: the `Query` object itself

__Guide__

- [Find Data - Projection](/guide/database/find.md#projection)

## Update Chain {#update-chain}

### `Query.set(conditions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ score: db.lt(60) })
  .set({ pass: false, failTime: db.inc(1) })
  .save();
```

Specify the operation to be performed during the update, and [Update Commands `save`](#update-commands) needs to be used at the end to perform the update.

In the `set` parameters, there are two ways to specify the data:
- Directly specify the value to be set, for example, `pass: false` in the example means to set the `pass` field to `false`
- Specify the operation by [Update Operators](#update-operators), for example, `failTime: db.inc(1)` means to increase the value of the `failTime` field by `1`

__parameter__

- `{Object} conditions`: the update operation, in the form of `{ field: value, ... }`

__return__

- `{Query}`: the `Query` object itself

__Guide__

- [Update Data - Set and Save](/guide/database/update.html#set-and-save)

---

### `Query.upsert([boolean=true])`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: 'Micheal', age: 28 })
  .set({ favorites: [ 'Ski', 'Hiking', 'Sushi' ] })
  .upsert(true)
  .save();
```

Specify the upsert operation, that is, to create a new one when no record is queried according to the query condition.

In the above example:

- If a record whose `name` is `'Micheal'` and `age` is `28` is matched, its `favorites` will be set to `[ 'Ski', 'Hiking', 'Sushi' ]`
- If there is no match, a new record will be created
  ```js
  {
    name: 'Micheal',
    age: 28,
    favorites: [ 'Ski', 'Hiking', 'Sushi' ]
  }
  ```

By setting `upsert(true)`, we can ensure that after the update operation is completed, there will be at least one record in the database that meets our conditions.

__parameter__

- `{boolean} [boolean=true]`: specify whether to enable the Upsert operation, the default is `true`

__return__

- `{Query}`: the `Query` object itself

__Guide__

- [Update Data - Upsert](/guide/database/update.html#upsert)

---

### `Query.setOnInsert(object)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: 'Micheal', age: 28 })
  .set({ favorites: [ 'Ski', 'Hiking', 'Sushi' ] })
  .setOnInsert({ score: 0 })
  .upsert(true)
  .save();
```

Specify the value to be set by upsert when performing an insert operation. `setOnInsert` must be used with `upsert(true)`, otherwise it will not take effect.

In the above example:

- If a record whose `name` is `'Micheal'` and `age` is `28` is found, its `favorites` will be set to `[ 'Ski', 'Hiking', 'Sushi' ]`. At this time, because the insert operation is not triggered, `setOnInsert` does not take effect
- If there is no match, a new record will be created
  ```js
  {
    name: 'Micheal',
    age: 28,
    favorites: [ 'Ski', 'Hiking', 'Sushi' ],
    score: 0
  }
  ```

By using `setOnInsert`, we can set some default values when the object is newly created, while performing an update without affecting the existing values.

__parameter__

- `{Object} object`: the value to be set when performing an insert operation, in the form of `{ field: value, ... }`

__return__

- `{Query}`: the `Query` object itself

__Guide__

- [Update Data - Upsert](/guide/database/update.html#upsert)

## Logical Chain {#logical-chain}

### `Query.and(...filters)`

```js
// f1 && f2
Table.where(f1).and(f2);
// f1 && (f2 && f3)
Table.where(f1).and(f2, f3);
```

Add an "and" relationship to multiple query conditions in a chained manner.

__parameter__

- `{Object} ...filters`: query criteria, at least one

__return__

- `{Query}`: the `Query` object itself

__Guide__

- [Find Data - Query by Logical Operators](/guide/database/find.html#logical-operator)

---

### `Query.or(...filters)`

```js
// f1 || f2
Table.where(f1).or(f2);
// f1 || (f2 || f3)
Table.where(f1).or(f2, f3);
```

Add an "or" relationship to multiple query conditions in a chained manner.

__parameter__

- `{Object} ...filters`: query criteria, at least one

__return__

- `{Query}`: the `Query` object itself

__Guide__

- [Find Data - Query by Logical Operators](/guide/database/find.html#logical-operator)

---

### `Query.nor(...filters)`

```js
// !(f1 || f2)
Table.where(f1).nor(f2);
// !(f1 || !(f2 || f3))
Table.where(f1).nor(f2, f3);
```

Add a "nor" relationship to multiple query conditions in a chained manner, that is, all conditions are `false`.

__parameter__

- `{Object} ...filters`: query criteria, at least one

__return__

- `{Query}`: the `Query` object itself

__Guide__

- [Find Data - Query by Logical Operators](/guide/database/find.html#logical-operator)

## Comparison Operators {#comparison-operators}

### `db.gt(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable.where({ age: db.gt(20) }).find();
```

Query by the condition that the value of a field is greater than (>) the specified `value`.

__parameter__

- `{*} value`: the value to be greater than when querying

__return__

- `{Object}`: query condition, assigned to a specific field

__Guide__

- [Find Data - Query by Comparison Operators](/guide/database/find.md#comparison)
- [Find Data - Query by Time Interval](/guide/database/find.md#date)

---

### `db.gte(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable.where({ age: db.gte(20) }).find();
```

Query by the condition that the value of a field is greater than or equal to (>=) the specified `value`.

__parameter__

- `{*} value`: the value to be greater than or equal to when querying

__return__

- `{Object}`: query condition, assigned to a specific field

__Guide__

- [Find Data - Query by Comparison Operators](/guide/database/find.md#comparison)
- [Find Data - Query by Time Interval](/guide/database/find.md#date)

---

### `db.lt(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable.where({ age: db.lt(50) }).find();
```

Query by the condition that the value of a field is less than (<) the specified `value`.

__parameter__

- `{*} value`: the value to be less than when querying

__return__

- `{Object}`: query condition, assigned to a specific field

__Guide__

- [Find Data - Query by Comparison Operators](/guide/database/find.md#comparison)
- [Find Data - Query by Time Interval](/guide/database/find.md#date)

---

### `db.lte(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable.where({ age: db.lte(50) }).find();
```

Query by the condition that the value of a field is less than or equal to (<=) the specified `value`.

__parameter__

- `{*} value`: the value to be less than or equal to when querying

__return__

- `{Object}`: query condition, assigned to a specific field

__Guide__

- [Find Data - Query by Comparison Operators](/guide/database/find.md#comparison)
- [Find Data - Query by Time Interval](/guide/database/find.md#date)

---

### `db.ne(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable.where({ blocked: db.ne(true) }).find();
```

Query by the condition that the value of a field is not equal to the specified `value`.

In addition, if a record does not contain this field, it will also be queried. For example for records:

```js
{
  name: Michael,
  location: 'New York'
}
```

Use the following conditions to query:

```js
where({
  blocked: db.ne(true)
})
```

Since there is no `blocked` field in this record, the condition of `db.ne` is also satisfied, so this record will be queried.

__parameter__

- `{*} value`: the value that the field is not equal to when querying

__return__

- `{Object}`: query condition, assigned to a specific field

__Guide__

- [Find Data - Query by Comparison Operators](/guide/database/find.md#comparison)

---

### `db.in(array)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ name: db.in([ 'Micheal', 'Mary' ]) })
  .find();
```

Query by the condition that the value of a field is equal to any element in `array`.

If the value of the field being queried is also an array, it only needs that any element in the array of this field exists in `array`. For example, for records like:

```js
{
  name: 'Micheal',
  favorites: [ 'Ski', 'Hiking', 'Sushi' ]
}
```

Use the following conditions to query:

```js
where({
  favorites: db.in([ 'Ski', 'Football' ])
})
```

Since the `'Ski'` of the `favorites` array of the record exists in the array of `db.in` conditions, the record will be queried.

__parameter__

- `{Array} array`: array condition for query

__return__

- `{Object}`: query condition, assigned to a specific field

__Guide__

- [Find Data - Query by Comparison Operators](/guide/database/find.md#comparison)

---

### `db.nin(array)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ location: db.nin([ 'Tokyo', 'London' ]) })
  .find();
```

Query by the condition that the value of a field satisfies one of the following conditions:

- the field's value is not in the specified `array`
- the record does not contain this field

If the value of the field being queried is also an array, it is required that **none of the elements** in the array of this field exist in `array`. For example, for records like:

```js
{
  name: 'Micheal',
  favorites: [ 'Ski', 'Hiking', 'Sushi' ]
}
```

Use the following conditions to query:

```js
where({
  favorites: db.nin([ 'Ski', 'Football' ])
})
```

Since the `'Ski'` of the `favorites` array of this record exists in the array of `db.nin` conditions, this record **will not** be queried.

__parameter__

- `{Array} array`: array condition for query

__return__

- `{Object}`: query condition, assigned to a specific field

__Guide__

- [Find Data - Query by Comparison Operators](/guide/database/find.md#comparison)

## Element Operators {#element-operators}

### `db.exists(boolean)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ name: db.exists(true) })
  .find();
```

It is used to set queries for whether a field exists in the record:

- If `boolean` is `true`, then query all records containing this field, including records whose field value is `null`
- If `boolean` is `false`, then query all records that do not contain this field

__parameter__

- `{boolean} boolean`: specify whether to include this field

__return__

- `{Object}`: query condition, assigned to a specific field

---

### `db.type(typeString)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ tags: db.type('array') })
  .find();
```

Query by the condition that the value type of field is the specified `typeString`.

__parameter__

- `{string} typeString`: type string, all available types are shown in the table below

  | type | `typeString` |
  | ---- | ---- |
  | Number | `'number'` |
  | String | `'string'` |
  | Object | `'object'` |
  | Array | `'array'` |
  | Binary data | `'binData'` |
  | Boolean | `'bool'` |
  | Date | `'date'` |
  | Null | `'null'` |
  | Regular Expression | `'regex'` |
  | JavaScript | `'javascript'` |
  | 32-bit integer | `'int'` |
  | 64-bit integer | `'long'` |
  | Double | `'double'` |
  | Decimal128 | `'decimal'` |
  | Timestamp | `'timestamp'` |

__return__

- `{Object}`: query condition, assigned to a specific field

## Evaluation Operators {#evaluation-operators}

### `db.mod(divisor, remainder)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ age: db.mod(5, 0) })
  .find();
```

Query by the condition that the remainder of a field value divided by `divisor` is `remainder`. Both `divisor` and `remainder` must be integers, otherwise an error will occur.

__parameter__

- `{number} divisor`: divisor, must be an integer
- `{number} remainder`: remainder, must be an integer

__return__

- `{Object}`: query condition, assigned to a specific field

## Array Operators {#array-operators}

### `db.all(array)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ favorites: db.all([ 'Ski', 'Hiking' ]) })
  .find();
```

Query by the condition that the value of a field is an array type and contains all elements in `array`.

In this example:
- If a record's `favorites` is `[ 'Ski', 'Hiking', 'Sushi' ]`, it will be queried
- If a record's `favorites` is `[ 'Ski', 'Football' ]`, since it does not contain `'Hiking'`, it will not be queried

::: tip Tips
If you want any element to be queried in the condition, you can use the [`db.in`](#db-in-array) operator.
:::

__parameter__

- `{Array} array`: array condition for query

__return__

- `{Object}`: query condition, assigned to a specific field

---

### `db.elemMatch(conditions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ results: db.elemMatch(db.gt(60).lt(80)) })
  .find();
```

Query by the condition that the value of a field is an array, and at least one element in the array satisfies all the conditions specified by `conditions`.

The above example is to query the records with at least one value greater than `60` and less than `80` in the `results` array. For example, for the following records:

```js
{ name: 'Micheal', results: [ 30, 50, 90 ] }
{ name: 'Mary', results: [ 20, 70, 100 ] }
{ name: 'Isabel', results: [ 50, 100, 120 ] }
```

The following records will be queried, because its `results` contains a `70` between `60` and `80`:

```js
{ name: 'Mary', results: [ 20, 70, 100 ] }
```

__subfield match__

If the elements in the array are `Object`, the `elemMatch` method can also specify the matching conditions of its subfields. For example, for the following records:

```js
{
  item: 'iPhone',
  inventories: [
    { location: 'Beijing', qty: 100 },
    { location: 'New York', qty: 30 },
    { location: 'Tokyo', qty: 120 },
  ]
}
{
  item: 'MacBook',
  inventories: [
    { location: 'London', qty: 20 },
    { location: 'New York', qty: 200 },
    { location: 'Sidney', qty: 60 },
  ]
}
{
  item: 'iPad',
  inventories: [
    { location: 'Beijing', qty: 80 },
    { location: 'London', qty: 25 },
    { location: 'Tokyo', qty: 90 },
  ]
}
```

Use the following query conditions:

```js
where({
  inventories: db.elemMatch({
    location: 'New York',
    qty: db.gt(100)
  })
})
```

Would return the following record because its `inventories` contains an element whose `location` is `'New York'` and `qty` is greater than `100`:

```js
{
  item: 'MacBook',
  inventories: [
    { location: 'London', qty: 20 },
    { location: 'New York', qty: 200 },
    { location: 'Sidney', qty: 60 },
  ]
}
```

__parameter__

- `{Object} conditions`: specify the conditions to match the elements in the array

__return__

- `{Object}`: query condition, assigned to a specific field

---

### `db.size(n)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ favorites: db.size(2) })
  .find();
```

Query by the condition that the value of a field is an array, and the number of array elements is `n`.

__parameter__

- `{number} n`: specify the number of elements in the array

__return__

- `{Object}`: query condition, assigned to a specific field

## Bitwise Operators {#bitwise-operators}

### `db.bitsAllClear(positions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ age: db.bitsAllClear([ 1, 5 ]) })
  .find();
```

Query by the condition that the value of a field is numeric or binary data, and the positions specified by `positions` in its binary value are all `0`.

The position of the binary data is determined as follows, note that the lowest bit is **position 0**:

| Bit Value | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Position | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |

For the query condition in the example, the 1st and 5th bits are required to be `0`. E.g:

- When `age` is `20`, its binary value is `00010100`, which satisfies the condition
- When `age` is `22`, its binary value is `00010110`, which does not satisfy the condition

__parameter__

- `{Array} positions`: specify the positions in the binary data to satisfy the condition

__return__

- `{Object}`: query condition, assigned to a specific field

---

### `db.bitsAllSet(positions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ age: db.bitsAllSet([ 1, 5 ]) })
  .find();
```

Query by the condition that the value of a field is numeric or binary data, and the positions specified by `positions` in its binary value are all `1`.

The position of the binary data is determined as follows, note that the lowest bit is **position 0**:

| Bit Value | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Position | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |

For the query condition in the example, the 1st and 5th bits are required to be `1`. E.g:

- When `age` is `38`, its binary value is `00100110`, which satisfies the condition
- When `age` is `6`, its binary value is `00000110`, which does not satisfy the condition

__parameter__

- `{Array} positions`: specify the positions in the binary data to satisfy the condition

__return__

- `{Object}`: query condition, assigned to a specific field

---

### `db.bitsAnyClear(positions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ age: db.bitsAnyClear([ 1, 5 ]) })
  .find();
```

Query by the condition that the value of a field is numeric or binary data, and any of the positions specified by `positions` in its binary value is `0`.

The position of the binary data is determined as follows, note that the lowest bit is **position 0**:

| Bit Value | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Position | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |

For the query condition in the example, any one of the 1st and 5th bits is required to be `0`. E.g:

- When `age` is `52`, its binary value is `00110100`, which satisfies the condition
- When `age` is `22`, its binary value is `00010110`, which satisfies the condition
- When `age` is `54`, its binary value is `00110110`, which does not satisfy the condition

__parameter__

- `{Array} positions`: specify the positions in the binary data to satisfy the condition

__return__

- `{Object}`: query condition, assigned to a specific field

---

### `db.bitsAnySet(positions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({ age: db.bitsAnyClear([ 1, 5 ]) })
  .find();
```

Query by the condition that the value of a field is numeric or binary data, and any of the positions specified by `positions` in its binary value is `1`.

The position of the binary data is determined as follows, note that the lowest bit is **position 0**:

| Bit Value | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Position | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |

For the query condition in the example, any one of the 1st and 5th bits is required to be `1`. E.g:

- When `age` is `52`, its binary value is `00110100`, which satisfies the condition
- When `age` is `22`, its binary value is `00010110`, which satisfies the condition
- When `age` is `20`, its binary value is `00010100`, which does not satisfy the condition

__parameter__

- `{Array} positions`: specify the positions in the binary data to satisfy the condition

__return__

- `{Object}`: query condition, assigned to a specific field

## Geospatial Objects {#geospatial-objects}

Geospatial objects are well-formed JavaScript objects that can be used for [Geo-based Query](/guide/database/geo.html).

Each geospatial object contains the following two fields:

- `type`: specify the type of this object, see the document below for supported types
- `coordinates`: specify the geographic coordinates of this object

::: tip Tips
When indicating coordinates in terms of latitude and longitude, __Longitude first, latitude last__.
- Longitude values ranges from -180 to 180, with positive numbers representing east longitude and negative numbers representing west longitude
- Latitude values ranges from -90 to 90, with positive numbers representing north latitudes and negative numbers representing south latitudes
:::

### `Point`

Represents a point in a geographic location, for example:

```js
{ type: 'Point', coordinates: [ 40, 5 ] }
```

---

### `LineString`

Represents a line segment defined by two points, for example:

```js
{ type: 'LineString', coordinates: [ [ 40, 5 ], [ 41, 6 ] ] }
```

---

### `Polygon`

Represents a polygon, divided into two types.

__Polygon objects with only one closed loop:__

```js
{
  type: 'Polygon',
  coordinates: [ [ [ 0, 0 ], [ 3, 6 ], [ 6, 1 ], [ 0, 0 ] ] ]
}
```

__Polygon objects containing multiple closed loops:__

```js
{
  type: 'Polygon',
  coordinates: [
    [ [ 0, 0 ], [ 3, 6 ], [ 6, 1 ], [ 0, 0 ] ],
    [ [ 2, 2 ], [ 3, 3 ], [ 4, 2 ], [ 2, 2 ] ]
  ]
}
```

---

### `MultiPoint`

Represents a collection of point objects, for example:

```js
{
  type: 'MultiPoint',
  coordinates: [
    [ -73.9580, 40.8003 ],
    [ -73.9498, 40.7968 ],
    [ -73.9737, 40.7648 ],
    [ -73.9814, 40.7681 ]
  ]
}
```

---

### `MultiLineString`

Represents a collection of line segments, for example:

```js
{
  type: 'MultiLineString',
  coordinates: [
    [ [ -73.96943, 40.78519 ], [ -73.96082, 40.78095 ] ],
    [ [ -73.96415, 40.79229 ], [ -73.95544, 40.78854 ] ],
    [ [ -73.97162, 40.78205 ], [ -73.96374, 40.77715 ] ],
    [ [ -73.97880, 40.77247 ], [ -73.97036, 40.76811 ] ]
  ]
}
```

---

### `MultiPolygon`

Represents a collection of polygons, for example:

```js
{
  type: 'MultiPolygon',
  coordinates: [
    [ [ [ -73.958, 40.8003 ], [ -73.9498, 40.7968 ], [ -73.9737, 40.7648 ], [ -73.9814, 40.7681 ], [ -73.958, 40.8003 ] ] ],
    [ [ [ -73.958, 40.8003 ], [ -73.9498, 40.7968 ], [ -73.9737, 40.7648 ], [ -73.958, 40.8003 ] ] ]
  ]
}
```

---

### `GeometryCollection`

The geographic collection object containing a collection of multiple geographic objects of different types, for example:

```js
{
  type: 'GeometryCollection',
  geometries: [
    {
      type: 'MultiPoint',
      coordinates: [
        [ -73.9580, 40.8003 ],
        [ -73.9498, 40.7968 ],
        [ -73.9737, 40.7648 ],
        [ -73.9814, 40.7681 ]
      ]
    },
    {
      type: 'MultiLineString',
      coordinates: [
        [ [ -73.96943, 40.78519 ], [ -73.96082, 40.78095 ] ],
        [ [ -73.96415, 40.79229 ], [ -73.95544, 40.78854 ] ],
        [ [ -73.97162, 40.78205 ], [ -73.96374, 40.77715 ] ],
        [ [ -73.97880, 40.77247 ], [ -73.97036, 40.76811 ] ]
      ]
    }
  ]
}
```

## Geospatial Operators {#geospatial-operators}

### `db.geoIntersects(conditions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({
    position: db.geoIntersects({
      $geometry: {
        type: 'Polygon',
        coordinates: [ [ [ 0, 0 ], [ 3, 6 ], [ 6, 1 ], [ 0, 0 ] ] ]
      }
    })
  }).find();
```

Query by the condition that the geographic location of a field intersects with the geographic object specified by `conditions`.

__parameter__

- `{Object} conditions`: geospatial query conditions, where `$geometry` is a [Geospatial Object](#geospatial-objects)

__return__

- `{Object}`: query condition, assigned to a specific field

__Guide__

- [Geo-based Query](/guide/database/geo.html)

---

### `db.geoWithin(conditions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({
    position: db.geoWithin({
      $geometry: {
        type: 'Polygon',
        coordinates: [ [ [ 0, 0 ], [ 3, 6 ], [ 6, 1 ], [ 0, 0 ] ] ]
      }
    })
  }).find();
```

Query by the condition that the geographic location of a field is completely inside the geographic object specified by `conditions`.

__parameter__

- `{Object} conditions`: geographic query conditions, where `$geometry` is a [Geospatial Object](#geospatial-objects)

__return__

- `{Object}`: query condition, assigned to a specific field

__Guide__

- [Geo-based Query](/guide/database/geo.html)

---

### `db.near(conditions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({
    position: db.near({
      $geometry: {
        type: 'Point',
        coordinates: [ -73.9855, 40.7580 ]
      },
      $maxDistance: 2000, // in meters
      $minDistance: 100 // in meters
    })
  }).find();
```

Query by the condition that the geographic location of a field is located at a certain **plane** distance near the geographic object specified by `conditions`.

__parameter__

- `{Object} conditions`: geospatial query conditions, where:
  - The value of `$geometry` is a [Geospatial Object](#geospatial-objects)
  - The value of `$maxDistance` is the maximum distance in meters
  - The value of `$minDistance` is the minimum distance in meters

__return__

- `{Object}`: query condition, assigned to a specific field

__Guide__

- [Geo-based Query](/guide/database/geo.html)

---

### `db.nearSphere(conditions)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({
    position: db.nearSphere({
      $geometry: {
        type: 'Point',
        coordinates: [ -73.9855, 40.7580 ]
      },
      $maxDistance: 2000, // in meters
      $minDistance: 100 // in meters
    })
  }).find();
```

Query by the condition that the geographic location of a field is within a certain **spherical** distance near the geographic object specified by `conditions`. The biggest difference from `near` is that `nearSphere` will use the algorithm of spherical geometry when calculating the distance, which is closer to the real surface distance on the earth.

__parameter__

- `{Object} conditions`: geospatial query conditions, where:
  - The value of `$geometry` is a [Geospatial Object](#geospatial-objects)
  - The value of `$maxDistance` is the maximum distance in meters
  - The value of `$minDistance` is the minimum distance in meters

__return__

- `{Object}`: query condition, assigned to a specific field

__Guide__

- [Geo-based Query](/guide/database/geo.html)

## Update Operators {#update-operators}

### `db.inc(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: 'Micheal' })
  .set({ score: db.inc(5) })
  .save();
```

It is used in [`set`](#query-set-conditions) method to increase the value of the corresponding field by the specified `value`. If the corresponding field does not exist, it will be created and its value set to `value`.

::: tip Tips
if `value` is negative, it is equivalent to decrease the value from the corresponding field.
:::

__parameter__

- `{number} value`: specify the value to increment

__return__

- `{Object}`: update condition, assigned to a specific field

---

### `db.mul(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: 'Micheal' })
  .set({ score: db.mul(2.5) })
  .save();
```

It is used in [`set`](#query-set-conditions) method to specify that the value of the corresponding field is multiplied by `value`. If the corresponding field does not exist, it will be created and its value set to `0`.

__parameter__

- `{number} value`: specify the value to multiply by

__return__

- `{Object}`: update condition, assigned to a specific field

---

### `db.min(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: 'Micheal' })
  .set({ score: db.min(60) })
  .save();
```

It is used in the [`set`](#query-set-conditions) method to select the smaller value between the current field value and the specified `value`, which is:

- When `value` is less than the current field value, set the current field to `value`
- Otherwise, no change

If the corresponding field does not exist, it will be created and its value set to `value`.

__parameter__

- `{any} value`: specify the value to compare

__return__

- `{Object}`: update condition, assigned to a specific field

---

### `db.max(value)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where({ name: 'Micheal' })
  .set({ score: db.max(120) })
  .save();
```

It is used in the [`set`](#query-set-conditions) method to select the larger value between the current field value and the specified `value`. which is:

- When `value` is greater than the current field value, set the current field to `value`
- Otherwise, no change

If the corresponding field does not exist, it will be created and its value set to `value`.

__parameter__

- `{any} value`: specify the value to compare

__return__

- `{Object}`: update condition, assigned to a specific field

---

### `db.rename(name)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where()
  .set({ cell: db.rename('mobile') })
  .save();
```

It is used in the [`set`](#query-set-conditions) method to change the name of the corresponding field to the value specified by the parameter `name`.

For example, the above example renames the `cell` field of all records to `mobile`.

__parameter__

- `{string} name`: the name to change to

__return__

- `{Object}`: update condition, assigned to a specific field

---

### `db.unset()`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where()
  .set({ position: db.unset() })
  .save();
```

It is used in the [`set`](#query-set-conditions) method, specifying to delete the corresponding field.

For example, the above example removes the `position` field from all records.

__parameter__

none

__return__

- `{Object}`: update condition, assigned to a specific field

---

### `db.currentDate()`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const result = await PersonsTable
  .where()
  .set({ lastModified: db.currentDate() })
  .save();
```

It is used in the [`set`](#query-set-conditions) method to specify that the value of the corresponding field is set to the current time when the query executes, and the type is `Date`.

__parameter__

none

__return__

- `{Object}`: update condition, assigned to a specific field

## Logical Operators {#logical-operators}

### `db.and(...filters)`

```js
// f1 || (f2 && f3)
Table.where(f1).or(db.and(f2, f3));
```

It is mainly used in complex logical combinations that cannot be solved by chains, and represents the "and" relationship of several query conditions.

__parameter__

- `{Object} ...filters`: query conditions, at least two

__return__

- `{Object}`: logical condition, can be used as the conditional parameter for other logical operators

__Guide__

- [Find Data - Query by Logical Operators](/guide/database/find.html#logical-operator)

---

### `db.or(...filters)`

```js
// (f1 || f2) && (f3 && f4)
Table.where(db.or(f1, f2)).and(f3, f4);
```

It is mainly used in complex logical combinations that cannot be solved by chains, and represents the "or" relationship of several query conditions.

__parameter__

- `{Object} ...filters`: query conditions, at least two

__return__

- `{Object}`: logical condition, can be used as the conditional parameter for other logical operators

__Guide__

- [Find Data - Query by Logical Operators](/guide/database/find.html#logical-operator)

---

### `db.nor(...filters)`

```js
// !(f1 || f2) && (f3 && f4)
Table.where(db.nor(f1, f2)).and(f3, f4);
```

It is mainly used in complex logic combinations that cannot be solved by chains, and represents the "nor" relationship of several query conditions.

__parameter__

- `{Object} ...filters`: query conditions, at least two

__return__

- `{Object}`: logical condition, can be used as the conditional parameter for other logical operators

__Guide__

- [Find Data - Query by Logical Operators](/guide/database/find.html#logical-operator)

---

### `db.not(condition)`

```js
const { db } = aircode;
const PersonsTable = db.table('persons');
const records = await PersonsTable
  .where({
    score: db.not(db.gt(2.5))
  })
  .find();
```

Query by the condition that the value of a field does not meet the condition specified by `condition`, which also includes the case that this record does not have this field.

For example, the above example will query:
1. Records with `score` less than or equal to `2.5`
2. Records that do not contain a `score` field

This is also the main difference from `db.lte(2.5)`, because `db.lte(2.5)` requires that records must contain a `score` field.

__parameter__

- `{any} condition`: specify the condition that is not met

__return__

- `{Object}`: query condition, assigned to a specific field

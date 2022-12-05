# Geo-based Query {#intro}

The AirCode database supports storing geographic location data and implementing queries based on the location. This allows you to quickly implement operations like finding nearby restaurants, finding attractions in an area, and so on.

## Geospatial Data {#geospatial-data}

In AirCode's database, the geospatial data is an object containing two fields: `type` and `coordinates`. For example, the following object represents a geographic point:

```js
// A point at 103.7715° E, 29.5441° N
{
  type: 'Point',
  coordinates: [ 103.7715, 29.5441 ]
}
```

Where `type` represents the type of geographic location, and `coordinates` represents the coordinates of it.

::: tip Tips
When representing coordinates by latitude and longitude, __longitude comes first and latitude follows__.
- Longitude values ranges from -180 to 180, with positive numbers representing east longitude and negative numbers representing west longitude
- Latitude values ranges from -90 to 90, with positive numbers representing north latitudes and negative numbers representing south latitudes
  :::

For complete definition and examples of geospatial objects, please refer to [Database API - Geospatial Objects](/reference/server/database-api.html#geospatial-objects).

## Geospatial Indexes {#geospatial-indexes}

To query based on geo-location in the database, you first need to establish a geospatial index (2DSPHERE) for the query field.

In the "Database" area of the console, select the table and switch to the "Indexes" tab to see all the created indexes.

Click the Add Index on the right, select the field to store the geospatial location in the pop-up window, and select the index type as "2DSPHERE", and click "Create".

::: warning Note
For a field to be geographically indexed, the stored value must be [Geospatial Data](#geospatial-data), otherwise the index won't work.
:::

After successfully created the index, you can see that it just appears in the list. At this point, you can use geospatial operators on this field for querying.

## Geospatial Operators {#geospatial-operators}

For fields that have already established [Geospatial Indexex](#geospatial-indexes), geospatial operators can be used to implement geospatial location-based queries. All the geospatial operators are nested in `aircode.db` object.

For example, to query all records whose `position` is near a corresponding point, and the distance is greater than 100 meters and less than 2000 meters:

```js
const aircode = require('aircode');

module.exports = async function(params, context) {
  // All operators are nested in `aircode.db`
  const { db } = aircode;
  // Use `db.table` to get a table
  const PlacesTable = db.table('places');

  // Query operations on geospatial data
  const result = await PlacesTable
    .where({
      position: db.near({
        $geometry: {
          type: 'Point',
          coordinates: [ -73.9855, 40.7580 ]
        },
        $maxDistance: 2000, // in meters
        $minDistance: 100 // in meters
      })
    })
    .find();

  return {
    result
  };
}
```

For complete geospatial operators and examples, see [Database API - Geospatial Operators](/reference/server/database-api.html#geospatial-operators).

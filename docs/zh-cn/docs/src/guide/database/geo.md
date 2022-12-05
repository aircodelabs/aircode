# 基于地理位置查询 {#intro}

AirCode 数据库支持存储地理位置数据，并基于地理位置来实现查询。这可以让你快速实现类似查找附近的饭店、查找一个区域内的景点等操作。

## 存储地理位置数据 {#geospatial-data}

在 AirCode 的数据库中，地理位置数据是包含 `type` 和 `coordinates` 两个字段的对象。例如以下对象代表一个地理点：

```js
// A point at 103.7715° E, 29.5441° N
{
  type: 'Point',
  coordinates: [ 103.7715, 29.5441 ]
}
```

其中 `type` 代表地理位置的类型，`coordinates` 代表地理位置的坐标。

::: tip 重要提示
当用经纬度来表示坐标时，__经度在前，纬度在后__。
- 经度值为 -180 到 180，正数代表东经，负数代表西经
- 纬度值为 -90 到 90，正数代表北纬，负数代表南纬
:::

完整的地理位置对象定义及示例，可参考[数据库 API - 地理位置对象](/reference/server/database-api.html#geospatial-objects)。

## 建立地理索引 {#geospatial-indexes}

要想在数据库中基于地理位置查询，首先需要对查询的字段建立地理位置索引（2DSPHERE）。

在控制台的「Database」区域中，选中数据表，并切换到「Indexes」标签可以看到所有已经建立的索引。

点击右侧的添加索引图标，在弹出对话框中选择存储地理位置的字段，并将索引类型选择为「2DSPHERE」，点击「Create」完成创建。

::: warning 注意
对于要建立地理索引的字段，其存储的值必须为[地理位置数据](#geospatial-data)，否则为索引会失效。
:::

成功后，可以看到列表中出现了刚才创建的索引。此时就可以在查询时对该字段使用地理操作符了。

## 使用地理操作符查询 {#geospatial-operators}

对于已经建立了[地理索引](#geospatial-indexes)的字段，可以通过地理操作符来实现基于地理位置的查询。所有地理操作符都在 `aircode.db` 对象下。

例如，查询 `position` 字段值在对应点附近，距离大于 100 米小于 2000 米的所有记录：

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
        $minDistance: 100   // in meters
      })
    })
    .find();

  return {
    result
  };
}
```

完整的地理操作符和示例，可参考[数据库 API - 地理操作符](/reference/server/database-api.html#geospatial-operators)。

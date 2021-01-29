import moment from 'moment'
import { timeChart } from './lib'

const dataSource = {
  values: [
    {
      date: {
        date: '2015-08',
      },
      count: 85609,
    },
    {
      date: {
        date: '2015-09',
      },
      count: 173805,
    },
    {
      date: {
        date: '2015-10',
      },
      count: 205045,
    },
    {
      date: {
        date: '2015-11',
      },
      count: 234733,
    },
    {
      date: {
        date: '2015-12',
      },
      count: 347092,
    },
    {
      date: {
        date: '2016-01',
      },
      count: 404816,
    },
    {
      date: {
        date: '2016-02',
      },
      count: 520040,
    },
    {
      date: {
        date: '2016-03',
      },
      count: 917170,
    },
    {
      date: {
        date: '2016-04',
      },
      count: 1023096,
    },
    {
      date: {
        date: '2016-05',
      },
      count: 1346796,
    },
    {
      date: {
        date: '2016-06',
      },
      count: 1351536,
    },
    {
      date: {
        date: '2016-07',
      },
      count: 1043970,
    },
    {
      date: {
        date: '2016-08',
      },
      count: 491067,
    },
    {
      date: {
        date: '2016-09',
      },
      count: 426772,
    },
    {
      date: {
        date: '2016-10',
      },
      count: 515381,
    },
    {
      date: {
        date: '2016-11',
      },
      count: 324952,
    },
    {
      date: {
        date: '2016-12',
      },
      count: 508180,
    },
    {
      date: {
        date: '2017-01',
      },
      count: 566374,
    },
    {
      date: {
        date: '2017-02',
      },
      count: 563292,
    },
    {
      date: {
        date: '2017-03',
      },
      count: 660392,
    },
    {
      date: {
        date: '2017-04',
      },
      count: 701086,
    },
    {
      date: {
        date: '2017-05',
      },
      count: 932771,
    },
    {
      date: {
        date: '2017-06',
      },
      count: 870862,
    },
    {
      date: {
        date: '2017-07',
      },
      count: 960310,
    },
    {
      date: {
        date: '2017-08',
      },
      count: 1084782,
    },
    {
      date: {
        date: '2017-09',
      },
      count: 1139438,
    },
    {
      date: {
        date: '2017-10',
      },
      count: 1172986,
    },
    {
      date: {
        date: '2017-11',
      },
      count: 1260095,
    },
    {
      date: {
        date: '2017-12',
      },
      count: 1485878,
    },
    {
      date: {
        date: '2018-01',
      },
      count: 1597171,
    },
    {
      date: {
        date: '2018-02',
      },
      count: 1327157,
    },
    {
      date: {
        date: '2018-03',
      },
      count: 1460186,
    },
    {
      date: {
        date: '2018-04',
      },
      count: 1089815,
    },
    {
      date: {
        date: '2018-05',
      },
      count: 955168,
    },
    {
      date: {
        date: '2018-06',
      },
      count: 1276822,
    },
    {
      date: {
        date: '2018-07',
      },
      count: 1480564,
    },
    {
      date: {
        date: '2018-08',
      },
      count: 1506989,
    },
    {
      date: {
        date: '2018-09',
      },
      count: 1374135,
    },
    {
      date: {
        date: '2018-10',
      },
      count: 1419737,
    },
    {
      date: {
        date: '2018-11',
      },
      count: 1421095,
    },
    {
      date: {
        date: '2018-12',
      },
      count: 1662598,
    },
    {
      date: {
        date: '2019-01',
      },
      count: 1613137,
    },
    {
      date: {
        date: '2019-02',
      },
      count: 1164598,
    },
    {
      date: {
        date: '2019-03',
      },
      count: 1260400,
    },
    {
      date: {
        date: '2019-04',
      },
      count: 1134398,
    },
    {
      date: {
        date: '2019-05',
      },
      count: 1256839,
    },
    {
      date: {
        date: '2019-06',
      },
      count: 1275689,
    },
    {
      date: {
        date: '2019-07',
      },
      count: 1379967,
    },
    {
      date: {
        date: '2019-08',
      },
      count: 1157152,
    },
    {
      date: {
        date: '2019-09',
      },
      count: 1024410,
    },
    {
      date: {
        date: '2019-10',
      },
      count: 1129522,
    },
    {
      date: {
        date: '2019-11',
      },
      count: 1539733,
    },
    {
      date: {
        date: '2019-12',
      },
      count: 1488030,
    },
    {
      date: {
        date: '2020-01',
      },
      count: 1189115,
    },
    {
      date: {
        date: '2020-02',
      },
      count: 1381871,
    },
    {
      date: {
        date: '2020-03',
      },
      count: 1143143,
    },
    {
      date: {
        date: '2020-04',
      },
      count: 1055629,
    },
    {
      date: {
        date: '2020-05',
      },
      count: 1164868,
    },
    {
      date: {
        date: '2020-06',
      },
      count: 991380,
    },
    {
      date: {
        date: '2020-07',
      },
      count: 1131651,
    },
    {
      date: {
        date: '2020-08',
      },
      count: 36847,
    },
  ],
  variables: "{\"dateFormat\":\"%Y-%m\"}"
}

timeChart('#chart', dataSource)

// console.log(moment)
// console.log(dataSource.values)

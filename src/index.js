import TimeChartEditor from './reactComponents/TimeChartEditor'
import TimeChartRenderer from './reactComponents/TimeChartRenderer'
import hasQuantative from './util/hasQuantative'

class TimeChartPlugin {
  constructor() {
    this.id = 'time.chart'
    this.name = 'Time Chart'
    this.editor = TimeChartEditor
    this.renderer = TimeChartRenderer
  }
  supportsModel(model) {
		console.log(model)
    for (let key in model) {
      if (
        model[key].typeInfo.toString()[0] === '[' &&
        model[key].typeInfo.toString().slice(-2, -1) !== '0'
      ) {
				return hasQuantative(model[key])
      }
      return false
    }
  }
}

export let timeChartPlugins = [new TimeChartPlugin()]

// import moment from 'moment'
// import { timeChart } from './lib'

// const dataSource = {
//   values: [
//     {
//       date: {
//         date: '2015-08',
//       },
//       count: 85609,
//     },
//     {
//       date: {
//         date: '2015-09',
//       },
//       count: 173805,
//     },
//     {
//       date: {
//         date: '2015-10',
//       },
//       count: 205045,
//     },
//     {
//       date: {
//         date: '2015-11',
//       },
//       count: 234733,
//     },
//     {
//       date: {
//         date: '2015-12',
//       },
//       count: 347092,
//     },
//     {
//       date: {
//         date: '2016-01',
//       },
//       count: 404816,
//     },
//     {
//       date: {
//         date: '2016-02',
//       },
//       count: 520040,
//     },
//     {
//       date: {
//         date: '2016-03',
//       },
//       count: 917170,
//     },
//     {
//       date: {
//         date: '2016-04',
//       },
//       count: 1023096,
//     },
//     {
//       date: {
//         date: '2016-05',
//       },
//       count: 1346796,
//     },
//     {
//       date: {
//         date: '2016-06',
//       },
//       count: 1351536,
//     },
//     {
//       date: {
//         date: '2016-07',
//       },
//       count: 1043970,
//     },
//     {
//       date: {
//         date: '2016-08',
//       },
//       count: 491067,
//     },
//     {
//       date: {
//         date: '2016-09',
//       },
//       count: 426772,
//     },
//     {
//       date: {
//         date: '2016-10',
//       },
//       count: 515381,
//     },
//     {
//       date: {
//         date: '2016-11',
//       },
//       count: 324952,
//     },
//     {
//       date: {
//         date: '2016-12',
//       },
//       count: 508180,
//     },
//     {
//       date: {
//         date: '2017-01',
//       },
//       count: 566374,
//     },
//     {
//       date: {
//         date: '2017-02',
//       },
//       count: 563292,
//     },
//     {
//       date: {
//         date: '2017-03',
//       },
//       count: 660392,
//     },
//     {
//       date: {
//         date: '2017-04',
//       },
//       count: 701086,
//     },
//     {
//       date: {
//         date: '2017-05',
//       },
//       count: 932771,
//     },
//     {
//       date: {
//         date: '2017-06',
//       },
//       count: 870862,
//     },
//     {
//       date: {
//         date: '2017-07',
//       },
//       count: 960310,
//     },
//     {
//       date: {
//         date: '2017-08',
//       },
//       count: 1084782,
//     },
//     {
//       date: {
//         date: '2017-09',
//       },
//       count: 1139438,
//     },
//     {
//       date: {
//         date: '2017-10',
//       },
//       count: 1172986,
//     },
//     {
//       date: {
//         date: '2017-11',
//       },
//       count: 1260095,
//     },
//     {
//       date: {
//         date: '2017-12',
//       },
//       count: 1485878,
//     },
//     {
//       date: {
//         date: '2018-01',
//       },
//       count: 1597171,
//     },
//     {
//       date: {
//         date: '2018-02',
//       },
//       count: 1327157,
//     },
//     {
//       date: {
//         date: '2018-03',
//       },
//       count: 1460186,
//     },
//     {
//       date: {
//         date: '2018-04',
//       },
//       count: 1089815,
//     },
//     {
//       date: {
//         date: '2018-05',
//       },
//       count: 955168,
//     },
//     {
//       date: {
//         date: '2018-06',
//       },
//       count: 1276822,
//     },
//     {
//       date: {
//         date: '2018-07',
//       },
//       count: 1480564,
//     },
//     {
//       date: {
//         date: '2018-08',
//       },
//       count: 1506989,
//     },
//     {
//       date: {
//         date: '2018-09',
//       },
//       count: 1374135,
//     },
//     {
//       date: {
//         date: '2018-10',
//       },
//       count: 1419737,
//     },
//     {
//       date: {
//         date: '2018-11',
//       },
//       count: 1421095,
//     },
//     {
//       date: {
//         date: '2018-12',
//       },
//       count: 1662598,
//     },
//     {
//       date: {
//         date: '2019-01',
//       },
//       count: 1613137,
//     },
//     {
//       date: {
//         date: '2019-02',
//       },
//       count: 1164598,
//     },
//     {
//       date: {
//         date: '2019-03',
//       },
//       count: 1260400,
//     },
//     {
//       date: {
//         date: '2019-04',
//       },
//       count: 1134398,
//     },
//     {
//       date: {
//         date: '2019-05',
//       },
//       count: 1256839,
//     },
//     {
//       date: {
//         date: '2019-06',
//       },
//       count: 1275689,
//     },
//     {
//       date: {
//         date: '2019-07',
//       },
//       count: 1379967,
//     },
//     {
//       date: {
//         date: '2019-08',
//       },
//       count: 1157152,
//     },
//     {
//       date: {
//         date: '2019-09',
//       },
//       count: 1024410,
//     },
//     {
//       date: {
//         date: '2019-10',
//       },
//       count: 1129522,
//     },
//     {
//       date: {
//         date: '2019-11',
//       },
//       count: 1539733,
//     },
//     {
//       date: {
//         date: '2019-12',
//       },
//       count: 1488030,
//     },
//     {
//       date: {
//         date: '2020-01',
//       },
//       count: 1189115,
//     },
//     {
//       date: {
//         date: '2020-02',
//       },
//       count: 1381871,
//     },
//     {
//       date: {
//         date: '2020-03',
//       },
//       count: 1143143,
//     },
//     {
//       date: {
//         date: '2020-04',
//       },
//       count: 1055629,
//     },
//     {
//       date: {
//         date: '2020-05',
//       },
//       count: 1164868,
//     },
//     {
//       date: {
//         date: '2020-06',
//       },
//       count: 991380,
//     },
//     {
//       date: {
//         date: '2020-07',
//       },
//       count: 1131651,
//     },
//     {
//       date: {
//         date: '2020-08',
//       },
//       count: 36847,
//     },
//   ],
//   variables: "{\"dateFormat\":\"%Y-%m\"}"
// }

// const dataSource = {
//   values: [
// 		{
// 			"date": {
// 				"date": "2016-07"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 30,
// 			"tradeAmount": 307.284080088563
// 		},
// 		{
// 			"date": {
// 				"date": "2016-08"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 3,
// 			"tradeAmount": 20.611912403774262
// 		},
// 		{
// 			"date": {
// 				"date": "2016-08"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 74,
// 			"tradeAmount": 1974.5760809461967
// 		},
// 		{
// 			"date": {
// 				"date": "2016-09"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 308,
// 			"tradeAmount": 79896.57939090469
// 		},
// 		{
// 			"date": {
// 				"date": "2016-10"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 737,
// 			"tradeAmount": 91048.71208298755
// 		},
// 		{
// 			"date": {
// 				"date": "2016-11"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 455,
// 			"tradeAmount": 48700.60989114314
// 		},
// 		{
// 			"date": {
// 				"date": "2016-12"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 373,
// 			"tradeAmount": 19906.04864635569
// 		},
// 		{
// 			"date": {
// 				"date": "2017-01"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 670,
// 			"tradeAmount": 65678.27738303461
// 		},
// 		{
// 			"date": {
// 				"date": "2017-02"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 735,
// 			"tradeAmount": 57046.753019930446
// 		},
// 		{
// 			"date": {
// 				"date": "2017-03"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 1357,
// 			"tradeAmount": 162095.514236298
// 		},
// 		{
// 			"date": {
// 				"date": "2017-04"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 4001,
// 			"tradeAmount": 877354.5929028331
// 		},
// 		{
// 			"date": {
// 				"date": "2017-05"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 4851,
// 			"tradeAmount": 1984897.596753992
// 		},
// 		{
// 			"date": {
// 				"date": "2017-05"
// 			},
// 			"exchange": {
// 				"fullName": "DecentrEx"
// 			},
// 			"count": 28,
// 			"tradeAmount": 3741.3638027109905
// 		},
// 		{
// 			"date": {
// 				"date": "2017-05"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 13,
// 			"tradeAmount": 25.667431121160526
// 		},
// 		{
// 			"date": {
// 				"date": "2017-06"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 39,
// 			"tradeAmount": 64.8632046590484
// 		},
// 		{
// 			"date": {
// 				"date": "2017-06"
// 			},
// 			"exchange": {
// 				"fullName": "DecentrEx"
// 			},
// 			"count": 747,
// 			"tradeAmount": 1222610.4759279059
// 		},
// 		{
// 			"date": {
// 				"date": "2017-06"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 25552,
// 			"tradeAmount": 16739772.958581122
// 		},
// 		{
// 			"date": {
// 				"date": "2017-07"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 133346,
// 			"tradeAmount": 89065588.60367215
// 		},
// 		{
// 			"date": {
// 				"date": "2017-07"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 6,
// 			"tradeAmount": 19.10832222290039
// 		},
// 		{
// 			"date": {
// 				"date": "2017-07"
// 			},
// 			"exchange": {
// 				"fullName": "DecentrEx"
// 			},
// 			"count": 688,
// 			"tradeAmount": 8820.611676319593
// 		},
// 		{
// 			"date": {
// 				"date": "2017-08"
// 			},
// 			"exchange": {
// 				"fullName": "DecentrEx"
// 			},
// 			"count": 349,
// 			"tradeAmount": 206586.20076090528
// 		},
// 		{
// 			"date": {
// 				"date": "2017-08"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 227229,
// 			"tradeAmount": 146620262.17566127
// 		},
// 		{
// 			"date": {
// 				"date": "2017-08"
// 			},
// 			"exchange": {
// 				"fullName": "Zerox Exchange"
// 			},
// 			"count": 16244,
// 			"tradeAmount": 10644896.700010879
// 		},
// 		{
// 			"date": {
// 				"date": "2017-09"
// 			},
// 			"exchange": {
// 				"fullName": "Zerox Exchange"
// 			},
// 			"count": 23,
// 			"tradeAmount": 5900.005549799632
// 		},
// 		{
// 			"date": {
// 				"date": "2017-09"
// 			},
// 			"exchange": {
// 				"fullName": "IDEX"
// 			},
// 			"count": 106,
// 			"tradeAmount": 143.08165883208687
// 		},
// 		{
// 			"date": {
// 				"date": "2017-09"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 66,
// 			"tradeAmount": 9470424.14613071
// 		},
// 		{
// 			"date": {
// 				"date": "2017-09"
// 			},
// 			"exchange": {
// 				"fullName": "<Zerox Exchange>"
// 			},
// 			"count": 19,
// 			"tradeAmount": 534.0174081549724
// 		},
// 		{
// 			"date": {
// 				"date": "2017-09"
// 			},
// 			"exchange": {
// 				"fullName": "TokenStore"
// 			},
// 			"count": 388,
// 			"tradeAmount": 19959.707092537865
// 		},
// 		{
// 			"date": {
// 				"date": "2017-09"
// 			},
// 			"exchange": {
// 				"fullName": "DecentrEx"
// 			},
// 			"count": 465,
// 			"tradeAmount": 166070.05603669418
// 		},
// 		{
// 			"date": {
// 				"date": "2017-09"
// 			},
// 			"exchange": {
// 				"fullName": "Radar Relay"
// 			},
// 			"count": 3,
// 			"tradeAmount": 395.3969096134733
// 		},
// 		{
// 			"date": {
// 				"date": "2017-09"
// 			},
// 			"exchange": {
// 				"fullName": "Oasis"
// 			},
// 			"count": 188,
// 			"tradeAmount": 0
// 		},
// 		{
// 			"date": {
// 				"date": "2017-09"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 220031,
// 			"tradeAmount": 126025457.18469445
// 		},
// 		{
// 			"date": {
// 				"date": "2017-10"
// 			},
// 			"exchange": {
// 				"fullName": "Bancor Network"
// 			},
// 			"count": 558,
// 			"tradeAmount": 1874614.0299382773
// 		},
// 		{
// 			"date": {
// 				"date": "2017-10"
// 			},
// 			"exchange": {
// 				"fullName": "IDEX"
// 			},
// 			"count": 1624,
// 			"tradeAmount": 750229.9992693465
// 		},
// 		{
// 			"date": {
// 				"date": "2017-10"
// 			},
// 			"exchange": {
// 				"fullName": "TokenStore"
// 			},
// 			"count": 540,
// 			"tradeAmount": 26891.530323183662
// 		},
// 		{
// 			"date": {
// 				"date": "2017-10"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 403238,
// 			"tradeAmount": 157220256.73374483
// 		},
// 		{
// 			"date": {
// 				"date": "2017-10"
// 			},
// 			"exchange": {
// 				"fullName": "Oasis"
// 			},
// 			"count": 301,
// 			"tradeAmount": 28963.68887278724
// 		},
// 		{
// 			"date": {
// 				"date": "2017-10"
// 			},
// 			"exchange": {
// 				"fullName": "Air Swap"
// 			},
// 			"count": 10252,
// 			"tradeAmount": 13116471.929474456
// 		},
// 		{
// 			"date": {
// 				"date": "2017-10"
// 			},
// 			"exchange": {
// 				"fullName": "Zerox Exchange"
// 			},
// 			"count": 50,
// 			"tradeAmount": 351.7272005200386
// 		},
// 		{
// 			"date": {
// 				"date": "2017-10"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 25,
// 			"tradeAmount": 1679338.777271138
// 		},
// 		{
// 			"date": {
// 				"date": "2017-10"
// 			},
// 			"exchange": {
// 				"fullName": "DecentrEx"
// 			},
// 			"count": 2049,
// 			"tradeAmount": 1131474.5737546023
// 		},
// 		{
// 			"date": {
// 				"date": "2017-10"
// 			},
// 			"exchange": {
// 				"fullName": "Radar Relay"
// 			},
// 			"count": 741,
// 			"tradeAmount": 75465.7737292788
// 		},
// 		{
// 			"date": {
// 				"date": "2017-10"
// 			},
// 			"exchange": {
// 				"fullName": "<Zerox Exchange>"
// 			},
// 			"count": 19,
// 			"tradeAmount": 1253.3484905403732
// 		},
// 		{
// 			"date": {
// 				"date": "2017-11"
// 			},
// 			"exchange": {
// 				"fullName": "<Zerox Exchange>"
// 			},
// 			"count": 13,
// 			"tradeAmount": 491.3931185972085
// 		},
// 		{
// 			"date": {
// 				"date": "2017-11"
// 			},
// 			"exchange": {
// 				"fullName": "IDEX"
// 			},
// 			"count": 7563,
// 			"tradeAmount": 2688535.690183154
// 		},
// 		{
// 			"date": {
// 				"date": "2017-11"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 15,
// 			"tradeAmount": 2015822.161890727
// 		},
// 		{
// 			"date": {
// 				"date": "2017-11"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 589227,
// 			"tradeAmount": 206288729.48779154
// 		},
// 		{
// 			"date": {
// 				"date": "2017-11"
// 			},
// 			"exchange": {
// 				"fullName": "DecentrEx"
// 			},
// 			"count": 2194,
// 			"tradeAmount": 1766126.8454869129
// 		},
// 		{
// 			"date": {
// 				"date": "2017-11"
// 			},
// 			"exchange": {
// 				"fullName": "Oasis"
// 			},
// 			"count": 782,
// 			"tradeAmount": 11505.410504415631
// 		},
// 		{
// 			"date": {
// 				"date": "2017-11"
// 			},
// 			"exchange": {
// 				"fullName": "Zerox Exchange"
// 			},
// 			"count": 8,
// 			"tradeAmount": 209.95082762598992
// 		},
// 		{
// 			"date": {
// 				"date": "2017-11"
// 			},
// 			"exchange": {
// 				"fullName": "Bancor Network"
// 			},
// 			"count": 3799,
// 			"tradeAmount": 19151500.00374058
// 		},
// 		{
// 			"date": {
// 				"date": "2017-11"
// 			},
// 			"exchange": {
// 				"fullName": "TokenStore"
// 			},
// 			"count": 864,
// 			"tradeAmount": 68539.1662533912
// 		},
// 		{
// 			"date": {
// 				"date": "2017-11"
// 			},
// 			"exchange": {
// 				"fullName": "Radar Relay"
// 			},
// 			"count": 1091,
// 			"tradeAmount": 147820.0298455673
// 		},
// 		{
// 			"date": {
// 				"date": "2017-11"
// 			},
// 			"exchange": {
// 				"fullName": "SingularX"
// 			},
// 			"count": 515,
// 			"tradeAmount": 94722.4339992522
// 		},
// 		{
// 			"date": {
// 				"date": "2017-12"
// 			},
// 			"exchange": {
// 				"fullName": "TokenStore"
// 			},
// 			"count": 3797,
// 			"tradeAmount": 3082196.2595776552
// 		},
// 		{
// 			"date": {
// 				"date": "2017-12"
// 			},
// 			"exchange": {
// 				"fullName": "Radar Relay"
// 			},
// 			"count": 1953,
// 			"tradeAmount": 1120199.3322171266
// 		},
// 		{
// 			"date": {
// 				"date": "2017-12"
// 			},
// 			"exchange": {
// 				"fullName": "Oasis"
// 			},
// 			"count": 2693,
// 			"tradeAmount": 8001488.8137915945
// 		},
// 		{
// 			"date": {
// 				"date": "2017-12"
// 			},
// 			"exchange": {
// 				"fullName": "IDEX"
// 			},
// 			"count": 5459,
// 			"tradeAmount": 3778600.609691428
// 		},
// 		{
// 			"date": {
// 				"date": "2017-12"
// 			},
// 			"exchange": {
// 				"fullName": "DecentrEx"
// 			},
// 			"count": 1060,
// 			"tradeAmount": 1818339.9260447246
// 		},
// 		{
// 			"date": {
// 				"date": "2017-12"
// 			},
// 			"exchange": {
// 				"fullName": "SingularX"
// 			},
// 			"count": 442,
// 			"tradeAmount": 328339.5133101141
// 		},
// 		{
// 			"date": {
// 				"date": "2017-12"
// 			},
// 			"exchange": {
// 				"fullName": "Zerox Exchange"
// 			},
// 			"count": 18,
// 			"tradeAmount": 11.028114569454193
// 		},
// 		{
// 			"date": {
// 				"date": "2017-12"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 24,
// 			"tradeAmount": 9364757.04082221
// 		},
// 		{
// 			"date": {
// 				"date": "2017-12"
// 			},
// 			"exchange": {
// 				"fullName": "Bancor Network"
// 			},
// 			"count": 5458,
// 			"tradeAmount": 56685375.12911614
// 		},
// 		{
// 			"date": {
// 				"date": "2017-12"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 481982,
// 			"tradeAmount": 359532622.106716
// 		},
// 		{
// 			"date": {
// 				"date": "2017-12"
// 			},
// 			"exchange": {
// 				"fullName": "<Zerox Exchange>"
// 			},
// 			"count": 64,
// 			"tradeAmount": 1352.703817294963
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "Zerox Exchange"
// 			},
// 			"count": 1539,
// 			"tradeAmount": 488355.95800305536
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "Bancor Network"
// 			},
// 			"count": 18003,
// 			"tradeAmount": 114913856.8967118
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "SingularX"
// 			},
// 			"count": 515,
// 			"tradeAmount": 409760.6562573888
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 661,
// 			"tradeAmount": 90616504.95287937
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "ERC dEX"
// 			},
// 			"count": 91,
// 			"tradeAmount": 9186.243746960581
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "<Zerox Exchange>"
// 			},
// 			"count": 45,
// 			"tradeAmount": 1525.1344949312006
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "TokenStore"
// 			},
// 			"count": 4772,
// 			"tradeAmount": 6129249.072355403
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "<Kyber Network>"
// 			},
// 			"count": 275,
// 			"tradeAmount": 65141.69342370212
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "DDEX"
// 			},
// 			"count": 283,
// 			"tradeAmount": 245346.29812407028
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "Oasis"
// 			},
// 			"count": 2727,
// 			"tradeAmount": 24315889.581588253
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "Air Swap"
// 			},
// 			"count": 90,
// 			"tradeAmount": 6714.968765170688
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "IDEX"
// 			},
// 			"count": 84836,
// 			"tradeAmount": 82138103.24548343
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "Radar Relay"
// 			},
// 			"count": 5958,
// 			"tradeAmount": 22045160.233722925
// 		},
// 		{
// 			"date": {
// 				"date": "2018-01"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 472299,
// 			"tradeAmount": 516311448.14065015
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "Kyber Network"
// 			},
// 			"count": 1369,
// 			"tradeAmount": 572388.9313485615
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "DUBIex"
// 			},
// 			"count": 106,
// 			"tradeAmount": 43897.29292325802
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "IDEX"
// 			},
// 			"count": 176743,
// 			"tradeAmount": 150861909.01320946
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "DDEX"
// 			},
// 			"count": 1417,
// 			"tradeAmount": 1220797.825898715
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "Air Swap"
// 			},
// 			"count": 270,
// 			"tradeAmount": 106891.18852283392
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "ERC dEX"
// 			},
// 			"count": 31,
// 			"tradeAmount": 21530.92294936148
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 1184,
// 			"tradeAmount": 20203840.9363887
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "Zerox Exchange"
// 			},
// 			"count": 2275,
// 			"tradeAmount": 1801271.3434099266
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "TokenStore"
// 			},
// 			"count": 12332,
// 			"tradeAmount": 7723641.547279626
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "<Kyber Network>"
// 			},
// 			"count": 190,
// 			"tradeAmount": 24132.17299477192
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "Radar Relay"
// 			},
// 			"count": 6322,
// 			"tradeAmount": 3673833.3562741354
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "<Zerox Exchange>"
// 			},
// 			"count": 26,
// 			"tradeAmount": 91.43115624604187
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "Bancor Network"
// 			},
// 			"count": 17644,
// 			"tradeAmount": 77846213.25443028
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 189824,
// 			"tradeAmount": 125580288.60874878
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "Oasis"
// 			},
// 			"count": 2187,
// 			"tradeAmount": 16273339.057288524
// 		},
// 		{
// 			"date": {
// 				"date": "2018-02"
// 			},
// 			"exchange": {
// 				"fullName": "SingularX"
// 			},
// 			"count": 2973,
// 			"tradeAmount": 5665562.891690084
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "<Zerox Exchange>"
// 			},
// 			"count": 1,
// 			"tradeAmount": 2.646614909172058
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "TokenStore"
// 			},
// 			"count": 20228,
// 			"tradeAmount": 12817090.610867193
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "DUBIex"
// 			},
// 			"count": 623,
// 			"tradeAmount": 875904.914643348
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 120890,
// 			"tradeAmount": 65005416.82002217
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 3572,
// 			"tradeAmount": 91672030.40865082
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "ERC dEX"
// 			},
// 			"count": 11,
// 			"tradeAmount": 22177.215168060247
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "SingularX"
// 			},
// 			"count": 8094,
// 			"tradeAmount": 14892968.09573066
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "Radar Relay"
// 			},
// 			"count": 6260,
// 			"tradeAmount": 6819205.609101887
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "Air Swap"
// 			},
// 			"count": 543,
// 			"tradeAmount": 228349.4312059262
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "Bamboo Relay"
// 			},
// 			"count": 17,
// 			"tradeAmount": 89.19347884351279
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "StarBitEx"
// 			},
// 			"count": 88,
// 			"tradeAmount": 42.9218610526942
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "Kyber Network"
// 			},
// 			"count": 4312,
// 			"tradeAmount": 1948467.8634791898
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "Bancor Network"
// 			},
// 			"count": 32767,
// 			"tradeAmount": 69528372.09498914
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "IDEX"
// 			},
// 			"count": 278614,
// 			"tradeAmount": 186871357.62378016
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "DDEX"
// 			},
// 			"count": 2614,
// 			"tradeAmount": 1544806.5462016359
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "Zerox Exchange"
// 			},
// 			"count": 8166,
// 			"tradeAmount": 9339027.10775485
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "DecentrEx"
// 			},
// 			"count": 2,
// 			"tradeAmount": 0.31689359130859374
// 		},
// 		{
// 			"date": {
// 				"date": "2018-03"
// 			},
// 			"exchange": {
// 				"fullName": "Oasis"
// 			},
// 			"count": 4341,
// 			"tradeAmount": 21008197.110412307
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "Shark Relay"
// 			},
// 			"count": 78,
// 			"tradeAmount": 608.3459336870998
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "ETHERCExchange"
// 			},
// 			"count": 9,
// 			"tradeAmount": 23.983064353615045
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "EtherDelta"
// 			},
// 			"count": 106255,
// 			"tradeAmount": 56141270.95488043
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "Bamboo Relay"
// 			},
// 			"count": 19,
// 			"tradeAmount": 320.93893749870676
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "IDEX"
// 			},
// 			"count": 301541,
// 			"tradeAmount": 196977551.081327
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "Bancor Network"
// 			},
// 			"count": 71154,
// 			"tradeAmount": 135331881.61994696
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "Radar Relay"
// 			},
// 			"count": 6860,
// 			"tradeAmount": 71814937.14501207
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "Bitox"
// 			},
// 			"count": 3,
// 			"tradeAmount": 0.6146420571084027
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "DUBIex"
// 			},
// 			"count": 185,
// 			"tradeAmount": 85594.61866389945
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "Kyber Network"
// 			},
// 			"count": 9808,
// 			"tradeAmount": 8598764.716739967
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "DDEX"
// 			},
// 			"count": 14953,
// 			"tradeAmount": 7126925.4746378865
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "<EtherDelta>"
// 			},
// 			"count": 277,
// 			"tradeAmount": 1605951.0213510827
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "<Bancor Network>"
// 			},
// 			"count": 13,
// 			"tradeAmount": 7694.383107563034
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "TokenStore"
// 			},
// 			"count": 15794,
// 			"tradeAmount": 6029370.303517108
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "Zerox Exchange"
// 			},
// 			"count": 7711,
// 			"tradeAmount": 3966677.7617575726
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "SingularX"
// 			},
// 			"count": 4150,
// 			"tradeAmount": 7444856.258941826
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "Oasis"
// 			},
// 			"count": 6882,
// 			"tradeAmount": 26269369.145264503
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "Tokenlon"
// 			},
// 			"count": 98,
// 			"tradeAmount": 2710.493808635719
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "<Zerox Exchange>"
// 			},
// 			"count": 17,
// 			"tradeAmount": 31.13226093614304
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "StarBitEx"
// 			},
// 			"count": 192,
// 			"tradeAmount": 213.88528846705023
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "Air Swap"
// 			},
// 			"count": 1337,
// 			"tradeAmount": 1319432.6195928564
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "TokenJar"
// 			},
// 			"count": 50,
// 			"tradeAmount": 5371.967960840352
// 		},
// 		{
// 			"date": {
// 				"date": "2018-04"
// 			},
// 			"exchange": {
// 				"fullName": "ERC dEX"
// 			},
// 			"count": 20,
// 			"tradeAmount": 48837.738679933485
// 		}],
//   variables: "{\"dateFormat\":\"%Y-%m\"}"
// }

// timeChart('#chart', dataSource)

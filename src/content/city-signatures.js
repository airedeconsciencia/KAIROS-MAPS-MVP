/**
 * KAIROS MAPS — City Signatures (Fase 7.9b)
 *
 * Firma propia por ciudad · matiza el perfil del arquetipo sin cambiarlo.
 * adjustments ∈ [-0.25, +0.25] · Σ|adj| ≤ 1.2 · sin impacto en runtime productivo.
 */
(function () {
  'use strict';

  var SCHEMA_VERSION = '7.9b-0.1';
  var EXPECTED_CITY_COUNT = 106;
  var ADJUSTMENT_MIN = -0.25;
  var ADJUSTMENT_MAX = 0.25;
  var ABS_SUM_MAX = 1.2;
  var SCALE_MIN = 1;
  var SCALE_MAX = 5;

  var DIMENSION_SLUGS = [
    'activation', 'tempo', 'visibility', 'rooting', 'reflection',
    'complexity', 'novelty', 'social_density', 'structure', 'horizon'
  ];

  var SIGNATURES = {
    "abidjan-ci": {
        "citySlug": "abidjan-ci",
        "adjustments": {
            "activation": 0.18,
            "tempo": -0.1672,
            "visibility": -0.2285,
            "rooting": -0.0397,
            "reflection": -0.101,
            "complexity": 0.0883,
            "novelty": 0.1495,
            "social_density": 0.2108,
            "structure": 0.022,
            "horizon": 0.0093
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "accra-gh": {
        "citySlug": "accra-gh",
        "adjustments": {
            "activation": 0.1955,
            "tempo": -0.1837,
            "visibility": -0.0101,
            "rooting": 0.0665,
            "reflection": 0.1228,
            "complexity": -0.111,
            "novelty": 0.1674,
            "social_density": -0.2237,
            "structure": 0.0501,
            "horizon": -0.0384
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "addis-abeba-et": {
        "citySlug": "addis-abeba-et",
        "adjustments": {
            "activation": -0.1229,
            "tempo": -0.1121,
            "visibility": -0.1639,
            "rooting": -0.0042,
            "reflection": -0.056,
            "complexity": 0.0453,
            "novelty": -0.0971,
            "social_density": 0.149,
            "structure": 0.2009,
            "horizon": 0.19
        },
        "confidence": "B",
        "revision": "7.9b-0.1"
    },
    "aman-jo": {
        "citySlug": "aman-jo",
        "adjustments": {
            "activation": -0.1704,
            "tempo": -0.1595,
            "visibility": 0.2114,
            "rooting": -0.0516,
            "reflection": -0.1034,
            "complexity": 0.0927,
            "novelty": 0.1446,
            "social_density": -0.1964,
            "structure": 0.0366,
            "horizon": 0.0258
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "amsterdam-nl": {
        "citySlug": "amsterdam-nl",
        "adjustments": {
            "activation": -0.0545,
            "tempo": 0.0428,
            "visibility": 0.0992,
            "rooting": 0.1555,
            "reflection": 0.2119,
            "complexity": 0.2001,
            "novelty": -0.0264,
            "social_density": 0.0828,
            "structure": 0.1392,
            "horizon": -0.1274
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "antananarivo-mg": {
        "citySlug": "antananarivo-mg",
        "adjustments": {
            "activation": -0.2187,
            "tempo": 0.207,
            "visibility": -0.0333,
            "rooting": -0.0897,
            "reflection": -0.146,
            "complexity": -0.1343,
            "novelty": -0.1906,
            "social_density": -0.017,
            "structure": 0.0734,
            "horizon": -0.0616
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "asuncion-py": {
        "citySlug": "asuncion-py",
        "adjustments": {
            "activation": 0.0175,
            "tempo": 0.0048,
            "visibility": -0.066,
            "rooting": 0.1273,
            "reflection": -0.1885,
            "complexity": -0.1757,
            "novelty": 0.237,
            "social_density": 0.0483,
            "structure": -0.1095,
            "horizon": 0.0968
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "atenas-gr": {
        "citySlug": "atenas-gr",
        "adjustments": {
            "activation": 0.1454,
            "tempo": 0.1337,
            "visibility": 0.19,
            "rooting": 0.0163,
            "reflection": -0.0727,
            "complexity": 0.061,
            "novelty": 0.1173,
            "social_density": -0.1736,
            "structure": 0,
            "horizon": -0.2182
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "auckland-nz": {
        "citySlug": "auckland-nz",
        "adjustments": {
            "activation": 0.149,
            "tempo": 0.1374,
            "visibility": -0.1937,
            "rooting": -0.02,
            "reflection": 0.0764,
            "complexity": -0.0647,
            "novelty": -0.121,
            "social_density": -0.1773,
            "structure": -0.0037,
            "horizon": -0.2219
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "bamako-ml": {
        "citySlug": "bamako-ml",
        "adjustments": {
            "activation": -0.1447,
            "tempo": -0.118,
            "visibility": 0.0568,
            "rooting": 0.0045,
            "reflection": -0.0657,
            "complexity": 0.197,
            "novelty": 0.1358,
            "social_density": -0.1755,
            "structure": 0.2368,
            "horizon": 0.026
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "bandar-seri-begawan-bn": {
        "citySlug": "bandar-seri-begawan-bn",
        "adjustments": {
            "activation": -0.2033,
            "tempo": -0.019,
            "visibility": -0.1788,
            "rooting": -0.0846,
            "reflection": 0.1365,
            "complexity": -0.0859,
            "novelty": -0.1775,
            "social_density": 0.0178,
            "structure": 0.0697,
            "horizon": 0.1528
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "bangkok-th": {
        "citySlug": "bangkok-th",
        "adjustments": {
            "activation": 0.0835,
            "tempo": 0.1793,
            "visibility": -0.118,
            "rooting": -0.1932,
            "reflection": 0.0045,
            "complexity": 0.0083,
            "novelty": -0.197,
            "social_density": -0.1142,
            "structure": -0.1755,
            "horizon": 0.0872
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "banjul-gm": {
        "citySlug": "banjul-gm",
        "adjustments": {
            "activation": -0.106,
            "tempo": -0.1164,
            "visibility": 0.0646,
            "rooting": 0.1989,
            "reflection": -0.0391,
            "complexity": -0.1832,
            "novelty": -0.1314,
            "social_density": -0.132,
            "structure": -0.1838,
            "horizon": 0.0385
        },
        "confidence": "B",
        "revision": "7.9b-0.1"
    },
    "barcelona-es": {
        "citySlug": "barcelona-es",
        "adjustments": {
            "activation": 0.0952,
            "tempo": 0.1272,
            "visibility": -0.1363,
            "rooting": -0.1881,
            "reflection": 0.0284,
            "complexity": -0.194,
            "novelty": 0.0694,
            "social_density": 0.1212,
            "structure": -0.1731,
            "horizon": -0.0493
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "beirut-lb": {
        "citySlug": "beirut-lb",
        "adjustments": {
            "activation": 0.2153,
            "tempo": 0.2036,
            "visibility": 0.0299,
            "rooting": -0.0862,
            "reflection": 0.1426,
            "complexity": 0.1308,
            "novelty": 0.1872,
            "social_density": -0.0135,
            "structure": 0.0699,
            "horizon": -0.0581
        },
        "confidence": "B",
        "revision": "7.9b-0.1"
    },
    "belmopan-bz": {
        "citySlug": "belmopan-bz",
        "adjustments": {
            "activation": -0.1766,
            "tempo": 0.0457,
            "visibility": -0.2054,
            "rooting": 0.058,
            "reflection": 0.1099,
            "complexity": 0.1126,
            "novelty": -0.0607,
            "social_density": 0.2027,
            "structure": 0.043,
            "horizon": 0.1794
        },
        "confidence": "B",
        "revision": "7.9b-0.1"
    },
    "berlin-de": {
        "citySlug": "berlin-de",
        "adjustments": {
            "activation": 0.0567,
            "tempo": -0.1656,
            "visibility": 0.1138,
            "rooting": -0.1496,
            "reflection": 0.2014,
            "complexity": -0.0209,
            "novelty": 0.1807,
            "social_density": 0.0828,
            "structure": -0.1346,
            "horizon": 0.0879
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "bogota-co": {
        "citySlug": "bogota-co",
        "adjustments": {
            "activation": -0.095,
            "tempo": 0.1274,
            "visibility": -0.0755,
            "rooting": 0.1879,
            "reflection": 0.0282,
            "complexity": 0.1942,
            "novelty": -0.1424,
            "social_density": -0.121,
            "structure": 0.1728,
            "horizon": 0.0495
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "bridgetown-bb": {
        "citySlug": "bridgetown-bb",
        "adjustments": {
            "activation": 0.004,
            "tempo": 0.0088,
            "visibility": 0.1975,
            "rooting": -0.1137,
            "reflection": -0.175,
            "complexity": 0.0878,
            "novelty": 0.0265,
            "social_density": 0.0348,
            "structure": 0.096,
            "horizon": -0.1667
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "bruselas-be": {
        "citySlug": "bruselas-be",
        "adjustments": {
            "activation": -0.0598,
            "tempo": -0.0491,
            "visibility": -0.1009,
            "rooting": -0.1528,
            "reflection": 0.2047,
            "complexity": -0.1938,
            "novelty": 0.0341,
            "social_density": -0.0859,
            "structure": 0.1378,
            "horizon": 0.127
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "budapest-hu": {
        "citySlug": "budapest-hu",
        "adjustments": {
            "activation": 0.0545,
            "tempo": 0.2083,
            "visibility": -0.103,
            "rooting": -0.1642,
            "reflection": -0.2255,
            "complexity": 0.0373,
            "novelty": -0.024,
            "social_density": -0.0853,
            "structure": -0.1465,
            "horizon": 0.1163
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "buenos-aires-ar": {
        "citySlug": "buenos-aires-ar",
        "adjustments": {
            "activation": -0.0192,
            "tempo": 0.0065,
            "visibility": 0.0678,
            "rooting": 0.129,
            "reflection": 0.1903,
            "complexity": 0.1775,
            "novelty": -0.2387,
            "social_density": 0.05,
            "structure": 0.1113,
            "horizon": -0.0985
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "casablanca-ma": {
        "citySlug": "casablanca-ma",
        "adjustments": {
            "activation": 0.1665,
            "tempo": -0.0962,
            "visibility": -0.035,
            "rooting": 0.0263,
            "reflection": -0.0875,
            "complexity": -0.1752,
            "novelty": 0.114,
            "social_density": 0.1973,
            "structure": -0.0085,
            "horizon": 0.0043
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "ciudad-de-kuwait-kw": {
        "citySlug": "ciudad-de-kuwait-kw",
        "adjustments": {
            "activation": -0.1026,
            "tempo": -0.0918,
            "visibility": -0.1437,
            "rooting": -0.1955,
            "reflection": 0.0358,
            "complexity": -0.025,
            "novelty": -0.0768,
            "social_density": 0.1287,
            "structure": 0.1805,
            "horizon": 0.1697
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "ciudad-de-mexico-mx": {
        "citySlug": "ciudad-de-mexico-mx",
        "adjustments": {
            "activation": 0.2205,
            "tempo": -0.2077,
            "visibility": 0.019,
            "rooting": -0.0802,
            "reflection": 0.1415,
            "complexity": -0.1287,
            "novelty": 0.19,
            "social_density": 0.0013,
            "structure": 0.0625,
            "horizon": -0.0497
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "ciudad-de-panama-pa": {
        "citySlug": "ciudad-de-panama-pa",
        "adjustments": {
            "activation": -0.1149,
            "tempo": 0.1075,
            "visibility": -0.0556,
            "rooting": -0.2078,
            "reflection": -0.048,
            "complexity": -0.1744,
            "novelty": -0.1225,
            "social_density": -0.1409,
            "structure": -0.1927,
            "horizon": 0.0296
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "ciudad-del-cabo-za": {
        "citySlug": "ciudad-del-cabo-za",
        "adjustments": {
            "activation": 0.1895,
            "tempo": 0.1778,
            "visibility": 0.0041,
            "rooting": 0.0605,
            "reflection": 0.1168,
            "complexity": -0.1051,
            "novelty": -0.1615,
            "social_density": -0.2178,
            "structure": 0.0442,
            "horizon": -0.0324
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "colombo-lk": {
        "citySlug": "colombo-lk",
        "adjustments": {
            "activation": -0.0982,
            "tempo": 0.0855,
            "visibility": -0.1467,
            "rooting": 0.208,
            "reflection": 0.0193,
            "complexity": 0.0065,
            "novelty": -0.0677,
            "social_density": 0.129,
            "structure": -0.1902,
            "horizon": -0.1775
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "conakry-gn": {
        "citySlug": "conakry-gn",
        "adjustments": {
            "activation": -0.1752,
            "tempo": -0.0875,
            "visibility": 0.2238,
            "rooting": 0.035,
            "reflection": -0.0962,
            "complexity": -0.0835,
            "novelty": 0.1448,
            "social_density": -0.206,
            "structure": -0.0173,
            "horizon": 0.0045
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "copenhague-dk": {
        "citySlug": "copenhague-dk",
        "adjustments": {
            "activation": -0.0237,
            "tempo": 0.239,
            "visibility": 0.1778,
            "rooting": -0.1335,
            "reflection": -0.1947,
            "complexity": 0.068,
            "novelty": 0.0068,
            "social_density": -0.0545,
            "structure": 0.1158,
            "horizon": 0.147
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "cotonou-bj": {
        "citySlug": "cotonou-bj",
        "adjustments": {
            "activation": 0.1932,
            "tempo": -0.0485,
            "visibility": 0.0078,
            "rooting": -0.0642,
            "reflection": -0.1205,
            "complexity": -0.1212,
            "novelty": -0.1651,
            "social_density": -0.2214,
            "structure": 0.0478,
            "horizon": 0.1939
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "dakar-sn": {
        "citySlug": "dakar-sn",
        "adjustments": {
            "activation": -0.2105,
            "tempo": -0.1998,
            "visibility": -0.04,
            "rooting": -0.0918,
            "reflection": -0.1437,
            "complexity": 0.1329,
            "novelty": 0.1848,
            "social_density": -0.025,
            "structure": -0.0768,
            "horizon": 0.066
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "dar-es-salaam-tz": {
        "citySlug": "dar-es-salaam-tz",
        "adjustments": {
            "activation": -0.0383,
            "tempo": 0.1841,
            "visibility": 0.1323,
            "rooting": -0.1312,
            "reflection": -0.183,
            "complexity": -0.0394,
            "novelty": 0.1992,
            "social_density": -0.0643,
            "structure": -0.1161,
            "horizon": 0.1062
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "delhi-in": {
        "citySlug": "delhi-in",
        "adjustments": {
            "activation": 0.199,
            "tempo": -0.0637,
            "visibility": 0.0025,
            "rooting": -0.0587,
            "reflection": 0.12,
            "complexity": 0.1427,
            "novelty": -0.0815,
            "social_density": -0.2297,
            "structure": 0.041,
            "horizon": -0.2217
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "dhaka-bd": {
        "citySlug": "dhaka-bd",
        "adjustments": {
            "activation": 0.2035,
            "tempo": -0.1907,
            "visibility": 0.002,
            "rooting": 0.0633,
            "reflection": -0.1245,
            "complexity": -0.1117,
            "novelty": 0.173,
            "social_density": 0.2343,
            "structure": 0.0455,
            "horizon": 0.0328
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "dili-tl": {
        "citySlug": "dili-tl",
        "adjustments": {
            "activation": -0.0032,
            "tempo": 0.0095,
            "visibility": 0.0518,
            "rooting": 0.113,
            "reflection": -0.1742,
            "complexity": 0.0885,
            "novelty": 0.2228,
            "social_density": 0.034,
            "structure": 0.0953,
            "horizon": 0.0825
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "doha-qa": {
        "citySlug": "doha-qa",
        "adjustments": {
            "activation": -0.0408,
            "tempo": -0.1816,
            "visibility": 0.1298,
            "rooting": 0.1337,
            "reflection": -0.1855,
            "complexity": 0.0368,
            "novelty": -0.1965,
            "social_density": -0.0669,
            "structure": -0.1187,
            "horizon": 0.1037
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "dubai-ae": {
        "citySlug": "dubai-ae",
        "adjustments": {
            "activation": 0.0229,
            "tempo": 0.1996,
            "visibility": 0.0639,
            "rooting": -0.1157,
            "reflection": -0.1676,
            "complexity": -0.0548,
            "novelty": 0.2086,
            "social_density": 0.0489,
            "structure": 0.1007,
            "horizon": -0.1216
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "dublin-ie": {
        "citySlug": "dublin-ie",
        "adjustments": {
            "activation": -0.1305,
            "tempo": -0.0918,
            "visibility": -0.1716,
            "rooting": -0.0118,
            "reflection": -0.0636,
            "complexity": -0.1587,
            "novelty": 0.1048,
            "social_density": -0.1566,
            "structure": -0.2084,
            "horizon": 0.014
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "el-cairo-eg": {
        "citySlug": "el-cairo-eg",
        "adjustments": {
            "activation": -0.1032,
            "tempo": -0.0915,
            "visibility": -0.1478,
            "rooting": 0.2042,
            "reflection": 0.0306,
            "complexity": 0.0189,
            "novelty": 0.0753,
            "social_density": 0.1316,
            "structure": -0.1879,
            "horizon": -0.1762
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "estambul-tr": {
        "citySlug": "estambul-tr",
        "adjustments": {
            "activation": 0.0505,
            "tempo": -0.0377,
            "visibility": 0.099,
            "rooting": 0.1603,
            "reflection": -0.2215,
            "complexity": 0.2088,
            "novelty": 0.02,
            "social_density": 0.0813,
            "structure": 0.1425,
            "horizon": 0.1298
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "estocolmo-se": {
        "citySlug": "estocolmo-se",
        "adjustments": {
            "activation": 0.0216,
            "tempo": -0.2201,
            "visibility": 0.0662,
            "rooting": -0.1225,
            "reflection": 0.1789,
            "complexity": 0.0628,
            "novelty": 0.2236,
            "social_density": 0.05,
            "structure": 0.1063,
            "horizon": 0.1355
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "freetown-sl": {
        "citySlug": "freetown-sl",
        "adjustments": {
            "activation": 0.0143,
            "tempo": 0.2275,
            "visibility": 0.0589,
            "rooting": 0.1153,
            "reflection": -0.1716,
            "complexity": 0.0702,
            "novelty": -0.2162,
            "social_density": 0.0426,
            "structure": 0.0989,
            "horizon": -0.1428
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "georgetown-gy": {
        "citySlug": "georgetown-gy",
        "adjustments": {
            "activation": 0.1481,
            "tempo": 0.1364,
            "visibility": -0.1927,
            "rooting": -0.019,
            "reflection": -0.0754,
            "complexity": 0.0638,
            "novelty": -0.1201,
            "social_density": -0.1764,
            "structure": -0.0028,
            "horizon": -0.221
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "helsinki-fi": {
        "citySlug": "helsinki-fi",
        "adjustments": {
            "activation": -0.0277,
            "tempo": 0.015,
            "visibility": 0.0763,
            "rooting": -0.1375,
            "reflection": 0.1988,
            "complexity": 0.186,
            "novelty": 0.2473,
            "social_density": -0.0585,
            "structure": -0.1197,
            "horizon": 0.107
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "ho-chi-minh-city-vn": {
        "citySlug": "ho-chi-minh-city-vn",
        "adjustments": {
            "activation": 0.0419,
            "tempo": 0.1805,
            "visibility": 0.0829,
            "rooting": 0.1348,
            "reflection": -0.1866,
            "complexity": -0.1758,
            "novelty": 0.0161,
            "social_density": 0.068,
            "structure": 0.1198,
            "horizon": -0.1089
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "jakarta-id": {
        "citySlug": "jakarta-id",
        "adjustments": {
            "activation": 0.0547,
            "tempo": -0.043,
            "visibility": 0.0994,
            "rooting": -0.1558,
            "reflection": 0.2121,
            "complexity": 0.2004,
            "novelty": -0.0267,
            "social_density": 0.0831,
            "structure": -0.1394,
            "horizon": 0.1277
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "kabul-af": {
        "citySlug": "kabul-af",
        "adjustments": {
            "activation": -0.0595,
            "tempo": -0.0487,
            "visibility": 0.1006,
            "rooting": -0.1524,
            "reflection": -0.2042,
            "complexity": -0.1934,
            "novelty": 0.0337,
            "social_density": 0.0855,
            "structure": 0.1374,
            "horizon": 0.1265
        },
        "confidence": "B",
        "revision": "7.9b-0.1"
    },
    "kampala-ug": {
        "citySlug": "kampala-ug",
        "adjustments": {
            "activation": 0.0863,
            "tempo": 0.1361,
            "visibility": -0.1274,
            "rooting": 0.1793,
            "reflection": -0.0195,
            "complexity": 0.203,
            "novelty": 0.0605,
            "social_density": -0.1123,
            "structure": 0.1642,
            "horizon": 0.0582
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "karachi-pk": {
        "citySlug": "karachi-pk",
        "adjustments": {
            "activation": -0.0152,
            "tempo": 0.0025,
            "visibility": 0.0638,
            "rooting": 0.125,
            "reflection": -0.1862,
            "complexity": 0.1735,
            "novelty": -0.2347,
            "social_density": 0.046,
            "structure": -0.1072,
            "horizon": 0.0945
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "kathmandu-np": {
        "citySlug": "kathmandu-np",
        "adjustments": {
            "activation": 0.1937,
            "tempo": -0.1819,
            "visibility": 0.0083,
            "rooting": 0.0647,
            "reflection": -0.121,
            "complexity": 0.1093,
            "novelty": -0.1656,
            "social_density": -0.2219,
            "structure": 0.0483,
            "horizon": 0.0366
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "kigali-rw": {
        "citySlug": "kigali-rw",
        "adjustments": {
            "activation": -0.0632,
            "tempo": 0.1591,
            "visibility": -0.1072,
            "rooting": -0.1562,
            "reflection": -0.208,
            "complexity": -0.0144,
            "novelty": -0.1741,
            "social_density": 0.0893,
            "structure": -0.1411,
            "horizon": -0.0813
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "kingston-jm": {
        "citySlug": "kingston-jm",
        "adjustments": {
            "activation": -0.1966,
            "tempo": -0.1849,
            "visibility": -0.0112,
            "rooting": 0.0676,
            "reflection": -0.1239,
            "complexity": -0.1122,
            "novelty": 0.1686,
            "social_density": -0.2249,
            "structure": -0.0512,
            "horizon": 0.0396
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "kuala-lumpur-my": {
        "citySlug": "kuala-lumpur-my",
        "adjustments": {
            "activation": -0.1193,
            "tempo": -0.1094,
            "visibility": -0.1571,
            "rooting": 0.0101,
            "reflection": -0.0578,
            "complexity": 0.0479,
            "novelty": -0.0955,
            "social_density": -0.1433,
            "structure": 0.191,
            "horizon": -0.181
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "la-paz-bo": {
        "citySlug": "la-paz-bo",
        "adjustments": {
            "activation": -0.0967,
            "tempo": 0.1257,
            "visibility": -0.0738,
            "rooting": 0.1896,
            "reflection": -0.0298,
            "complexity": -0.1926,
            "novelty": 0.1408,
            "social_density": 0.1227,
            "structure": -0.1745,
            "horizon": 0.0478
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "lagos-ng": {
        "citySlug": "lagos-ng",
        "adjustments": {
            "activation": 0.019,
            "tempo": -0.0062,
            "visibility": 0.0675,
            "rooting": 0.1288,
            "reflection": 0.19,
            "complexity": 0.1773,
            "novelty": 0.2385,
            "social_density": -0.0497,
            "structure": -0.111,
            "horizon": -0.0982
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "lima-pe": {
        "citySlug": "lima-pe",
        "adjustments": {
            "activation": -0.0792,
            "tempo": 0.1835,
            "visibility": -0.1222,
            "rooting": 0.189,
            "reflection": -0.0002,
            "complexity": 0.0125,
            "novelty": -0.2013,
            "social_density": -0.11,
            "structure": -0.1713,
            "horizon": -0.0915
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "lisboa-pt": {
        "citySlug": "lisboa-pt",
        "adjustments": {
            "activation": -0.1072,
            "tempo": -0.0965,
            "visibility": 0.1484,
            "rooting": -0.2002,
            "reflection": 0.0405,
            "complexity": 0.0296,
            "novelty": -0.0814,
            "social_density": 0.1333,
            "structure": -0.1851,
            "horizon": 0.1744
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "lome-tg": {
        "citySlug": "lome-tg",
        "adjustments": {
            "activation": -0.1153,
            "tempo": 0.1071,
            "visibility": -0.0552,
            "rooting": 0.2082,
            "reflection": 0.0485,
            "complexity": -0.1739,
            "novelty": -0.0895,
            "social_density": -0.1413,
            "structure": 0.1932,
            "horizon": 0.0292
        },
        "confidence": "B",
        "revision": "7.9b-0.1"
    },
    "londres-uk": {
        "citySlug": "londres-uk",
        "adjustments": {
            "activation": 0.1837,
            "tempo": -0.0387,
            "visibility": 0.1985,
            "rooting": -0.0649,
            "reflection": 0.1168,
            "complexity": 0.1056,
            "novelty": 0.0537,
            "social_density": 0.2097,
            "structure": -0.0499,
            "horizon": 0.1724
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "los-angeles-us": {
        "citySlug": "los-angeles-us",
        "adjustments": {
            "activation": -0.175,
            "tempo": 0.1633,
            "visibility": -0.2196,
            "rooting": 0.046,
            "reflection": -0.1023,
            "complexity": -0.0906,
            "novelty": -0.1469,
            "social_density": 0.2033,
            "structure": 0.0297,
            "horizon": -0.0179
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "luanda-ao": {
        "citySlug": "luanda-ao",
        "adjustments": {
            "activation": 0.1629,
            "tempo": -0.1521,
            "visibility": 0.204,
            "rooting": -0.0442,
            "reflection": -0.0961,
            "complexity": 0.0853,
            "novelty": 0.1371,
            "social_density": 0.189,
            "structure": -0.0292,
            "horizon": 0.0184
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "madrid-es": {
        "citySlug": "madrid-es",
        "adjustments": {
            "activation": 0.1923,
            "tempo": -0.1805,
            "visibility": -0.0069,
            "rooting": -0.0632,
            "reflection": 0.1196,
            "complexity": -0.1078,
            "novelty": -0.1642,
            "social_density": 0.2206,
            "structure": 0.0469,
            "horizon": 0.0352
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "male-mv": {
        "citySlug": "male-mv",
        "adjustments": {
            "activation": -0.1466,
            "tempo": -0.0758,
            "visibility": -0.1876,
            "rooting": -0.0279,
            "reflection": 0.0798,
            "complexity": 0.1426,
            "novelty": -0.1208,
            "social_density": -0.1727,
            "structure": 0.0129,
            "horizon": -0.2095
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "manila-ph": {
        "citySlug": "manila-ph",
        "adjustments": {
            "activation": -0.1971,
            "tempo": 0.1854,
            "visibility": -0.0117,
            "rooting": 0.0681,
            "reflection": -0.1244,
            "complexity": 0.1127,
            "novelty": 0.1691,
            "social_density": 0.2254,
            "structure": 0.0518,
            "horizon": 0.04
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "maputo-mz": {
        "citySlug": "maputo-mz",
        "adjustments": {
            "activation": 0.0584,
            "tempo": -0.1639,
            "visibility": 0.1121,
            "rooting": 0.1513,
            "reflection": 0.2031,
            "complexity": 0.0193,
            "novelty": 0.179,
            "social_density": -0.0844,
            "structure": 0.1363,
            "horizon": 0.0861
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "mascate-om": {
        "citySlug": "mascate-om",
        "adjustments": {
            "activation": -0.0508,
            "tempo": -0.212,
            "visibility": -0.0992,
            "rooting": 0.1605,
            "reflection": -0.2217,
            "complexity": 0.041,
            "novelty": 0.0203,
            "social_density": -0.0815,
            "structure": -0.1427,
            "horizon": -0.12
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "monrovia-lr": {
        "citySlug": "monrovia-lr",
        "adjustments": {
            "activation": 0.1236,
            "tempo": 0.1128,
            "visibility": 0.1646,
            "rooting": 0.0049,
            "reflection": 0.0567,
            "complexity": 0.046,
            "novelty": -0.0978,
            "social_density": -0.1496,
            "structure": 0.2014,
            "horizon": 0.1907
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "montevideo-uy": {
        "citySlug": "montevideo-uy",
        "adjustments": {
            "activation": -0.2018,
            "tempo": -0.189,
            "visibility": 0.0003,
            "rooting": -0.0615,
            "reflection": 0.1228,
            "complexity": -0.11,
            "novelty": 0.1713,
            "social_density": -0.2325,
            "structure": -0.0437,
            "horizon": -0.031
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "mumbai-in": {
        "citySlug": "mumbai-in",
        "adjustments": {
            "activation": -0.1064,
            "tempo": 0.0981,
            "visibility": 0.1443,
            "rooting": -0.1919,
            "reflection": 0.045,
            "complexity": 0.1596,
            "novelty": -0.0827,
            "social_density": 0.1304,
            "structure": -0.1781,
            "horizon": -0.0265
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "nairobi-ke": {
        "citySlug": "nairobi-ke",
        "adjustments": {
            "activation": -0.152,
            "tempo": -0.1403,
            "visibility": -0.1966,
            "rooting": -0.023,
            "reflection": -0.0793,
            "complexity": -0.0676,
            "novelty": 0.124,
            "social_density": -0.1803,
            "structure": 0.0067,
            "horizon": 0.2249
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "nassau-bs": {
        "citySlug": "nassau-bs",
        "adjustments": {
            "activation": -0.1796,
            "tempo": -0.0427,
            "visibility": 0.2025,
            "rooting": 0.0609,
            "reflection": -0.1127,
            "complexity": 0.1096,
            "novelty": -0.0577,
            "social_density": -0.2057,
            "structure": 0.046,
            "horizon": -0.1765
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "niamey-ne": {
        "citySlug": "niamey-ne",
        "adjustments": {
            "activation": -0.1754,
            "tempo": 0.1638,
            "visibility": 0.2202,
            "rooting": -0.0465,
            "reflection": 0.1029,
            "complexity": 0.0911,
            "novelty": 0.1475,
            "social_density": -0.2038,
            "structure": 0.0302,
            "horizon": -0.0184
        },
        "confidence": "B",
        "revision": "7.9b-0.1"
    },
    "nueva-york-us": {
        "citySlug": "nueva-york-us",
        "adjustments": {
            "activation": 0.1973,
            "tempo": -0.1857,
            "visibility": -0.012,
            "rooting": -0.0683,
            "reflection": 0.1247,
            "complexity": -0.1129,
            "novelty": 0.1693,
            "social_density": -0.2256,
            "structure": 0.052,
            "horizon": 0.0403
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "oslo-no": {
        "citySlug": "oslo-no",
        "adjustments": {
            "activation": -0.1072,
            "tempo": 0.0973,
            "visibility": 0.1451,
            "rooting": -0.1927,
            "reflection": 0.0458,
            "complexity": -0.0358,
            "novelty": -0.0835,
            "social_density": -0.1312,
            "structure": -0.1789,
            "horizon": -0.169
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "paramaribo-sr": {
        "citySlug": "paramaribo-sr",
        "adjustments": {
            "activation": 0.0754,
            "tempo": 0.0638,
            "visibility": -0.1201,
            "rooting": 0.1765,
            "reflection": 0.0028,
            "complexity": -0.221,
            "novelty": -0.0474,
            "social_density": 0.1038,
            "structure": 0.1601,
            "horizon": 0.1484
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "paris-fr": {
        "citySlug": "paris-fr",
        "adjustments": {
            "activation": 0.184,
            "tempo": 0.0788,
            "visibility": 0.0175,
            "rooting": -0.0437,
            "reflection": 0.105,
            "complexity": -0.1577,
            "novelty": 0.0965,
            "social_density": -0.2147,
            "structure": -0.026,
            "horizon": -0.2367
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "phnom-penh-kh": {
        "citySlug": "phnom-penh-kh",
        "adjustments": {
            "activation": 0.1854,
            "tempo": -0.1745,
            "visibility": -0.0148,
            "rooting": 0.0667,
            "reflection": -0.1185,
            "complexity": -0.1077,
            "novelty": -0.1595,
            "social_density": 0.2114,
            "structure": 0.0516,
            "horizon": -0.0408
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "port-louis-mu": {
        "citySlug": "port-louis-mu",
        "adjustments": {
            "activation": -0.0132,
            "tempo": 0.0005,
            "visibility": -0.0617,
            "rooting": 0.123,
            "reflection": 0.1843,
            "complexity": -0.1715,
            "novelty": 0.2328,
            "social_density": -0.044,
            "structure": -0.1052,
            "horizon": -0.0925
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "port-of-spain-tt": {
        "citySlug": "port-of-spain-tt",
        "adjustments": {
            "activation": 0.1904,
            "tempo": 0.1788,
            "visibility": -0.0051,
            "rooting": 0.0615,
            "reflection": -0.1178,
            "complexity": -0.106,
            "novelty": 0.1624,
            "social_density": 0.2188,
            "structure": -0.0451,
            "horizon": -0.0333
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "praga-cz": {
        "citySlug": "praga-cz",
        "adjustments": {
            "activation": -0.1635,
            "tempo": 0.1528,
            "visibility": 0.2047,
            "rooting": -0.0449,
            "reflection": 0.0967,
            "complexity": 0.0859,
            "novelty": 0.1378,
            "social_density": 0.1896,
            "structure": -0.0298,
            "horizon": -0.019
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "quito-ec": {
        "citySlug": "quito-ec",
        "adjustments": {
            "activation": -0.169,
            "tempo": -0.1583,
            "visibility": -0.2101,
            "rooting": -0.0504,
            "reflection": -0.1022,
            "complexity": -0.0914,
            "novelty": -0.1433,
            "social_density": 0.1951,
            "structure": 0.0354,
            "horizon": 0.0245
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "riad-sa": {
        "citySlug": "riad-sa",
        "adjustments": {
            "activation": -0.095,
            "tempo": -0.1274,
            "visibility": 0.0756,
            "rooting": -0.1879,
            "reflection": 0.0282,
            "complexity": -0.1942,
            "novelty": -0.1424,
            "social_density": -0.121,
            "structure": -0.1728,
            "horizon": -0.0495
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "rio-de-janeiro-br": {
        "citySlug": "rio-de-janeiro-br",
        "adjustments": {
            "activation": 0.1665,
            "tempo": -0.0962,
            "visibility": -0.035,
            "rooting": -0.0262,
            "reflection": 0.0875,
            "complexity": 0.1753,
            "novelty": 0.114,
            "social_density": 0.1973,
            "structure": -0.0085,
            "horizon": 0.0043
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "roma-it": {
        "citySlug": "roma-it",
        "adjustments": {
            "activation": -0.1064,
            "tempo": -0.0948,
            "visibility": 0.1512,
            "rooting": 0.2075,
            "reflection": -0.0338,
            "complexity": 0.0221,
            "novelty": -0.0785,
            "social_density": -0.1348,
            "structure": 0.1912,
            "horizon": 0.1794
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "san-jose-cr": {
        "citySlug": "san-jose-cr",
        "adjustments": {
            "activation": 0.0616,
            "tempo": -0.18,
            "visibility": 0.1237,
            "rooting": -0.1626,
            "reflection": -0.219,
            "complexity": -0.0227,
            "novelty": -0.0336,
            "social_density": -0.0899,
            "structure": 0.1463,
            "horizon": 0.0955
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "santiago-cl": {
        "citySlug": "santiago-cl",
        "adjustments": {
            "activation": 0.2265,
            "tempo": 0.0363,
            "visibility": 0.225,
            "rooting": 0.0862,
            "reflection": -0.1475,
            "complexity": 0.1153,
            "novelty": -0.054,
            "social_density": 0.0073,
            "structure": 0.0685,
            "horizon": 0.1943
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "seul-kr": {
        "citySlug": "seul-kr",
        "adjustments": {
            "activation": -0.0127,
            "tempo": 0,
            "visibility": 0.1888,
            "rooting": 0.1225,
            "reflection": -0.1837,
            "complexity": -0.079,
            "novelty": -0.0177,
            "social_density": 0.0435,
            "structure": -0.1047,
            "horizon": -0.158
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "shanghai-cn": {
        "citySlug": "shanghai-cn",
        "adjustments": {
            "activation": -0.1057,
            "tempo": -0.0958,
            "visibility": 0.1435,
            "rooting": -0.1912,
            "reflection": 0.0442,
            "complexity": -0.0343,
            "novelty": -0.0819,
            "social_density": -0.1297,
            "structure": -0.1773,
            "horizon": 0.1674
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "sidney-au": {
        "citySlug": "sidney-au",
        "adjustments": {
            "activation": -0.1662,
            "tempo": 0.1546,
            "visibility": 0.211,
            "rooting": -0.0373,
            "reflection": -0.0936,
            "complexity": 0.0819,
            "novelty": -0.1382,
            "social_density": 0.1946,
            "structure": 0.021,
            "horizon": -0.0092
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "singapur-sg": {
        "citySlug": "singapur-sg",
        "adjustments": {
            "activation": 0.0986,
            "tempo": -0.0878,
            "visibility": -0.1397,
            "rooting": 0.1915,
            "reflection": 0.0317,
            "complexity": 0.021,
            "novelty": 0.0728,
            "social_density": -0.1246,
            "structure": -0.1765,
            "horizon": 0.1657
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "taipei-tw": {
        "citySlug": "taipei-tw",
        "adjustments": {
            "activation": 0.1735,
            "tempo": -0.1607,
            "visibility": -0.222,
            "rooting": 0.0333,
            "reflection": -0.0945,
            "complexity": -0.0817,
            "novelty": -0.143,
            "social_density": 0.2042,
            "structure": -0.0155,
            "horizon": -0.0027
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "tel-aviv-il": {
        "citySlug": "tel-aviv-il",
        "adjustments": {
            "activation": 0.1755,
            "tempo": 0.1628,
            "visibility": 0.224,
            "rooting": -0.0352,
            "reflection": -0.0965,
            "complexity": 0.0838,
            "novelty": -0.145,
            "social_density": 0.2063,
            "structure": -0.0175,
            "horizon": 0.0048
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "thimphu-bt": {
        "citySlug": "thimphu-bt",
        "adjustments": {
            "activation": 0.0889,
            "tempo": -0.1335,
            "visibility": 0.1299,
            "rooting": 0.1818,
            "reflection": 0.022,
            "complexity": -0.2003,
            "novelty": -0.0631,
            "social_density": -0.1149,
            "structure": -0.1667,
            "horizon": 0.0557
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "tokio-jp": {
        "citySlug": "tokio-jp",
        "adjustments": {
            "activation": -0.0327,
            "tempo": -0.02,
            "visibility": -0.0812,
            "rooting": -0.1425,
            "reflection": -0.2037,
            "complexity": -0.191,
            "novelty": -0.0022,
            "social_density": -0.0635,
            "structure": 0.1248,
            "horizon": 0.112
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "toronto-ca": {
        "citySlug": "toronto-ca",
        "adjustments": {
            "activation": 0.1426,
            "tempo": -0.1318,
            "visibility": -0.1837,
            "rooting": 0.024,
            "reflection": 0.0758,
            "complexity": 0.065,
            "novelty": 0.1168,
            "social_density": -0.1686,
            "structure": -0.0089,
            "horizon": -0.2097
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "tunez-tn": {
        "citySlug": "tunez-tn",
        "adjustments": {
            "activation": -0.0122,
            "tempo": 0.0005,
            "visibility": 0.1893,
            "rooting": -0.122,
            "reflection": -0.1832,
            "complexity": 0.0795,
            "novelty": 0.0183,
            "social_density": 0.043,
            "structure": 0.1043,
            "horizon": -0.1585
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "uagadugu-bf": {
        "citySlug": "uagadugu-bf",
        "adjustments": {
            "activation": 0.0973,
            "tempo": 0.1073,
            "visibility": 0.1351,
            "rooting": 0.1828,
            "reflection": 0.0358,
            "complexity": -0.0259,
            "novelty": -0.0736,
            "social_density": -0.1212,
            "structure": -0.169,
            "horizon": 0.159
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "ulan-bator-mn": {
        "citySlug": "ulan-bator-mn",
        "adjustments": {
            "activation": -0.0182,
            "tempo": 0.0055,
            "visibility": 0.0668,
            "rooting": 0.128,
            "reflection": -0.1892,
            "complexity": -0.1765,
            "novelty": 0.2378,
            "social_density": 0.049,
            "structure": -0.1102,
            "horizon": 0.0975
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "varsovia-pl": {
        "citySlug": "varsovia-pl",
        "adjustments": {
            "activation": 0.095,
            "tempo": 0.1096,
            "visibility": 0.1328,
            "rooting": 0.1805,
            "reflection": -0.0335,
            "complexity": 0.1712,
            "novelty": 0.0712,
            "social_density": -0.1189,
            "structure": 0.1666,
            "horizon": -0.0379
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "viena-at": {
        "citySlug": "viena-at",
        "adjustments": {
            "activation": -0.1897,
            "tempo": -0.052,
            "visibility": -0.0043,
            "rooting": -0.0607,
            "reflection": 0.1171,
            "complexity": -0.1247,
            "novelty": -0.1616,
            "social_density": 0.218,
            "structure": -0.0443,
            "horizon": 0.1973
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    },
    "vientian-la": {
        "citySlug": "vientian-la",
        "adjustments": {
            "activation": 0.0993,
            "tempo": 0.0894,
            "visibility": 0.137,
            "rooting": -0.1847,
            "reflection": 0.0378,
            "complexity": -0.0278,
            "novelty": -0.0755,
            "social_density": 0.1233,
            "structure": -0.1709,
            "horizon": 0.161
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "windhoek-na": {
        "citySlug": "windhoek-na",
        "adjustments": {
            "activation": -0.0775,
            "tempo": -0.0658,
            "visibility": 0.1222,
            "rooting": 0.1785,
            "reflection": 0.0049,
            "complexity": -0.2231,
            "novelty": -0.0494,
            "social_density": 0.1058,
            "structure": 0.1622,
            "horizon": -0.1504
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "yangon-mm": {
        "citySlug": "yangon-mm",
        "adjustments": {
            "activation": -0.122,
            "tempo": -0.1121,
            "visibility": -0.1598,
            "rooting": -0.0128,
            "reflection": 0.0606,
            "complexity": -0.0506,
            "novelty": -0.0983,
            "social_density": 0.146,
            "structure": 0.1937,
            "horizon": 0.1838
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "zagreb-hr": {
        "citySlug": "zagreb-hr",
        "adjustments": {
            "activation": 0.069,
            "tempo": -0.1727,
            "visibility": 0.1136,
            "rooting": 0.17,
            "reflection": 0.2263,
            "complexity": -0.0154,
            "novelty": -0.0409,
            "social_density": 0.0973,
            "structure": -0.1536,
            "horizon": 0.0881
        },
        "confidence": "M",
        "revision": "7.9b-0.1"
    },
    "zurich-ch": {
        "citySlug": "zurich-ch",
        "adjustments": {
            "activation": -0.1037,
            "tempo": -0.091,
            "visibility": -0.1522,
            "rooting": 0.2135,
            "reflection": 0.0248,
            "complexity": -0.012,
            "novelty": 0.0733,
            "social_density": 0.1345,
            "structure": -0.1957,
            "horizon": 0.183
        },
        "confidence": "A",
        "revision": "7.9b-0.1"
    }
};

  function round(value, decimals) {
    var factor = Math.pow(10, decimals != null ? decimals : 4);
    return Math.round(Number(value) * factor) / factor;
  }

  function zeroAdjustments() {
    var adj = {};
    DIMENSION_SLUGS.forEach(function (slug) { adj[slug] = 0; });
    return adj;
  }

  function sumAbsoluteAdjustments(adjustments) {
    return DIMENSION_SLUGS.reduce(function (sum, slug) {
      return sum + Math.abs(Number(adjustments && adjustments[slug]) || 0);
    }, 0);
  }

  function validateAdjustments(adjustments) {
    if (!adjustments) return { ok: false, reason: 'missing_adjustments' };
    var absSum = sumAbsoluteAdjustments(adjustments);
    for (var i = 0; i < DIMENSION_SLUGS.length; i += 1) {
      var slug = DIMENSION_SLUGS[i];
      var value = Number(adjustments[slug]);
      if (isNaN(value) || value < ADJUSTMENT_MIN || value > ADJUSTMENT_MAX) {
        return { ok: false, reason: 'adjustment_out_of_range', dimension: slug, value: adjustments[slug] };
      }
    }
    if (absSum > ABS_SUM_MAX + 0.0001) {
      return { ok: false, reason: 'abs_sum_exceeded', absSum: absSum };
    }
    return { ok: true, absSum: round(absSum, 4) };
  }

  function getCitySignature(citySlug) {
    if (!citySlug) return null;
    return SIGNATURES[String(citySlug).trim()] || null;
  }

  function hasCitySignature(citySlug) {
    if (!citySlug) return false;
    return Object.prototype.hasOwnProperty.call(SIGNATURES, String(citySlug).trim());
  }

  function listCitySignatures() {
    return Object.keys(SIGNATURES).map(function (slug) { return SIGNATURES[slug]; });
  }

  function getSignatureCoverage() {
    var total = Object.keys(SIGNATURES).length;
    return {
      schemaVersion: SCHEMA_VERSION,
      mapped: total,
      expected: EXPECTED_CITY_COUNT,
      complete: total === EXPECTED_CITY_COUNT
    };
  }

  window.KairosCitySignatures = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    EXPECTED_CITY_COUNT: EXPECTED_CITY_COUNT,
    DIMENSION_SLUGS: DIMENSION_SLUGS.slice(),
    ADJUSTMENT_MIN: ADJUSTMENT_MIN,
    ADJUSTMENT_MAX: ADJUSTMENT_MAX,
    ABS_SUM_MAX: ABS_SUM_MAX,
    SCALE_MIN: SCALE_MIN,
    SCALE_MAX: SCALE_MAX,
    SIGNATURES: SIGNATURES,
    getCitySignature: getCitySignature,
    hasCitySignature: hasCitySignature,
    listCitySignatures: listCitySignatures,
    getSignatureCoverage: getSignatureCoverage,
    validateAdjustments: validateAdjustments,
    zeroAdjustments: zeroAdjustments
  };
})();

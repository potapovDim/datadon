interface ITransformData {
  toWeb();
  toApi();
  toMobile();
  reverseFromWebToApi(param: object);
  reverseFromMobileToApi(param: object);
}

interface ITransformRule {
  key?(): string;
  value?(): string;
}

/**
 * @return {object<{
 *  toApi: function(): object,
 *  toWeb: function(): object,
 *  toMobile: function(): object,
 *  reverseFromWebToApi: function(param: object): object,
 *  reverseFromMobileToApi: function(param: object): object
 * }>}
 *
 * @example data will be provided from generateData step
 * data = { test1KeyApi: 'default key 1', test2KeyApi: 'default key 2' }
 * @example web config what will be used for transormation data from default API view to WEB
 * webConfig {
 *   test1KeyApi: { key: () => 'test1WebKey', value: () => 'required web key1' },
 *   test2KeyApi: { key: () => 'test2WebKey' }
 * }
 */
function transformData({data, webConfig = {}, mobileConfig = {}}): ITransformData {

  const transformDataInterface = {
    toApi(): object {
      return Object.getOwnPropertyNames(data).reduce((acc, cur) => {
        const value = data[cur].toApi && data[cur].toApi() ? data[cur].value : data[cur].value;
        acc[cur] = value;
        return acc;
      }, {});
    },
    toWeb(): object {
      return Object.getOwnPropertyNames(data).reduce((acc, cur) => {
        let key = cur;
        let value = null;
        if (cur in webConfig) {
          const valueCreator = data[cur].seemsHardcoded ? (() => data[cur].value) : webConfig[cur].value || (() => data[cur].value);
          const keyCreator = webConfig[cur].key || (() => key);
          console.log(key, valueCreator(), data[cur].seemsHardcoded);
          key = keyCreator(cur);
          value = valueCreator();
        } else {
          value = data[cur].toWeb ? data[cur].toWeb() : data[cur].value;
        }

        const emptyArray = Array.isArray(value) && value.length === 0;
        if (value !== null && !emptyArray) {
          acc[key] = key in acc ? `${acc[key]}${value}` : value;
        }
        return acc;
      }, {});
    },
    toMobile(): object {
      return Object.getOwnPropertyNames(data).reduce((acc, cur) => {
        let key = cur;
        let value = null;
        if (cur in mobileConfig) {
          const valueCreator = data[cur].seemsHardcoded ? (() => data[cur].value) : mobileConfig[cur].value || (() => data[cur].value);
          const keyCreator = mobileConfig[cur].key || (() => key);
          key = keyCreator(cur);
          value = valueCreator();
        } else {
          value = data[cur] && data[cur].toMobile ? data[cur].toMobile() : data[cur].value;
        }

        const emptyArray = Array.isArray(value) && value.length === 0;
        if (value !== null && !emptyArray) {
          acc[key] = key in acc ? `${acc[key]}${value}` : value;
        }
        return acc;
      }, {});
    },
    reverseFromWebToApi(requiredReverseData: object): object {
      return Object.getOwnPropertyNames(requiredReverseData).reduce((acc, cur) => {
        const transformKey = Object
          .keys(webConfig)
          .find((k) => webConfig[k].key && webConfig[k].key() === cur);
        const key = transformKey ? transformKey : cur;
        acc[key] = requiredReverseData[cur];
        return acc;
      }, {});
    },
    reverseFromMobileToApi(requiredReverseData: object): object {
      return Object.getOwnPropertyNames(requiredReverseData).reduce((acc, cur) => {
        const transformKey = Object
          .keys(webConfig)
          .find((k) => mobileConfig[k].key && mobileConfig[k].key() === cur);
        const key = transformKey ? transformKey : cur;
        acc[key] = requiredReverseData[cur];
        return acc;
      }, {});
    },
  };
  return transformDataInterface;
}

export {ITransformData, ITransformRule, transformData};

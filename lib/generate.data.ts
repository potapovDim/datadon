import * as faker from 'faker';
import {transformData} from './transform.data';
import {getRandomString} from '../utils';

interface IGenerateData {
  generate();
}

interface IGenerateRule {
  rules?: {maxLength?: number; minLength?: number};
  default?(): any;
  valid?(): any;
  empty?(): any;
  remove?(): any;
  exceedLength?(): any;
  lessLength?(): any;
  toLower?(): any;
  skipDigit?(): any;
  skipSpecial?(): any;
  number?(): any;
  specialSymbols?(): any;
}

const internalUsage = {
  recursive: 'recursive',
  configRecursive: 'configRecursive',
  configValue: 'configValue',
  unknown: 'unknown',
};

const publicKeys = {
  default: 'default',
  valid: 'valid',
  empty: 'empty',
  remove: 'remove',
  exceedLength: 'exceedLength',
  lessLength: 'lessLength',
  toLower: 'toLower',
  toUpper: 'toUpper',
  skipDigit: 'skipDigit',
  skipSpecial: 'skipSpecial',
  number: 'number',
  specialSymbols: 'specialSymbols'
};

const GenerateAction = {
  ...internalUsage,
  ...publicKeys
};

function generateData({generateRules, config = {}, transformRulesWeb = {}, transformRulesMobile = {}}) {
  function getRule(fieldName: string) {
    if (fieldName in config) {
      if (config[fieldName] in generateRules[fieldName] || GenerateAction[config[fieldName]]) {
        return config[fieldName];
      }
      return GenerateAction.configValue;
    }
    if (typeof generateRules[fieldName] !== 'object' || generateRules[fieldName] === null) {
      return GenerateAction.unknown;
    }
    if (GenerateAction.default in generateRules[fieldName]) {
      return GenerateAction.default;
    }
    if (GenerateAction.valid in generateRules[fieldName]) {
      return GenerateAction.valid;
    }
    return GenerateAction.unknown;
  }

  const generateDataInterface = {
    generate() {
      const data = Object.getOwnPropertyNames(generateRules).reduce((acc, cur) => {
        const rule = getRule(cur);
        switch (rule) {
          case GenerateAction.recursive:
            acc[cur] = {value: generateRules[cur].generate()};
            break;
          case GenerateAction.configRecursive:
            acc[cur] = {value: config[cur].generate()};
            break;
          case GenerateAction.configValue:
            acc[cur] = {value: config[cur], seemsHardcoded: true};
            break;
          case GenerateAction.remove:
            break;
          case GenerateAction.empty:
            acc[cur] = {value: '', seemsHardcoded: true};
            break;
          case GenerateAction.exceedLength: {
            const maxLength = generateRules[cur].rules.maxLength;
            const validExceedLength = generateRules[cur].valid;
            const validValueExceedLength = validExceedLength ? validExceedLength() : generateRules[cur].default();
            const repeatCount = Math.round(maxLength / validValueExceedLength.length) + 1;
            acc[cur] = {value: validValueExceedLength.repeat(repeatCount).substring(0, maxLength.length + 1)};
            break;
          }
          case GenerateAction.lessLength: {
            const minLength = generateRules[cur].rules.minLength;
            const validLessLength = generateRules[cur].valid;
            const validValueLessLength = validLessLength ? validLessLength() : generateRules[cur].default();
            acc[cur] = {value: validValueLessLength.substring(0, minLength - 1)};
            break;
          }
          case GenerateAction.toLower: {
            const validToLower = generateRules[cur].valid as () => any;
            acc[cur] = {value: validToLower ? validToLower().toLowerCase() : generateRules[cur].default().toLowerCase()};
            break;
          }
          case GenerateAction.toUpper: {
            const validToUpper = generateRules[cur].valid as () => any;
            acc[cur] = {value: validToUpper ? validToUpper().toLowerCase() : generateRules[cur].default().toUpperCase()};
            break;
          }
          case GenerateAction.skipDigit:
            acc[cur] = {value: generateRules[cur].valid().replace(/[0-9]/g, 'a')};
            break;
          case GenerateAction.skipSpecial:
            acc[cur] = {value: generateRules[cur].valid().replace(/[^A-Za-z0-9]/g, 'a')};
            break;
          case GenerateAction.number:
            acc[cur] = {value: faker.random.number()};
            break;
          case GenerateAction.specialSymbols:
            acc[cur] = {value: getRandomString(10, {symbols: true})};
            break;
          case GenerateAction.unknown: {
            acc[cur] = {value: generateRules[cur]};
            break;
          }
          default:
            acc[cur] = {value: generateRules[cur][rule]()};
            break;
        }
        return acc;
      }, {});
      return transformData({data, webConfig: transformRulesWeb, mobileConfig: transformRulesMobile});
    },
    updateConfig(newConfig) {
      Object.assign(config, newConfig);
      return generateDataInterface;
    },
    updateRules(newRules) {
      Object.assign(generateRules, newRules);
      return generateDataInterface;
    },
    updateMobileTransformationRules(newRules) {
      Object.assign(transformRulesMobile, newRules);
    },
    updateWebTransformationRules(newRules) {
      Object.assign(transformRulesWeb, newRules);
    }
  };

  return generateDataInterface;
}

export {IGenerateData, IGenerateRule, publicKeys, generateData};

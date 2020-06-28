# datadon

## datadon is a data builder

### Main porpuse of this library is flexiblse data creation, transformation, from one condition to other

### Simple API provides the possibility to declare WEB, backend API and mobile data, aslo every dataset can be transformed from one condition to other

## API and examples

### default example

```js
const {generator} = require('datadon');

function getDefatultData() {
  const generateRules = {
    field1: {default: () => 'field1 default'},
    field2: {default: () => 'field2 default'}
  };
  return generator({generateRules});
}

const defaultDataAPI = getDefatultData().generate().toApi();
const defaultDataWeb = getDefatultData().generate().toWeb();
const defaultDataMobile = getDefatultData().generate().toApi();

console.log(defaultDataAPI);    // {field1: 'field1 default', field2: 'field2 default'}
console.log(defaultDataWeb);    // {field1: 'field1 default', field2: 'field2 default'}
console.log(defaultDataMobile); // {field1: 'field1 default', field2: 'field2 default'}
```

### tranformatio to web

```js
const {generator} = require('datadon');

function getTransformData() {
  const generateRules = {
    keyApi: {default: () => 'field1 default'},
    field2: {default: () => 'field2 default'}
  };
  const transformRulesWeb = {
    keyApi: {key: () => 'keyWeb', value: () => 'Web key'},
  };
  return generateData({generateRules, transformRulesWeb});
}

const dataAPI = getTransformData().generate().toApi();
const dataWeb = getTransformData().generate().toWeb();

console.log(dataAPI) // {keyApi: 'field1 default', field2: 'field2 default'}
console.log(dataWeb) // {keyWeb: 'Web key', field2: 'field2 default'}
```

### configure your fields

```js
const {generator, configRules} = require('datadon');

// remove
function getConfiguredData(config) {
  const generateRules = {
    keyApi: {default: () => 'field1 default'},
    field2: {default: () => 'field2 default'}
  };
  const transformRulesWeb = {
    keyApi: {key: () => 'keyWeb', value: () => 'Web key'},
  };
  return generateData({generateRules, transformRulesWeb, config});
}
const generated = getTransformData({keyApi: configRules.remove}).generate();
const dataAPI = generated.toApi();
const dataWeb = generated.toWeb();

console.log(dataAPI) // {field2: 'field2 default'}
console.log(dataWeb) // {field2: 'field2 default'}

// default / valid
function getConfiguredData(config) {
  const generateRules = {
    keyApi: {default: () => 'field1 default', valid: () => 'field1 valid'},
  };
  return generateData({generateRules, transformRulesWeb, config});
}
const dataAPIValid = getTransformData({keyApi: configRules.valid}).generate();
const dataAPIDefault = getTransformData().generate();

console.log(dataAPIValid) // {keyApi: 'field1 valid'}
console.log(dataAPIDefault) // {keyApi: 'field1 default'}

```

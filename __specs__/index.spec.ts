import {expect} from 'chai';
import {generator, configRules} from '../lib';

describe('initial', function() {
  it('defaults', function() {
    const generateDefaults = () => {
      const generateRules = {
        field1: {default: () => 'field1 default'},
        field2: {default: () => 'field2 default'}
      }
      return generator({generateRules})
    }
    const dataGenerator = generateDefaults().generate()
    expect(dataGenerator.toWeb()).to.eql({field1: 'field1 default', field2: 'field2 default'})
    expect(dataGenerator.toWeb()).to.eql(dataGenerator.toApi())
    expect(dataGenerator.toApi()).to.eql(dataGenerator.toMobile())
    expect(dataGenerator.toMobile()).to.eql(dataGenerator.toWeb())
  })

  it('valids', function() {
    const generateValids = () => {
      const generateRules = {
        field1: {valid: () => 'field1 default'},
        field2: {valid: () => 'field2 default'}
      }
      return generator({generateRules})
    }
    const dataGenerator = generateValids().generate()
    expect(dataGenerator.toWeb()).to.eql({field1: 'field1 default', field2: 'field2 default'})
    expect(dataGenerator.toWeb()).to.eql(dataGenerator.toApi())
    expect(dataGenerator.toApi()).to.eql(dataGenerator.toMobile())
    expect(dataGenerator.toMobile()).to.eql(dataGenerator.toWeb())
  })

  it(`${configRules.empty}`, function() {
    const generateValidsForEmpty = (config) => {
      const generateRules = {
        field1: {valid: () => 'field1 default'},
        field2: {valid: () => 'field2 default'}
      }
      return generator({generateRules, config})
    }
    const config = {field1: configRules.empty};
    const dataGenerator = generateValidsForEmpty(config).generate()
    expect(dataGenerator.toWeb()).to.eql({field1: '', field2: 'field2 default'})
    expect(dataGenerator.toWeb()).to.eql(dataGenerator.toApi())
    expect(dataGenerator.toApi()).to.eql(dataGenerator.toMobile())
    expect(dataGenerator.toMobile()).to.eql(dataGenerator.toWeb())
  })

  it(`${configRules.remove}`, function() {
    const generateValidsForEmpty = (config) => {
      const generateRules = {
        field1: {valid: () => 'field1 default'},
        field2: {valid: () => 'field2 default'}
      }
      return generator({generateRules, config})
    }
    const config = {field1: configRules.remove};
    const dataGenerator = generateValidsForEmpty(config).generate()
    expect(dataGenerator.toWeb()).to.eql({field2: 'field2 default'})
    expect(dataGenerator.toWeb()).to.eql(dataGenerator.toApi())
    expect(dataGenerator.toApi()).to.eql(dataGenerator.toMobile())
    expect(dataGenerator.toMobile()).to.eql(dataGenerator.toWeb())
  })
})
import {expect} from 'chai';
import {generator} from '../lib';

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

  it('valid', function() {
    const generateDefaults = () => {
      const generateRules = {
        field1: {valid: () => 'field1 default'},
        field2: {valid: () => 'field2 default'}
      }
      return generator({generateRules})
    }
    const dataGenerator = generateDefaults().generate()
    expect(dataGenerator.toWeb()).to.eql({field1: 'field1 default', field2: 'field2 default'})
    expect(dataGenerator.toWeb()).to.eql(dataGenerator.toApi())
    expect(dataGenerator.toApi()).to.eql(dataGenerator.toMobile())
    expect(dataGenerator.toMobile()).to.eql(dataGenerator.toWeb())
  })
})
'use strict';

const yepnope = require('../lib/index.js')
const assert = require('assert')

describe('init', () => {
  it('who tests the tests?', () => {
    expect(true).toBe(true)
  })
})

describe('Yepnope', () => {

  it('should create a yepnope obj', () => {
    let obj = new yepnope()

    expect(typeof obj).toBe('object')
    expect(obj instanceof yepnope).toBe(true)
  })


  it('should define  .true and .false', () => {
    let obj = new yepnope()

    expect(obj.true).toBeDefined()
    expect(obj.false).toBeDefined()
    expect(obj.parse).toBeDefined()
    expect(typeof obj.parse).toBe('function')
  })

  describe('.parse()', () => {
    it('should be chainable', () => {
      let obj = new yepnope()
      let obj2 = obj.parse()
      let obj3 = obj.parse().parse()

      expect(obj == obj2).toBe(true)
      expect(obj3 == obj3).toBe(true)

      expect(obj instanceof yepnope).toBe(true)
      expect(obj2 instanceof yepnope).toBe(true)
      expect(obj3 instanceof yepnope).toBe(true)
    })
  })

  describe(' is POSITIVE about', () => {

    it('simple YES', () => {
      let obj = new yepnope('yes');

      expect(obj.true).toBe(true)
      expect(obj.false).toBe(false)
    })

    it('complex YES', () => {
      let options = [
        'yep', 'ya', 'yepp', 'y', 'yy', 'sure', 'ok', 'oki', 'okay', 'true', 'affirmative',
        ];

      options.forEach(yep => {
        expect((new yepnope(yep)).true).toBe(true, yep + ' means yes')
      })
    })


    it('YES is a phrase', () => {
      let options = [
        'yes.',
        'y! do that!',
        'YeS in special CASE',
        'yeah, sure!',
        'yes please',
        'yep @botname',
        'sure, @botname',
        'yes! i would like that!'
      ];

      options.forEach(yep => {
        expect((new yepnope(yep)).true).toBe(true, yep + ' means yes')
      })
    })
  })

  describe(' is NEGATIVE about', () => {

    it('simple NO', () => {
      let obj = new yepnope('no');

      expect(obj.false).toBe(true)
      expect(obj.true).toBe(false)
    })

    it('complex NO', () => {
      let options = [
        'nope', 'n', 'nn', 'nepia', 'not today', 'not again', 'nooope', 'noo', 'nooo', 'false', 'negative'
      ];

      options.forEach(nope => {
        expect((new yepnope(nope)).false).toBe(true, nope + ' means NO')
      })
    })

    it('NO is a phrase', () => {
      let options = [
        'no.',
        'n! dont do that',
        'nOpE in special CASE',
        'nope, not today!',
        'no please',
        'no @botname',
        'nooope, @botname',
        'NO! i wont like that!'
      ];

      options.forEach(yep => {
        expect((new yepnope(yep)).true).toBe(false, yep + ' means no')
      })
    })
  })


  it(' is UNSURE about', () => {
      let options = [
        '', 
        'not sure',
        'dont want no short dick men',
        'what',
        'why not?',
        'some phrase with yes in it',
        'some phrase with no in it',
        'dfa sdf asdf ',
        3,
        {},
        [],
        undefined
      ];

     options.forEach(unsure => {
        expect((new yepnope(unsure)).true).toBe(false, 'is unsure about:' + unsure)
        expect((new yepnope(unsure)).false).toBe(false, 'is unsure about:' + unsure)
      })
  })

});

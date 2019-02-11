'use strict';


function isTrue(instance) {
  instance.true = true;
  return instance;
}

function isFalse(instance) {
  instance.false = true;
  return instance;
}

const YEP = ['yes','yep', 'yepp','yeah', 'y', 'ya', 'yy', 'sure', 'ok', 'oki', 'okay', 'true', 'affirmative']
const NOPE = ['no','nope', 'n', 'nn', 'nepia', 'not again', 'not today', 'nooope', 'noo', 'nooo', 'false', 'negative']
const BREAKS = new RegExp(/[\,\.\!\?\s\n]+/g);

class yepnope {

  constructor(input) {
    if (typeof input === 'undefined') {
      input = '';
    }

    this.true = false;
    this.false = false;

    this.parse(new String(input).trim().toLowerCase())

    return this;
  }


  parse(i) {
    if(!i) return this;
    // fast in your face answers
    if (i === 'yes') {
      return isTrue(this)
    } else if (i === 'no') {
      return isFalse(this)
    }

    if (YEP.indexOf(i) !== -1) {
      return isTrue(this)
    }


    if (NOPE.indexOf(i) !== -1) {
      return isFalse(this)
    }

    let first = i.split(BREAKS).shift(); 
    if(first){ 

      if (YEP.indexOf(first) !== -1) {
        return isTrue(this)
      }

      if (NOPE.indexOf(first) !== -1) {
        return isFalse(this)
      }
    }

    return this;
  }
}

module.exports = yepnope;

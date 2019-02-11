Yepnope
=======
[![Build Status](https://travis-ci.org/entomb/yepnope.svg?branch=master)](https://travis-ci.org/entomb/yepnope)

Yepnope transforms yes/no answers into bools, very usefull for chatbots and command line tools.

## Usage
require the lib using `const yepnope = require('yepnoe')`

```javascript
  var ok = new yepnope('yes')
  //ok.true === true


  var notok = new yepnope('nope')
  //notok.false === true
```

## Example
```javascript
  function parseAnswer(text){
    var response = new yepnope(text);

    if(response.true){
      return 'thanks! i\'ll do that!';
    }

    if(response.false){
      return 'ups! i\'ll do something else then!';
    }

    if(!response.false && !response.true){
      return 'I don\'t understand!'
    }

  }
```

'use strict';

function merge(obj1,obj2) {
  var result = {};
  _merge(result,obj1);
  _merge(result,obj2); // first merge in 
  return result;
}

// http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
function _merge(obj1, obj2) {

  for (var p in obj2) {
    if( obj2.hasOwnProperty(p)){
      if (obj2[p] instanceof Array) {
        obj1[p] = obj2[p].slice(0);
      } else {
        // If the object is null just assign it
        if (obj2[p] === null) {
          obj1[p] = null;
        } else {
          obj1[p] = typeof obj2[p] === 'object' ? merge(obj1[p], obj2[p]) : obj2[p];
        }
      }
    } else {
    }
  }
  return obj1;
}

module.exports = merge;

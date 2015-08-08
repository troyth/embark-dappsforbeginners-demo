var deasync = require('deasync');


function sync(f)
{
    // get arguments following passed function
    var args = arguments;
    var n = {}
    var max_key;
    var returned = 0;

    // skip the first one (function itself)
    Object.keys(args).forEach(function(key) {
       if (key != '0')
       {
         max_key = key;
         n[key-1] = args[key];
       }
    });

    // put it at the end, in case if no other args are passed, make it the only one (at index 0)
    if (typeof max_key === "undefined") max_key = 0;
    n[max_key] = callback;

    var ret;
    function callback()
    {
        ret = arguments;
        returned = 1;
    }

    // convert arguments from object to array (so function.apply can use it)
    var args_array = [];
    Object.keys(n).forEach(function(key) {
         args_array.push(n[key]);
    });

    // call our original function and pass the arguments (as array) including our own callback at last position
    f.apply(null, args_array);

    // non-blocking wait until we get response from callback
    while(!returned) {
      require('deasync').runLoopOnce();
    }

    // convert ret (data returned in callback) from object to simple array
    var ret_array = [];
    Object.keys(ret).forEach(function(key) {
         ret_array.push(ret[key]);
    });

    // if we have just one element being returned, returned it as simple variable, not an array
    if (ret_array.length == 1) return ret_array[0];

    // return all params passed through callback
    return ret_array;
}


module.exports = sync;
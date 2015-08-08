sync-me
=======

Call any async function synchronously with one simple call.

## Installation

    npm install sync-me

## Usage

####var sync = require('sync-me')
####sync(**function_name**,**[arguments]**)

To execute asynchronous function in a synchronous way, call `sync()` and pass your function as a first argument followed by the arguments you want to pass to your function. Skip the callback.

For example, to call `fs.readFile()` in a synchronous way:

    var content = sync(fs.readFile,'file.txt')

`sync()` returns an array of variables that normally would be passed to the callback. In this example `readFile()` takes a callback `function(err, data)` so you will get an array with two values: error (if any) and the data returned (file content).

## Examples

###Synchronous readFile:

    var sync = require('sync-me');
    var fs = require('fs');

    // Result: source code of your script
    var content = sync(fs.readFile,__filename)[1];
    process.stdout.write(content);
    process.exit(1);

###Synchronous setTimeout:

    var sync = require('sync-me');

    function waitSecond(callback)
    {
        setTimeout(function(){
            callback();
            console.log('One second has passed!');
        },1000);
    }

    sync(waitSecond);
    process.exit(1);

###Returning multiple variables in a callback response:

    var sync = require('sync-me');

    function doubleIt(a,b,c,callback)
    {
        setTimeout(function(){
            callback(a*2,b*2,c*2);
        },500);
    }

    // Result: array [2,4,6]
    var doubled = sync(doubleIt,1,2,3);
    console.log(doubled);
    process.exit(1);

## Notes

* The function that you can convert may take any amount of arguments, but **callback** must be on the **last** position.
* Data returned by `sync()` depends on variables passed to the original callback. If callback takes a simple value, it will return that value. Otherwise, it will return an array of values
* For now, only functions with single callback are accepted. If function passed to `sync()` takes multiple callbacks, only the result of the last provided callback will get returned. Other callbacks most likely will get called asynchronously.
* I am aware that `fs.readFile()` has its synchronous counterpart `fs.readFileSync()`.I used it only as an example.
* **sync-me** is based on `.sleep()` function from [deasync](https://www.npmjs.org/package/deasync) package providing more flexibility and complete return values (array) compared to the original.

## Release History

* 0.1.0 Initial release
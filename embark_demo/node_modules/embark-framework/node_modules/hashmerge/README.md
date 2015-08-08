## Description
A utility to merge 2 hash objects into a new object.

With this we address:
- avoid changing existing hashes (kinda like clone)
- able to deep merge
- merge values from 2 hashes at same keys

    var hashmerge = require('hashmerge');
    var h1 = { log: { level: 'debug', mute: true}};
    var h2 = { log: { level: 'info, color: true} , port: 33};
    var h3 = hashmerge(h1,h2);

    -> h3 = { log: { level:'info', mute: true, color: true} , port: 33};

## Usage:

see [tests](test/hashmerge) for usage and abilities

'use strict';
let R;
module.exports.init = (runtime) => {
    R = runtime;
};

module.exports.snakeLadder = {
    'conf': {
        'handler': getstate,
    },
    'method': 'POST'
};

function getstate(req,res){

 console.log("---------------in getstate--------------")

}


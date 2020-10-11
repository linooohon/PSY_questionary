
function Get(thing) {
    switch (thing) {
        case "mongoPath":
            return 'mongodb://localhost:27017/';
        default:
            return '';
    }
}


module.exports.Get = Get;
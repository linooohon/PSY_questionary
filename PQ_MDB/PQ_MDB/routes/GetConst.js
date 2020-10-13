function Get(thing) {
    switch (thing) {
        case "mongoPath":
            return 'mongodb://localhost:27017/';
        case 'ID':
            return 'admin';
        case 'password':
            return '0000';
        default:
            return '';
    }
}


module.exports.Get = Get;
const mongoose = require('mongoose');
var fs = require('fs');
const currentPath = __dirname;
let models = {};

fs.readdirSync(`${currentPath}`).forEach(function (file) {
    if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js')
        return;
    var name = file.substr(0, file.indexOf('.'));
    const schema = require(`./${name}`);
    // console.log(name, schema);
    models[name] = mongoose.model(name, schema);
});
// console.log(models, 'name')

module.exports = models;
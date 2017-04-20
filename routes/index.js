var fs = require('fs');
var path = require('path');

module.exports = function(app) {
    fs.readdirSync(path.join(__dirname, './routers' )).forEach(function(name) {
        var routeArr = require('./routers/' + name);
        routeArr.forEach(function(obj) {
           var url = obj.url;
            var cpath = obj.cpath;
            var handle = require('./controllers/' + cpath);
            app.use(url, handle);
        });
    });
}
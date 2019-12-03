'use strict';

const app = require('./app.js');

if(process.env.PRODUCTION){
    require('greenlock-express')
        .init(function() {
            return {
                greenlock: require('./greenlock.js'),
                cluster: false
            };
        })
        .ready(function(glx) {
            glx.serveApp(app);
        });
} else {
    app.listen(5000, () => console.log('Server running on port 5000.'));
}
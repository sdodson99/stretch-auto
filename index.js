'use strict';

const app = require('./app.js');

if(process.env.PRODUCTION == "TRUE"){
    require('greenlock-express')
        .init(function() {
            return {
                greenlock: require('./greenlock/greenlock'),
                cluster: false
            };
        })
        .ready(function(glx) {
            glx.serveApp(app);
        });
} else {
    app.listen(80, () => console.log('Server running on port 80.'));
}
require("babel-core/register");

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('../webpack.config.js').development;
const open = require("open");
const app = express();
const compiler = webpack(config);

var url = require('url');

const port = 9527;
const host = '0.0.0.0';
const serverUrl = 'http://' + host + ':' + port;

//pushState
app.use(require('connect-pushstate')({
    allow: /__webpack_hmr|api/
}));


app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath,
    stats: {
        colors: true,
        profile:true
    }
}));

app.use(require('webpack-hot-middleware')(compiler));

//proxy
app.use('/api', require('proxy-middleware')(url.parse('http://172.16.30.125:8080/zeus/')));


app.listen(port, host, function (err) {
    if (err) {
        console.log(err);
        return;
    }

    open(serverUrl);

    console.log('Listening at ' + serverUrl);
});

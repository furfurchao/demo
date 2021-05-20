const Path = require('path')
const express = require('express')

function runServer() {
    const app = express()
    app.set('views', Path.join(__dirname, 'dist'));
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.static(Path.join(__dirname, 'dist', 'live-demo'), {
        'index': false,
        'maxAge': 3600
      }),)
    // app.all('*', function(req, res, next) {
    //     // res.header("Access-Control-Allow-Origin", req.headers.origin);
    //     res.header("Access-Control-Allow-Origin", '*');
    //     res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    //     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //     res.header("Access-Control-Allow-Credentials","true");
    //     res.header("X-Powered-By",' 3.2.1')
    //     if(req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
    //     else  next();
    // });
    app.get("*", (req, res) => {
        res.render('live-demo/index')
    })
    app.listen(7200, '127.0.0.1')
}

// runServer()

module.exports = {runServer}
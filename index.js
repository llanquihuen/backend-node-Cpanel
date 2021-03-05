const express = require('express');
const https = require('https');
const fs = require('fs');
const http = require('http');
const cors = require('cors');
const bodyParser = require ('body-parser')
const port = 3002;
const porthttp = 3003


const productRoutes = require ('./api/routes/productos_routecopy.js');
const imagesRoutes = require ('./api/routes/images_route.js');

var key = fs.readFileSync('../ssl/keys/e8826_81799_dad8d8409ac17f0ce51acae71388a834.key');
var cert = fs.readFileSync('../ssl/certs/sakuranboshodo_cl_e8826_81799_1643137875_f1b1dec7d497a4599d93d1e805694214.crt');
var options = {
  key: key,
  cert: cert
};

app = express()



var server = https.createServer(options, app);
var serverhttp = http.createServer(app)


server.listen(port, () => {
    console.log("Server starting on port : " + port)
});

serverhttp.listen(porthttp, ()=>{console.log("server on " + porthttp)})
// app.listen(porthttp, ()=>{console.log("server on " + porthttp)})

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/test2/uploads', express.static('uploads'));
app.use('/test2/products', productRoutes)
app.use('/test2/images', imagesRoutes)

app.get('/test2', (req, res) => {
   res.send('Now using https on port '+port);
});
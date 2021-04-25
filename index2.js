const express = require('express');
const https = require('https');
const fs = require('fs');
const http = require('http');
const cors = require('cors');
// const bodyParser = require ('body-parser')
const port = 3002;
const porthttp = 3003


const productRoutes = require ('./api/routes/productos_routecopy.js');
const clientesRoutes = require ('./api/routes/clientes_route.js');
const comprasRoutes = require ('./api/routes/compras_route.js');

const imagesRoutes = require ('./api/routes/images_route.js');
const authRoutes = require ('./api/routes/auth_route.js');
const authToken = require ('./api/middle/authToken.js');

var key = fs.readFileSync('../ssl/keys/long-file-name.key');
var cert = fs.readFileSync('../ssl/certs/long-file-name.crt');
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(authToken)
app.use('/test4/uploads', express.static('uploads'));
app.use('/test4/thumb', express.static('thumb'));
app.use('/test4/products', productRoutes)
app.use('/test4/clientes',clientesRoutes)
app.use('/test4/compras',comprasRoutes)
app.use('/test4/images', imagesRoutes)
app.use('/test4/auth',authRoutes)

app.get('/test4', (req, res) => {
   res.send('Now using https on port '+port);
});
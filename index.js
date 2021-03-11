const express = require('express');
// const https = require('https');
const http = require('http');
// const fs = require('fs');
const cors = require('cors');
// const bodyParser = require ('body-parser')
// const port = 3002;
const porthttp = 5000


const productRoutes = require ('./api/routes/productos_routecopy.js');
const imagesRoutes = require ('./api/routes/images_route.js');
const authRoutes = require ('./api/routes/auth_route.js');
const authToken = require ('./api/middle/authToken.js');

// var key = fs.readFileSync('../ssl/keys/filename.key');
// var cert = fs.readFileSync('../ssl/certs/filename.crt');
// var options = {
//   key: key,
//   cert: cert
// };

app = express()

// var server = https.createServer(options, app);
//var serverhttp = http.createServer(app)

// server.listen(port, () => {
    // console.log("Server starting on port : " + port)
// });

//serverhttp.listen(porthttp, ()=>{console.log("Servidor corriendo en el puerto " + porthttp)})
app.listen(porthttp, ()=>{console.log("Servidor corriendo en el puerto " + porthttp)})

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authToken)
app.use('/uploads', express.static('uploads'));
app.use('/thumb', express.static('thumb'));
app.use('/products', productRoutes)
app.use('/images', imagesRoutes)
app.use('/auth',authRoutes)

app.get('/', (req, res) => {
   res.send('Now using https on port '+port);
});
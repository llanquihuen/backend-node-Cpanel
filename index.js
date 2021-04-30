const express = require('express');
// const https = require('https');
const http = require('http');
// const fs = require('fs');
const cors = require('cors');
const path = require('path');

// const bodyParser = require ('body-parser')
// const port = 3002;
const porthttp = 5000

// //Loads the handlebars module
const handlebars = require('express-handlebars');


const productRoutes = require ('./api/routes/productos_routecopy.js');
const clientesRoutes = require ('./api/routes/clientes_route.js');
const comprasRoutes = require ('./api/routes/compras_route.js');

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

let unJson = JSON.parse(`[{"_id":19,"name":"Otro producto color Rojo","price":8000,"stock":53,"tag":"Rojo,caligrafia","descrip":"lalsladsl dla lladsl dsl dlsa sdnkahsbd uaysd b "},{"_id":20,"name":"ssss","price":213,"stock":170,"tag":"qas,da,da,dsa","descrip":" asdasd a sda sda das"}]`)
// //-----VER EL HANDLEBAR DEL MAIL------
//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');
//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars({
layoutsDir: __dirname + '/views',
}));
app.use(express.static('public'))

app.get('/', (req, res) => {
//Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
res.render('main', {
    name:"Pedrito", 
    direccion:"Los Pedros #112",
    uno:unJson
});
});


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
app.use('/clientes',clientesRoutes)
app.use('/compras',comprasRoutes)
app.use('/images', imagesRoutes)
app.use('/auth',authRoutes)

// Ver una página 
// app.get('/preview',(req,res)=>{
//     res.sendFile(path.join(__dirname+'/test.html'));
//   });

app.get('/', (req, res) => {
   res.send('Now using https on port '+porthttp);
});


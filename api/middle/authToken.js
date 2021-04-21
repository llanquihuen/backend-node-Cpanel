  
const jwt = require  ('jsonwebtoken');
const { report } = require('../routes/clientes_route');
const authToken = (req,res,next)=>{

    if(req.path !== '/auth/login'){
            // console.log(req.headers)
       
        if(req.headers.authorization && req.headers.authorization !== 'null'){
            // console.log(req.headers.authorization)
             let token = req.headers.authorization.split(' ')[1]  //Esto lo pasé a actions (api) para el cliente. 
            jwt.verify(token,process.env.SECRET_TOKEN, (error, decoded)=>{
                // console.log(decoded)
                if (error){
                    console.log("Holi, se te venció el token")

                    return res.status(500).send({message:'No tienes los permisos suficientes, error de token',error});
                }
                if(req.method != 'GET'){
                    //accesso a mas de un rol
                    // console.log("No te pases de listo, no tienes permiso")
                    if(decoded.role == 'un_rol'){console.log("acceso");next();}
                    else res.status(500).send({message:'No tienes los permisos suficientes,usuario no es admin',error});
                }else{
                    //Sale todo acá :S
                    // console.log(decoded)
                    next();
                }
            })
        }else {
            if(req.method == 'GET'){
                // console.log('get si',req.path)
                // console.log(req.path.includes('clientes'))
                if(req.path.includes('clientes') || req.path.includes('compras')){
                    res.status(401).send({message:'No tienes permisos para obtener esos datos'})
                }else{
                    next()
                }
            }
            if(req.method=='POST'){
                // console.log(req.path)
                if(req.path == '/clientes' || req.path == '/compras'){
                    //Estas lineas daban error de 'ERR_HTTP_HEADERS_SENT' se puede dar solo una vez la respuesta a headers, y en authControl estaba dando otra respuesta alternativa
                    // res.status(200).send({message:'Cliente agregado'})
                    next()
                }
            }
     
        }
        
    }
    else next();
}
module.exports = authToken
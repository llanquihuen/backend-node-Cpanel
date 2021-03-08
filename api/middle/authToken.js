  
const jwt = require  ('jsonwebtoken');
const authToken = (req,res,next)=>{
 
    if(req.path !== '/auth/login'){
        // console.log(req.headers)
       
        if(req.headers.authorization){
            let token = req.headers.authorization.split(' ')[1]  //Esto lo pasé a actions (api) para el cliente. 
            // console.log(token);
            jwt.verify(token,process.env.SECRET_TOKEN, (error, decoded)=>{
                // console.log(decoded)
                if (error){
                    return res.status(500).send({message:'No tienes los permisos suficientes, error de token',error});
                }
                if(req.method != 'GET'){
                    //accesso a mas de un rol
                    if(decoded.role == 'un_rol'){console.log("acceso");next();}
                    else res.status(500).send({message:'No tienes los permisos suficientes,usuario no es admin',error});
                }else{
                    console.log(decoded)
                    next();
                }
            })
        }else {
            if(req.method == 'GET'){
                console.log('get si')
                next()
            }else{
            res.status(403).send({message:'Usted no tiene token'})
            }
        }
        

    }else next();
}
module.exports = authToken
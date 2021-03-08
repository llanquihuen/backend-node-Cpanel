const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const dotenv = require ('dotenv');
const pool = require  ('../../database.js')


// const usermodels = require ('../models/userModel.js');
const saltRounds = 10;
dotenv.config()

const theToken = process.env.SECRET_TOKEN;
const tabla = 'users'
const handleUser = {
    create: async (req,res)=> {
        let username = req.username;
        let password =req.password;
        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        // console.log(encryptedPassword)

        pool.query(
            `INSERT INTO ${tabla} (username,password,role) VALUES(?,?,?)`,
            [
                username,
                encryptedPassword,
                req.role,

            ],
            (error, results)=>{
                console.log(results,error)
                if(error){
                    return res(error);
                }
                return res(null, results);
            }

        )
    },
    
    compare: async (req,res)=>{
        let username = req.username;
        let password =req.password;
        
        pool.query(
            `SELECT * FROM ${tabla} WHERE username = '${username}'`,
            async (err,results)=>{
                    if (err){
                        return res(error)              
                    }else{
                        if (results.length >0){
                            const comparison = await bcrypt.compare(password, results[0].password)
                            if (comparison){
                                // console.log(results[0].role)

                                //Descripcion del token que se lee en el middle
                                const token = jwt.sign(
                                    {
                                        username:username,
                                        password:password,
                                        role:results[0].role
                                    },
                                    theToken,{
                                        expiresIn:"1h"
                                    }
                                );
                                return res(null,{
                                    "message":"Acceso autorizado, todo correcto ;)",
                                    "token":token,
                                    "id":res._id,
                                })
                    
                            }else{  
                                return res  (null,{
                                    "code":204,
                                    "error":"Usuario y password no concuerdan",
                                })      
                            }
                        }else{
                            return res (null, {
                                "code":206,
                                "error":"Usuario no existe",
                            })   

                        } 
                
                    }
            }
            

        )
    }

    
    // users.findOne({username})
    // .then(user => {
    //     if(!user) return res.status(404).send({message: 'No existe el usuario'})
    //     bcrypt.compare(password, user.password)
    //         .then(match => {
    //             if(match){
    //                 const token = jwt.sign(
    //                     {
    //                         username:user.username,
    //                         password:user.password,
    //                         role: user.role
    //                     },
    //                     theToken,{
    //                         expiresIn:"1h"
    //                     }
    //                 );
    //                 res.status(200).json({
    //                     message:"Acceso autorizado",
    //                     token:token,
    //                     id:user.id,
    //                     photo:user.photo,
    //                 })
    //                 // const payload={
    //                 //     username:user.username,
    //                 //     email:user.email,
    //                 //     name:user.name
    //                 // }
    //                 // jwt.sign({payload, theToken, function (error,token) {
    //                 //     if(error){
    //                 //         res.status(500).send({error});
    //                 //     }else{
    //                 //         res.status(200).send({message:'Acceso',token})
    //                 //     }
                        
    //                 // }})
    //             }else{
    //                 res.status(200).send({message: 'Password incorrecto'});

    //             }
    //         }).catch(error => {
    //             console.log(error);
    //             res.status(500).send({message:'error 1',error});
    //         });                
    // }).catch(error => {
    //         console.log(error);
    //         res.status(500).send({message:'error 2',error});
    //     });
}

module.exports = handleUser;
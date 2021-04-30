const pool = require  ('../../database.js')
const fs = require ('fs');
var nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars')

let logStream = fs.createWriteStream('log.txt')
let consoles = {}
consoles.log = (obj) => {
  var s = ''
  if (typeof obj === 'string')
    s = obj
  else
    s = JSON.stringify(obj)

  s = `${s}'\n'`
  logStream.write(s)
}

// var transporter = nodemailer.createTransport({
//   service: 'mail.sakuranboshodo.cl',
//   pool:true,
//   port:465,
//   secure:true,
//   auth: {
//     user: 'contacto@sakuranboshodo.cl',
//     pass: process.env.MAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false
// }

// });

var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'llanquihuen6@gmail.com',
      pass: process.env.MAIL_PASS,
    }
});
transporter.use('compile',hbs({
    viewEngine:'express-handlebars',
    viewPath:'./'
}));

const tabla = 'compras'
const handleProducto = {
    create:(data,callBack) =>{
        consoles.log(data)
        // const detalleCompra = data.detalleCompra.toString();

        pool.query(
            `INSERT INTO ${tabla} (detalleCompra,idCliente,direccion) VALUES(?,?,?)`,
                [
                    data.detalleCompra,
                    data.idCliente,
                    data.direccion,
                ],
                (error, results, fields)=>{
                    if(error){
                        return callBack(error);
                    }
                    let unJJ1 = data.detalleCompra.replace(/'/g,'"')
                    let unJson1 = JSON.parse(unJJ1)
                    let num=[]
                    for (let i in unJson1){
                        num.push(unJson1[i]._id)
                    }
                    pool.query(`SELECT * FROM clientes WHERE rut='${data.idCliente}'`,
                     (err,res)=>{
                        if (err) {
                            return callBack(err)
                        }
                        let numString = "(".concat(num.toString(),")")
                        pool.query(
                            `SELECT * FROM productos2 WHERE _id IN ${numString}`,
                            (err,resu)=>{
                                if (err){
                                    return callBack(err)
                                }

                                //ACA SE TIENEN TODOS LOS DATOS :D
                                
                                console.log(resu)
                                console.log(res)
                                // console.log(unJJ1)
                                // console.log(unJson1)

                                // var mailOptions = {
                                //     from: 'contacto@sakuranboshodo.cl',
                                //     to: res[0].email,
                                //     subject: 'Comprobante de compra sakuranbo.shodo',
                                //     text: 'That was easy!',
                                //     template:'main',
                                //     context:{
                                //         name:res[0].nombre,
                                //         direccion:res[0].direccion,
                                //         order:resu,
                                //     }
                                // };




                            }
                        )
                            
                        
                        
                        // console.log(res)
                        // console.log(data.detalleCompra)
                        // console.log(unJson1.length)
                        // console.log(res[0].email)


                    //     transporter.sendMail(mailOptions, function(error, info){
                    //         if (error) {
                    //         //   consoles.log('error mail'+error);
                    //           console.log('error mail'+ error);

                    //         } else {
                    //         //   consoles.log('Email sent: ' + info.response);
                    //           console.log('Email sent: ' + info.response);

                    //         }
                    //       });

                    })

                    let unJJ = data.detalleCompra.replace(/'/g,'"')
                    let unJson = JSON.parse(unJJ)
                   
                    for (let i in unJson){
                        pool.query(
                            `UPDATE productos2
                            SET productos2.stock = productos2.stock - ${unJson[i].cantidad}
                            WHERE productos2._id = ${unJson[i]._id}`
                        )
                    }

                    // console .log(data)
                    return callBack(null, results);
                }
        );
    },
    //Seguir desde acá
    view:(id,callBack)=>{
        if (id===null){
            pool.query(`SELECT * FROM ${tabla}`,
            (error,results)=>{
                if(error){
                    return callBack(error);
                }
                let unJson = JSON.parse(JSON.stringify(results))
                return callBack(null,unJson)
            })
        }else{
            pool.query(`SELECT * FROM ${tabla} WHERE _id =${id}`,
            (error,results)=>{
                if(error){
                    return callBack(error);
                }
                let unJson = JSON.parse(JSON.stringify(results))
                return callBack(null,unJson)
            })
        }
        // console.log(res)
        // return res
    },
    update:(id,post,callBack)=>{
        pool.query(
            `UPDATE ${tabla} SET ${'name="'+post.rut+'"'},
            ${'price="'+post.nombre+'"'},
            ${'stock="'+post.region+'"'},
            ${'tag="'+post.comuna+'"'},
            ${'descrip="'+post.direccion+'"'},
            ${'imageLocation="'+post.email+'"'}, 
            ${'imageLocation="'+post.telefono+'"'}, 

            
            WHERE _id ='${id}'`,

            
            

            (error,results)=>{
                console.log(JSON.stringify(results)+" handle productos update")
                if(error){
                    return callBack(error);
                }
                return callBack(null,results)
         
            }
        )},
    borrar:(id,callBack)=>{
        pool.query(`DELETE FROM ${tabla} WHERE _id =${id}`,
            (error,results)=>{
                if(error){
                    return callBack (error);
                }
                return callBack(null,results)
            }
        )},
    

}

module.exports = handleProducto;




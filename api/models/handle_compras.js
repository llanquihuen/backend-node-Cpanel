const pool = require  ('../../database.js')
const fs = require ('fs');
var nodemailer = require('nodemailer');

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

var transporter = nodemailer.createTransport({
  service: 'mail.sakuranboshodo.cl',
  pool:true,
  port:465,
  secure:true,
  auth: {
    user: 'contacto@sakuranboshodo.cl',
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
}

});

var mailOptions = {
    from: 'contacto@sakuranboshodo.cl',
    to: 'llanquihuen@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

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
                    
                    pool.query(`SELECT * FROM clientes WHERE rut='${data.idCliente}'`,
                     (err,res)=>{
                        if (err) {
                            return callBack(err)
                        }
                        console.log(res)

                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                              consoles.log('error mail'+error);
                            } else {
                              consoles.log('Email sent: ' + info.response);
                            }
                          });

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




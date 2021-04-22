const pool = require  ('../../database.js')
const fs = require ('fs');

const tabla = 'compras'
const handleProducto = {
    create:(data,callBack) =>{
        console.log(data)
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




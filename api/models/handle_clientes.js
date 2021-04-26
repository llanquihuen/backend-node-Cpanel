const pool = require  ('../../database.js')
const fs = require ('fs');

const tabla = 'clientes'
const handleProducto = {
    create:(data,callBack) =>{
        console.log(data)
        pool.query(
            `INSERT INTO ${tabla} (rut,nombre,region,comuna,direccion,email,telefono) VALUES(?,?,?,?,?,?,?)`,
                [
                    data.rut,
                    data.nombre,
                    data.region,
                    data.comuna,
                    data.direccion,
                    data.email, 
                    data.telefono,
                ],
                (error, results, fields)=>{
                    if(error){
                        if (error.code==="ER_DUP_ENTRY"){
                            pool.query(
                                `UPDATE ${tabla} SET 
                                ${'nombre="'+data.nombre+'"'},
                                ${'region="'+data.region+'"'},
                                ${'comuna="'+data.comuna+'"'},
                                ${'direccion="'+data.direccion+'"'},
                                ${'email="'+data.email+'"'}, 
                                ${'telefono="'+data.telefono+'"'} WHERE rut ="${data.rut}"`,
                    
                                (error,results)=>{
                                    console.log(JSON.stringify(results)+" handle CLIENTES update")
                                    if(error){
                                        console.log(error)
                                        // return callBack(error);
                                    }else{

                                        console.log("no hay error")
                                    }

                                    // return callBack(null,results)
                            
                                }
                            )
                        }else{
                            return callBack(error);
                        }
                    }
                    console.log (results)
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




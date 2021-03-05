const pool = require ('../../database.js');
const tabla = 'imagenes'
const handleImagen = {
    create:(path,callBack) =>{
        path = path.toString();
        // console.log(path +" create---------------")
        pool.query(
            `INSERT INTO ${tabla} (productImage) VALUES ('${path}')`,
                
                (error, results, fields)=>{
                    if(error){
                        return callBack(error);
                    }
                    fields = path
                    return callBack(null, results,fields);
                }
        );
    },
    view:(id,callBack)=>{
        if (id===null){
            pool.query(`SELECT * FROM ${tabla}`,
            (error,results)=>{
                if(error){
                    return callBack(error);
                }
                let unJson = JSON.parse(JSON.stringify(results))
                for(let i in unJson){
                    unJson[i].productImage = unJson[i].productImage.split(/\s*(?:,|$)\s*/)
                    // console.log(JSON.stringify(unJson)+" image view2-----------------")

                }
                
                return callBack(null,unJson)
            })
        }else{
            pool.query(`SELECT * FROM ${tabla} WHERE _id =${id}`,
            (error,results)=>{
                // console.log(error)
                // console.log(results)
                if(error){
                    return callBack(error);
                }
                
                let unJson = JSON.parse(JSON.stringify(results))
                for(let i in unJson){
                    unJson[i].productImage = unJson[i].productImage.split(/\s*(?:,|$)\s*/)
                    // console.log(JSON.stringify(unJson)+" image view2-----------------")
                }
                
                return callBack(null,unJson)
            })
        }
        // console.log(res)
        // return res
    },
    update:(id,post,callBack)=>{
        if(post.tag) post.tag = post.tag.toString();
        if(post.imageLocation) post.imageLocation = post.imageLocation.toString()
        // console.log(post.imageLocation +"image update---------------")
        pool.query(`UPDATE ${tabla} SET imageLocation='${post.imageLocation}' WHERE _id ='${id}'`,

            (error,results)=>{
                // console.log(results)
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

module.exports = handleImagen;
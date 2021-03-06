const pool = require  ('../../database.js')
const fs = require ('fs');

const tabla = 'productos2'
const handleProducto = {
    create:(data,callBack) =>{
        // console.log(data)
        const stringTag = data.tag.toString();
        const stringImage = data.imageLocation.toString();
        pool.query(
            `INSERT INTO ${tabla} (name,price,stock,tag,descrip,imageLocation) VALUES(?,?,?,?,?,?)`,
                [
                    data.name,
                    data.price,
                    data.stock,
                    stringTag, 
                    data.descrip,
                    stringImage,
                ],
                (error, results, fields)=>{
                    if(error){
                        return callBack(error);
                    }
                    return callBack(null, results);
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
                // console.log(results)
                let unJson = JSON.parse(JSON.stringify(results))
                for(let i in unJson){
                    if(unJson[i].tag){unJson[i].tag = unJson[i].tag.split(/\s*(?:,|$)\s*| /)}
                    if(unJson[i].imageLocation){unJson[i].imageLocation = unJson[i].imageLocation.split(/\s*(?:,|$)\s*/)}
                }
                let array1= []
                fs.readdirSync('uploads').forEach(file => {
                    // array1.push(`uploads/${file}`)
                    array1.push(`uploads\\${file}`)

                });
                let array2 =[]
                try{
                    unJson.map((photo)=>{photo.imageLocation.map(((single)=>array2.push(single)))})
                    // console.log(array1)
                    // console.log(array2)
                    let difference =  array1.filter(x=> !array2.includes(x))
                    difference.map((photo)=>{
                    console.log("Eliminando el archivo "+photo)
                        try{
                        fs.unlinkSync(photo)
                        }catch{
                        console.log("El archivo no existe")
                        };
                    })
                }catch{
                    console.log("Nada que borrar")
                }

                return callBack(null,unJson)
            })
        }else{
            pool.query(`SELECT * FROM ${tabla} WHERE _id =${id}`,
            (error,results)=>{
                console.log(results + "get - view")
                
                if(error){
                    return callBack(error);
                }
                let unJson = JSON.parse(JSON.stringify(results))
                for(let i in unJson){
                    unJson[i].tag = unJson[i].tag.split(/\s*(?:,|$)\s*| /)
                    unJson[i].imageLocation = unJson[i].imageLocation.split(/\s*(?:,|$)\s*/)
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
            // console.log(post.imageLocation+"------------------------------------------------------------------------------------")

          let post2 = post.imageLocation.replace(/\\/g, "\\\\")
        //   console.log(post.imageLocation+"------------------------------------------------------------------------------------")

        pool.query(`UPDATE ${tabla} SET 
            ${post.name?'name="'+post.name+'"':" "}
            ${post.price?',price="'+post.price+'"':" "}
            ${post.stock?',stock="'+post.stock+'"':" "}
            ${post.tag?',tag="'+post.tag+'"':" "}
            ${post.descrip?',descrip="'+post.descrip+'"':" "}
            ${post.descrip&&post.imageLocation? ",":" "}
            ${post2?'imageLocation="'+post2+'"':" "} WHERE _id ='${id}'`,

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




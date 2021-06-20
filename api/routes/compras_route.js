const express = require ("express");
// const multer = require ('multer');

const handleCompras = require ("../models/handle_compras.js");

const router = express.Router();

router.get("/", async (req, res) => {
  handleCompras.view(null,(err, result)=>{
    if (err) {throw err}
    res.send( result );
    
  });
});

 
router.post('/', async (req,res)=>{
  // console.log("client-post")
  const body = req.body;
  handleCompras.create(body,(err,results)=>{
    if (err){
      // console.log(err)
      return res.status(500).json({
        sqlMessage:err.sqlMessage,
        code:err.code,
        success: 0,
        message:"Error conexión DB"
      });
    }
    //Estas lineas daban error de 'ERR_HTTP_HEADERS_SENT' se puede dar solo una vez la respuesta a headers, y en authControl estaba dando otra respuesta alternativa
    return res.status(200).json({
      success:"Compra reservada",
      data: results
    });
  })
})


router.get("/:id",  async (req, res) => {
  const theId = req.params.id
  handleCompras.view(theId,(err, result)=>{
    if (err) {
      res.status(500).json({message:"Error de conexión DB"})
      throw err
    ;}
    res.send( result );
    
  });
});




router.patch("/:id", async (req, res) => {
  const theId = req.params.id
  const post = req.body
  const lalala = JSON.parse(JSON.stringify(post))
  console.log(theId,post, lalala+"58.compras_route")
  handleCompras.update(theId,post,(err, result)=>{
    if (err) {
      res.status(500).json({message:error.message})
      throw err
      ;}

    res.send( result );
  });
});



router.delete("/:id",async(req,res)=>{
  const theId = req.params.id;

  handleCompras.borrar(theId,(err, result)=>{
    if (err){
      res.status(500).json({message:error.message})
    }
    res.send(result)
  })
})



module.exports = router;
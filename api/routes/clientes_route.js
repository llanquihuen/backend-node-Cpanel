const express = require ("express");
const multer = require ('multer');

const handleClientes = require ("../models/handle_clientes.js");

const router = express.Router();

router.get("/", async (req, res) => {
  handleClientes.view(null,(err, result)=>{
    if (err) {throw err}
    res.send( result );
    
  });
});

 
router.post('/', async (req,res)=>{
  console.log("oye")
  const body = req.body;
  handleClientes.create(body,(err,results)=>{
    if (err){
      return res.status(500).json({
        
        success: 0,
        message:"Error conexión DB"
      });
    }
    //Estas lineas daban error de 'ERR_HTTP_HEADERS_SENT' se puede dar solo una vez la respuesta a headers, y en authControl estaba dando otra respuesta alternativa
    return res.status(200).json({
      success:"Cliente agregado",
      data: results
    });
  })
})


router.get("/:id",  async (req, res) => {
  const theId = req.params.id
  handleClientes.view(theId,(err, result)=>{
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
  console.log(theId,post, lalala +"------------jiji-----")
  handleClientes.update(theId,post,(err, result)=>{
    if (err) {
      res.status(500).json({message:error.message})
      throw err
      ;}

    res.send( result );
  });
});



router.delete("/:id",async(req,res)=>{
  const theId = req.params.id;

  handleClientes.borrar(theId,(err, result)=>{
    if (err){
      res.status(500).json({message:error.message})
    }
    res.send(result)
  })
})



module.exports = router;
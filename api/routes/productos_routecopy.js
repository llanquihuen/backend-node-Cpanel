const express = require ("express");
const multer = require ('multer');

const handleProducto = require ("../models/handle_products.js");

const router = express.Router();

router.get("/", async (req, res) => {
  handleProducto.view(null,(err, result)=>{
    if (err) {throw err}
    res.send( result );
    
  });
});

 
router.post('/', async (req,res)=>{
  const body = req.body;
  handleProducto.create(body,(err,results)=>{
    if (err){
      console.log(err);
      return res.status(500).json({
        success: 0,
        message:"Error conexión DB"
      });
    }
    return res.status(200).json({
      success:1,
      data: results
    });
  })
})


router.get("/:id",  async (req, res) => {
  const theId = req.params.id
  handleProducto.view(theId,(err, result)=>{
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
  console.log(theId,post, lalala+"54-routecopy")
  handleProducto.update(theId,post,(err, result)=>{
    if (err) {
      res.status(500).json({message:error.message})
      throw err
      ;}

    res.send( result );
  });
});



router.delete("/:id",async(req,res)=>{
  const theId = req.params.id;

  handleProducto.borrar(theId,(err, result)=>{
    if (err){
      res.status(500).json({message:error.message})
    }
    res.send(result)
  })
})



module.exports = router;
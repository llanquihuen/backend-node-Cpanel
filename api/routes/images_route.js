const express =require ("express");
const multer = require ('multer');
const sharp = require('sharp');

const handleImagen = require ('../models/handle_images.js');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4024 * 4024 * 5
  },
  fileFilter: fileFilter
});

//import Product from "../models/handle_images.js";

router.get("/", async (req, res) => {
  // const thesql = `SELECT * FROM productos`;
  
  handleImagen.view(null,(err, result)=>{
    if (err) {throw err}
    res.send( result );
    
  });
});

// router.get("/", (req, res, next) => {
//     Product.find()
//       .select(" _id productImage ")
//       .exec()
//       .then(docs => {
//         const response = {
//           count: docs.length,
//           products: docs.map(doc => {
//             return {
//               productImage: doc.productImage,
//               _id: doc._id,
//               request: {
//                 type: "GET",
//                 url: "http://localhost:8000/images/" + doc._id
//               }
//             };
//           })
//         };
//         res.status(200).json(response.products);
//       })
//       .catch(err => {
//         console.log(err);
  
//         res.status(500).json({
//           error: err
          
//         });
//       });
//   });
  
  router.post('/',upload.array('productImage',10), async (req,res)=>{
  const body = req.body;
      let paths=[];
    if (req.files){
      for (const file of req.files) {
        console.log(file)

        sharp(file.path).resize(400, 400).toFile('thumb/' + 'thumbnails-' + file.filename, (err, resizeImage) => {
          if (err) {
               console.log(err);
          } else {
               console.log(resizeImage);
          }
        });
        paths.push(file.path)
      }
    } handleImagen.create(paths,(err,results,fields)=>{
    if (err){
      console.log(err);
      return res.status(500).json({
        success: 0,
        message:"Error conexión DB"
      });
    }
      return res.status(201).json({
      message: "Created product successfully",
      createdProduct:{
        _id:results.insertId,
        photo: fields,
      }
    });
  })
})

  // router.post("/", upload.array('productImage',10), (req, res, next) => {
  //   let paths=[];
  //   if (req.files){
  //     for (const file of req.files) {
  //       // console.log(file.path)
  //       paths.push(file.path)
  //     }
  //   }
  //   console.log(req.body)
  //   const product = new Product({
  //     _id: new mongoose.Types.ObjectId(),
  //       productImage:paths
  //   });
  //     product
  //     .save()
  //     .then(result => {
  //       console.log(result)
  //       res.status(201).json({
  //         message: "Created product successfully",
  //         createdProduct: {
  //             _id: result._id,
  //             photo: result.productImage,
  //             request: {
  //                 type: 'GET',
  //                 url: "http://localhost:8000/images/" + result._id
  //             }
  //         }
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //         res.status(500).json({
  //         error: err
  //       });
  //     });
  // });
  
  router.get("/:id",  async (req, res) => {
  const theId = req.params.id
    handleImagen.view(theId,(err, result)=>{
    if (err) {
      res.status(500).json({message:"Error de conexión DB"})
      throw err
    ;}
    res.send( result );
    
  });
});

router.delete("/:id",async(req,res)=>{
  const theId = req.params.id;

  handleImagen.borrar(theId,(err, result)=>{
    if (err){
      res.status(500).json({message:error.message})
    }
    res.send(result)
  })
})

// router.patch("/:id", async (req, res) => {
//   const theId = req.params.id
//   const post = req.body
  
//   handleImagen.update(theId,post,(err, result)=>{
//     if (err) {
//       res.status(500).json({message:error.message})
//       throw err
//       ;}

//     res.send( result );
//   });
// });

  // router.get("/:productId", (req, res, next) => {
  //   const id = req.params.productId;
  //   Product.findById(id)
  //     .select('_id productImage')
  //     .exec()
  //     .then(doc => {
  //       console.log("From database", doc);
  //       if (doc) {
  //         res.status(200).json({
  //             product: doc,
  //             request: {
  //                 type: 'GET',
  //                 url: 'http://localhost:8000/images'
  //             }
  //         });
  //       } else {
  //         res
  //           .status(404)
  //           .json({ message: "No valid entry found for provided ID" });
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.status(500).json({ error: err });
  //     });
  // });

//------------- Hasta aqui esta ok, falta PATCH y DELETE ----------------


  
  // router.delete("/:productId", (req, res, next) => {
  //   const id = req.params.productId;
  //   Product.remove({ _id: id })
  //     .exec()
  //     .then(result => {
  //       res.status(200).json({
  //           message: 'Product deleted',
  //           request: {
  //               type: 'POST',
  //               url: 'http://localhost:8000/images',
  //               body: { name: 'String', price: 'Number' }
  //           }
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.status(500).json({
  //         error: err
  //       });
  //     });
  // });
  
  module.exports = router;
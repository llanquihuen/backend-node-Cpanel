const express = require ('express');
const authCtrl = require ('../models/authControl.js')


const router = express.Router()


router.post('/register', async(req,res)=>{
    const body = req.body
    authCtrl.create(body,(err,result)=>{
        if (err) {
            console.log(err)
            return res.status(500).json({
                errorCode: err.code,
                message: err.sqlMessage
            });
        }
        return res.status(200).json({
            success:1,
            data: result
          });

    });
});

router.post('/login',async(req,res)=>{
    const body = req.body

    authCtrl.compare(body,(err,result)=>{
        if (err) {throw err}
        return res.status(200).json({
            data: result,
          });
    })
})

module.exports = router
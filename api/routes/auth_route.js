const express = require ('express');
const authCtrl = require ('../models/authControl.js')


const router = express.Router()

router.post('/login', authCtrl);

module.exports = router
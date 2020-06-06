const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const pool = require('../../database');

router.get('/', async(req, res) => {

    res.render('links/compras/compras');

});
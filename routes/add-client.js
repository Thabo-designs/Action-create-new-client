const express = require('express');
const router = express.Router();
const addClientController = require('../controllers/addController');

router.post("/client", addClientController.addClient)

module.exports = router;
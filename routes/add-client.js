const express = require('express');
const router = express.Router();
const addClientController = require('../controllers/addController');
const addContactController = require('../controllers/addContactController')
const linkClientController = require('../controllers/linkClientController')


router.post("/client", addClientController.addClient)
router.post("/contact", addContactController.addContact)
router.post("/linkClient", linkClientController.linkClient)
router.post("/delink", linkClientController.delinkClient)

module.exports = router;
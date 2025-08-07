const express = require('express');
const router = express.Router();
const docGiaController = require('../controllers/DocGia.controller');

router.get('/', docGiaController.getAllReaders);
router.delete('/:id', docGiaController.deleteReader);
router.post('/signup', docGiaController.signUp);
router.post('/signin', docGiaController.signIn);
router.get('/my-account', docGiaController.getMyAccount);
router.patch('/my-account', docGiaController.updateMyAccount);
router.patch('/change-password', docGiaController.changePassword);
router.delete('/my-account', docGiaController.deleteMyAccount);
module.exports = router;
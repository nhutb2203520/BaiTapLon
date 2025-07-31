const express = require('express');
const router = express.Router();
const sachController = require('../controllers/Sach.controller');

// ✅ THÊM: Route upload ảnh sách
router.post('/upload', sachController.uploadImage);

// Các route khác
router.get('/', sachController.getAll);
router.get('/hot', sachController.getHot);
router.get('/new', sachController.getNew);
router.get('/:MaSach', sachController.getById);
router.post('/', sachController.add);
router.patch('/:MaSach', sachController.update);
router.delete('/:MaSach', sachController.delete);
router.delete('/', sachController.deleteAll);

module.exports = router;
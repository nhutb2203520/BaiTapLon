const express = require('express');
const router = express.Router();
const docGiaController = require('../controllers/DocGia.controller');

router.get('/', docGiaController.getAllReaders);
router.delete('/:id', docGiaController.deleteReader);

// Route đăng ký
router.post('/signup', docGiaController.signUp);

// Route đăng nhập
router.post('/signin', docGiaController.signIn);

// Route lấy thông tin tài khoản (cần authentication)
router.get('/my-account', docGiaController.getMyAccount);

// Route cập nhật thông tin tài khoản (cần authentication)
router.patch('/my-account', docGiaController.updateMyAccount);

// Route đổi mật khẩu (cần authentication)
router.patch('/change-password', docGiaController.changePassword);

// Route xóa tài khoản (cần authentication)
router.delete('/my-account', docGiaController.deleteMyAccount);

module.exports = router;
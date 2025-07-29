    const express = require('express');
    const multer = require('multer');
    const path = require('path');
    const fs = require('fs');
    const router = express.Router();

    // ✅ Tạo thư mục uploads nếu chưa có
    const uploadDir = 'uploads/books';
    if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ✅ Cấu hình multer storage
    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Tạo tên file unique: timestamp_originalname
        const uniqueName = Date.now() + '_' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
    });

    // ✅ Cấu hình multer với validation
    const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Chỉ cho phép ảnh
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
        } else {
        cb(new Error('Chỉ cho phép upload file ảnh (jpg, jpeg, png, gif, webp)'), false);
        }
    }
    });

    // ✅ Route upload single image
    router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Không có file được upload!'
        });
        }

        // Trả về đường dẫn file
        const imageUrl = `/uploads/books/${req.file.filename}`;
        
        res.json({
        success: true,
        message: 'Upload ảnh thành công!',
        imageUrl: imageUrl,
        fileName: req.file.filename
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
        success: false,
        message: 'Lỗi server khi upload ảnh!'
        });
    }
    });

    // ✅ Error handling middleware
    router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File quá lớn! Kích thước tối đa 5MB.'
        });
        }
    }
    
    res.status(400).json({
        success: false,
        message: error.message || 'Lỗi upload file!'
    });
    });

    module.exports = router;
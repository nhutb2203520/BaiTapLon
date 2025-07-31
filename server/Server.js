const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();
const ApiError = require("./src/ApiError");
const database = require("./src/config/KetNoiMongoDB");

const route = require('./src/routes/index');
const uploadRouter = require('./src/routes/Upload.route');

require("dotenv").config();
database.connect();

// ✅ CẬP NHẬT: CORS configuration để cho phép truy cập ảnh
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// ✅ SỬA: Static files serving - đặt trước các middleware khác
console.log('📁 Setting up static file serving...');

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, 'uploads');
const booksDir = path.join(__dirname, 'uploads', 'books');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

if (!fs.existsSync(booksDir)) {
  fs.mkdirSync(booksDir, { recursive: true });
  console.log('📁 Created books directory');
}

// ✅ CẬP NHẬT: Static file serving với headers đúng
app.use('/uploads', (req, res, next) => {
  // Thêm CORS headers cho static files
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// ✅ THÊM: Route test để kiểm tra ảnh cụ thể
app.get('/test-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'uploads', 'books', filename);
  
  console.log('🔍 Testing image:', filename);
  console.log('📁 Full path:', imagePath);
  console.log('📁 File exists:', fs.existsSync(imagePath));
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({
      success: false,
      message: 'Image not found',
      path: imagePath,
      filename: filename
    });
  }
});

// ✅ CẬP NHẬT: Logging middleware để debug
app.use((req, res, next) => {
  if (req.path.startsWith('/uploads')) {
    console.log(`📁 Static file request: ${req.method} ${req.path}`);
    console.log(`📁 Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    
    // Kiểm tra file có tồn tại không
    const filePath = path.join(__dirname, req.path);
    console.log(`📁 File path: ${filePath}`);
    console.log(`📁 File exists: ${fs.existsSync(filePath)}`);
  }
  next();
});

// Existing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route upload
app.use('/upload', uploadRouter);

// Các route chính
route(app);

// ✅ CẬP NHẬT: Route test với thông tin chi tiết hơn
app.get('/test', (req, res) => {
  const uploadsPath = path.join(__dirname, 'uploads');
  const booksPath = path.join(__dirname, 'uploads', 'books');
  
  let bookFiles = [];
  if (fs.existsSync(booksPath)) {
    bookFiles = fs.readdirSync(booksPath);
  }
  
  res.json({
    success: true,
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    paths: {
      uploads: uploadsPath,
      books: booksPath,
      uploadsExists: fs.existsSync(uploadsPath),
      booksExists: fs.existsSync(booksPath),
      bookFiles: bookFiles
    },
    staticUrls: {
      uploads: `${req.protocol}://${req.get('host')}/uploads`,
      books: `${req.protocol}://${req.get('host')}/uploads/books`
    }
  });
});

// ✅ THÊM: Route để list tất cả files trong uploads/books
app.get('/list-images', (req, res) => {
  const booksPath = path.join(__dirname, 'uploads', 'books');
  
  if (!fs.existsSync(booksPath)) {
    return res.json({
      success: false,
      message: 'Books directory does not exist',
      path: booksPath
    });
  }
  
  const files = fs.readdirSync(booksPath);
  const fileInfos = files.map(file => {
    const filePath = path.join(booksPath, file);
    const stats = fs.statSync(filePath);
    return {
      name: file,
      size: stats.size,
      created: stats.birthtime,
      url: `${req.protocol}://${req.get('host')}/uploads/books/${file}`
    };
  });
  
  res.json({
    success: true,
    directory: booksPath,
    files: fileInfos,
    count: files.length
  });
});

// Xử lý lỗi 404
app.use((req, res, next) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  return next(new ApiError(404, `Route not found: ${req.method} ${req.path}`));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Global error:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    statusCode: err.statusCode
  });

  // Xử lý lỗi file quá lớn
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File ảnh quá lớn (tối đa 5MB)'
    });
  }

  // Xử lý lỗi định dạng file không đúng
  if (err.message && err.message.includes('Chỉ chấp nhận file ảnh')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Xử lý lỗi ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Xử lý lỗi chung
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
  console.log(`📁 Static files served from: ${path.join(__dirname, 'uploads')}`);
  console.log(`📁 Books images served from: ${path.join(__dirname, 'uploads', 'books')}`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`🔗 List images: http://localhost:${PORT}/list-images`);
  console.log(`🔗 Test image: http://localhost:${PORT}/test-image/[filename]`);
});
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
// CORS config
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Ensure uploads/books directory exists
const uploadsDir = path.join(__dirname, 'uploads');
const booksDir = path.join(uploadsDir, 'books');
if (!fs.existsSync(booksDir)) fs.mkdirSync(booksDir, { recursive: true });

// Serve static files
app.use('/uploads', express.static(uploadsDir));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/upload', uploadRouter);
route(app);
// 404 handler
app.use((req, res, next) => {
  return next(new ApiError(404, `Route not found: ${req.method} ${req.path}`));
});
// Global error handler
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File ảnh quá lớn (tối đa 5MB)' });
  }

  if (err.message?.includes('Chỉ chấp nhận file ảnh')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

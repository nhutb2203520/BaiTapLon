const express = require("express");
const cors = require("cors");
const app = express();
const ApiError = require("./src/ApiError");
const database = require("./src/config/KetNoiMongoDB");

const route = require('./src/routes/index');
const uploadRouter = require('./src/routes/Upload.route'); // Sửa đường dẫn đúng

require("dotenv").config();
database.connect();

app.use(cors());
app.use(express.json());

// Route upload
app.use('/upload', uploadRouter);

// Các route chính
route(app);

// Xử lý lỗi 404
app.use((req, res, next) => {
  return next(new ApiError(400, "Resource not found"));
});

// Xử lý lỗi toàn cục
app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});

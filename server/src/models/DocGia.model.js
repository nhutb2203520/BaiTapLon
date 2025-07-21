const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    HoLot: { type: String, required: true },
    Ten: { type: String, required: true },
    NgaySinh: { type: Date, required: true, default: Date.now() },
    GioiTinh: { type: String, required: true },
    DiaChi: { type: String, required: true },
    SoDienThoai: { type: String, required: true },
    MatKhau: { type: String, required: true },
    //them vao thuoc tinh MatKhau
  },
  { collection: 'users' }
);

module.exports = mongoose.model?.userSchema || mongoose.model("userSchema", userSchema);

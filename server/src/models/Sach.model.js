const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const bookSchema = new mongoose.Schema(
  {
    MaSach: Number,
    TenSach: { type: String, required: true },
    DonGia: { type: String, required: true },
    SoQuyen: { type: Number, required: true },
    NamXuatBan: { type: Number, required: true },
    TacGia: { type: String },
    // ✅ SỬA: Đổi ref từ "publisherSchema" thành "NhaXuatBan"
    MaNXB: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "NhaXuatBan", // ✅ Phải trùng với tên trong NhaXuatBan.model
      required: true
    },
    image: { type: String },
    SoLuongDaMuon: { type: Number, required: true, default: 0 }
  },
  { timestamps: true, minimize: false, collection: 'Sach' }
);

bookSchema.plugin(AutoIncrement, { inc_field: "MaSach", start_seq: 1000 });

module.exports = mongoose.models?.bookSchema || mongoose.model('bookSchema', bookSchema);
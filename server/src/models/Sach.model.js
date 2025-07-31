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
    MaNXB: {
      type: Number,
      ref: "NhaXuatBan",
      required: true
    },
    // ✅ THÊM: Field image với validation
    image: { 
      type: String,
      default: null // Mặc định null nếu không có ảnh
    },
    SoLuongDaMuon: { type: Number, required: true, default: 0 }
  },
  { timestamps: true, minimize: false, collection: 'Sach' }
);

bookSchema.plugin(AutoIncrement, { inc_field: "MaSach", start_seq: 1000 });

module.exports = mongoose.models?.bookSchema || mongoose.model('bookSchema', bookSchema);
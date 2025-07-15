const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const publisherSchema = new mongoose.Schema(
  {
    MaNXB: Number,
    TenNXB: { type: String, require: true },
    DiaChi: { type: String, require: true },
  },
  { timestamps: true,
    minimize: false,
    collection:'NhaXuatBan' 
  }
);

publisherSchema.plugin(AutoIncrement, { inc_field: "MaNXB", start_seq: 1000 });

module.exports = mongoose.model("publisherSchema", publisherSchema);
  const mongoose = require("mongoose");
  const AutoIncrement = require("mongoose-sequence")(mongoose);

  const publisherSchema = new mongoose.Schema(
    {
      MaNXB: Number,
      TenNXB: { type: String, required: true },
      DiaChi: { type: String, required: true },
    },
    { timestamps: true,
      minimize: false,
      collection:'NhaXuatBan' 
    }
  );

  publisherSchema.plugin(AutoIncrement, { inc_field: "MaNXB", start_seq: 1 });

 module.exports = mongoose.model("NhaXuatBan", publisherSchema); // ✅


import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    batchId: {
      type: String,
    },
    expiry: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      required: true,
      default: 0,
    },
    mrp: {
      type: Number,
      required: true,
      default: 0,
    },
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
    }
  },
  { timestamps: true }
);

const Stock = mongoose.models.Stock || mongoose.model('Stock', stockSchema);

export default Stock;

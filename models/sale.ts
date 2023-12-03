import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    invoiceNumber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
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
    quantity: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Sale = mongoose.models.Sale || mongoose.model('Sale', saleSchema);

export default Sale;

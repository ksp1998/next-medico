import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: Number,
      unique: true,
      required: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["due", "paid"],
      default: "due",
    }
  },
  { timestamps: true }
);

const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', purchaseSchema);

export default Purchase;

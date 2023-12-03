import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Supplier = mongoose.models.Supplier || mongoose.model( 'Supplier', supplierSchema );

export default Supplier;

import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
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
    },
    number: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    doctorAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default Customer;

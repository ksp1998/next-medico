import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Option = mongoose.models.Option || mongoose.model( 'Option', optionSchema );

export default Option;

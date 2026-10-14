import mongoose, { Document, Schema } from "mongoose";

export interface ISupplier extends Document {
  supplierNo: string;
  supplierName: string;
  address?: string;
  taxNo?: string;
  country: string;
  mobileNo: string;
  email: string;
  status: "Active" | "Inactive" | "Blocked";
}

const supplierSchema = new Schema<ISupplier>(
  {
    supplierNo: { type: String, unique: true },
    supplierName: { type: String, required: true },
    address: { type: String },
    taxNo: { type: String },
    country: { type: String, required: true },
    mobileNo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Blocked"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

supplierSchema.pre("save", async function (next) {
  if (!this.supplierNo) {
    const lastSupplier = await mongoose
      .model<ISupplier>("Supplier")
      .findOne({})
      .sort({ supplierNo: -1 });

    const lastNumber = lastSupplier
      ? parseInt(lastSupplier.supplierNo.replace("SUP-", ""), 10)
      : 0;

    this.supplierNo = `SUP-${String(lastNumber + 1).padStart(3, "0")}`;
  }
  next();
});

export const Supplier = mongoose.model<ISupplier>("Supplier", supplierSchema);

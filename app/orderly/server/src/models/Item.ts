import mongoose, { Document } from "mongoose";

export interface IItem extends Document {
  itemNo: string;
  itemName: string;
  inventoryLocation?: string;
  brand?: string;
  category?: string;
  supplier: mongoose.Schema.Types.ObjectId;
  stockUnit?: string;
  unitPrice: number;
  itemImages?: string[];
  status?: "Enabled" | "Disabled";
  createdAt?: Date;
  updatedAt?: Date;
}

const itemSchema = new mongoose.Schema(
  {
    itemNo: { type: String, unique: true },
    itemName: { type: String, required: true },
    inventoryLocation: String,
    brand: String,
    category: String,
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    stockUnit: String,
    unitPrice: { type: Number, required: true },
    itemImages: [String],
    status: { type: String, enum: ["Enabled", "Disabled"], default: "Enabled" },
  },
  {
    timestamps: true,
  }
);

itemSchema.pre("save", async function (next) {
  if (!this.itemNo) {
    const lastSupplier = await mongoose
      .model<IItem>("Item")
      .findOne({})
      .sort({ itemNo: -1 });

    const lastNumber = lastSupplier
      ? parseInt(lastSupplier.itemNo.replace("ITM-", ""), 10)
      : 0;

    this.itemNo = `ITM-${String(lastNumber + 1).padStart(3, "0")}`;
  }
  next();
});

export const Item = mongoose.model<IItem>("Item", itemSchema);

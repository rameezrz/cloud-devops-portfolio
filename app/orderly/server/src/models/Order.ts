import mongoose, { Document, Schema, Types } from "mongoose";

interface ISupplier {
  _id: Types.ObjectId;
  supplierName: string;
}

export interface IOrderItem {
  item: Types.ObjectId;
  orderQty: number;
  discount?: number;
  itemAmount: number;
  netAmount: number;
}

export interface IOrder extends Document {
  orderNo: string;
  orderDate: Date;
  supplier: Types.ObjectId | ISupplier;
  items: IOrderItem[];
  itemTotal: number;
  discountTotal: number;
  netAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNo: { type: String, unique: true },
    orderDate: { type: Date },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    items: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        orderQty: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        itemAmount: { type: Number, required: true },
        netAmount: { type: Number, required: true },
      },
    ],
    itemTotal: { type: Number, required: true },
    discountTotal: { type: Number, required: true },
    netAmount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", async function (next) {
  if (!this.orderNo) {
    const lastOrder = await mongoose
      .model<IOrder>("Order")
      .findOne({})
      .sort({ orderNo: -1 });

    const lastNumber = lastOrder
      ? parseInt(lastOrder.orderNo.replace("ORD-", ""), 10)
      : 0;

    this.orderNo = `ORD-${String(lastNumber + 1).padStart(3, "0")}`;
  }
  next();
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);

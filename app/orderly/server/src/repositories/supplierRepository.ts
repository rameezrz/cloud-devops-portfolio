import { AppError } from "../utils";
import { Supplier, ISupplier } from "../models/Supplier";
import { validateObjectIdOrThrow } from "../validations";

class SupplierRepository {
  async createSupplier(data: Partial<ISupplier>): Promise<ISupplier> {
    const existingSupplier = await Supplier.findOne({ email: data.email });
    if (existingSupplier) {
      throw new AppError("A supplier with this email already exists.", 409);
    }

    const supplier = new Supplier(data);
    return await supplier.save();
  }

  async getSupplierById(id: string): Promise<ISupplier | null> {
    validateObjectIdOrThrow(id);

    const supplier = await Supplier.findById(id).exec();

    if (!supplier) {
      throw new AppError("No Supplier found with this id", 404);
    }
    return supplier;
  }

  async getSupplierCount(): Promise<number> {
    return await Supplier.countDocuments().exec();
  }

  async getAllSuppliers(
    page: number = 1,
    limit: number = 10
  ): Promise<ISupplier[]> {
    const skip = (page - 1) * limit;
    return await Supplier.find()
      .sort({ supplierNo: 1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getAllActiveSuppliersNames(): Promise<
    Pick<ISupplier, "supplierNo" | "supplierName" | "_id">[]
  > {
    return await Supplier.find(
      { status: "Active" },
      { supplierNo: 1, supplierName: 1, _id: 1 }
    )
      .sort({ supplierNo: 1 })
      .exec();
  }

  async updateSupplier(
    id: string,
    data: Partial<ISupplier>
  ): Promise<ISupplier | null> {
    validateObjectIdOrThrow(id);

    if (data.email) {
      const existingSupplier = await Supplier.findOne({
        email: data.email,
        _id: { $ne: id }, // Exclude the current supplier's ID
      });

      if (existingSupplier) {
        throw new AppError("A supplier with this email already exists.", 409);
      }
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();

    if (!updatedSupplier) {
      throw new AppError("No Supplier found with this id", 404);
    }

    return updatedSupplier;
  }

  async deleteSupplier(id: string): Promise<ISupplier | null> {
    validateObjectIdOrThrow(id);

    const deletedSupplier = await Supplier.findByIdAndDelete(id).exec();

    if (!deletedSupplier) {
      throw new AppError("No Supplier found with this id", 404);
    }

    return deletedSupplier;
  }
}

export default new SupplierRepository();

import { cloudinary } from "../config";
import { Item, IItem, Supplier } from "../models";
import { AppError } from "../utils";
import { validateObjectIdOrThrow } from "../validations";

class ItemRepository {
  async createItem(
    data: Partial<IItem>,
    files: Express.Multer.File[]
  ): Promise<IItem> {
    const existingItem = await Item.findOne({ itemName: data.itemName });

    if (existingItem) {
      throw new AppError("An item with this name already exists.", 409);
    }

    if (data.supplier) {
      const supplierExists = await Supplier.findById(data.supplier);
      if (!supplierExists) {
        throw new AppError("Invalid supplier ID provided.", 400);
      }
    }

    const item = new Item({
      ...data,
      itemImages: [],
    });

    const savedItem = await item.save();

    this.uploadImages(files, savedItem._id as string);
    return savedItem;
  }

  async getItemById(id: string): Promise<IItem | null> {
    validateObjectIdOrThrow(id);
    const item = await Item.findById(id).populate("supplier").exec();
    if (!item) {
      throw new AppError("No item found with this id", 404);
    }
    return item;
  }

  async getAllActiveItemNames(): Promise<
    Pick<IItem, "itemNo" | "itemName" | "unitPrice" | "stockUnit" | "_id">[]
  > {
    return await Item.find(
      { status: "Enabled" },
      { itemNo: 1, itemName: 1, unitPrice: 1, stockUnit: 1, _id: 1 }
    ).exec();
  }

  async getItemCount(): Promise<number> {
    return await Item.countDocuments().exec();
  }

  async getItems(page: number = 1, limit: number = 10): Promise<IItem[]> {
    const skip = (page - 1) * limit;
    return await Item.find().skip(skip).limit(limit).exec();
  }

  async updateItem(id: string, data: Partial<IItem>): Promise<IItem | null> {
    validateObjectIdOrThrow(id);

    if (data.supplier) {
      const supplierExists = await Supplier.findById(data.supplier);
      if (!supplierExists) {
        throw new AppError("Invalid supplier ID provided.", 400);
      }
    }

    const updatedItem = await Item.findByIdAndUpdate(id, data, { new: true });
    if (!updatedItem) {
      throw new AppError("No item found with this id", 404);
    }
    return updatedItem;
  }

  async deleteItem(id: string): Promise<void> {
    validateObjectIdOrThrow(id);
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      throw new AppError("No item found with this id", 404);
    }
  }

  private async uploadImages(files: Express.Multer.File[], itemId: string) {
    const imageUploadPromises = files.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error)
                reject(
                  new AppError("Failed to upload image to Cloudinary", 500)
                );
              else resolve(result?.secure_url ?? "");
            }
          );
          uploadStream.end(file.buffer);
        })
    );

    const imageUrls = await Promise.all(imageUploadPromises);

    await Item.findByIdAndUpdate(itemId, { itemImages: imageUrls });
  }
}

export default new ItemRepository();

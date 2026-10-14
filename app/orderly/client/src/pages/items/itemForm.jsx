import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addItemAPI,
  editItemAPI,
  fetchActiveSuppliersAPI,
  fetchItemById,
} from "@/api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Select } from "antd";
import ImgUpload from "@/widgets/imgUpload";
import { BackButton } from "@/widgets";

const itemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  inventoryLocation: z.string().min(1, "Inventory location is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  supplier: z.string().min(1, "Supplier ID is required"),
  stockUnit: z.string().min(1, "Stock unit is required"),
  unitPrice: z.number().positive("Unit price must be positive"),
  status: z.enum(["Enabled", "Disabled"]).optional(),
});

export function ItemForm({ mode = "create" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {},
  });

  const {
    data: itemData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["item", id],
    queryFn: () => fetchItemById(id),
    enabled: !!id && mode === "edit",
    refetchOnWindowFocus: false,
  });

  const { data: activeSuppliers } = useQuery({
    queryKey: ["activeSuppliers"],
    queryFn: () => fetchActiveSuppliersAPI(),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isSuccess && itemData) {
      reset({ ...itemData, supplier: itemData.supplier._id });
      setFileList(
        itemData?.itemImages?.map((image) => ({
          url: image,
        }))
      );
    }
  }, [isSuccess, itemData, reset]);

  const addMutation = useMutation({
    mutationFn: addItemAPI,
    onSuccess: () => {
      toast.success("Item created successfully");
      reset();
      navigate("/dashboard/items");
    },
    onError: () => {
      toast.error("There was a problem submitting your form");
      setIsSubmitting(false);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const editMutation = useMutation({
    mutationFn: editItemAPI,
    onSuccess: () => {
      reset();
      navigate("/dashboard/items");
      toast.success("Item updated successfully");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);

    if (mode === "edit") {
      editMutation.mutate({ id, data });
    } else {
      const payload = {
        ...data,
        itemImages: fileList?.map((file) => file.originFileObj),
      };
      addMutation.mutate(payload);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching Items</div>;

  console.log({ activeSuppliers, itemData });

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 flex justify-between items-center"
        >
          <Typography variant="h6" color="white">
            {mode === "edit" ? "Edit" : "Add"} Item
          </Typography>
          <BackButton />
        </CardHeader>
        <CardBody className="min-h-[630px] overflow-x-auto px-5 pt-8 pb-14">
          <div className="w-full bg-white flex items-center justify-center">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-lg bg-gray-100 p-8 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Item Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="itemName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Item Name
                  </label>
                  <input
                    id="itemName"
                    {...register("itemName")}
                    className="py-1 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                  />
                  {errors.itemName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.itemName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="inventoryLocation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Inventory Location
                  </label>
                  <input
                    id="inventoryLocation"
                    {...register("inventoryLocation")}
                    className="py-1 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                  />
                  {errors.inventoryLocation && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.inventoryLocation.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Brand
                  </label>
                  <input
                    id="brand"
                    {...register("brand")}
                    className="py-1 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                  />
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.brand.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <input
                    id="category"
                    {...register("category")}
                    className="py-1 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="supplier"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Supplier{" "}
                    {mode !== "edit" && (
                      <span className="text-gray-500 text-sm">
                        (Only active suppliers)
                      </span>
                    )}
                  </label>

                  <Select
                    showSearch
                    placeholder="Select Supplier"
                    optionFilterProp="label"
                    virtual
                    disabled={mode === "edit"}
                    {...register("supplier")}
                    onChange={(value) => {
                      reset((prev) => ({
                        ...prev,
                        supplier: value,
                      }));
                    }}
                    options={activeSuppliers?.map((supplier) => ({
                      label: (
                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "bold",
                              textTransform: "capitalize",
                            }}
                          >
                            {supplier?.supplierName + " - "}
                          </span>
                          <span style={{ color: "gray", marginLeft: "8px" }}>
                            {supplier?.supplierNo}
                          </span>
                        </div>
                      ),
                      value: supplier?._id,
                    }))}
                    defaultValue={itemData?.supplier?._id}
                    className="w-full"
                  />

                  {errors.supplier && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.supplier.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 items-start">
                  <div>
                    <label
                      htmlFor="stockUnit"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Stock Unit
                    </label>
                    <Select
                      id="stockUnit"
                      key={"stockUnit"}
                      showSearch
                      placeholder="Select"
                      optionFilterProp="label"
                      disabled={mode === "edit"}
                      virtual
                      {...register("stockUnit")}
                      onChange={(value) => {
                        reset((prev) => ({
                          ...prev,
                          stockUnit: value,
                        }));
                      }}
                      options={[
                        { label: "Pcs", value: "pcs" },
                        { label: "Kg", value: "kg" },
                        { label: "gm", value: "gm" },
                        { label: "Liters", value: "liters" },
                      ]}
                      defaultValue={itemData?.stockUnit}
                      className="w-full mt-1"
                    />
                    {errors.stockUnit && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.stockUnit.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="unitPrice"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Unit Price
                    </label>
                    <input
                      id="unitPrice"
                      type="number"
                      step="any"
                      defaultValue={1}
                      {...register("unitPrice", { valueAsNumber: true })}
                      className="py-1 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                    />
                    {errors.unitPrice && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.unitPrice.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="images"
                    className="block text-sm font-medium text-gray-700 mb-4"
                  >
                    Images{" "}
                    {mode === "edit" && (
                      <span className="text-gray-500 text-sm">
                        (can't be changed)
                      </span>
                    )}
                  </label>
                  <ImgUpload
                    fileList={fileList}
                    setFileList={setFileList}
                    showRemoveIcon={mode !== "edit"}
                  />
                </div>

                {mode === "edit" && (
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <Select
                      id="status"
                      key={itemData?.status}
                      showSearch
                      placeholder="Select"
                      optionFilterProp="label"
                      virtual
                      {...register("status")}
                      onChange={(value) => {
                        reset((prev) => ({
                          ...prev,
                          status: value,
                        }));
                      }}
                      options={[
                        { label: "Enabled", value: "Enabled" },
                        { label: "Disabled", value: "Disabled" },
                      ]}
                      defaultValue={itemData?.status}
                      className="w-full"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
              >
                {mode === "edit"
                  ? isSubmitting
                    ? "Updating..."
                    : "Update"
                  : isSubmitting
                  ? "Creating..."
                  : "Create"}
              </button>
            </form>
            <ToastContainer />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ItemForm;

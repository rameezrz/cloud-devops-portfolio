import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import {
  addOrderAPI,
  fetchActiveItemsAPI,
  fetchActiveSuppliersAPI,
} from "@/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/widgets";

const itemSchema = z.object({
  item: z.string().min(1, "Item No is required"),
  itemName: z.string().min(1, "Item Name is required"),
  stockUnit: z.string().min(1, "Stock Unit is required"),
  unitPrice: z.number().positive("Unit Price must be positive"),
  orderQty: z.number().positive("Order Quantity must be positive"),
  discount: z.number().min(0, "Discount cannot be negative"),
});

const purchaseOrderSchema = z.object({
  orderDate: z.date(),
  supplier: z.string().min(1, "Supplier is required"),
  items: z.array(itemSchema).min(1, "At least one item is required"),
});

export function OrderForm() {
  const [itemTotal, setItemTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      orderDate: new Date(),
      items: [{ orderQty: 1, discount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");

  const watchOrderQty = watch("items").map((item) => item.orderQty);
  const watchUnitPrice = watch("items").map((item) => item.unitPrice);
  const watchDiscount = watch("items").map((item) => item.discount);

  useEffect(() => {
    const newItemTotal = watchItems.reduce(
      (sum, item) => sum + (item.orderQty * item.unitPrice || 0),
      0
    );
    const newTotalDiscount = watchItems.reduce(
      (sum, item) => sum + (item.discount || 0),
      0
    );
    setItemTotal(newItemTotal);
    setTotalDiscount(newTotalDiscount);
    setNetAmount(newItemTotal - newTotalDiscount);
  }, [watchOrderQty, watchUnitPrice, watchDiscount]);

  const { data: suppliers = [] } = useQuery({
    queryKey: ["activeSuppliers"],
    queryFn: fetchActiveSuppliersAPI,
    refetchOnWindowFocus: false,
  });

  const { data: items } = useQuery({
    queryKey: ["activeItems"],
    queryFn: fetchActiveItemsAPI,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: addOrderAPI,
    onSuccess: () => {
      reset();
      navigate("/dashboard/orders");
      toast.success("Order created successfully");
    },
    onError: () => {
      toast.error("There was a problem submitting your form");
    },
  });

  const onSubmit = (data) => {
    const payload = {
      orderDate: dayjs(data.orderDate).format("YYYY-MM-DD"),
      supplier: data.supplier,
      items: data.items.map((item, index) => ({
        item: item.item,
        orderQty: item.orderQty,
        discount: item.discount,
      })),
    };
    mutation.mutate(payload);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 flex justify-between items-center"
        >
          <Typography variant="h6" color="white">
            Create Purchase Order
          </Typography>
          <BackButton />
        </CardHeader>
        <CardBody className="overflow-x-auto px-5 pt-8 pb-14">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full px-12 mx-auto"
          >
            <div className="grid grid-cols-1 md:max-w-3xl md:grid-cols-2 gap-y-6 gap-x-12 mb-6">
              <div>
                <label
                  htmlFor="orderDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Order Date
                </label>
                <Controller
                  name="orderDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      className="w-full h-[40px]"
                      format="YYYY-MM-DD"
                      value={dayjs(field.value)}
                      onChange={(date) => field.onChange(date?.toDate())}
                    />
                  )}
                />
                {errors.orderDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.orderDate.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="supplier"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Supplier Name
                </label>
                <Controller
                  name="supplier"
                  control={control}
                  render={({ field }) => (
                    <Select
                      showSearch
                      {...field}
                      className="w-full h-[40px]"
                      placeholder="Select Supplier"
                      options={suppliers?.map((supplier) => ({
                        value: supplier._id,
                        label: supplier.supplierName,
                      }))}
                    />
                  )}
                />
                {errors.supplierName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.supplierName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <Typography variant="h4" color="blue-gray" className="mb-3">
                Items
              </Typography>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 xl:grid-cols-10 -mx-3 mb-6"
                >
                  <div className="w-full px-3 mb-6 xl:mb-0 xl:col-span-2 h-full">
                    <label
                      htmlFor="item"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Item
                    </label>
                    <Controller
                      name={`items.${index}.item`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="w-full mb-2 h-[42px]"
                          placeholder="Select Item"
                          options={items?.map((item) => ({
                            value: item._id,
                            label: `${item.itemNo} - ${item.itemName}`,
                          }))}
                          onChange={(value) => {
                            const selectedItem = items.find(
                              (item) => item._id === value
                            );
                            setValue(
                              `items.${index}.itemName`,
                              selectedItem.itemName
                            );
                            setValue(
                              `items.${index}.stockUnit`,
                              selectedItem.stockUnit
                            );
                            setValue(
                              `items.${index}.unitPrice`,
                              selectedItem.unitPrice
                            );
                            field.onChange(value);
                          }}
                        />
                      )}
                    />
                    {errors.items?.[index]?.item && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.items[index]?.itemNo?.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full px-3 mb-6 xl:mb-0 xl:col-span-3">
                    <label
                      htmlFor="itemName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Item Name
                    </label>
                    <input
                      {...register(`items.${index}.itemName`)}
                      placeholder="Item Name"
                      className="w-full p-2 border rounded"
                      readOnly
                    />
                  </div>
                  <div className="w-full px-3 mb-6 xl:mb-0 xl:col-span-1">
                    <label
                      htmlFor="StockUnit"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Stock Unit
                    </label>
                    <input
                      {...register(`items.${index}.stockUnit`)}
                      placeholder="Stock Unit"
                      className="w-full p-2 border rounded"
                      readOnly
                    />
                  </div>
                  <div className="w-full px-3 mb-6 xl:mb-0 xl:col-span-1">
                    <label
                      htmlFor="unitPrice"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Unit Price
                    </label>
                    <input
                      {...register(`items.${index}.unitPrice`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Unit Price"
                      type="number"
                      className="w-full p-2 border rounded"
                      readOnly
                    />
                  </div>

                  <div className="w-full px-3 mb-6 xl:mb-0 xl:col-span-1">
                    <label
                      htmlFor="orderQty"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Order Quantity
                    </label>
                    <input
                      {...register(`items.${index}.orderQty`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Order Quantity"
                      type="number"
                      className="w-full p-2 border rounded"
                    />
                    {errors.items?.[index]?.orderQty && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.items[index].orderQty.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full px-3 mb-6 xl:mb-0 xl:col-span-1">
                    <label
                      htmlFor="discount"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Discount
                    </label>
                    <input
                      {...register(`items.${index}.discount`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Discount"
                      type="number"
                      step="any"
                      className="w-full p-2 border rounded"
                    />
                    {errors.items?.[index]?.discount && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.items[index].discount.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full px-3 mb-6 xl:mb-0 xl:col-span-1">
                    <label
                      htmlFor="remove"
                      className="block text-sm font-medium text-white mb-1"
                    >
                      remove
                    </label>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-500 text-white p-2 px-6 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ orderQty: 1, discount: 0 })}
                className="bg-blue-gray-900 text-white p-2 px-6 rounded mt-6"
              >
                Add Item
              </button>
            </div>

            <hr />

            <div className="my-6">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Order Summary
              </Typography>
              <div className="flex justify-between mb-2">
                <span>Item Total:</span>
                <span>
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(itemTotal)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Total Discount:</span>
                <span>
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalDiscount)}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Net Amount:</span>
                <span>
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(netAmount)}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-gray-900 text-white p-2 px-6 rounded"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "Submitting..." : "Create Purchase Order"}
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

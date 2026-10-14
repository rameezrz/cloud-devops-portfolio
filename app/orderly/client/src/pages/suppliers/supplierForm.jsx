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
import { addSupplierAPI, editSupplierAPI, fetchSupplierById } from "@/api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import countries from "@/lib/data/countries.json";
import { Select } from "antd";
import { BackButton } from "@/widgets";

const supplierSchema = z.object({
  supplierName: z.string().min(1, "Supplier name is required"),
  address: z.string().min(1, "Address is required"),
  taxNo: z.string().min(1, "Tax number is required"),
  country: z.string().min(1, "Country is required"),
  mobileNo: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
  email: z.string().email("Invalid email address"),
  status: z.enum(["Active", "Inactive", "Blocked"]).optional(),
});

export function SupplierForm({ mode = "create" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: {},
  });

  const {
    data: supplierData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["supplier", id],
    queryFn: () => fetchSupplierById(id),
    enabled: !!id && mode === "edit",
  });

  useEffect(() => {
    if (isSuccess && supplierData) {
      reset(supplierData);
    }
  }, [isSuccess, supplierData, reset]);

  const addMutation = useMutation({
    mutationFn: addSupplierAPI,
    onSuccess: () => {
      toast.success("Supplier created successfully");
      reset();
      navigate("/dashboard/suppliers");
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
    mutationFn: editSupplierAPI,
    onSuccess: () => {
      reset();
      navigate("/dashboard/suppliers");
      toast.success("Supplier updated successfully");
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
      addMutation.mutate(data);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching supplier</div>;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 flex justify-between items-center"
        >
          <Typography variant="h6" color="white">
            {mode === "edit" ? "Edit" : "Add"} Supplier
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
                Supplier Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="supplierName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Supplier Name
                  </label>
                  <input
                    id="supplierName"
                    {...register("supplierName")}
                    className="py-1 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                  />
                  {errors.supplierName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.supplierName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    {...register("address")}
                    className="py-1 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="taxNo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tax Number
                  </label>
                  <input
                    id="taxNo"
                    {...register("taxNo")}
                    className="py-1 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                  />
                  {errors.taxNo && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.taxNo.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>

                  <Select
                    showSearch
                    placeholder="Select"
                    optionFilterProp="label"
                    virtual
                    {...register("country")}
                    onChange={(value) => {
                      reset((prev) => ({
                        ...prev,
                        country: value,
                      }));
                    }}
                    options={countries.map((country) => ({
                      label: country.name,
                      value: country.name,
                    }))}
                    defaultValue={supplierData?.country}
                    className="w-full"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="mobileNo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mobile Number
                  </label>
                  <input
                    id="mobileNo"
                    {...register("mobileNo")}
                    className="py-1 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                  />
                  {errors.mobileNo && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.mobileNo.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="py-1 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
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
                      key={supplierData?.status}
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
                        { label: "Active", value: "Active" },
                        { label: "Inactive", value: "Inactive" },
                        { label: "Blocked", value: "Blocked" },
                      ]}
                      defaultValue={supplierData?.status}
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

export default SupplierForm;

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
} from "@material-tailwind/react";
import { Carousel, Tooltip } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchItemById } from "@/api";
import { BackButton } from "@/widgets";
import { EditOutlined } from "@ant-design/icons";

export function ViewSingleItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: itemData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["item", id],
    queryFn: () => fetchItemById(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Item Details
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-auto px-5 pt-8 pb-14">
            <div className="w-full bg-white flex items-center justify-center">
              <div className="w-full px-12 bg-gray-100 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Loading...
                </h2>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Item Details
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-auto px-5 pt-8 pb-14">
            <div className="w-full bg-white flex items-center justify-center">
              <div className="w-full px-12 bg-gray-100 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Error fetching item
                </h2>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const handleItemEdit = () => {
    navigate(`/dashboard/edit-item/${itemData._id}`);
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
            Item Details
          </Typography>
          <BackButton />
        </CardHeader>
        <CardBody className="overflow-x-auto px-5 pt-8 pb-14">
          <div className="w-full bg-white flex items-center justify-center">
            <div className="w-full px-12 bg-gray-100 p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-6 gap-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  {itemData.itemName}
                </h2>
                <button onClick={handleItemEdit}>
                  <Tooltip title="Edit Item">
                    <EditOutlined className="text-blue-600" />
                  </Tooltip>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                <div>
                  <div className="mb-5">
                    {itemData.itemImages && itemData.itemImages.length > 0 ? (
                      <div>
                        <Carousel
                          autoplay
                          arrows
                          className="bg-gray-300 rounded-2xl"
                        >
                          {itemData.itemImages.map((image, index) => (
                            <div key={index}>
                              <img
                                src={image}
                                alt={`Item image ${index + 1}`}
                                className="w-full h-64 object-contain rounded-md"
                              />
                            </div>
                          ))}
                        </Carousel>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-gray-200 rounded-md">
                        <p className="text-gray-500">No images available</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <DetailRow
                      label="Inventory Location"
                      value={itemData.inventoryLocation}
                    />
                    <DetailRow label="Brand" value={itemData.brand} />
                    <DetailRow label="Category" value={itemData.category} />
                    <DetailRow label="Stock Unit" value={itemData.stockUnit} />
                    <DetailRow
                      label="Unit Price"
                      value={new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(itemData.unitPrice)}
                    />
                    <DetailRow label="Status" value={itemData.status} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      Supplier Details
                    </h3>
                    <DetailRow
                      label="Supplier Name"
                      value={itemData?.supplier?.supplierName}
                    />
                    <DetailRow
                      label="Supplier No"
                      value={itemData?.supplier?.supplierNo}
                    />
                    <DetailRow
                      label="Address"
                      value={itemData?.supplier?.address}
                    />
                    <DetailRow
                      label="Tax No"
                      value={itemData?.supplier?.taxNo}
                    />
                    <DetailRow
                      label="Country"
                      value={itemData?.supplier?.country}
                    />
                    <DetailRow
                      label="Mobile No"
                      value={itemData?.supplier?.mobileNo}
                    />
                    <DetailRow
                      label="Email"
                      value={itemData?.supplier?.email}
                    />
                    <DetailRow
                      label="Status"
                      value={itemData?.supplier?.status}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function DetailRow({ label, value }) {
  if (label === "Status") {
    return (
      <div className="flex justify-between border-b border-gray-200 py-2">
        <span className="font-medium text-gray-600">{label}:</span>
        <Chip
          variant="gradient"
          color={
            value === "Enabled" || value === "Active" ? "green" : "blue-gray"
          }
          value={value}
          className="py-0.5 px-2 text-[11px] font-medium w-fit"
        />
      </div>
    );
  }
  return (
    <div className="flex justify-between border-b border-gray-200 py-2">
      <span className="font-medium text-gray-600">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

export default ViewSingleItem;

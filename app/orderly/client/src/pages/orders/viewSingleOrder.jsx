import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderByIdAPI } from "@/api";
import { BackButton, OrderPDFTemplate } from "@/widgets";
import { PDFDownloadLink } from "@react-pdf/renderer";

export function ViewSingleOrder() {
  const { id } = useParams();

  const {
    data: orderData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderByIdAPI(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
  const handlePrint = () => {
    const pdfBlob = new Blob([<OrderPDFTemplate orderData={orderData} />], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(url);
    printWindow.onload = () => {
      printWindow.print();
      URL.revokeObjectURL(url); // Clean up
    };
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching Orders</div>;
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6 flex justify-between items-center"
        >
          <Typography variant="h6" color="white">
            Purchase Order Details
          </Typography>
          <BackButton />
        </CardHeader>
        <CardBody className="overflow-x-auto px-14 pt-8 pb-14">
          <div className="w-full min-w-[800px] mx-auto bg-white p-8 rounded-lg">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Purchase Order</h1>
              <button
                // onClick={handlePrint}
                className="bg-blue-gray-900 text-white p-2 px-6 rounded print:hidden"
              >
                <PDFDownloadLink
                  document={<OrderPDFTemplate orderData={orderData} />}
                  fileName={`orderly_invoice_${orderData?.orderNo}.pdf`}
                >
                  {({ blob, url, loading, error }) =>
                    loading ? "Loading document..." : "Download PDF"
                  }
                </PDFDownloadLink>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p>
                  <strong>Order No:</strong> {orderData?.orderNo}
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {dayjs(orderData?.orderDate).format("MMMM D, YYYY")}
                </p>
              </div>
              <div>
                <p>
                  <strong>Supplier:</strong> {orderData?.supplier.supplierName}
                </p>
                <p>
                  <strong>Supplier No:</strong> {orderData?.supplier.supplierNo}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Supplier Details</h2>
              <p>{orderData?.supplier.address}</p>
              <p>{orderData?.supplier.country}</p>
              <p>Tax No: {orderData?.supplier.taxNo}</p>
              <p>Mobile: {orderData?.supplier.mobileNo}</p>
              <p>Email: {orderData?.supplier.email}</p>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-right">Unit Price</th>
                  <th className="p-2 text-right">Discount</th>
                  <th className="p-2 text-right">Net Amount</th>
                </tr>
              </thead>
              <tbody>
                {orderData?.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <div className="flex items-center">
                        {item.item.itemImages &&
                          item.item.itemImages.length > 0 && (
                            <img
                              src={item.item.itemImages[0]}
                              alt={item.item.itemName}
                              className="w-12 h-12 object-cover mr-2"
                            />
                          )}
                        <div>
                          <p>{item.item.itemName}</p>
                          <p className="text-sm text-gray-500">
                            {item.item.itemNo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      {item.orderQty} {item.item.stockUnit}
                    </td>
                    <td className="p-2 text-right">
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.item.unitPrice)}
                    </td>
                    <td className="p-2 text-right">
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.discount)}
                    </td>
                    <td className="p-2 text-right">
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(item.netAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-1/2">
                <div className="flex justify-between mb-2">
                  <span>Item Total:</span>
                  <span>
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(orderData?.itemTotal)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Discount Total:</span>
                  <span>
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(orderData?.discountTotal)}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Net Amount:</span>
                  <span>
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(orderData?.netAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ViewSingleOrder;

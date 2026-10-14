import React, { useState } from "react";
import { Dropdown, Menu, Pagination, Table } from "antd";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
} from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { exportToExcel, fetchItemsAPI, fetchOrdersAPI } from "@/api";
import { useNavigate } from "react-router-dom";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

const OrdersTable = ({ data, isLoading }) => {
  const navigate = useNavigate();
  const handleMenuClick = (e, rowId) => {
    switch (e.key) {
      case "1":
        navigate(`/dashboard/order/${rowId}`);
        break;
      case "2":
        navigate(`/dashboard/item/${rowId}`);
        break;
    }
  };

  const actions = [
    {
      key: "1",
      label: "View Details",
    },
  ];

  const columns = [
    {
      title: "Order No",
      dataIndex: "orderNo",
      render: (text, record) => (
        <span
          onClick={() => navigate(`/dashboard/order/${record._id}`)}
          className="cursor-pointer text-blue-600 hover:underline"
        >
          {text}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
      render: (text) => {
        const date = new Date(text);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Supplier Name",
      dataIndex: "supplier",
      sorter: (a, b) =>
        a.supplier?.supplierName.localeCompare(b.supplier?.supplierName),
      render: (supplier) => supplier?.supplierName || "-",
    },
    {
      title: "Item Total",
      dataIndex: "itemTotal",
      sorter: (a, b) => a.itemTotal - b.itemTotal,
      render: (value) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value),
    },
    {
      title: "Discount Total",
      dataIndex: "discountTotal",
      sorter: (a, b) => a.discountTotal - b.discountTotal,
      render: (value) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value),
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      sorter: (a, b) => a.netAmount - b.netAmount,
      render: (value) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value),
    },
    {
      title: "Action",
      key: "operation",
      render: (text, record) => {
        const menu = (
          <Menu onClick={(e) => handleMenuClick(e, record._id)}>
            {actions.map((action) => (
              <Menu.Item key={action.key}>{action.label}</Menu.Item>
            ))}
          </Menu>
        );

        return (
          <Dropdown overlay={menu}>
            <a>
              <EllipsisHorizontalIcon className="h-6 w-6" />
            </a>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={isLoading}
      rowKey="_id"
      pagination={false}
      className="w-full"
    />
  );
};

export function ViewOrders() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", currentPage],
    queryFn: () => fetchOrdersAPI({ page: currentPage, limit: 10 }),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  if (isError) {
    return <div>Error fetching suppliers</div>;
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
            All Orders
          </Typography>
          <div>
            <button
              className="px-4 py-2 bg-gray-100 font-bold text-black rounded-md shadow hover:bg-gray-600 hover:text-white transition"
              onClick={exportToExcel}
            >
              Download Excel
            </button>
          </div>
        </CardHeader>
        <CardBody className="min-h-[630px] overflow-x-auto px-5 pt-0 pb-2 flex flex-col gap-8 items-center">
          <OrdersTable data={data?.orders} isLoading={isLoading} />
          <Pagination
            current={currentPage}
            pageSize={10}
            total={data?.totalOrders || 0}
            onChange={onPageChange}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default ViewOrders;

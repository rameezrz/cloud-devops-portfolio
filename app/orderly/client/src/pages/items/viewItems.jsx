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
import { fetchItemsAPI } from "@/api";
import { useNavigate } from "react-router-dom";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

const ItemsTable = ({ data, isLoading }) => {
  const navigate = useNavigate();
  const handleMenuClick = (e, rowId) => {
    switch (e.key) {
      case "1":
        navigate(`/dashboard/edit-item/${rowId}`);
        break;
      case "2":
        navigate(`/dashboard/item/${rowId}`);
        break;
    }
  };

  const actions = [
    {
      key: "1",
      label: "Edit",
    },
    {
      key: "2",
      label: "View Details",
    },
  ];

  const columns = [
    {
      title: "Item No",
      dataIndex: "itemNo",
    },
    {
      title: "Name",
      dataIndex: "itemName",
      sorter: (a, b) => a.itemName.length - b.itemName.length,
      render: (text, record) => (
        <span
          onClick={() => navigate(`/dashboard/item/${record._id}`)}
          className="cursor-pointer text-blue-600 hover:underline"
        >
          {text}
        </span>
      ),
    },
    {
      title: "Location",
      dataIndex: "inventoryLocation",
      sorter: (a, b) => a.inventoryLocation.length - b.inventoryLocation.length,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      sorter: (a, b) => a.brand.length - b.brand.length,
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.length - b.category.length,
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      sorter: (a, b) => a.unitPrice - b.unitPrice,
      render: (value) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.length - b.status.length,
      render: (status) => {
        return (
          <Chip
            variant="gradient"
            color={status === "Enabled" ? "green" : "blue-gray"}
            value={status}
            className="py-0.5 px-2 text-[11px] font-medium w-fit"
          />
        );
      },
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

export function ViewItems() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["items", currentPage],
    queryFn: () => fetchItemsAPI({ page: currentPage, limit: 10 }),
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
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            All Items
          </Typography>
        </CardHeader>
        <CardBody className="min-h-[630px] overflow-x-auto px-5 pt-0 pb-2 flex flex-col gap-8 items-center">
          <ItemsTable data={data?.items} isLoading={isLoading} />
          <Pagination
            current={currentPage}
            pageSize={10}
            total={data?.totalItems || 0}
            onChange={onPageChange}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default ViewItems;

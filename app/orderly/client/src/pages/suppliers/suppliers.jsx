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
import { fetchSuppliers } from "@/api";
import { useNavigate } from "react-router-dom";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

const SuppliersTable = ({ data, isLoading }) => {
  const navigate = useNavigate();
  const handleMenuClick = (e, rowId) => {
    navigate(`/dashboard/edit-supplier/${rowId}`);
  };

  const actions = [
    {
      key: "1",
      label: "Edit",
    },
  ];

  const columns = [
    {
      title: "Supplier No",
      dataIndex: "supplierNo",
    },
    {
      title: "Name",
      dataIndex: "supplierName",
      sorter: (a, b) => a.supplierName.length - b.supplierName.length,
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: "Tax No",
      dataIndex: "taxNo",
      sorter: (a, b) => a.taxNo.length - b.taxNo.length,
    },
    {
      title: "Country",
      dataIndex: "country",
      sorter: (a, b) => a.country.length - b.country.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Mobile",
      dataIndex: "mobileNo",
      sorter: (a, b) => a.mobileNo.length - b.mobileNo.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.length - b.status.length,
      render: (status) => {
        return (
          <Chip
            variant="gradient"
            color={status === "Active" ? "green" : "blue-gray"}
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

export function Suppliers() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["suppliers", currentPage],
    queryFn: () => fetchSuppliers({ page: currentPage, limit: 6 }),
    keepPreviousData: true,
  });

  const onPageChange = (page) => {
    console.log({ page });
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
            All Suppliers
          </Typography>
        </CardHeader>
        <CardBody className="min-h-[630px] overflow-x-auto px-5 pt-0 pb-2 flex flex-col gap-8 items-center">
          <SuppliersTable data={data?.suppliers} isLoading={isLoading} />
          <Pagination
            current={currentPage}
            pageSize={6}
            total={data?.totalSuppliers || 0}
            onChange={onPageChange}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export default Suppliers;

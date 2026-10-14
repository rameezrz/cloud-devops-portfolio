import {
  HomeIcon,
  UsersIcon,
  UserPlusIcon,
  Squares2X2Icon,
  SquaresPlusIcon,
  DocumentDuplicateIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/solid";
import {
  Home,
  Suppliers,
  SupplierForm,
  ItemForm,
  ViewItems,
  ViewSingleItem,
  ViewOrders,
  OrderForm,
  ViewSingleOrder,
} from "./pages";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    title: "Suppliers",
    layout: "dashboard",
    pages: [
      {
        icon: <UsersIcon {...icon} />,
        name: "view suppliers",
        path: "/suppliers",
        element: <Suppliers />,
      },
      {
        icon: <UserPlusIcon {...icon} />,
        name: "add Supplier",
        path: "/add-supplier",
        element: <SupplierForm key={"add-supplier"} mode="create" />,
      },
    ],
  },
  {
    title: "Items",
    layout: "dashboard",
    pages: [
      {
        icon: <Squares2X2Icon {...icon} />,
        name: "view Items",
        path: "/items",
        element: <ViewItems />,
      },
      {
        icon: <SquaresPlusIcon {...icon} />,
        name: "add item",
        path: "/add-item",
        element: <ItemForm key={"add-item"} mode="create" />,
      },
    ],
  },
  {
    title: "Orders",
    layout: "dashboard",
    pages: [
      {
        icon: <DocumentDuplicateIcon {...icon} />,
        name: "view Orders",
        path: "/orders",
        element: <ViewOrders />,
      },
      {
        icon: <DocumentPlusIcon {...icon} />,
        name: "add order",
        path: "/add-order",
        element: <OrderForm key={"add-item"} mode="create" />,
      },
    ],
  },
  {
    layout: "hiddenMenus",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "edit Supplier",
        path: "/edit-supplier/:id",
        element: <SupplierForm key={"edit-supplier"} mode="edit" />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "edit Item",
        path: "/edit-item/:id",
        element: <ItemForm key={"edit-item"} mode="edit" />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "view Item",
        path: "/item/:id",
        element: <ViewSingleItem key={"view-item"} />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "view Order",
        path: "/order/:id",
        element: <ViewSingleOrder key={"view-order"} />,
      },
    ],
  },
];

export default routes;

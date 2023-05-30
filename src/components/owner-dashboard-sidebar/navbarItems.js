import AccountRoundedIcon from "@mui/icons-material/AccountCircle";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
export const mainNavbarItems = [
  {
    id: 0,
    icon: <AccountRoundedIcon />,
    label: "Profile",
    route: "/owner-dashboard",
  },
  {
    id: 1,
    icon: <LocalMallRoundedIcon />,
    label: "Products",
    route: "/owner-products",
  },
  {
    id: 2,
    icon: <LocalShippingRoundedIcon />,
    label: "Orders",
    route: "/owner-orders",
  },
];

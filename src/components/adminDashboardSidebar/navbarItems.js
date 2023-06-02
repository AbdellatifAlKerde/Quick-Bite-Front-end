import AccountRoundedIcon from "@mui/icons-material/AccountCircle";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
export const mainNavbarItems = [
  {
    id: 0,
    icon: <AccountRoundedIcon />,
    label: "Owners",
    route: "/admin-dashboard",
  },
  {
    id: 1,
    icon: <RestaurantRoundedIcon />,
    label: "Restaurants",
    route: "/admin-restaurants",
  },
  {
    id: 2,
    icon: <CategoryRoundedIcon />,
    label: "Categories",
    route: "/admin-categories",
  },
];

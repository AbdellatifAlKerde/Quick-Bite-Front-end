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
    icon: <LeaderboardRoundedIcon />,
    label: "Home",
    route: "/admin-dashboard",
  },
  {
    id: 1,
    icon: <AccountRoundedIcon />,
    label: "Users",
    route: "/admin-users",
  },
  {
    id: 2,
    icon: <RestaurantRoundedIcon />,
    label: "Restaurants",
    route: "/admin-restaurants",
  },
  {
    id: 3,
    icon: <CategoryRoundedIcon />,
    label: "Categories",
    route: "/admin-categories",
  },
];

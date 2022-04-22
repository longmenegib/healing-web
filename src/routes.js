import DashboardHome from "./views/DashboardHome";
import Home from "./views/Home";
import { faHome, faUsers, faUser } from '@fortawesome/free-solid-svg-icons'
import DashboardClient from "./views/DashboardClient";

var routes = [
  {
    path: "/",
    name: "Home",
    icon: faHome,
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: faUsers,
    component: DashboardHome,
  },
  {
    path: "/account",
    name: "Profile",
    icon: faUser,
    component: DashboardHome,
  },
];

var clientRoutes = [
  {
    path: "/",
    name: "Home",
    icon: faHome,
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: faUsers,
    component: DashboardClient,
  }
]

export {routes, clientRoutes};

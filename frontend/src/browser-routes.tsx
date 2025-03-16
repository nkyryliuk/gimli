import { RouteObject } from "react-router-dom";
import AppLayout from "./layouts/app-layout";
import Home from "./routes/home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

// Define routes compatible with React Router DOM
const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
];

export default routes;

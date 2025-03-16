import { RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  layout("./layouts/app-layout.tsx", [
    index("./routes/home.tsx"),
    route("/login", "./components/Login.tsx"),
    route("/dashboard", "./components/Dashboard.tsx"),
    route("*", "./catchall.tsx"),
  ]),
] satisfies RouteConfig;

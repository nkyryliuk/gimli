import { RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  layout("./layouts/app-layout.tsx", [
    index("./routes/home.tsx"),
    route("/login", "./routes/login.tsx"),
    route("/campaigns/*", "./routes/campaigns.tsx"),
    route("/bestiary/*", "./routes/bestiary.tsx"),
    route("*", "./catchall.tsx"),
  ]),
] satisfies RouteConfig;

import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

interface RouteMetadata {
  label: string;
  parent: string | null;
}

const routeMetadata: Record<string, RouteMetadata> = {
  "/": { label: "Home", parent: null },
  "/dashboard": { label: "Dashboard", parent: "/" },
  "/login": { label: "Login", parent: null },
  "/campaigns": { label: "Campaigns", parent: "/" },
  "/campaigns/starred": { label: "Starred", parent: "/campaigns" },
  "/campaigns/history": { label: "History", parent: "/campaigns" },
};

const DynamicBreadcrumbs = () => {
  const location = useLocation();

  const currentPath = location.pathname;

  const breadcrumbs = [];
  let path: string | null = currentPath;

  while (path) {
    const metadata: RouteMetadata = routeMetadata[path] || {
      label: path.split("/").pop() || "Unknown",
      parent: "/",
    };

    breadcrumbs.unshift({
      path,
      label: metadata.label.charAt(0).toUpperCase() + metadata.label.slice(1),
    });

    path = metadata.parent;

    if (!path) break;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <Fragment key={crumb.path}>
            <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
              {index < breadcrumbs.length - 1 ? (
                <BreadcrumbLink href={crumb.path}>{crumb.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator
                className={index === 0 ? "hidden md:block" : ""}
              />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumbs;

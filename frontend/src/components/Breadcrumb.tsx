import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import "./Breadcrumb.css";

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const ROUTE_MAP: Record<string, string> = {
  "home": "/",
  "jobs": "/Job",
  "job": "/Job",
  "internships": "/Internship",
  "internship": "/Internship",
  "admin panel": "/adminPanel",
  "admin": "/Admin",
  "applications": "/viewApplication",
  "post job": "/postJob",
  "post internship": "/postInternship",
  "my profile": "/profile",
  "profile": "/profile",
};

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="breadcrumb-sticky-wrapper">
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            // Automatically derive link path if not explicitly provided
            const resolvedPath =
              item.path ||
              (item.label.toLowerCase() === "home"
                ? "/"
                : ROUTE_MAP[item.label.toLowerCase()]);

            return (
              <li key={index} className="breadcrumb-item">
                {resolvedPath && !isLast ? (
                  <Link to={resolvedPath} className="breadcrumb-link">
                    {item.label}
                  </Link>
                ) : (
                  <span className={`breadcrumb-current ${isLast ? "active" : ""}`}>
                    {item.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="breadcrumb-separator" size={16} />}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;

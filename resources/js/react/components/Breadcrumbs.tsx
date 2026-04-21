import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show on home page
  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 py-4 container mx-auto px-4">
      <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home className="w-3 h-3" />
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = name.replace(/-/g, " ");

        return (
          <div key={name} className="flex items-center space-x-2">
            <ChevronRight className="w-3 h-3" />
            {isLast ? (
              <span className="text-primary">{displayName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-primary transition-colors">
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

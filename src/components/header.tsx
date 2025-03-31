import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { Container } from "./container";
import { LogoContainer } from "./logo-container";
import { NavigationRoutes } from "./navigation-routes";
import { NavLink } from "react-router-dom";
import { ProfileContainer } from "./profile-container";
import { ToggleContainer } from "./toggle-container";

const Header = () => {
  const { userId } = useAuth();

  return (
    <header
      className={cn(
        "w-full  duration-150 transition-all ease-in-out bg-white/20 backdrop-blur-lg backdrop-saturate-150 absolute z-10"
      )}
    >
      <Container>
        <div className="flex items-center gap-4 w-full">
          {/* logo section */}
          <LogoContainer />
  
          {/* navigation section */}
          <nav className="hidden md:flex no-underline  items-start  gap-6">
            <NavigationRoutes />
            {userId && (
              <NavLink
                to={"/generate"}
                className={({ isActive }) =>
                  cn(
                    "text-base text-neutral-600 no-underline",
                    isActive && "text-neutral-900 no-underline font-semibold"
                  )
                }
              >
                Take An Interview
              </NavLink>
            )}
          </nav>
  
          <div className="ml-auto flex items-center gap-6">
            {/* profile section */}
            <ProfileContainer />
  
            {/* mobile toggle section */}
            <ToggleContainer />
          </div>
        </div>
      </Container>
    </header>
  );
  
};

export default Header;
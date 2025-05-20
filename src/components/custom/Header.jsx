import React, { useContext } from "react";
import { Button } from "../ui/button.jsx";
import { LogInContext } from "@/Context/LogInContext/Login.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { LogInIcon, LogOutIcon, Plane, Plus, User } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../constants/ThemeToggle.jsx";

function Header({headerRef}) {
  const { user, isAuthenticated, logout, loginWithPopup } =
    useContext(LogInContext);
  const LogOut = () => {
    logout();
  };  
  const LogIn = () => {
    loginWithPopup();
  };

  return (
    <div
      ref={headerRef}
      className="w-full flex items-center justify-between shadow-sm p-3 md:px-40 border-b"
    >
      <Link to={"/"}>
        <div className="logo flex gap-2 items-center justify-between">
          <div className="img inline-block h-5 w-5 md:h-10 md:w-10">
            <img src="/logo.png" alt="" />
          </div>
          <h1 className="text-lg md:text-3xl font-bold bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">
            𝖲𝖸𝖭𝖳𝖧𝖳𝖱𝖤𝖪
          </h1>
        </div>
      </Link>
      <div className="flex items-center justify-center gap-5">
        <ThemeToggle className="" />
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="">
              <div className="user flex items-center gap-2 mr-3">
                <h2 className="hidden sm:block text-lg md:text-xl bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent capitalize">
                  Hi {user.given_name || user.nickname}
                </h2>
                <div className="userimg overflow-hidden h-10 w-10 rounded-full">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} />
                  ) : (
                    <User />
                  )}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-center sm:text-left w-56">
              <DropdownMenuLabel className="font-semibold text-xl flex items-center justify-start gap-2">
                <User /> My Account
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <Link to="/all-trips" className="">
                <DropdownMenuItem className="w-full cursor-pointer text-lg flex items-center justify-start gap-2">
                  <Plane /> My Trips
                </DropdownMenuItem>
              </Link>

              <Link to="/plan-a-trip" className="">
                <DropdownMenuItem className="w-full cursor-pointer text-lg flex items-center justify-start gap-2">
                  <Plus /> Create Trip
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <Button
                variant="destructive"
                className="w-full min-w-[100px] flex items-center justify-center gap-3 relative overflow-hidden group font-bold text-white dark:text-black text-lg md:text-xl whitespace-nowrap"
                onClick={LogOut}
              >
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                  Log Out
                </span>
                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                  Log Out
                </span>
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={LogIn}
            className="min-w-[100px] flex items-center justify-center gap-3 relative overflow-hidden group font-bold text-white dark:text-black text-lg md:text-xl whitespace-nowrap"
          >
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
              Sign in
            </span>
            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
              Sign in
            </span>
            <DropdownMenuShortcut>
            </DropdownMenuShortcut>
          </Button>
        )}
      </div>
    </div>
  );
}

export default Header;
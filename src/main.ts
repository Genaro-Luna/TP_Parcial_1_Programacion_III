import type { IUser } from "./types/IUser.ts";

const publicRoutes = ["/src/pages/auth/login/", "/src/pages/auth/registro/"];

const checkAuth = () => {
  const currentPath = window.location.pathname;
  const userDataString = localStorage.getItem("userData");
  const user: IUser | null = userDataString ? JSON.parse(userDataString) : null;

  if (!user && !publicRoutes.some(route => currentPath.includes(route))) {
    window.location.href = "/src/pages/auth/login/login.html";
    return;
  }

  if (currentPath.includes("/admin/")) {
    if (user?.role !== "admin") {
      window.location.href = "/src/pages/client/home/home.html";
    }
  }

  if (user && publicRoutes.some(route => currentPath.includes(route))) {
    const targetHome = user.role === "admin" 
      ? "/src/pages/admin/home/home.html" 
      : "/src/pages/client/home/home.html";
    window.location.href = targetHome;
  }
};
checkAuth();
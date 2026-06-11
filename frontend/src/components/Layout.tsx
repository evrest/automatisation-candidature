import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const STORAGE_KEY = "ui.sidebar.collapsed";

function readInitialCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "1";
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState<boolean>(readInitialCollapsed);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed]);

  return (
    <div className={"app" + (collapsed ? " collapsed" : "")}>
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />
      <TopBar />
      <main className="main">
        <div className="main-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

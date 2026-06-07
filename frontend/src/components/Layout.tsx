import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout">
      <nav className="nav">
        <div className="nav-brand">Job Automator</div>
        <NavLink to="/profile" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Profil
        </NavLink>
        <NavLink to="/jobs" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Candidatures
        </NavLink>
      </nav>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

import {
  AwardIcon,
  BriefcaseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
  GraduationIcon,
  RocketIcon,
  SidebarIcon,
  SparklesIcon,
  TargetIcon,
  UserIcon,
} from "./icons/Icon";

interface NavLeaf {
  to: string;
  label: string;
  icon: ReactNode;
}

interface NavBranch {
  label: string;
  icon: ReactNode;
  baseRoute: string;
  children: NavLeaf[];
}

const PROFILE_NAV: NavBranch = {
  label: "Profil",
  icon: <UserIcon />,
  baseRoute: "/profile",
  children: [
    { to: "/profile/identity",       label: "Identité",       icon: <UserIcon /> },
    { to: "/profile/experiences",    label: "Expériences",    icon: <BriefcaseIcon /> },
    { to: "/profile/projects",       label: "Projets",        icon: <RocketIcon /> },
    { to: "/profile/education",      label: "Formation",      icon: <GraduationIcon /> },
    { to: "/profile/skills",         label: "Compétences",    icon: <SparklesIcon /> },
    { to: "/profile/languages",      label: "Langues",        icon: <GlobeIcon /> },
    { to: "/profile/certifications", label: "Certifications", icon: <AwardIcon /> },
  ],
};

const TOP_LEVEL: NavLeaf[] = [
  { to: "/jobs", label: "Candidatures", icon: <TargetIcon /> },
];

interface Props {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export default function Sidebar({ collapsed, onToggleCollapsed }: Props) {
  const location = useLocation();
  const profileActive = location.pathname.startsWith(PROFILE_NAV.baseRoute);

  // La branche profil s'ouvre auto quand on est dedans, manuellement sinon.
  const [profileOpen, setProfileOpen] = useState(profileActive);
  useEffect(() => {
    if (profileActive) setProfileOpen(true);
  }, [profileActive]);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">JA</div>
        <span className="sidebar-brand-text">Job Automator</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <div className="sidebar-section-label">Espace</div>

          {/* Branche profil — toggle + sous-items */}
          <button
            type="button"
            className={
              "nav-item" + (profileActive ? " active" : "") + (profileOpen ? " open" : "")
            }
            data-tip={collapsed ? PROFILE_NAV.label : undefined}
            onClick={() => {
              // En mode collapsed, le clic navigue vers la 1ʳᵉ sous-page plutôt
              // que de tenter d'ouvrir une liste cachée.
              if (collapsed) {
                window.location.hash = ""; // no-op
              }
              setProfileOpen((o) => !o);
            }}
          >
            <span className="nav-item-icon">{PROFILE_NAV.icon}</span>
            <span className="nav-item-label">{PROFILE_NAV.label}</span>
            <span className="nav-item-chevron">
              <ChevronRightIcon size={14} />
            </span>
          </button>

          {profileOpen && (
            <div className="nav-subitems">
              {PROFILE_NAV.children.map((child) => (
                <NavLink
                  key={child.to}
                  to={child.to}
                  className={({ isActive }) => "nav-subitem" + (isActive ? " active" : "")}
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          )}

          {/* Liens de premier niveau */}
          {TOP_LEVEL.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
              data-tip={collapsed ? item.label : undefined}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={onToggleCollapsed}
          data-tip={collapsed ? "Déplier" : undefined}
          aria-label={collapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
        >
          <span className="nav-item-icon">
            {collapsed ? <SidebarIcon /> : <ChevronLeftIcon />}
          </span>
          <span className="nav-item-label">Replier</span>
        </button>
      </div>
    </aside>
  );
}

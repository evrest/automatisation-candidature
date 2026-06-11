import { useLocation } from "react-router-dom";

import { useProfile } from "../contexts/ProfileContext";
import { SaveIcon } from "./icons/Icon";

/**
 * Mapping route → label. Permet de fabriquer un breadcrumb sans router config lourd.
 */
const LABELS: Record<string, string> = {
  profile: "Profil",
  identity: "Identité",
  experiences: "Expériences",
  projects: "Projets",
  education: "Formation",
  skills: "Compétences",
  languages: "Langues",
  certifications: "Certifications",
  jobs: "Candidatures",
};

function buildCrumbs(pathname: string): string[] {
  return pathname
    .split("/")
    .filter(Boolean)
    .map((seg) => LABELS[seg] ?? seg);
}

export default function TopBar() {
  const { pathname } = useLocation();
  const crumbs = buildCrumbs(pathname);
  const inProfile = pathname.startsWith("/profile");

  return (
    <header className="topbar">
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        {crumbs.map((label, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={i} className="flex">
              {i > 0 && <span className="breadcrumb-sep">/</span>}
              <span className={"breadcrumb-item" + (isLast ? " current" : "")}>{label}</span>
            </span>
          );
        })}
      </nav>

      {inProfile && <ProfileSaveControl />}
    </header>
  );
}

/** Statut + bouton enregistrer, visible quand on est dans /profile. */
function ProfileSaveControl() {
  const { status, error, save } = useProfile();

  const statusLabel: Record<typeof status, string> = {
    loading: "Chargement…",
    idle: "À jour",
    saving: "Enregistrement…",
    saved: "Enregistré",
    error: "Erreur",
  };

  return (
    <div className="flex" style={{ gap: 14 }}>
      <div className="topbar-status" title={error ?? undefined}>
        <span className={`status-dot ${status}`} />
        {statusLabel[status]}
      </div>
      <button
        className="btn btn-primary btn-sm"
        onClick={save}
        disabled={status === "saving" || status === "loading"}
      >
        <SaveIcon size={14} />
        Enregistrer
      </button>
    </div>
  );
}

import { Outlet } from "react-router-dom";

import { useProfile } from "../../contexts/ProfileContext";

/**
 * Boundary visuel pour les sous-pages /profile/*.
 * Le ProfileProvider est hissé à la racine de l'app (cf. main.tsx) car la TopBar
 * (rendue par le Layout commun) consomme aussi le contexte.
 */
export default function ProfileLayout() {
  const { status, error } = useProfile();

  if (status === "loading") {
    return <p className="muted">Chargement du profil…</p>;
  }
  return (
    <>
      <Outlet />
      {status === "saved" && <div className="toast success">Profil enregistré</div>}
      {status === "error" && error && (
        <div className="toast error">Erreur : {error}</div>
      )}
    </>
  );
}

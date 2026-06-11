import { useEffect, useState } from "react";

import { scrapeApi } from "../../api/scrape";
import { SearchIcon } from "../icons/Icon";
import { Field, Row } from "../ui/Field";
import type { ScrapeRequest, ScrapeSite } from "../../types/scrape";

interface Props {
  onClose: () => void;
  onRun: (req: ScrapeRequest) => Promise<void>;
}

/** Petite fenêtre de lancement du scraping : sites, limite, ciblage. */
export default function ScrapeModal({ onClose, onRun }: Props) {
  const [sites, setSites] = useState<ScrapeSite[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set(["linkedin"]));
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    scrapeApi.sites().then(setSites).catch((e) => setError(String(e)));
  }, []);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const launch = async () => {
    if (selected.size === 0) {
      setError("Sélectionne au moins un site.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onRun({
        sites: [...selected],
        limit,
        query: query.trim() || undefined,
        location: location.trim() || undefined,
      });
      onClose();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={busy ? undefined : onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          <SearchIcon size={16} />
          Scraper des offres
        </h2>
        <p className="muted modal-sub">
          Les offres correspondant à ton profil seront importées dans Candidatures, doublons exclus.
        </p>

        <div className="modal-section">
          <div className="modal-label">Sites</div>
          <div className="scrape-sites">
            {sites.map((s) => (
              <label key={s.id} className={"scrape-site" + (selected.has(s.id) ? " on" : "")}>
                <input
                  type="checkbox"
                  checked={selected.has(s.id)}
                  onChange={() => toggle(s.id)}
                />
                {s.label}
              </label>
            ))}
            {sites.length === 0 && <span className="muted">Chargement des sites…</span>}
          </div>
        </div>

        <Row>
          <Field
            label="Poste recherché"
            value={query}
            onChange={setQuery}
            placeholder="Par défaut : le titre de ton profil"
          />
          <Field
            label="Lieu"
            value={location}
            onChange={setLocation}
            placeholder="Par défaut : ta ville"
          />
        </Row>

        <div className="modal-section">
          <div className="modal-label">Limite d'offres par site : {limit}</div>
          <input
            type="range"
            min={1}
            max={25}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="scrape-limit"
          />
        </div>

        {error && <div className="modal-error">{error}</div>}

        <footer className="modal-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClose} disabled={busy}>
            Annuler
          </button>
          <button className="btn btn-primary btn-sm" onClick={launch} disabled={busy}>
            {busy ? "Scraping en cours… (~1 min)" : "Lancer le scraping"}
          </button>
        </footer>
      </div>
    </div>
  );
}

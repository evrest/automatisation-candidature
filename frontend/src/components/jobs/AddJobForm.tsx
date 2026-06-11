import { useState } from "react";

import { PlusIcon } from "../icons/Icon";
import type { JobCreate } from "../../types/job";
import { Field, Row, TextArea } from "../ui/Field";

interface Props {
  onSubmit: (job: JobCreate) => Promise<void>;
}

const blank = (): JobCreate => ({
  title: "",
  company: "",
  source: "manual",
  url: "",
  location: "",
  contractType: "",
  salary: "",
  description: "",
  requirements: [],
  keywords: [],
  contactEmail: "",
  notes: "",
});

export default function AddJobForm({ onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [job, setJob] = useState<JobCreate>(blank);
  const [busy, setBusy] = useState(false);

  if (!open) {
    return (
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}>
        <PlusIcon size={14} />
        Ajouter manuellement
      </button>
    );
  }

  const patch = (d: Partial<JobCreate>) => setJob((j) => ({ ...j, ...d }));

  const submit = async () => {
    setBusy(true);
    try {
      await onSubmit(job);
      setJob(blank());
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <header className="card-header">
        <div>
          <h2 className="card-title">Nouvelle candidature</h2>
          <p className="card-subtitle">Saisie manuelle d'une offre repérée à la main.</p>
        </div>
      </header>
      <div className="card-body">
        <Row>
          <Field label="Titre" value={job.title} onChange={(v) => patch({ title: v })} />
          <Field label="Entreprise" value={job.company} onChange={(v) => patch({ company: v })} />
        </Row>
        <Row>
          <Field label="Lieu" value={job.location ?? ""} onChange={(v) => patch({ location: v })} />
          <Field label="Contrat" value={job.contractType ?? ""} onChange={(v) => patch({ contractType: v })} placeholder="CDI, CDD, Stage..." />
          <Field label="Salaire" value={job.salary ?? ""} onChange={(v) => patch({ salary: v })} />
        </Row>
        <Row>
          <Field label="URL offre" value={job.url ?? ""} onChange={(v) => patch({ url: v })} />
          <Field label="Email contact" value={job.contactEmail ?? ""} onChange={(v) => patch({ contactEmail: v })} />
        </Row>
        <TextArea
          label="Description"
          value={job.description ?? ""}
          onChange={(v) => patch({ description: v })}
        />
        <div className="flex" style={{ justifyContent: "flex-end", marginTop: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Annuler</button>
          <button className="btn btn-primary btn-sm" onClick={submit} disabled={busy || !job.title || !job.company}>
            {busy ? "Création…" : "Créer"}
          </button>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";

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
        + Ajouter manuellement
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
    <div className="section">
      <h3 style={{ marginTop: 0 }}>Nouvelle candidature</h3>
      <Row>
        <Field label="Titre" value={job.title} onChange={(v) => patch({ title: v })} />
        <Field label="Entreprise" value={job.company} onChange={(v) => patch({ company: v })} />
      </Row>
      <Row>
        <Field label="Lieu" value={job.location ?? ""} onChange={(v) => patch({ location: v })} />
        <Field label="Contrat" value={job.contractType ?? ""} onChange={(v) => patch({ contractType: v })} />
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
      <div className="actions">
        <button className="btn" onClick={submit} disabled={busy || !job.title || !job.company}>
          {busy ? "…" : "Créer"}
        </button>
        <button className="btn btn-ghost" onClick={() => setOpen(false)}>Annuler</button>
      </div>
    </div>
  );
}

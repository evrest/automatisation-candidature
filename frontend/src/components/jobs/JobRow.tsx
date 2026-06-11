import type { ReactNode } from "react";

import {
  CheckCheckIcon,
  ExternalLinkIcon,
  FileTextIcon,
  MailIcon,
  SaveIcon,
  SendIcon,
  SparklesIcon,
  TrashIcon,
} from "../icons/Icon";
import type { Job, JobStatus } from "../../types/job";

interface Props {
  job: Job;
  onAction: (action: JobAction) => void;
}

export type JobAction =
  | "generateCv"
  | "generateCoverLetter"
  | "verify"
  | "submit"
  | "sendEmail"
  | "delete";

interface ActionDef {
  key: JobAction;
  label: string;
  icon: ReactNode;
  variant?: "default" | "danger";
}

const ACTIONS: ActionDef[] = [
  { key: "generateCv",          label: "Générer le CV",            icon: <FileTextIcon size={14} /> },
  { key: "generateCoverLetter", label: "Générer la lettre",        icon: <SparklesIcon size={14} /> },
  { key: "verify",              label: "Vérifier les documents",   icon: <CheckCheckIcon size={14} /> },
  { key: "submit",              label: "Soumettre la candidature", icon: <SendIcon size={14} /> },
  { key: "sendEmail",           label: "Envoyer par mail",         icon: <MailIcon size={14} /> },
  { key: "delete",              label: "Supprimer",                icon: <TrashIcon size={14} />, variant: "danger" },
];

const STATUS_LABEL: Record<JobStatus, string> = {
  found: "Repérée",
  cv_generated: "CV prêt",
  reviewed: "Relue",
  submitted: "Envoyée",
  responded: "Réponse",
  rejected: "Refusée",
};

export default function JobRow({ job, onAction }: Props) {
  return (
    <tr>
      <td>
        <div className="cell-title">{job.title || "(sans titre)"}</div>
        <div className="cell-sub">
          {job.company}
          {job.location ? ` · ${job.location}` : ""}
          {job.contractType ? ` · ${job.contractType}` : ""}
        </div>
        {job.url && (
          <div className="cell-link" style={{ marginTop: 4 }}>
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              {job.source}
              <ExternalLinkIcon size={11} />
            </a>
          </div>
        )}
      </td>
      <td>
        <span className={`badge badge-${job.status}`}>{STATUS_LABEL[job.status]}</span>
      </td>
      <td>
        <div className="flex" style={{ gap: 12 }}>
          <DocStatus label="CV" present={Boolean(job.cvPath)} />
          <DocStatus label="LM" present={Boolean(job.coverLetterPath)} />
        </div>
      </td>
      <td>
        <div className="flex" style={{ gap: 2, justifyContent: "flex-end" }}>
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              className={"btn btn-icon " + (a.variant === "danger" ? "btn-danger" : "btn-subtle")}
              title={a.label}
              aria-label={a.label}
              onClick={() => onAction(a.key)}
            >
              {a.icon}
            </button>
          ))}
        </div>
      </td>
    </tr>
  );
}

function DocStatus({ label, present }: { label: string; present: boolean }) {
  return (
    <span
      className="flex"
      style={{ gap: 4, fontSize: 12, color: present ? "var(--accent-text)" : "var(--text-dim)" }}
    >
      {present ? <SaveIcon size={11} /> : null}
      {label}
    </span>
  );
}

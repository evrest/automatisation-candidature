import { useNavigate } from "react-router-dom";

import { FileTextIcon, SparklesIcon, TrashIcon } from "../icons/Icon";
import { STATUS_LABEL, type Job } from "../../types/job";

interface Props {
  job: Job;
  onDelete: () => void;
}

const SOURCE_LABEL: Record<string, string> = {
  linkedin: "LinkedIn",
  indeed: "Indeed",
  manual: "Manuel",
};

/** Carte miniature : clic → vue augmentée /jobs/:id. */
export default function JobCard({ job, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <article className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
      <header className="job-card-head">
        <span className="badge badge-source">{SOURCE_LABEL[job.source] ?? job.source}</span>
        <span className={`badge badge-${job.status}`}>{STATUS_LABEL[job.status]}</span>
        <button
          className="btn btn-icon btn-danger job-card-delete"
          title="Supprimer"
          aria-label="Supprimer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <TrashIcon size={13} />
        </button>
      </header>

      <h3 className="job-card-title">{job.title || "(sans titre)"}</h3>
      <div className="job-card-company">
        {job.company}
        {job.location ? ` · ${job.location}` : ""}
      </div>

      {job.summary ? (
        <p className="job-card-summary">{job.summary}</p>
      ) : (
        <p className="job-card-summary muted">Pas encore de résumé.</p>
      )}

      <footer className="job-card-foot">
        {job.salary && <span className="job-card-salary">{job.salary}</span>}
        <span className="job-card-docs">
          <DocDot label="CV" present={Boolean(job.cvContent || job.cvPath)} icon={<FileTextIcon size={11} />} />
          <DocDot
            label="LM"
            present={Boolean(job.letterContent || job.coverLetterPath)}
            icon={<SparklesIcon size={11} />}
          />
        </span>
      </footer>
    </article>
  );
}

function DocDot({ label, present, icon }: { label: string; present: boolean; icon: React.ReactNode }) {
  return (
    <span
      className="job-card-doc"
      style={{ color: present ? "var(--accent-text)" : "var(--text-dim)" }}
      title={`${label} ${present ? "généré" : "non généré"}`}
    >
      {icon}
      {label}
    </span>
  );
}

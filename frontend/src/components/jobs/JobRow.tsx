import type { Job } from "../../types/job";

interface Action {
  label: string;
  run: () => void;
}

interface Props {
  job: Job;
  actions: Action[];
  onDelete: () => void;
}

export default function JobRow({ job, actions, onDelete }: Props) {
  return (
    <tr>
      <td>
        <div><strong>{job.title || "(sans titre)"}</strong></div>
        <div className="muted">{job.company}</div>
        {job.url && (
          <div>
            <a href={job.url} target="_blank" rel="noreferrer">Voir l'offre</a>
          </div>
        )}
      </td>
      <td>{job.source}</td>
      <td>{job.location ?? "—"}</td>
      <td>
        <span className={`badge badge-${job.status}`}>{job.status}</span>
      </td>
      <td>
        <div className="muted">CV : {job.cvPath ? "✓" : "—"}</div>
        <div className="muted">LM : {job.coverLetterPath ? "✓" : "—"}</div>
      </td>
      <td>
        <div className="actions">
          {actions.map((a) => (
            <button key={a.label} className="btn btn-ghost btn-sm" onClick={a.run}>
              {a.label}
            </button>
          ))}
          <button className="btn btn-danger btn-sm" onClick={onDelete}>Suppr.</button>
        </div>
      </td>
    </tr>
  );
}

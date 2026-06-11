import type { ChangeEvent, ReactNode } from "react";

interface BaseProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}

export function Field({ label, value, onChange, type = "text", placeholder }: BaseProps) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder }: BaseProps) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      />
    </div>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <div className="field field-checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <label>{label}</label>
    </div>
  );
}

interface TagListProps {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}

/** Saisie de tags par CSV : simple et suffisant pour le MVP. */
export function TagList({ label, value, onChange, placeholder }: TagListProps) {
  return (
    <div className="field">
      <label>
        {label} <span className="field-hint">séparés par des virgules</span>
      </label>
      <input
        type="text"
        value={value.join(", ")}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
      />
    </div>
  );
}

interface RowProps {
  children: ReactNode;
}

export function Row({ children }: RowProps) {
  return <div className="row">{children}</div>;
}

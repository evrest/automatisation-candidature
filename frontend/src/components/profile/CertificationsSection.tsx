import type { Certification } from "../../types/profile";
import { useArrayField } from "../../hooks/useArrayField";
import { Field, Row } from "../ui/Field";
import { RepeatableSection } from "../ui/RepeatableSection";

interface Props {
  items: Certification[];
  setItems: (next: Certification[]) => void;
}

const blank = (order: number): Certification => ({
  name: "",
  issuer: "",
  date: "",
  url: "",
  order,
});

export default function CertificationsSection({ items, setItems }: Props) {
  const { add, remove, update } = useArrayField(items, setItems);

  return (
    <RepeatableSection
      title="Certifications"
      items={items}
      onAdd={() => add(blank(items.length))}
      onRemove={remove}
      itemLabel={(it) => [it.name, it.issuer].filter(Boolean).join(" — ")}
      renderItem={(it, i) => (
        <Row>
          <Field label="Nom" value={it.name} onChange={(v) => update(i, { name: v })} />
          <Field label="Émetteur" value={it.issuer} onChange={(v) => update(i, { issuer: v })} />
          <Field label="Date" value={it.date} onChange={(v) => update(i, { date: v })} placeholder="YYYY-MM" />
          <Field label="URL" value={it.url ?? ""} onChange={(v) => update(i, { url: v })} />
        </Row>
      )}
    />
  );
}

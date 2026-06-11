import { useProfile } from "../../contexts/ProfileContext";
import { useArrayField } from "../../hooks/useArrayField";
import { AwardIcon } from "../icons/Icon";
import type { Certification } from "../../types/profile";
import { Field, Row } from "../ui/Field";
import { RepeatableSection } from "../ui/RepeatableSection";

const blank = (order: number): Certification => ({
  name: "",
  issuer: "",
  date: "",
  url: "",
  order,
});

export default function CertificationsSection() {
  const { profile, setField } = useProfile();
  const items = profile.certifications;
  const { add, remove, update } = useArrayField(items, setField("certifications"));

  return (
    <RepeatableSection
      title="Certifications"
      subtitle="Diplômes professionnels, cours en ligne validés, accréditations."
      items={items}
      onAdd={() => add(blank(items.length))}
      onRemove={remove}
      addLabel="Ajouter une certification"
      emptyLabel="Aucune certification renseignée."
      emptyIcon={<AwardIcon size={20} />}
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

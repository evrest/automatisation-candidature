import { useProfile } from "../../contexts/ProfileContext";
import { useArrayField } from "../../hooks/useArrayField";
import { GraduationIcon } from "../icons/Icon";
import type { Education } from "../../types/profile";
import { Field, Row, TextArea } from "../ui/Field";
import { RepeatableSection } from "../ui/RepeatableSection";

const blank = (order: number): Education => ({
  institution: "",
  degree: "",
  field: "",
  location: "",
  startDate: "",
  endDate: "",
  grade: "",
  description: "",
  order,
});

export default function EducationSection() {
  const { profile, setField } = useProfile();
  const items = profile.educations;
  const { add, remove, update } = useArrayField(items, setField("educations"));

  return (
    <RepeatableSection
      title="Formation"
      subtitle="Diplômes, écoles, formations continues."
      items={items}
      onAdd={() => add(blank(items.length))}
      onRemove={remove}
      addLabel="Ajouter une formation"
      emptyLabel="Aucune formation renseignée."
      emptyIcon={<GraduationIcon size={20} />}
      itemLabel={(it) => [it.degree, it.institution].filter(Boolean).join(" — ")}
      renderItem={(it, i) => (
        <>
          <Row>
            <Field label="Établissement" value={it.institution} onChange={(v) => update(i, { institution: v })} />
            <Field label="Diplôme" value={it.degree} onChange={(v) => update(i, { degree: v })} />
          </Row>
          <Row>
            <Field label="Spécialité" value={it.field ?? ""} onChange={(v) => update(i, { field: v })} />
            <Field label="Lieu" value={it.location ?? ""} onChange={(v) => update(i, { location: v })} />
            <Field label="Mention / Note" value={it.grade ?? ""} onChange={(v) => update(i, { grade: v })} />
          </Row>
          <Row>
            <Field label="Début" value={it.startDate} onChange={(v) => update(i, { startDate: v })} placeholder="YYYY-MM" />
            <Field label="Fin" value={it.endDate ?? ""} onChange={(v) => update(i, { endDate: v })} placeholder="YYYY-MM" />
          </Row>
          <TextArea
            label="Description"
            value={it.description ?? ""}
            onChange={(v) => update(i, { description: v })}
            placeholder="Cours marquants, projets, prix..."
          />
        </>
      )}
    />
  );
}

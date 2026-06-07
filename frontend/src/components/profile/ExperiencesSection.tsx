import type { Experience } from "../../types/profile";
import { useArrayField } from "../../hooks/useArrayField";
import { Field, Row, TagList, TextArea } from "../ui/Field";
import { RepeatableSection } from "../ui/RepeatableSection";

interface Props {
  items: Experience[];
  setItems: (next: Experience[]) => void;
}

const blank = (order: number): Experience => ({
  company: "",
  position: "",
  location: "",
  contractType: "",
  startDate: "",
  endDate: "",
  description: "",
  achievements: [],
  technologies: [],
  tags: [],
  order,
});

export default function ExperiencesSection({ items, setItems }: Props) {
  const { add, remove, update } = useArrayField(items, setItems);

  return (
    <RepeatableSection
      title="Expériences professionnelles"
      items={items}
      onAdd={() => add(blank(items.length))}
      onRemove={remove}
      itemLabel={(it) => [it.position, it.company].filter(Boolean).join(" — ")}
      renderItem={(it, i) => (
        <>
          <Row>
            <Field label="Poste" value={it.position} onChange={(v) => update(i, { position: v })} />
            <Field label="Entreprise" value={it.company} onChange={(v) => update(i, { company: v })} />
          </Row>
          <Row>
            <Field label="Lieu" value={it.location ?? ""} onChange={(v) => update(i, { location: v })} />
            <Field
              label="Contrat"
              value={it.contractType ?? ""}
              onChange={(v) => update(i, { contractType: v })}
              placeholder="CDI, CDD, Stage..."
            />
          </Row>
          <Row>
            <Field
              label="Début (YYYY-MM)"
              value={it.startDate}
              onChange={(v) => update(i, { startDate: v })}
              placeholder="2023-01"
            />
            <Field
              label="Fin (YYYY-MM, vide si en cours)"
              value={it.endDate ?? ""}
              onChange={(v) => update(i, { endDate: v })}
            />
          </Row>
          <TextArea
            label="Description (détaillée)"
            value={it.description}
            onChange={(v) => update(i, { description: v })}
            placeholder="Le contexte, la mission, les responsabilités. Détaille — on condensera selon le poste cible."
          />
          <TagList
            label="Réalisations clés (bullets)"
            value={it.achievements}
            onChange={(v) => update(i, { achievements: v })}
          />
          <TagList
            label="Technologies"
            value={it.technologies}
            onChange={(v) => update(i, { technologies: v })}
          />
          <TagList
            label="Tags (pour ciblage CV)"
            value={it.tags}
            onChange={(v) => update(i, { tags: v })}
            placeholder="backend, data, frontend..."
          />
        </>
      )}
    />
  );
}

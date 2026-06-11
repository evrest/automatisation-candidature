import { useProfile } from "../../contexts/ProfileContext";
import { useArrayField } from "../../hooks/useArrayField";
import { BriefcaseIcon } from "../icons/Icon";
import type { Experience } from "../../types/profile";
import { Field, Row, TagList, TextArea } from "../ui/Field";
import { RepeatableSection } from "../ui/RepeatableSection";

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

export default function ExperiencesSection() {
  const { profile, setField } = useProfile();
  const items = profile.experiences;
  const { add, remove, update } = useArrayField(items, setField("experiences"));

  return (
    <RepeatableSection
      title="Expériences professionnelles"
      subtitle="Détaille au max — l'IA condense selon l'offre ciblée."
      items={items}
      onAdd={() => add(blank(items.length))}
      onRemove={remove}
      addLabel="Ajouter une expérience"
      emptyLabel="Aucune expérience renseignée."
      emptyIcon={<BriefcaseIcon size={20} />}
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
              label="Début"
              value={it.startDate}
              onChange={(v) => update(i, { startDate: v })}
              placeholder="YYYY-MM"
            />
            <Field
              label="Fin"
              value={it.endDate ?? ""}
              onChange={(v) => update(i, { endDate: v })}
              placeholder="vide si en cours"
            />
          </Row>
          <TextArea
            label="Description"
            value={it.description}
            onChange={(v) => update(i, { description: v })}
            placeholder="Contexte, mission, responsabilités. Détaille — on condensera plus tard."
          />
          <TagList
            label="Réalisations clés"
            value={it.achievements}
            onChange={(v) => update(i, { achievements: v })}
            placeholder="Lancé un produit, réduit le coût de X%..."
          />
          <TagList
            label="Technologies"
            value={it.technologies}
            onChange={(v) => update(i, { technologies: v })}
            placeholder="React, Python, PostgreSQL..."
          />
          <TagList
            label="Tags"
            value={it.tags}
            onChange={(v) => update(i, { tags: v })}
            placeholder="backend, data, frontend..."
          />
        </>
      )}
    />
  );
}

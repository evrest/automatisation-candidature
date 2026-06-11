import { useProfile } from "../../contexts/ProfileContext";
import { useArrayField } from "../../hooks/useArrayField";
import { RocketIcon } from "../icons/Icon";
import type { Project } from "../../types/profile";
import { Field, Row, TagList, TextArea } from "../ui/Field";
import { RepeatableSection } from "../ui/RepeatableSection";

const blank = (order: number): Project => ({
  name: "",
  role: "",
  context: "",
  startDate: "",
  endDate: "",
  url: "",
  githubUrl: "",
  description: "",
  achievements: [],
  technologies: [],
  tags: [],
  order,
});

export default function ProjectsSection() {
  const { profile, setField } = useProfile();
  const items = profile.projects;
  const { add, remove, update } = useArrayField(items, setField("projects"));

  return (
    <RepeatableSection
      title="Projets"
      subtitle="Side-projects, projets pro marquants, contributions open source."
      items={items}
      onAdd={() => add(blank(items.length))}
      onRemove={remove}
      addLabel="Ajouter un projet"
      emptyLabel="Aucun projet renseigné."
      emptyIcon={<RocketIcon size={20} />}
      itemLabel={(it) => it.name}
      renderItem={(it, i) => (
        <>
          <Row>
            <Field label="Nom" value={it.name} onChange={(v) => update(i, { name: v })} />
            <Field
              label="Rôle"
              value={it.role ?? ""}
              onChange={(v) => update(i, { role: v })}
              placeholder="Lead, auteur, contributeur..."
            />
            <Field
              label="Contexte"
              value={it.context ?? ""}
              onChange={(v) => update(i, { context: v })}
              placeholder="perso, pro, étudiant..."
            />
          </Row>
          <Row>
            <Field label="Début" value={it.startDate ?? ""} onChange={(v) => update(i, { startDate: v })} placeholder="YYYY-MM" />
            <Field label="Fin" value={it.endDate ?? ""} onChange={(v) => update(i, { endDate: v })} placeholder="YYYY-MM" />
          </Row>
          <Row>
            <Field label="URL démo" value={it.url ?? ""} onChange={(v) => update(i, { url: v })} />
            <Field label="URL GitHub" value={it.githubUrl ?? ""} onChange={(v) => update(i, { githubUrl: v })} />
          </Row>
          <TextArea
            label="Description"
            value={it.description}
            onChange={(v) => update(i, { description: v })}
            placeholder="Pourquoi, comment, défis techniques rencontrés."
          />
          <TagList label="Réalisations clés" value={it.achievements} onChange={(v) => update(i, { achievements: v })} />
          <TagList label="Technologies" value={it.technologies} onChange={(v) => update(i, { technologies: v })} />
          <TagList label="Tags" value={it.tags} onChange={(v) => update(i, { tags: v })} />
        </>
      )}
    />
  );
}

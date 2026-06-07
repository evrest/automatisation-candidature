import type { Project } from "../../types/profile";
import { useArrayField } from "../../hooks/useArrayField";
import { Field, Row, TagList, TextArea } from "../ui/Field";
import { RepeatableSection } from "../ui/RepeatableSection";

interface Props {
  items: Project[];
  setItems: (next: Project[]) => void;
}

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

export default function ProjectsSection({ items, setItems }: Props) {
  const { add, remove, update } = useArrayField(items, setItems);

  return (
    <RepeatableSection
      title="Projets"
      items={items}
      onAdd={() => add(blank(items.length))}
      onRemove={remove}
      itemLabel={(it) => it.name}
      renderItem={(it, i) => (
        <>
          <Row>
            <Field label="Nom" value={it.name} onChange={(v) => update(i, { name: v })} />
            <Field
              label="Rôle"
              value={it.role ?? ""}
              onChange={(v) => update(i, { role: v })}
              placeholder="Lead dev, Auteur..."
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
            label="Description (détaillée)"
            value={it.description}
            onChange={(v) => update(i, { description: v })}
            placeholder="Le pourquoi, le comment, les défis techniques..."
          />
          <TagList label="Réalisations clés" value={it.achievements} onChange={(v) => update(i, { achievements: v })} />
          <TagList label="Technologies" value={it.technologies} onChange={(v) => update(i, { technologies: v })} />
          <TagList label="Tags (ciblage CV)" value={it.tags} onChange={(v) => update(i, { tags: v })} />
        </>
      )}
    />
  );
}

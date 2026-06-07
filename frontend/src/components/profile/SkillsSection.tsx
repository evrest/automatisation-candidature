import type { Skill } from "../../types/profile";
import { useArrayField } from "../../hooks/useArrayField";
import { Field, Row } from "../ui/Field";
import { RepeatableSection } from "../ui/RepeatableSection";

interface Props {
  items: Skill[];
  setItems: (next: Skill[]) => void;
}

const blank = (order: number): Skill => ({
  category: "",
  name: "",
  level: "",
  yearsOfExperience: null,
  order,
});

export default function SkillsSection({ items, setItems }: Props) {
  const { add, remove, update } = useArrayField(items, setItems);

  return (
    <RepeatableSection
      title="Compétences"
      items={items}
      onAdd={() => add(blank(items.length))}
      onRemove={remove}
      itemLabel={(it) => [it.category, it.name].filter(Boolean).join(" / ")}
      renderItem={(it, i) => (
        <Row>
          <Field
            label="Catégorie"
            value={it.category}
            onChange={(v) => update(i, { category: v })}
            placeholder="Langages, Frameworks, Soft skills..."
          />
          <Field label="Nom" value={it.name} onChange={(v) => update(i, { name: v })} />
          <Field
            label="Niveau"
            value={it.level ?? ""}
            onChange={(v) => update(i, { level: v })}
            placeholder="débutant / intermédiaire / avancé / expert"
          />
          <Field
            label="Années d'XP"
            type="number"
            value={it.yearsOfExperience?.toString() ?? ""}
            onChange={(v) => update(i, { yearsOfExperience: v ? Number(v) : null })}
          />
        </Row>
      )}
    />
  );
}

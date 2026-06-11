import { useProfile } from "../../contexts/ProfileContext";
import { useArrayField } from "../../hooks/useArrayField";
import { SparklesIcon } from "../icons/Icon";
import type { Skill } from "../../types/profile";
import { Field, Row } from "../ui/Field";
import { RepeatableSection } from "../ui/RepeatableSection";

const blank = (order: number): Skill => ({
  category: "",
  name: "",
  level: "",
  yearsOfExperience: null,
  order,
});

export default function SkillsSection() {
  const { profile, setField } = useProfile();
  const items = profile.skills;
  const { add, remove, update } = useArrayField(items, setField("skills"));

  return (
    <RepeatableSection
      title="Compétences"
      subtitle="Regroupe par catégorie pour mieux trier le CV."
      items={items}
      onAdd={() => add(blank(items.length))}
      onRemove={remove}
      addLabel="Ajouter une compétence"
      emptyLabel="Aucune compétence renseignée."
      emptyIcon={<SparklesIcon size={20} />}
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
            placeholder="débutant / avancé / expert"
          />
          <Field
            label="Années d'expérience"
            type="number"
            value={it.yearsOfExperience?.toString() ?? ""}
            onChange={(v) => update(i, { yearsOfExperience: v ? Number(v) : null })}
          />
        </Row>
      )}
    />
  );
}

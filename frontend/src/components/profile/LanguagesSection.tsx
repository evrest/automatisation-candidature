import { useProfile } from "../../contexts/ProfileContext";
import { useArrayField } from "../../hooks/useArrayField";
import { GlobeIcon } from "../icons/Icon";
import type { Language } from "../../types/profile";
import { Field, Row } from "../ui/Field";
import { RepeatableSection } from "../ui/RepeatableSection";

const blank = (order: number): Language => ({ name: "", level: "", order });

export default function LanguagesSection() {
  const { profile, setField } = useProfile();
  const items = profile.languages;
  const { add, remove, update } = useArrayField(items, setField("languages"));

  return (
    <RepeatableSection
      title="Langues"
      subtitle="Niveau CECRL ou descriptif libre."
      items={items}
      onAdd={() => add(blank(items.length))}
      onRemove={remove}
      addLabel="Ajouter une langue"
      emptyLabel="Aucune langue renseignée."
      emptyIcon={<GlobeIcon size={20} />}
      itemLabel={(it) => [it.name, it.level].filter(Boolean).join(" — ")}
      renderItem={(it, i) => (
        <Row>
          <Field label="Langue" value={it.name} onChange={(v) => update(i, { name: v })} />
          <Field
            label="Niveau"
            value={it.level}
            onChange={(v) => update(i, { level: v })}
            placeholder="A1, A2, B1, B2, C1, C2, natif"
          />
        </Row>
      )}
    />
  );
}

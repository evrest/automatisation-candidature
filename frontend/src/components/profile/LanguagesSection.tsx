import type { Language } from "../../types/profile";
import { useArrayField } from "../../hooks/useArrayField";
import { Field, Row } from "../ui/Field";
import { RepeatableSection } from "../ui/RepeatableSection";

interface Props {
  items: Language[];
  setItems: (next: Language[]) => void;
}

const blank = (order: number): Language => ({ name: "", level: "", order });

export default function LanguagesSection({ items, setItems }: Props) {
  const { add, remove, update } = useArrayField(items, setItems);

  return (
    <RepeatableSection
      title="Langues"
      items={items}
      onAdd={() => add(blank(items.length))}
      onRemove={remove}
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

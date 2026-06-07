import type { ReactNode } from "react";

interface Props<T> {
  title: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
  itemLabel: (item: T, index: number) => string;
  addLabel?: string;
  emptyLabel?: string;
}

export function RepeatableSection<T>({
  title,
  items,
  onAdd,
  onRemove,
  renderItem,
  itemLabel,
  addLabel = "+ Ajouter",
  emptyLabel = "Aucun élément",
}: Props<T>) {
  return (
    <section className="section">
      <div className="toolbar">
        <h2 style={{ margin: 0, border: 0, padding: 0 }}>{title}</h2>
        <button type="button" className="btn btn-sm toolbar-right" onClick={onAdd}>
          {addLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="muted">{emptyLabel}</p>
      ) : (
        items.map((item, index) => (
          <div className="item-card" key={index}>
            <div className="item-card-header">
              <h3>{itemLabel(item, index) || `Élément ${index + 1}`}</h3>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => onRemove(index)}
              >
                Supprimer
              </button>
            </div>
            {renderItem(item, index)}
          </div>
        ))
      )}
    </section>
  );
}

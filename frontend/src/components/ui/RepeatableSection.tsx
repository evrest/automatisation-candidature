import type { ReactNode } from "react";

import { PlusIcon, TrashIcon } from "../icons/Icon";

interface Props<T> {
  title: string;
  subtitle?: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
  itemLabel: (item: T, index: number) => string;
  addLabel?: string;
  emptyLabel?: string;
  emptyIcon?: ReactNode;
}

export function RepeatableSection<T>({
  title,
  subtitle,
  items,
  onAdd,
  onRemove,
  renderItem,
  itemLabel,
  addLabel = "Ajouter",
  emptyLabel = "Aucun élément pour l'instant.",
  emptyIcon,
}: Props<T>) {
  return (
    <section className="card">
      <header className="card-header">
        <div>
          <h2 className="card-title">{title}</h2>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        <div className="card-actions">
          <button type="button" className="btn btn-subtle btn-sm" onClick={onAdd}>
            <PlusIcon size={14} />
            {addLabel}
          </button>
        </div>
      </header>

      <div className="card-body">
        {items.length === 0 ? (
          <div className="empty">
            {emptyIcon && <div className="empty-icon">{emptyIcon}</div>}
            <div>{emptyLabel}</div>
          </div>
        ) : (
          items.map((item, index) => {
            const label = itemLabel(item, index);
            return (
              <div className="item-card" key={index}>
                <div className="item-card-header">
                  <div className={"item-card-title" + (label ? "" : " empty")}>
                    {label || `Sans titre (${index + 1})`}
                  </div>
                  <div className="flex-spacer" />
                  <button
                    type="button"
                    className="btn btn-danger btn-icon"
                    onClick={() => onRemove(index)}
                    title="Supprimer"
                    aria-label="Supprimer"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
                <div className="item-card-body">{renderItem(item, index)}</div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

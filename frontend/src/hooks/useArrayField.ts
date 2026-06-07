import { useCallback } from "react";

/** Gère add/remove/update sur un tableau imbriqué dans un state parent. */
export function useArrayField<T>(
  items: T[],
  setItems: (next: T[]) => void,
) {
  const add = useCallback(
    (item: T) => setItems([...items, item]),
    [items, setItems],
  );

  const remove = useCallback(
    (index: number) => setItems(items.filter((_, i) => i !== index)),
    [items, setItems],
  );

  const update = useCallback(
    (index: number, patch: Partial<T>) =>
      setItems(items.map((it, i) => (i === index ? { ...it, ...patch } : it))),
    [items, setItems],
  );

  return { add, remove, update };
}

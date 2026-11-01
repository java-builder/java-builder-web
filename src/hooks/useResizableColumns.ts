import { useState, useEffect, useCallback, useMemo } from "react";

export interface ResizableColumn {
  id: string;
  label: string;
  defaultWidth: number;
  minWidth?: number;
  maxWidth?: number;
  align?: "left" | "right";
}

interface UseResizableColumnsOptions {
  storageKey?: string;
  columns: ResizableColumn[];
}

export function useResizableColumns({ storageKey, columns }: UseResizableColumnsOptions) {
  // Build default widths map
  const defaultMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const col of columns) {
      map[col.id] = col.defaultWidth;
    }
    return map;
  }, [columns]);

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(defaultMap);
  const [resizingColId, setResizingColId] = useState<string | null>(null);

  // Load saved widths from localStorage on mount
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "object" && parsed !== null) {
          setColumnWidths((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      }
    } catch (e) {
      console.warn("Failed to read column widths from localStorage", e);
    }
  }, [storageKey]);

  // Handle drag resizing
  const handleMouseDown = useCallback(
    (colId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startWidth = columnWidths[colId] || defaultMap[colId] || 150;
      const col = columns.find((c) => c.id === colId);
      const minWidth = col?.minWidth ?? 70;
      const maxWidth = col?.maxWidth ?? 1200;

      setResizingColId(colId);

      const previousUserSelect = document.body.style.userSelect;
      const previousCursor = document.body.style.cursor;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";

      let latestWidth = startWidth;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = Math.min(maxWidth, Math.max(minWidth, Math.round(startWidth + deltaX)));
        latestWidth = newWidth;

        setColumnWidths((prev) => {
          if (prev[colId] === newWidth) return prev;
          return { ...prev, [colId]: newWidth };
        });
      };

      const onMouseUp = () => {
        document.body.style.userSelect = previousUserSelect;
        document.body.style.cursor = previousCursor;
        setResizingColId(null);

        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);

        if (storageKey && typeof window !== "undefined") {
          try {
            setColumnWidths((current) => {
              const updated = { ...current, [colId]: latestWidth };
              localStorage.setItem(storageKey, JSON.stringify(updated));
              return updated;
            });
          } catch (err) {
            console.error("Failed to persist column widths", err);
          }
        }
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [columnWidths, defaultMap, columns, storageKey]
  );

  // Double-click to reset single column to default
  const handleDoubleClick = useCallback(
    (colId: string) => {
      const def = defaultMap[colId];
      if (def) {
        setColumnWidths((prev) => {
          const updated = { ...prev, [colId]: def };
          if (storageKey && typeof window !== "undefined") {
            try {
              localStorage.setItem(storageKey, JSON.stringify(updated));
            } catch {}
          }
          return updated;
        });
      }
    },
    [defaultMap, storageKey]
  );

  // Reset all columns
  const resetAllWidths = useCallback(() => {
    setColumnWidths(defaultMap);
    if (storageKey && typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch {}
    }
  }, [defaultMap, storageKey]);

  // Check if any width differs from default
  const isCustomized = useMemo(() => {
    return columns.some(
      (col) => (columnWidths[col.id] || defaultMap[col.id]) !== col.defaultWidth
    );
  }, [columns, columnWidths, defaultMap]);

  // Total table width
  const totalTableWidth = useMemo(() => {
    return columns.reduce((sum, col) => sum + (columnWidths[col.id] || col.defaultWidth), 0);
  }, [columns, columnWidths]);

  return {
    columnWidths,
    resizingColId,
    handleMouseDown,
    handleDoubleClick,
    resetAllWidths,
    isCustomized,
    totalTableWidth,
  };
}


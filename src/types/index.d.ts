declare module '@tanstack/react-table' {
    interface TableMeta {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    }
}

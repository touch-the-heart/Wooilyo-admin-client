import { useReactTable, getCoreRowModel } from "@tanstack/react-table";

export const ProductTable = () => {
  const table = useReactTable({
    data: [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
  });
  return <div className="p-4"></div>;
};

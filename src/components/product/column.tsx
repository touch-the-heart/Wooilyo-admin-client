import { GetProductsResponses } from "@/client/types.gen";
import { ColumnDef, RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey?: keyof TData;
    filterVariant?: "text" | "number";
  }
}

type PRODUCT = GetProductsResponses["200"]["data"][number];

export const PRODUCT_COLUMNS: ColumnDef<PRODUCT>[] = [
  {
    accessorKey: "id",
    header: () => <span className="text-xs">ID</span>,
    meta: {
      filterKey: "id",
      filterVariant: "number",
    },
  },
];

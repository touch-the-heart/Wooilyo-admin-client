import { GetProductsResponses } from "@/client/types.gen";
import { ColumnDef, createColumnHelper, RowData } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey?: keyof TData;
    filterVariant?: "text" | "number" | "boolean";
  }
}

type PRODUCT = GetProductsResponses["200"]["data"][number];

// 카테고리 경로를 생성하는 헬퍼 함수
const getCategoryPath = (categories: PRODUCT["categories"]) => {
  if (!categories || categories.length === 0) return "";

  // 레벨별로 카테고리를 정렬
  const sortedCategories = [...categories].sort(
    (a, b) => a.category.level - b.category.level
  );

  // 레벨별로 카테고리 이름을 수집
  const categoryNames = sortedCategories.map((cat) => cat.category.name);

  return categoryNames.join(" > ");
};

// 날짜 포맷팅 함수
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식
};

export const PRODUCT_COLUMNS: ColumnDef<PRODUCT>[] = [
  {
    accessorKey: "images",
    header: "이미지",
    cell: ({ row }) => {
      const product = row.original;
      const mainImage = product.images?.find((img) => img.type === "main");

      return mainImage ? (
        <img
          src={mainImage.url}
          alt={product.name}
          className="w-12 h-12 object-cover rounded-md"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
          <span className="text-xs text-gray-500">No Image</span>
        </div>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "name",
    header: "상품명",
    meta: { filterKey: "name", filterVariant: "text" },
  },
  {
    accessorKey: "categories",
    header: "카테고리",
    cell: ({ row }) => {
      const categories = row.original.categories;
      const categoryPath = getCategoryPath(categories);

      return categoryPath ? (
        <Badge variant="secondary" className="text-sm">
          {categoryPath}
        </Badge>
      ) : (
        <span className="text-gray-400">카테고리 없음</span>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "createdAt",
    header: "생성일",
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    },
    meta: { filterKey: "createdAt", filterVariant: "text" },
  },
  {
    accessorKey: "isVisible",
    header: "공개여부",
    cell: ({ row }) => {
      return row.original.isVisible ? (
        <Badge variant="default">공개</Badge>
      ) : (
        <Badge variant="secondary">비공개</Badge>
      );
    },
    meta: { filterKey: "isVisible", filterVariant: "boolean" },
  },
];

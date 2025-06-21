import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Search,
  Plus,
  ChevronRight,
  Image as ImageIcon,
  InfoIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 도자기 제품 스키마 정의
const ProductListQuerySchema = z.object({
  categoryIds: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(",").map((id) => Number.parseInt(id, 10)) : undefined
    ),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number.parseInt(val, 10) : 15)),
  sortBy: z
    .enum(["newest", "oldest", "asc", "desc"])
    .optional()
    .default("newest"),
});

// 카테고리 계층 구조 정의
type Category = {
  id: number;
  name: string;
  level: number;
  parentId?: number;
};

// 제품 크기 옵션 타입 정의
type SizeOption = {
  id: number;
  size: string;
  price: number;
};

// 제품 이미지 타입 정의
type ProductImage = {
  id: number;
  url: string;
  isMain: boolean;
  displayOrder: number;
};

// 제품 타입 정의 (도자기 전용)
type Product = {
  id: number;
  name: string;
  description: string;
  category: {
    level1: string;
    level2?: string;
    level3?: string;
  };
  categoryIds: number[];
  sizeOptions: SizeOption[];
  images: ProductImage[];
  mainImage: string;
  createdAt: string;
};

export const Route = createFileRoute("/")({
  component: ProductManagement,
});

// 계층형 카테고리 데이터 (도자기 특화)
const mockCategories: Category[] = [
  // 레벨 1 카테고리
  { id: 1, name: "찻잔", level: 1 },
  { id: 2, name: "접시", level: 1 },
  { id: 3, name: "화병", level: 1 },
  { id: 4, name: "그릇", level: 1 },
  // 레벨 2 카테고리
  { id: 11, name: "홍차잔", level: 2, parentId: 1 },
  { id: 12, name: "다도 세트", level: 2, parentId: 1 },
  { id: 13, name: "머그", level: 2, parentId: 1 },
  { id: 21, name: "원형 접시", level: 2, parentId: 2 },
  { id: 22, name: "직사각형 접시", level: 2, parentId: 2 },
  { id: 31, name: "장식용 화병", level: 2, parentId: 3 },
  { id: 32, name: "꽃병", level: 2, parentId: 3 },
  { id: 41, name: "국그릇", level: 2, parentId: 4 },
  { id: 42, name: "밥그릇", level: 2, parentId: 4 },
  // 레벨 3 카테고리
  { id: 111, name: "골드라인 홍차잔", level: 3, parentId: 11 },
  { id: 112, name: "플라워 홍차잔", level: 3, parentId: 11 },
  { id: 211, name: "청화접시", level: 3, parentId: 21 },
  { id: 212, name: "백자접시", level: 3, parentId: 21 },
  { id: 311, name: "달항아리", level: 3, parentId: 31 },
];

// 카테고리 경로 가져오기 함수
const getCategoryPath = (
  categoryId: number
): { level1: string; level2?: string; level3?: string } => {
  const result = { level1: "", level2: undefined, level3: undefined };

  const category = mockCategories.find((c) => c.id === categoryId);
  if (!category) return result;

  if (category.level === 3) {
    result.level3 = category.name;
    const parent = mockCategories.find((c) => c.id === category.parentId);
    if (parent) {
      result.level2 = parent.name;
      const grandparent = mockCategories.find((c) => c.id === parent.parentId);
      if (grandparent) {
        result.level1 = grandparent.name;
      }
    }
  } else if (category.level === 2) {
    result.level2 = category.name;
    const parent = mockCategories.find((c) => c.id === category.parentId);
    if (parent) {
      result.level1 = parent.name;
    }
  } else {
    result.level1 = category.name;
  }

  return result;
};

// 목업 제품 데이터 생성
const generateMockProducts = (): Product[] => {
  const productNames = [
    "청화백자 물결 시리즈",
    "모던 화이트 컬렉션",
    "금빛 달항아리",
    "민트 청자 세트",
    "분청 스트라이프",
    "메이플 오크 시리즈",
    "산뜻한 봄 컬렉션",
    "고요한 밤 시리즈",
    "모닝 브런치 세트",
    "제주 흙 컬렉션",
    "한라산 흙 시리즈",
    "가을 단풍 컬렉션",
    "해변의 조약돌 세트",
    "소나무 숲 컬렉션",
    "달빛 아래 시리즈",
  ];

  const sizeSets = [
    [
      { size: "소 (10cm)", priceMultiplier: 0.7, stockDivisor: 1 },
      { size: "중 (15cm)", priceMultiplier: 1.0, stockDivisor: 1.5 },
      { size: "대 (20cm)", priceMultiplier: 1.5, stockDivisor: 2 },
    ],
    [
      { size: "미니 (8cm)", priceMultiplier: 0.5, stockDivisor: 1 },
      { size: "스탠다드 (16cm)", priceMultiplier: 1.0, stockDivisor: 1.8 },
    ],
    [
      { size: "1인용", priceMultiplier: 0.6, stockDivisor: 1 },
      { size: "2인용", priceMultiplier: 1.0, stockDivisor: 1.5 },
      { size: "4인용", priceMultiplier: 1.8, stockDivisor: 2.5 },
    ],
  ];

  return Array(15)
    .fill(null)
    .map((_, index) => {
      // 카테고리 ID 무작위 선택 (레벨 3 카테고리 중에서)
      const level3CategoryIds = mockCategories
        .filter((c) => c.level === 3)
        .map((c) => c.id);
      const categoryId =
        level3CategoryIds[Math.floor(Math.random() * level3CategoryIds.length)];

      // 기본 가격 설정
      const basePrice = Math.floor(Math.random() * 200000) / 100 + 15000;

      // 사이즈 옵션 선택
      const sizeSetIndex = Math.floor(Math.random() * sizeSets.length);
      const sizeSet = sizeSets[sizeSetIndex];

      // 총 재고 계산을 위한 변수

      // 사이즈별 재고 및 가격 설정
      const sizeOptions = sizeSet.map((sizeOption, idx) => {
        const stock =
          Math.floor((Math.random() * 50) / sizeOption.stockDivisor) + 5;
        return {
          id: index * 10 + idx,
          size: sizeOption.size,
          price:
            Math.floor((basePrice * sizeOption.priceMultiplier) / 100) * 100, // 100원 단위로 반올림
          stock: stock,
        };
      });

      // 이미지 생성
      const mainImageIndex = Math.floor(Math.random() * 3);
      const images = Array(3)
        .fill(null)
        .map((_, imgIdx) => ({
          id: index * 10 + imgIdx,
          url: `https://source.unsplash.com/400x400/?pottery,ceramic&${index}${imgIdx}`,
          isMain: imgIdx === mainImageIndex,
          displayOrder: imgIdx,
        }));

      const mainImage = images.find((img) => img.isMain)?.url || images[0].url;

      return {
        id: index + 1,
        name: productNames[index % productNames.length],
        description: "전통 방식으로 제작된 수제 도자기입니다.",
        category: getCategoryPath(categoryId),
        categoryIds: [categoryId],
        sizeOptions: sizeOptions,
        images: images,
        mainImage: mainImage,
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 10000000000)
        ).toISOString(),
      };
    });
};

const mockProducts = generateMockProducts();

function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: mockProducts.length,
  });
  const [filters, setFilters] = useState({
    search: "",
    categoryIds: [] as number[],
    sortBy: "newest",
  });

  // 데이터 필터링 및 정렬
  useEffect(() => {
    setLoading(true);

    // 필터링
    const filteredProducts = mockProducts.filter((product) => {
      const matchesSearch =
        !filters.search ||
        product.name.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.categoryIds.length === 0 ||
        product.categoryIds.some(
          (catId) =>
            filters.categoryIds.includes(catId) ||
            // 상위 카테고리로 필터링 처리
            filters.categoryIds.some((filterCatId) => {
              const category = mockCategories.find((c) => c.id === catId);
              return category?.parentId === filterCatId;
            })
        );

      return matchesSearch && matchesCategory;
    });

    // 정렬
    let sortedProducts = [...filteredProducts];
    if (filters.sortBy === "newest") {
      sortedProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filters.sortBy === "oldest") {
      sortedProducts.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (filters.sortBy === "asc") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === "desc") {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    // 페이지네이션
    const start = (pagination.current - 1) * pagination.pageSize;
    const paginatedProducts = sortedProducts.slice(
      start,
      start + pagination.pageSize
    );

    setProducts(paginatedProducts);
    setPagination((prev) => ({ ...prev, total: filteredProducts.length }));

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [filters, pagination.current, pagination.pageSize]);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current: page }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">제품 관리</h1>
        <div className="flex gap-2">
          <Link to="/product/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              제품 등록
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="제품명 검색"
          className="pl-10 rounded-lg"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <Card>
        <Table className="whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">제품 정보</TableHead>
              <TableHead className="font-semibold">카테고리</TableHead>
              <TableHead className="font-semibold">가격(사이즈)</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 bg-gray-100 rounded flex items-center justify-center">
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="max-h-full max-w-full object-cover rounded"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                              {product.images.length}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{product.images.length}개의 제품 이미지</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <span>{product.category.level1}</span>
                    {product.category.level2 && (
                      <>
                        <ChevronRight className="h-3 w-3 mx-1" />
                        <span>{product.category.level2}</span>
                      </>
                    )}
                    {product.category.level3 && (
                      <>
                        <ChevronRight className="h-3 w-3 mx-1" />
                        <span>{product.category.level3}</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center">
                          <span>
                            ₩{product.sizeOptions[0].price.toLocaleString()} ~ ₩
                            {Math.max(
                              ...product.sizeOptions.map((o) => o.price)
                            ).toLocaleString()}
                          </span>
                          <InfoIcon className="h-3 w-3 ml-1 text-gray-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="w-72 p-2">
                        <p className="font-medium mb-1">사이즈별 가격:</p>
                        <ul className="space-y-1">
                          {product.sizeOptions.map((option) => (
                            <li
                              key={option.id}
                              className="flex justify-between text-sm"
                            >
                              <span>{option.size}</span>
                              <span>₩{option.price.toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
                            fill="currentColor"
                          />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link to={`/product/${product.id}`} className="w-full">
                          상세보기
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          to={`/product/${product.id}/edit`}
                          className="w-full"
                        >
                          수정
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end p-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    handlePaginationChange(Math.max(1, pagination.current - 1))
                  }
                  className={
                    pagination.current === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {Array.from(
                {
                  length: Math.min(
                    5,
                    Math.ceil(pagination.total / pagination.pageSize)
                  ),
                },
                (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePaginationChange(page)}
                        isActive={pagination.current === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              {Math.ceil(pagination.total / pagination.pageSize) > 5 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() =>
                        handlePaginationChange(
                          Math.ceil(pagination.total / pagination.pageSize)
                        )
                      }
                      isActive={
                        pagination.current ===
                        Math.ceil(pagination.total / pagination.pageSize)
                      }
                    >
                      {Math.ceil(pagination.total / pagination.pageSize)}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePaginationChange(
                      Math.min(
                        Math.ceil(pagination.total / pagination.pageSize),
                        pagination.current + 1
                      )
                    )
                  }
                  className={
                    pagination.current ===
                    Math.ceil(pagination.total / pagination.pageSize)
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
}

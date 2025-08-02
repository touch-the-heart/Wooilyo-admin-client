import { getProducts } from "@/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/product/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (productsData && productsData.data) {
    }
  }, [productsData]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">제품 관리</h1>
        <Link to="/product/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            <span>제품 등록</span>
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="제품명 검색" className="pl-10 rounded-lg" />
      </div>
    </div>
  );
}

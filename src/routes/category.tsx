import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AddCategoryModal } from "@/components/category/AddCategoryModal";
import { EditCategoryModal } from "@/components/category/EditCategoryModal";
import { DeleteCategoryModal } from "@/components/category/DeleteCategoryModal";
import { CategoryRow, NoCategoryRow } from "@/components/category/CategoryRow";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/client";
import { buildCategoryTree } from "@/lib/category";
import { Category, CategoryTreeItem } from "@/components/category/type";
import { Container } from "@/components/layout/container";

export const Route = createFileRoute("/category")({
  component: CategoryManagement,
});

function CategoryManagement() {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryTreeItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (categoriesData && categoriesData.data) {
      const formattedCategories = categoriesData.data.map((cat: any) => ({
        id: cat.id,
        key: cat.key,
        name: cat.name,
        level: cat.level as 1 | 2 | 3,
        parentId: cat.parentId,
        expanded: false,
      }));
      setCategories(formattedCategories);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (!categories.length) return;
    setCategoryTree(buildCategoryTree(categories));
  }, [categories]);

  const toggleExpand = (categoryId: number) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? { ...category, expanded: !category.expanded }
          : category
      )
    );
  };

  const getCategoryParents = () => {
    return categories.filter((cat) => cat.level < 3);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">카테고리 관리</h1>
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          categoryParents={getCategoryParents()}
        />
      </div>

      {/* Categories table in tree view */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>카테고리 이름</TableHead>
              <TableHead>레벨</TableHead>
              <TableHead className="text-right">동작</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoryTree.length === 0 && <NoCategoryRow />}
            {categoryTree.length > 0 &&
              categoryTree.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  onToggleExpand={toggleExpand}
                  onEdit={(category) => {
                    setCurrentCategory(category);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={(category) => {
                    setCurrentCategory(category);
                    setIsDeleteModalOpen(true);
                  }}
                />
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        category={currentCategory}
        categoryParents={getCategoryParents()}
      />
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        category={currentCategory}
      />
    </Container>
  );
}

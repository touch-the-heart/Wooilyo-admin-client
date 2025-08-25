import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData } from "./types";
import { Category, CategoryTreeItem } from "@/components/category/type";
import { flattenCategories } from "@/lib/category";

interface CategorySectionProps {
  form: UseFormReturn<FormData>;
  categories: CategoryTreeItem[];
}

function getCategoryIndentation(category: Category) {
  return category.level === 1 ? (
    ""
  ) : category.level === 2 ? (
    "└─ "
  ) : (
    <>&nbsp; &nbsp; &nbsp; &nbsp; └─ </>
  );
}

export function CategorySection({ form, categories }: CategorySectionProps) {
  // 선택된 카테고리 ID를 추적하기 위한 상태 추가
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  // 서버에서 받아온 기존 카테고리를 컴포넌트 상태로 초기화
  useEffect(() => {
    const formCategoryIds = form.watch("categoryIds");

    // form.categoryIds가 있고 아직 선택된 카테고리가 없을 때만 실행
    if (formCategoryIds && formCategoryIds.length > 0 && !selectedCategoryId) {
      // 가장 하위 카테고리 ID (배열의 마지막 요소)를 선택
      const lastCategoryId = formCategoryIds[formCategoryIds.length - 1];
      setSelectedCategoryId(lastCategoryId.toString());
    }
  }, [form.watch("categoryIds"), selectedCategoryId]);

  // 선택된 카테고리 이름을 찾는 함수
  const getSelectedCategoryName = (categoryId: string): string => {
    if (!categoryId) return "";

    const flatCategories = flattenCategories(categories);
    const selectedCategory = flatCategories.find(
      (cat) => cat.id.toString() === categoryId
    );

    return selectedCategory ? selectedCategory.name : "";
  };

  const findParentCategories = (selectedCategoryId: number): number[] => {
    const flatCategories = flattenCategories(categories);
    const result: number[] = [];
    const selectedCategory = flatCategories.find(
      (cat) => cat.id === selectedCategoryId
    );

    if (!selectedCategory) return result;

    // 선택한 카테고리부터 시작
    result.push(selectedCategory.id);

    // 부모 카테고리들을 재귀적으로 찾기
    const findParents = (category: Category) => {
      if (category.parentId) {
        const parent = flatCategories.find(
          (cat) => cat.id === category.parentId
        );
        if (parent) {
          result.unshift(parent.id); // 배열 앞쪽에 추가 (최상위부터 순서대로)
          findParents(parent);
        }
      }
    };

    findParents(selectedCategory);
    return result;
  };

  // 트리 구조를 재귀적으로 렌더링하는 함수
  const renderCategoryTree = (items: CategoryTreeItem[]): React.ReactNode[] => {
    return items.map((category) => {
      const prefix = getCategoryIndentation(category);

      // 자식 카테고리가 있는지 확인 (선택 가능 여부 결정)
      const hasChildren = category.children && category.children.length > 0;

      return (
        <React.Fragment key={category.id}>
          <SelectItem
            value={category.id.toString()}
            disabled={hasChildren} // 자식이 있는 카테고리는 선택 불가 (폴더 역할만 함)
          >
            {prefix}
            {category.name}
          </SelectItem>
          {/* 자식 카테고리가 있으면 재귀적으로 렌더링 */}
          {category.children && renderCategoryTree(category.children)}
        </React.Fragment>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>카테고리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={selectedCategoryId}
          onValueChange={(value) => {
            setSelectedCategoryId(value);
            const selectedId = parseInt(value);
            const categoryHierarchy = findParentCategories(selectedId);
            form.setValue("categoryIds", categoryHierarchy);
          }}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a category">
              {/* 선택된 카테고리 이름만 표시 (들여쓰기 없이) */}
              {getSelectedCategoryName(selectedCategoryId)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent side="bottom" className="max-h-100">
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {renderCategoryTree(categories)}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

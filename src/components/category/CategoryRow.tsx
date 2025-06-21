import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, Pencil, Trash } from "lucide-react";
import { Category, CategoryTreeItem } from "./type";

interface BaseCategoryRowProps {
  category: CategoryTreeItem;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

interface ExpandableCategoryRowProps extends BaseCategoryRowProps {
  onToggleExpand: (id: number) => void;
}

// Shared components

function CategoryActions({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="mr-2"
        onClick={() => onEdit(category)}
      >
        <Pencil size={14} className="mr-1" />
        수정
      </Button>
      <Button variant="outline" size="sm" onClick={() => onDelete(category)}>
        <Trash size={14} className="mr-1" />
        삭제
      </Button>
    </>
  );
}

function CategoryToggleExpandButton({
  expanded,
  onToggleExpand,
}: {
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggleExpand}
      className="p-0 h-6 w-6 mr-1"
    >
      {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
    </Button>
  );
}

// Level 1 Category Component
function Level1CategoryRow({
  category,
  onToggleExpand,
  onEdit,
  onDelete,
}: ExpandableCategoryRowProps) {
  const hasChildren = category.children && category.children.length > 0;

  return (
    <>
      <TableRow key={category.id}>
        <TableCell className="font-medium">
          <div className="flex items-center">
            {hasChildren && (
              <CategoryToggleExpandButton
                expanded={category.expanded!}
                onToggleExpand={() => onToggleExpand(category.id)}
              />
            )}
            {category.name}
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="text-blue-700">
            레벨 {category.level}
          </Badge>
        </TableCell>

        <TableCell className="text-right">
          <CategoryActions
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TableCell>
      </TableRow>

      {/* Render level 2 children if expanded */}
      {category.expanded &&
        hasChildren &&
        category.children!.map((child) => (
          <Level2CategoryRow
            key={child.id}
            category={child}
            onToggleExpand={onToggleExpand}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </>
  );
}

// Level 2 Category Component
function Level2CategoryRow({
  category,
  onToggleExpand,
  onEdit,
  onDelete,
}: ExpandableCategoryRowProps) {
  const hasChildren = category.children && category.children.length > 0;

  return (
    <>
      <TableRow key={category.id}>
        <TableCell className="font-medium">
          <div className="flex items-center pl-6">
            {hasChildren && (
              <CategoryToggleExpandButton
                expanded={category.expanded!}
                onToggleExpand={() => onToggleExpand(category.id)}
              />
            )}
            {!hasChildren && <span className="ml-7"></span>}
            {category.name}
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className="text-purple-700">
            레벨 {category.level}
          </Badge>
        </TableCell>

        <TableCell className="text-right">
          <CategoryActions
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </TableCell>
      </TableRow>

      {/* Render level 3 children if expanded */}
      {category.expanded &&
        hasChildren &&
        category.children!.map((child) => (
          <Level3CategoryRow
            key={child.id}
            category={child}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </>
  );
}

// Level 3 Category Component
function Level3CategoryRow({
  category,
  onEdit,
  onDelete,
}: BaseCategoryRowProps) {
  return (
    <TableRow key={category.id}>
      <TableCell className="font-medium">
        <div className="flex items-center pl-12">
          <span className="ml-6">└─</span>
          <span className="ml-2"></span>
          {category.name}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-orange-700">
          레벨 {category.level}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <CategoryActions
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}

// Main CategoryRow component that determines which level-specific component to render
export function CategoryRow({
  category,
  onToggleExpand,
  onEdit,
  onDelete,
}: ExpandableCategoryRowProps) {
  // Choose the appropriate component based on category level
  if (category.level === 1) {
    return (
      <Level1CategoryRow
        category={category}
        onToggleExpand={onToggleExpand}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  } else if (category.level === 2) {
    return (
      <Level2CategoryRow
        category={category}
        onToggleExpand={onToggleExpand}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  } else {
    return (
      <Level3CategoryRow
        category={category}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }
}

// Component for when there are no categories
export function NoCategoryRow() {
  return (
    <TableRow>
      <TableCell colSpan={4} className="text-center">
        카테고리가 없습니다.
      </TableCell>
    </TableRow>
  );
}

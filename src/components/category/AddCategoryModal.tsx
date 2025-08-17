import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCategories, PostCategoriesData } from "@/client";
import { Category } from "./type";

interface AddCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categoryParents: Category[];
}

export function AddCategoryModal({
  isOpen,
  onOpenChange,
  categoryParents,
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { mutate: addCategory } = useMutation({
    mutationFn: (data: PostCategoriesData["body"]) =>
      postCategories({ body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      resetForm();
    },
  });

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const level = !parentId
      ? 1
      : categoryParents.find((c) => c.id.toString() === parentId)?.level === 1
        ? 2
        : 3;
    const newCategory = {
      key: name,
      name,
      parentId: parentId ? parseInt(parentId) : undefined,
      level: level as 1 | 2 | 3,
    };
    addCategory(newCategory);
  };

  const resetForm = () => {
    setName("");
    setParentId(null);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />새 카테고리
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 카테고리 추가</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              이름
            </label>
            <Input
              id="name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="parent" className="text-right">
              상위 카테고리
            </label>
            <Select
              value={parentId || "none"}
              onValueChange={(value) => {
                setParentId(value === "none" ? null : value);
              }}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="상위 카테고리 선택">
                  {parentId && parentId !== "none"
                    ? categoryParents.find((c) => c.id.toString() === parentId)
                        ?.name
                    : parentId === "none"
                      ? "없음 (최상위 카테고리)"
                      : "상위 카테고리 선택"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent side="bottom" className="max-h-100">
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="none">없음 (최상위 카테고리)</SelectItem>
                  {categoryParents.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.level > 1 ? "└─ " : ""}
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit}>추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

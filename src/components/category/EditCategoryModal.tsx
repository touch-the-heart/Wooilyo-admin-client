import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Category } from "./type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchCategoriesById } from "@/client";

interface EditCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  categoryParents: Category[];
}

export function EditCategoryModal({
  isOpen,
  onOpenChange,
  category,
  categoryParents,
}: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { mutate: editCategory } = useMutation({
    mutationFn: (data: { id: number; name: string; parentId?: number }) =>
      patchCategoriesById({ body: data, path: { id: data.id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (category) {
      setName(category.name);
      setParentId(category.parentId?.toString() || null);
    }
  }, [category]);

  const handleSubmit = () => {
    if (!category || !name.trim()) return;
    editCategory({
      id: category.id,
      name: name,
      parentId: parentId ? parseInt(parentId) : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>카테고리 수정</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="edit-name" className="text-right">
              이름
            </label>
            <Input
              id="edit-name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {category?.level !== 1 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-parent" className="text-right">
                상위 카테고리
              </label>
              <Select
                value={parentId || ""}
                onValueChange={(value) => setParentId(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryParents
                    .filter(
                      (cat) =>
                        cat.level < (category?.level || 3) &&
                        cat.id !== category?.id
                    )
                    .map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.level > 1 ? "└─ " : ""}
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSubmit}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

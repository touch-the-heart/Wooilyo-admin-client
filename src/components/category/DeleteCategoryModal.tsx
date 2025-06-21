import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteCategoriesById } from "@/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Category } from "./type";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export function DeleteCategoryModal({
  isOpen,
  onOpenChange,
  category,
}: DeleteCategoryModalProps) {
  const queryClient = useQueryClient();
  const { mutate: deleteCategory } = useMutation({
    mutationFn: (id: number) => deleteCategoriesById({ path: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onOpenChange(false);
    },
  });

  const onDelete = () => {
    if (!category) return;
    deleteCategory(category.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>카테고리 삭제</DialogTitle>
        </DialogHeader>
        <p>
          '{category?.name}' 카테고리를 삭제하시겠습니까? 이 작업은 되돌릴 수
          없습니다.
        </p>
        {category?.level !== 3 && (
          <p className="text-destructive mt-2">
            경고: 이 카테고리에 속한 모든 하위 카테고리가 존재하면 삭제되지
            않습니다.
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

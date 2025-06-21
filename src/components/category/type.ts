// Types for our category structure
export interface Category {
  id: number;
  key: string;
  name: string;
  level: 1 | 2 | 3;
  parentId: number | null;
  expanded?: boolean; // For tracking expanded state in tree view
}

export interface CategoryTreeItem extends Category {
  children?: CategoryTreeItem[];
}

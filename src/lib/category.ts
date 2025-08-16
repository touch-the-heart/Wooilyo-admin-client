import { Category, CategoryTreeItem } from "@/components/category/type";

export const buildCategoryTree = (categories: Category[]) => {
  const rootCategories: CategoryTreeItem[] = categories
    .filter((cat) => cat.level === 1)
    .map((cat) => ({ ...cat, children: [] }));

  // For each level 1 category
  rootCategories.forEach((rootCat) => {
    // Get its level 2 children
    const level2Children: any[] = categories
      .filter((cat) => cat.level === 2 && cat.parentId === rootCat.id)
      .map((cat) => ({ ...cat, children: [] }));

    // For each level 2 category
    level2Children.forEach((level2Cat) => {
      // Get its level 3 children
      const level3Children = categories
        .filter((cat) => cat.level === 3 && cat.parentId === level2Cat.id)
        .map((cat) => ({ ...cat }));

      // Add level 3 children to level 2 parent
      if (level3Children.length > 0) {
        level2Cat.children = level3Children;
      }
    });

    // Add level 2 children to level 1 parent
    if (level2Children.length > 0) {
      rootCat.children = level2Children;
    }
  });

  return rootCategories;
};

export const flattenCategories = (items: CategoryTreeItem[]): Category[] => {
  const result: Category[] = [];

  const flatten = (items: CategoryTreeItem[]) => {
    items.forEach((item) => {
      result.push({
        id: item.id,
        key: item.key,
        name: item.name,
        level: item.level,
        parentId: item.parentId,
      });
      if (item.children) {
        flatten(item.children);
      }
    });
  };

  flatten(items);
  return result;
};

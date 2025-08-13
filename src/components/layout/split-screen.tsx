import React, { ReactNode, Children, isValidElement } from "react";
import { cn } from "@/lib/utils";

interface SplitScreenProps {
  children: ReactNode;
  leftRatio?: 1 | 2; // 왼쪽 영역의 비율 (1은 1/2, 2는 2/3)
  gap?: number; // 간격 (Tailwind spacing scale)
  equalHeight?: boolean; // 양쪽 높이를 같게 만들지 여부
  className?: string;
}

interface SplitScreenLeftProps {
  children: ReactNode;
  className?: string;
}

interface SplitScreenRightProps {
  children: ReactNode;
  className?: string;
}

// Left 컴포넌트
function SplitScreenLeft({ children, className }: SplitScreenLeftProps) {
  return <div className={className}>{children}</div>;
}

// Right 컴포넌트
function SplitScreenRight({ children, className }: SplitScreenRightProps) {
  return <div className={className}>{children}</div>;
}

// 메인 SplitScreen 컴포넌트
function SplitScreenRoot({
  children,
  leftRatio = 2,
  gap = 6,
  equalHeight = true,
  className,
}: SplitScreenProps) {
  const gridColsClass =
    leftRatio === 2
      ? "grid-cols-1 lg:grid-cols-3"
      : "grid-cols-1 lg:grid-cols-2";

  const gapClass = `gap-${gap}`;
  const heightClass = equalHeight ? "items-stretch" : "";

  // children에서 Left와 Right 컴포넌트를 찾아서 분리
  const childrenArray = Children.toArray(children);

  let leftContent: ReactNode = null;
  let rightContent: ReactNode = null;

  childrenArray.forEach((child) => {
    if (isValidElement(child)) {
      if (child.type === SplitScreenLeft) {
        const leftColSpanClass = leftRatio === 2 ? "lg:col-span-2" : "";
        const props = child.props as SplitScreenLeftProps;
        const heightClass = equalHeight ? "h-full" : "";
        leftContent = (
          <div className={cn(leftColSpanClass, heightClass, props.className)}>
            {props.children}
          </div>
        );
      } else if (child.type === SplitScreenRight) {
        const props = child.props as SplitScreenRightProps;
        const heightClass = equalHeight ? "h-full" : "";
        rightContent = (
          <div className={cn(heightClass, props.className)}>
            {props.children}
          </div>
        );
      }
    }
  });

  return (
    <div
      className={cn(
        `grid ${gridColsClass} ${gapClass} ${heightClass}`,
        className
      )}
    >
      {leftContent}
      {rightContent}
    </div>
  );
}

// Compound Component 패턴으로 조합
export const SplitScreen = Object.assign(SplitScreenRoot, {
  Left: SplitScreenLeft,
  Right: SplitScreenRight,
});

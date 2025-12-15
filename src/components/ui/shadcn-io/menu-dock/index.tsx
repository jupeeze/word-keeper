"use client";

import React, { useState, useRef, useEffect } from "react";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

import type { LearningStep } from "@/types";

type IconComponentType = React.ElementType<{ className?: string }>;

export interface MenuDockItem {
  label: LearningStep;
  icon: IconComponentType;
  onClick?: () => void;
  isComplete?: boolean;
}

export interface MenuDockProps {
  items: MenuDockItem[];
  className?: string;
  variant?: "default" | "compact" | "large";
  orientation?: "horizontal" | "vertical";
  showLabels?: boolean;
  animated?: boolean;
  activeIndex: number;
  onItemClick?: (index: number, item: MenuDockItem) => void;
  isStepAccessible: (label: LearningStep) => boolean;
}

export const MenuDock: React.FC<MenuDockProps> = ({
  items,
  className,
  variant = "default",
  orientation = "horizontal",
  showLabels = true,
  animated = true,
  activeIndex,
  onItemClick,
  isStepAccessible,
}) => {
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlineLeft, setUnderlineLeft] = useState(0);

  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const updateUnderline = () => {
      const activeButton = itemRefs.current[activeIndex];
      const activeText = textRefs.current[activeIndex];

      if (
        activeButton &&
        activeText &&
        showLabels &&
        orientation === "horizontal"
      ) {
        const buttonRect = activeButton.getBoundingClientRect();
        const textRect = activeText.getBoundingClientRect();
        const containerRect =
          activeButton.parentElement?.getBoundingClientRect();

        if (containerRect) {
          setUnderlineWidth(textRect.width);
          setUnderlineLeft(
            buttonRect.left -
              containerRect.left +
              (buttonRect.width - textRect.width) / 2,
          );
        }
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeIndex, items, showLabels, orientation]);

  const handleItemClick = (index: number, item: MenuDockItem) => {
    if (onItemClick) {
      onItemClick(index, item);
    } else {
      item.onClick?.();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return {
          container: "p-1",
          item: "p-2 min-w-12",
          icon: "h-4 w-4",
          text: "text-xs",
        };
      case "large":
        return {
          container: "p-3",
          item: "p-3 min-w-16",
          icon: "h-6 w-6",
          text: "text-base",
        };
      default:
        return {
          container: "p-2",
          item: "p-2 min-w-14",
          icon: "h-5 w-5",
          text: "text-sm",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <nav
      className={cn(
        "bg-card relative flex inline-flex w-full items-center justify-between rounded-xl shadow",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        styles.container,
        className,
      )}
      role="navigation"
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const IconComponent = item.icon;
        const isComplete = item.isComplete ?? false;
        const isAccessible = isStepAccessible(item.label);

        const getButtonStyles = () => {
          if (animated && isActive) {
            return "animate-bounce";
          }
          if (showLabels) {
            return "mb-1";
          }
        };

        const getLabelStyles = () => {
          if (!isActive) {
            return "text-gray-500";
          }
        };

        return (
          <button
            key={`${item.label}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-lg transition-all duration-200",
              "hover:bg-muted/50 focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              styles.item,
              isActive && "text-primary",
              !isActive && "text-muted-foreground hover:text-foreground",
              isAccessible && "cursor-pointer",
              !isAccessible && "cursor-not-allowed opacity-60",
            )}
            onClick={() => isAccessible && handleItemClick(index, item)}
            aria-label={item.label}
            type="button"
            disabled={!isAccessible}
          >
            <div
              className={cn(
                "mb-1 flex items-center justify-center transition-all duration-200",
                getButtonStyles(),
              )}
            >
              {isComplete || isActive ? (
                <IconComponent
                  className={cn(styles.icon, "transition-colors duration-200")}
                />
              ) : (
                <Lock
                  className={cn(styles.icon, "transition-colors duration-200")}
                />
              )}
            </div>

            {showLabels && (
              <span
                ref={(el) => {
                  textRefs.current[index] = el;
                }}
                className={cn(
                  "text-sm font-medium capitalize transition-colors duration-200",
                  getLabelStyles(),
                  "whitespace-nowrap",
                )}
              >
                {item.label}
              </span>
            )}
          </button>
        );
      })}

      {/* Animated underline for horizontal orientation with labels */}
      {showLabels && orientation === "horizontal" && (
        <div
          className={cn(
            "bg-primary absolute bottom-2 h-0.5 rounded-full transition-all duration-300 ease-out",
            animated ? "transition-all duration-300" : "",
          )}
          style={{
            width: `${underlineWidth}px`,
            left: `${underlineLeft}px`,
          }}
        />
      )}

      {/* Active indicator for vertical orientation or no labels */}
      {(!showLabels || orientation === "vertical") && (
        <div
          className={cn(
            "bg-primary absolute rounded-full transition-all duration-300",
            orientation === "vertical"
              ? "left-1 h-6 w-1"
              : "bottom-0.5 h-0.5 w-6",
          )}
          style={{
            [orientation === "vertical" ? "top" : "left"]:
              orientation === "vertical"
                ? `${activeIndex * (variant === "large" ? 64 : variant === "compact" ? 56 : 60) + (variant === "large" ? 19 : variant === "compact" ? 16 : 18)}px`
                : `${activeIndex * (variant === "large" ? 64 : variant === "compact" ? 56 : 60) + (variant === "large" ? 19 : variant === "compact" ? 16 : 18)}px`,
          }}
        />
      )}
    </nav>
  );
};

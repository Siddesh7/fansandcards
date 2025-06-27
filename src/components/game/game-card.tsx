"use client";

import { AnswerCard } from "../../types/game";
import { cn } from "@/lib/utils";

interface GameCardProps {
  card: AnswerCard;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const rarityColors = {
  common: "from-gray-500 to-gray-600",
  rare: "from-blue-500 to-blue-600",
  epic: "from-purple-500 to-purple-600",
  legendary: "from-yellow-500 to-orange-500",
};

const sizeClasses = {
  sm: "w-24 h-32 text-xs",
  md: "w-32 h-44 text-sm",
  lg: "w-40 h-56 text-base",
};

export const GameCard = ({
  card,
  isSelected = false,
  onClick,
  size = "md",
  className,
}: GameCardProps) => {
  return (
    <div
      className={cn(
        "relative cursor-pointer transform transition-all duration-200",
        sizeClasses[size],
        "hover:scale-105 hover:z-10",
        isSelected && "scale-110 z-20",
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "absolute inset-0 w-full h-full rounded-lg border-2 overflow-hidden",
          "bg-gradient-to-br text-white shadow-lg",
          isSelected
            ? "border-yellow-400 shadow-yellow-400/50"
            : "border-gray-700",
          rarityColors[card.rarity]
        )}
      >
        {/* Card Content */}
        <div className="relative h-full flex flex-col p-3">
          {/* Rarity indicator */}
          <div className="absolute top-2 right-2">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                card.rarity === "legendary" && "bg-yellow-400",
                card.rarity === "epic" && "bg-purple-400",
                card.rarity === "rare" && "bg-blue-400",
                card.rarity === "common" && "bg-gray-400"
              )}
            />
          </div>

          {/* Card text */}
          <div className="flex-1 flex items-center justify-center text-center">
            <p
              className={cn(
                "font-bold leading-tight",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                size === "lg" && "text-base"
              )}
            >
              {card.text}
            </p>
          </div>

          {/* Category badge */}
          <div className="mt-2">
            <span
              className={cn(
                "inline-block px-2 py-1 bg-black/30 rounded text-xs font-medium",
                "backdrop-blur-sm border border-white/20"
              )}
            >
              {card.category}
            </span>
          </div>
        </div>

        {/* Selection ring */}
        {isSelected && (
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 opacity-75 blur-sm -z-10" />
        )}
      </div>
    </div>
  );
};

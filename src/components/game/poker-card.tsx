"use client";

import { AnswerCard } from "../../types/game";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Star, Sparkles, Crown, Zap } from "lucide-react";

interface PokerCardProps {
  card: AnswerCard;
  isSelected?: boolean;
  onClick?: () => void;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  isRevealed?: boolean;
  showBack?: boolean;
}

const rarityConfig = {
  common: {
    gradient: "from-gray-400 via-gray-500 to-gray-600",
    border: "border-gray-300",
    glow: "shadow-gray-400/20",
    icon: Star,
    iconColor: "text-gray-600",
  },
  rare: {
    gradient: "from-blue-400 via-blue-500 to-blue-600",
    border: "border-blue-300",
    glow: "shadow-blue-400/30",
    icon: Sparkles,
    iconColor: "text-blue-600",
  },
  epic: {
    gradient: "from-purple-400 via-purple-500 to-purple-600",
    border: "border-purple-300",
    glow: "shadow-purple-400/40",
    icon: Zap,
    iconColor: "text-purple-600",
  },
  legendary: {
    gradient: "from-amber-400 via-yellow-500 to-orange-500",
    border: "border-amber-300",
    glow: "shadow-amber-400/50",
    icon: Crown,
    iconColor: "text-amber-600",
  },
};

const sizeClasses = {
  xs: "w-16 h-24",
  sm: "w-20 h-28",
  md: "w-24 h-36",
  lg: "w-32 h-48",
};

const textSizeClasses = {
  xs: "text-[8px] leading-tight",
  sm: "text-[10px] leading-tight",
  md: "text-xs leading-normal",
  lg: "text-sm leading-normal",
};

export const PokerCard = ({
  card,
  isSelected = false,
  onClick,
  size = "md",
  className,
  isRevealed = true,
  showBack = false,
}: PokerCardProps) => {
  const config = rarityConfig[card.rarity];
  const IconComponent = config.icon;

  if (showBack || !isRevealed) {
    return (
      <motion.div
        className={cn(
          "relative cursor-pointer transform transition-all duration-300",
          sizeClasses[size],
          "hover:scale-105",
          className
        )}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 w-full h-full rounded-lg bg-gradient-to-br from-red-800 via-red-900 to-red-950 border-2 border-red-600 shadow-lg overflow-hidden">
          {/* Card back pattern */}
          <div className="absolute inset-2 rounded-md bg-gradient-to-br from-red-700 to-red-800 border border-red-500">
            <div className="absolute inset-1 rounded border border-red-400/50">
              {/* Decorative pattern */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 bg-red-300/20 rounded-full border border-red-300/30 flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-200/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        "relative cursor-pointer transform transition-all duration-300",
        sizeClasses[size],
        "hover:scale-105 hover:z-10",
        isSelected && "scale-110 z-20",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ rotateY: 180 }}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Card container */}
      <div
        className={cn(
          "absolute inset-0 w-full h-full rounded-lg border-2 overflow-hidden shadow-xl",
          "bg-gradient-to-br",
          config.gradient,
          config.border,
          config.glow,
          isSelected && "ring-2 ring-yellow-400 ring-opacity-75"
        )}
      >
        {/* Card background - clean white */}
        <div className="absolute inset-[3px] rounded-lg bg-white shadow-inner">
          {/* Top corner rarity indicator */}
          <div className="absolute top-2 left-2 flex flex-col items-center">
            <IconComponent
              size={size === "xs" ? 10 : size === "sm" ? 12 : 14}
              className={config.iconColor}
            />
            <div
              className={cn(
                "font-bold uppercase tracking-wide mt-0.5",
                config.iconColor,
                size === "xs"
                  ? "text-[6px]"
                  : size === "sm"
                  ? "text-[7px]"
                  : "text-[8px]"
              )}
            >
              {card.rarity.charAt(0)}
            </div>
          </div>

          {/* Bottom corner (rotated) */}
          <div className="absolute bottom-2 right-2 flex flex-col items-center rotate-180">
            <IconComponent
              size={size === "xs" ? 10 : size === "sm" ? 12 : 14}
              className={config.iconColor}
            />
            <div
              className={cn(
                "font-bold uppercase tracking-wide mt-0.5",
                config.iconColor,
                size === "xs"
                  ? "text-[6px]"
                  : size === "sm"
                  ? "text-[7px]"
                  : "text-[8px]"
              )}
            >
              {card.rarity.charAt(0)}
            </div>
          </div>

          {/* Main content area - full height for text */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full h-full flex items-center justify-center">
              <p
                className={cn(
                  "text-center font-medium text-gray-800 px-1",
                  textSizeClasses[size]
                )}
                style={{
                  fontFamily:
                    "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif",
                  lineHeight:
                    size === "xs" ? "1.1" : size === "sm" ? "1.2" : "1.3",
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {card.text}
              </p>
            </div>
          </div>
        </div>

        {/* Selection glow effect */}
        {isSelected && (
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 opacity-75 blur-sm -z-10" />
        )}

        {/* Subtle shine effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg opacity-10 pointer-events-none",
            "bg-gradient-to-br from-white via-transparent to-transparent"
          )}
        />
      </div>
    </motion.div>
  );
};

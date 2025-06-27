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
    background: "bg-white/10 backdrop-blur-md",
    border: "border-gray-300/20",
    glow: "shadow-gray-400/20",
    icon: Star,
    iconColor: "text-gray-600",
  },
  rare: {
    background: "bg-cyan-400/15 backdrop-blur-md",
    border: "border-cyan-300/30",
    glow: "shadow-cyan-400/30",
    icon: Sparkles,
    iconColor: "text-cyan-600",
  },
  epic: {
    background: "bg-purple-400/15 backdrop-blur-md",
    border: "border-purple-300/30",
    glow: "shadow-purple-400/40",
    icon: Zap,
    iconColor: "text-purple-600",
  },
  legendary: {
    background: "bg-yellow-400/15 backdrop-blur-md",
    border: "border-yellow-300/30",
    glow: "shadow-yellow-400/50",
    icon: Crown,
    iconColor: "text-yellow-600",
  },
};

const sizeClasses = {
  xs: "w-20 h-24",
  sm: "w-28 h-28",
  md: "w-32 h-36",
  lg: "w-40 h-48",
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
          className
        )}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ scale: { duration: 0.1, ease: "easeOut" } }}
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
        "hover:z-10",
        isSelected && "scale-110 z-20",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ rotateY: 180 }}
      animate={{ rotateY: 0 }}
      transition={{
        rotateY: { duration: 0.6 },
        scale: { duration: 0.1, ease: "easeOut" },
      }}
    >
      {/* Card container */}
      <div
        className={cn(
          "absolute inset-0 w-full h-full rounded-lg border-2 overflow-hidden shadow-xl",
          config.background,
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

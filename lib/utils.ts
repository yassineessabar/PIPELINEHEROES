import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`
  }
  return xp.toString()
}

export function calculateLevel(xp: number): number {
  if (xp < 1000) return 1
  if (xp < 3000) return 2
  if (xp < 6000) return 3
  if (xp < 10000) return 4
  if (xp < 15000) return 5

  // For levels above 5, use exponential scaling
  let level = 5
  let requiredXP = 15000
  let increment = 7000

  while (xp >= requiredXP) {
    level++
    requiredXP += increment
    increment = Math.floor(increment * 1.2)
  }

  return level
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)

  if (currentLevel === 1) return 1000
  if (currentLevel === 2) return 3000
  if (currentLevel === 3) return 6000
  if (currentLevel === 4) return 10000
  if (currentLevel === 5) return 15000

  let level = 5
  let requiredXP = 15000
  let increment = 7000

  while (level < currentLevel) {
    level++
    requiredXP += increment
    increment = Math.floor(increment * 1.2)
  }

  return requiredXP + increment
}

export function getXPProgressToNextLevel(currentXP: number): { current: number, max: number, percentage: number } {
  const currentLevel = calculateLevel(currentXP)
  const nextLevelXP = getXPForNextLevel(currentXP)

  let currentLevelXP = 0
  if (currentLevel > 1) {
    currentLevelXP = getXPForNextLevel(currentXP - 1) - getXPForNextLevel(currentXP - 1) + getXPForNextLevel(0)
  }

  const progress = currentXP - currentLevelXP
  const max = nextLevelXP - currentLevelXP
  const percentage = Math.floor((progress / max) * 100)

  return { current: progress, max, percentage }
}
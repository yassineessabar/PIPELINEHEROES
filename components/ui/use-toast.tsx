'use client'

// Simple toast hook for demo purposes
// In production, you'd use a proper toast library like react-hot-toast or sonner

import { useState, useCallback } from 'react'

interface Toast {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

let toastCount = 0

export function useToast() {
  const toast = useCallback(({ title, description, variant = 'default', duration = 3000 }: Toast) => {
    const toastId = `toast-${++toastCount}`

    // Create toast element
    const toastElement = document.createElement('div')
    toastElement.id = toastId
    toastElement.className = `
      fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm
      ${variant === 'destructive'
        ? 'bg-red-900 border-red-700 text-red-100'
        : 'bg-obsidian border-gold text-gold'
      }
      border-2 animate-in slide-in-from-right-full
    `

    toastElement.innerHTML = `
      <div class="font-bold">${title}</div>
      ${description ? `<div class="text-sm mt-1 opacity-90">${description}</div>` : ''}
    `

    // Add to DOM
    document.body.appendChild(toastElement)

    // Remove after duration
    setTimeout(() => {
      const element = document.getElementById(toastId)
      if (element) {
        element.style.animation = 'slide-out-to-right-full 0.2s ease-in-out'
        setTimeout(() => {
          document.body.removeChild(element)
        }, 200)
      }
    }, duration)
  }, [])

  return { toast }
}
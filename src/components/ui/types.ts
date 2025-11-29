/**
 * Shared types and utilities for UI components
 */

import type { ReactNode } from "react"

/**
 * Common size variants used across UI components
 */
export type Size = "sm" | "md" | "lg"

/**
 * Common color variants used across UI components
 */
export type ColorVariant = "default" | "success" | "warning" | "error"

/**
 * Utility type for components that accept className
 */
export type WithClassName<T = {}> = T & {
    className?: string
}

/**
 * Utility type for components that accept children
 */
export type WithChildren<T = {}> = T & {
    children?: ReactNode
}

/**
 * Utility type for components that accept both className and children
 */
export type WithClassNameAndChildren<T = {}> = WithClassName<WithChildren<T>>

/**
 * Icon position for components that support icons
 */
export type IconPosition = "left" | "right"

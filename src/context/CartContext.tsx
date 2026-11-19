/**
 * CartContext re-exports the Zustand cart store as a React context hook
 * so components can consume cart state without importing the store directly.
 * This keeps the door open for swapping the underlying implementation.
 */
'use client';

export { useCartStore } from '@/store/cartStore';

'use client';

import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/store/cartStore';
import { STRINGS } from '@/lib/strings';

export default function CartBadge() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <button
      aria-label={STRINGS.cart.label}
      className="relative inline-flex items-center justify-center rounded-full p-2 text-rose-600 hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition"
    >
      <ShoppingCartIcon className="h-7 w-7" />
      {count > 0 && (
        <span
          aria-live="polite"
          aria-atomic="true"
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[11px] font-bold text-white shadow"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

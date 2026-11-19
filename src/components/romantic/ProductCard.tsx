'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { STRINGS } from '@/lib/strings';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onOrderNow: (product: Product) => void;
}

export default function ProductCard({ product, onOrderNow }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddToCart = async () => {
    if (adding) return;
    setAdding(true);

    // Simulate a brief async operation (e.g. syncing with a remote cart API)
    await new Promise<void>((resolve) => setTimeout(resolve, 400));

    addItem({ id: product.id, name: product.name, price: product.price });
    setAdding(false);
    setAdded(true);

    if (addedTimerRef.current) clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setAdded(false), 1500);
  };

  const handleOrderNow = () => {
    onOrderNow(product);
  };

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-rose-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-rose-50">
        <Image
          src={imgSrc}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() =>
            setImgSrc(
              `https://placehold.co/800x600/ffe4e6/9f1239?text=${encodeURIComponent(product.name)}`
            )
          }
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-serif text-lg font-bold text-rose-800 line-clamp-2">
          {product.name}
        </h2>
        <p className="mt-2 flex-1 text-sm text-gray-500 line-clamp-3">
          {product.description}
        </p>
        <p className="mt-3 text-xl font-extrabold text-rose-600">
          {formatCurrency(product.price)}
        </p>

        {/* CTA Buttons */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            aria-disabled={adding}
            aria-label={`${STRINGS.product.addToCart}: ${product.name}`}
            className={[
              'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2',
              added
                ? 'bg-green-500 text-white'
                : 'bg-rose-500 text-white hover:bg-rose-600',
              adding ? 'cursor-not-allowed opacity-70' : '',
            ].join(' ')}
          >
            {adding ? (
              <>
                <Spinner />
                {STRINGS.product.adding}
              </>
            ) : added ? (
              STRINGS.product.added
            ) : (
              STRINGS.product.addToCart
            )}
          </button>

          {/* Order Now */}
          <button
            onClick={handleOrderNow}
            aria-label={`${STRINGS.product.orderNow}: ${product.name}`}
            className="flex flex-1 items-center justify-center rounded-full border-2 border-rose-400 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
          >
            {STRINGS.product.orderNow}
          </button>
        </div>
      </div>
    </article>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

'use client';

import { useState, useRef } from 'react';
import RomanticHero from '@/components/romantic/RomanticHero';
import ProductCard from '@/components/romantic/ProductCard';
import OrderFormModal from '@/components/romantic/OrderFormModal';
import CartBadge from '@/components/romantic/CartBadge';
import { ROMANTIC_PRODUCTS } from '@/data/romanticProducts';
import type { Product } from '@/types/product';

export default function RomanticPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Ref map to return focus to the "Order Now" trigger button when modal closes
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleOrderNow = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Return focus to the trigger button
    if (selectedProduct) {
      setTimeout(() => {
        triggerRefs.current[selectedProduct.id]?.focus();
      }, 150);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-rose-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a
            href="/"
            className="font-serif text-xl font-bold text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded"
          >
            ♥ Beloved
          </a>
          <CartBadge />
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <RomanticHero />

      {/* ── Product Grid ──────────────────────────────────────────── */}
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="sr-only">Romantic Products</h2>
        <ul
          role="list"
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ROMANTIC_PRODUCTS.map((product) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                onOrderNow={handleOrderNow}
              />
            </li>
          ))}
        </ul>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-rose-100 py-8 text-center text-sm text-rose-400">
        <p>Made with ♥ — All rights reserved {new Date().getFullYear()}</p>
      </footer>

      {/* ── Order Form Modal ──────────────────────────────────────── */}
      <OrderFormModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

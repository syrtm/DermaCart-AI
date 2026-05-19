"use client";

import { useState, useEffect } from "react";
import ProductCard, { Product } from "@/components/ProductCard";
import CartPanel from "@/components/CartPanel";

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-100 h-32" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
        <div className="h-4 bg-gray-100 rounded-full w-4/5" />
        <div className="h-3 bg-gray-100 rounded-full w-full" />
        <div className="h-9 bg-gray-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data))
      .catch(console.error)
      .finally(() => setProductsLoading(false));
  }, []);

  const addToCart = (product: Product) => {
    if (!cartItems.find((p) => p.id === product.id)) {
      setCartItems((prev) => [...prev, product]);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">💎</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 tracking-tight">DermaCart AI+</h1>
              <p className="text-xs text-gray-400 leading-none">B2B Multi-Agent Cilt Analiz Platformu</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Ajan Aktif
            </span>
            <div className="flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-violet-200">
              <span>✦</span>
              <span>Gemini AI</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol — Ürünler */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">Cilt Bakım Kataloğu</h2>
                {!productsLoading && (
                  <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">
                    {products.length} ürün
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Ürünleri sepete ekleyin, B2B Risk Ajanı uyumluluk analizi yapsın.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productsLoading
                ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
                : products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isInCart={!!cartItems.find((p) => p.id === product.id)}
                      onAdd={addToCart}
                    />
                  ))}
            </div>

            {/* B2B Info Banner */}
            <div className="mt-6 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-4 flex gap-3 items-start">
              <span className="text-2xl flex-shrink-0">🤖</span>
              <div>
                <p className="text-sm font-semibold text-violet-800 mb-0.5">
                  Multi-Agent B2B Analiz Motoru
                </p>
                <p className="text-xs text-violet-600 leading-relaxed">
                  DermaCart AI+ ajanı, sepetinizdeki aktif içerikleri moleküler düzeyde analiz eder.
                  TEWL (transepidermal su kaybı), korneum bütünlüğü ve inflamatuar sitokin riskleri
                  değerlendirilir. Gemini 1.5 Flash tabanlı B2B risk skorlaması ve çapraz satış
                  önerileri gerçek zamanlı üretilir.
                </p>
              </div>
            </div>
          </div>

          {/* Sağ — Sepet */}
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <div className="sticky top-24">
              <CartPanel cartItems={cartItems} onRemove={removeFromCart} />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-gray-100 py-6">
        <p className="text-center text-xs text-gray-400">
          © 2026 DermaCart AI+ · B2B Multi-Agent Platform · Powered by Google Gemini 1.5 Flash
        </p>
      </footer>
    </div>
  );
}

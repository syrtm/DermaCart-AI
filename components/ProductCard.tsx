"use client";

import { ShoppingCartIcon, CheckIcon } from "./Icons";

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  badge: string;
  badgeColor: string;
  description: string;
  activeIngredient: string;
  emoji: string;
}

interface ProductCardProps {
  product: Product;
  isInCart: boolean;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, isInCart, onAdd }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 flex items-center justify-center h-32">
        <span className="text-5xl">{product.emoji}</span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${product.badgeColor}`}>
            {product.badge}
          </span>
          <span className="text-sm font-bold text-gray-800">{product.price}</span>
        </div>

        <p className="text-xs text-gray-400 mt-1 mb-0.5">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-1 line-clamp-2">{product.description}</p>
        <p className="text-xs text-indigo-500 font-medium mb-3">
          Aktif: {product.activeIngredient}
        </p>

        <button
          onClick={() => onAdd(product)}
          disabled={isInCart}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
            isInCart
              ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
              : "bg-gray-900 text-white hover:bg-gray-700 active:scale-95"
          }`}
        >
          {isInCart ? (
            <>
              <CheckIcon className="w-4 h-4" />
              Sepette
            </>
          ) : (
            <>
              <ShoppingCartIcon className="w-4 h-4" />
              Sepete Ekle
            </>
          )}
        </button>
      </div>
    </div>
  );
}

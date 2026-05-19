"use client";

import { useState, useEffect } from "react";
import { Product } from "./ProductCard";
import { TrashIcon, SparklesIcon } from "./Icons";
import AnalysisCard, { B2BAnalysis } from "./AnalysisCard";

interface CartPanelProps {
  cartItems: Product[];
  onRemove: (id: number) => void;
}

const AGENT_STEPS = [
  "Sepet içeriği taranıyor...",
  "Aktif içerikler belirleniyor...",
  "Moleküler çakışma analizi yapılıyor...",
  "B2B risk skoru hesaplanıyor...",
  "Çapraz satış önerileri oluşturuluyor...",
];

function AgentLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % AGENT_STEPS.length);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white border border-violet-200 rounded-2xl p-5 flex flex-col items-center gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-violet-100" />
        <div className="absolute inset-0 rounded-full border-4 border-t-violet-600 border-r-indigo-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <SparklesIcon className="w-5 h-5 text-violet-600" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-bold text-gray-800 mb-1">Otonom Ajan Sepeti İnceliyor...</p>
        <p className="text-xs text-violet-600 min-h-[1.25rem] transition-all duration-300">
          {AGENT_STEPS[step]}
        </p>
      </div>

      <div className="w-full flex gap-1 justify-center">
        {AGENT_STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === step ? "bg-violet-600 w-6" : "bg-gray-200 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function CartPanel({ cartItems, onRemove }: CartPanelProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<B2BAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("₺", "").replace(",", "."));
    return sum + price;
  }, 0);

  const handleAnalyze = async () => {
    if (cartItems.length < 2) {
      setError("B2B analizi için sepetinizde en az 2 ürün olmalı.");
      return;
    }
    setLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      const response = await fetch("/api/analyze-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: cartItems.map((p) => p.name) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analiz başarısız.");
      setAnalysis(data as B2BAnalysis);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Cart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Sepetim</h2>
          <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {cartItems.length} ürün
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-8 flex flex-col items-center text-gray-400">
            <span className="text-4xl mb-3">🛒</span>
            <p className="text-sm">Sepetiniz boş</p>
            <p className="text-xs mt-1">Sol taraftan ürün ekleyin</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.activeIngredient}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">{item.price}</span>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cartItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">Toplam</span>
            <span className="text-lg font-bold text-gray-900">
              ₺{totalPrice.toFixed(2).replace(".", ",")}
            </span>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      {cartItems.length > 0 && !loading && (
        <button
          onClick={handleAnalyze}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-200 active:scale-95"
        >
          <SparklesIcon className="w-5 h-5" />
          Sepetimi Gemini AI ile Analiz Et
        </button>
      )}

      {/* Agent Loading Animation */}
      {loading && <AgentLoader />}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* B2B Analysis Result */}
      {analysis && !loading && <AnalysisCard data={analysis} />}
    </div>
  );
}

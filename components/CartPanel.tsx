"use client";

import { useState } from "react";
import { Product } from "./ProductCard";
import { TrashIcon, SparklesIcon } from "./Icons";
import AnalysisCard, { B2BAnalysis } from "./AnalysisCard";

interface CartPanelProps {
  cartItems: Product[];
  onRemove: (id: number) => void;
}

// ─── 3-Stage Agentic Loader ───────────────────────────────────────────────────

const AGENT_STAGES = [
  {
    icon: "🧬",
    title: "Dermatolog Ajanı Analiz Ediyor",
    subtitle: "Aktif içerikler moleküler düzeyde inceleniyor...",
  },
  {
    icon: "🗄️",
    title: "Stok Veritabanı Taranıyor",
    subtitle: "B2B ürün katalog eşleştirmesi yapılıyor...",
  },
  {
    icon: "🛒",
    title: "Çapraz Satış Önerisi Oluşturuluyor",
    subtitle: "Kişiselleştirilmiş stok tavsiyeleri hazırlanıyor...",
  },
] as const;

function AgentLoader({ activeStage }: { activeStage: number }) {
  return (
    <div className="bg-white border border-violet-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-center gap-3 pb-2">
        <div className="relative w-10 h-10 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border-[3px] border-violet-100" />
          <div className="absolute inset-0 rounded-full border-[3px] border-t-violet-600 border-r-indigo-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <SparklesIcon className="w-4 h-4 text-violet-600" />
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Otonom Ajan Çalışıyor</p>
          <p className="text-xs text-violet-500">DermaCart AI+ B2B Pipeline</p>
        </div>
      </div>

      <div className="space-y-2">
        {AGENT_STAGES.map((stage, i) => {
          const isDone = i < activeStage;
          const isActive = i === activeStage;
          const isPending = i > activeStage;

          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-500 ${
                isActive
                  ? "bg-violet-50 border border-violet-200"
                  : isDone
                  ? "bg-emerald-50 border border-emerald-100"
                  : "opacity-40"
              }`}
            >
              {/* Status icon */}
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {isDone ? (
                  <span className="text-emerald-600 text-base">✓</span>
                ) : isActive ? (
                  <div className="w-3 h-3 rounded-full bg-violet-500 animate-pulse" />
                ) : (
                  <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{stage.icon}</span>
                  <p
                    className={`text-xs font-semibold truncate ${
                      isDone
                        ? "text-emerald-700"
                        : isActive
                        ? "text-violet-800"
                        : "text-gray-400"
                    }`}
                  >
                    {stage.title}
                  </p>
                </div>
                {isActive && (
                  <p className="text-xs text-violet-500 mt-0.5">{stage.subtitle}</p>
                )}
              </div>

              {isPending && (
                <span className="text-xs text-gray-300 flex-shrink-0">Bekliyor</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CartPanel({ cartItems, onRemove }: CartPanelProps) {
  const [agentStage, setAgentStage] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<B2BAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLoading = agentStage !== null;

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("₺", "").replace(",", "."));
    return sum + price;
  }, 0);

  const handleAnalyze = async () => {
    if (cartItems.length < 2) {
      setError("B2B analizi için sepetinizde en az 2 ürün olmalı.");
      return;
    }

    setAnalysis(null);
    setError(null);
    setAgentStage(0);

    // Stage 1 → 2 after 900ms (visible to jury)
    const t1 = setTimeout(() => setAgentStage(1), 900);
    // Stage 2 → 3 after 1800ms
    const t2 = setTimeout(() => setAgentStage(2), 1800);

    try {
      const response = await fetch("/api/analyze-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: cartItems.map((p) => p.name) }),
      });

      const data = await response.json();

      // Ensure stage 3 is visible for at least 600ms before result renders
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (!response.ok) throw new Error(data.error || "Analiz başarısız.");
      setAnalysis(data as B2BAnalysis);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setAgentStage(null);
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
      {cartItems.length > 0 && !isLoading && (
        <button
          onClick={handleAnalyze}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-200 active:scale-95"
        >
          <SparklesIcon className="w-5 h-5" />
          Sepetimi Gemini AI ile Analiz Et
        </button>
      )}

      {/* 3-Stage Agentic Loader */}
      {isLoading && <AgentLoader activeStage={agentStage!} />}

      {/* Error */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* B2B Analysis Result */}
      {analysis && !isLoading && <AnalysisCard data={analysis} />}
    </div>
  );
}

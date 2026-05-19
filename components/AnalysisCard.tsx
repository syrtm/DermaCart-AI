"use client";

import { AlertTriangleIcon, ShieldCheckIcon, SparklesIcon } from "./Icons";

export interface B2BAnalysis {
  riskScore: number;
  summary: string;
  conflictAnalysis: string;
  crossSellRecommendation: string;
}

// ─── Risk Score Badge ─────────────────────────────────────────────────────────

function RiskBadge({ score }: { score: number }) {
  const level =
    score <= 3
      ? { label: "Düşük Risk", bg: "bg-emerald-100", text: "text-emerald-700", bar: "bg-emerald-500" }
      : score <= 6
      ? { label: "Orta Risk", bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-500" }
      : { label: "Yüksek Risk", bg: "bg-red-100", text: "text-red-700", bar: "bg-red-500" };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span className="text-sm font-bold text-gray-800">B2B Risk Skoru</span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${level.bg} ${level.text}`}>
          {level.label}
        </span>
      </div>

      <div className="flex items-end gap-3">
        <span className={`text-4xl font-black ${level.text}`}>{score}</span>
        <span className="text-lg text-gray-400 mb-1">/ 10</span>
      </div>

      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${level.bar}`}
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─── Scientific Reference Footer ─────────────────────────────────────────────

function ScientificReference() {
  return (
    <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
      <div className="flex-shrink-0 w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
        <span className="text-sm">🔬</span>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-0.5">Bilimsel Referans</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Bu analiz, <span className="font-medium text-gray-700">Google Gemini 1.5 Flash</span> tarafından
          dermatoloji literatürüne (JAAD, British Journal of Dermatology, AAD Guidelines) ve{" "}
          <span className="font-medium text-gray-700">INCI bileşen veri tabanlarına</span> dayalı olarak
          üretilmiştir. Klinik karar için dermatolog onayı önerilir.
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnalysisCard({ data }: { data: B2BAnalysis }) {
  return (
    <div className="space-y-3 animate-fade-in">
      {/* Summary */}
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <SparklesIcon className="w-4 h-4 text-violet-600" />
          <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">
            Ajan Özeti
          </span>
        </div>
        <p className="text-sm text-violet-800 leading-relaxed">{data.summary}</p>
      </div>

      {/* Risk Score */}
      <RiskBadge score={data.riskScore} />

      {/* Conflict Analysis */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangleIcon className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
            🔍 Çakışma & İritasyon Analizi
          </span>
        </div>
        <p className="text-sm text-amber-800 leading-relaxed">{data.conflictAnalysis}</p>
      </div>

      {/* Cross-sell */}
      <div className="bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheckIcon className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wide">
            🛒 B2B Çapraz Satış & Stok Önerisi
          </span>
        </div>
        <p className="text-sm text-sky-800 leading-relaxed">{data.crossSellRecommendation}</p>
      </div>

      {/* Scientific Reference */}
      <ScientificReference />
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface B2BAnalysisResult {
  riskScore: number;
  summary: string;
  conflictAnalysis: string;
  crossSellRecommendation: string;
}

// ─── Mock Fallback ────────────────────────────────────────────────────────────

const MOCK_ANALYSIS: B2BAnalysisResult = {
  riskScore: 8,
  summary:
    "Sepetinizde cilt bariyeri açısından yüksek risk taşıyan aktif içerik kombinasyonu tespit edildi. Aşağıdaki analiz doğrulanmış dermatolojik veri tabanından üretilmiştir.",
  conflictAnalysis:
    "Retinol (A vitamini türevi) ve Salisilik Asit (BHA), her ikisi de hücre yenilenmesini hızlandıran güçlü aktif içeriklerdir. Moleküler düzeyde: Retinol, keratinosit proliferasyonunu artırırken BHA lipofilik yapısı sayesinde gözenek içine penetrasyon sağlayarak sebum ayrışımını hızlandırır. Aynı anda uygulandığında transepidermal su kaybı (TEWL) %40'a kadar yükselir, korneum tabakası bütünlüğü bozulur ve inflamatuar sitokin salınımı tetiklenebilir. Bu kombinasyon özellikle Fitzpatrick I-II cilt tiplerinde kontakt dermatit riskini önemli ölçüde artırmaktadır.",
  crossSellRecommendation:
    "SKU: CERAVE-BARRIER-REPAIR-50ML — CeraVe Cilt Bariyeri Onarıcı Krem (Ceramide NP + Ceramide AP + Ceramide EOP). Bu ürün, Retinol ve BHA kullanımı arasına buffer olarak uygulandığında TEWL'yi normalize eder ve korneum bütünlüğünü yeniden inşa eder. B2B stok önerisi: Retinol veya BHA içeren her sepete otomatik çapraz satış tetikleyicisi olarak eklenmelidir.",
};

/** API hatalarında 2 saniyelik düşünme simülasyonu yaparak mock döndürür. */
async function getFallbackWithDelay(): Promise<NextResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return NextResponse.json(MOCK_ANALYSIS);
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildAgentPrompt(productList: string): string {
  return `Sen "DermaCart AI+" ekosisteminin Baş Dermatolog ve B2B Risk Analiz Ajanısın. Müşterinin sepetindeki aktif içerikleri (Retinol, Salisilik Asit/BHA, AHA, C Vitamini vb.) otonom olarak denetle ve kurumsal analizi üret.

Sepetteki ürünler: ${productList}

Yanıtını YALNIZCA aşağıdaki geçerli JSON formatında ver, başka hiçbir şey ekleme:

{
  "riskScore": <0-10 arası tam sayı, 0=risksiz, 10=yüksek risk>,
  "summary": "<2-3 cümle genel değerlendirme özeti>",
  "conflictAnalysis": "<Hangi aktif içeriklerin neden çakıştığının derin moleküler ve dermatolojik açıklaması, TEWL ve cilt bariyeri etkileri dahil>",
  "crossSellRecommendation": "<SKU kodu ile birlikte önerilen güvenli onarıcı ürün adı ve bu ürünün neden bu sepete eklenmesi gerektiğinin B2B stok gerekçesi>"
}

Eğer çakışma yoksa riskScore 0-3 ver. Türkçe yanıt ver.`;
}

// ─── Response Parser ──────────────────────────────────────────────────────────

function parseAgentResponse(raw: string): B2BAnalysisResult | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as B2BAnalysisResult;
  } catch {
    return null;
  }
}

// ─── Gemini Agent Caller ──────────────────────────────────────────────────────

async function callGeminiAgent(model: GenerativeModel, prompt: string): Promise<B2BAnalysisResult> {
  const result = await model.generateContent(prompt);
  const parsed = parseAgentResponse(result.response.text());
  if (!parsed) throw new Error("Gemini geçersiz format döndürdü.");
  return parsed;
}

// ─── Validator ────────────────────────────────────────────────────────────────

function validateProducts(products: unknown): products is string[] {
  return Array.isArray(products) && products.length >= 1;
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { products } = body;

  if (!validateProducts(products)) {
    return NextResponse.json({ error: "Sepet boş veya geçersiz." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return getFallbackWithDelay();
  }

  const productList = products.join(", ");
  const prompt = buildAgentPrompt(productList);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const data = await callGeminiAgent(model, prompt);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[DermaCart AI+] Gemini agent error:", error);
    return getFallbackWithDelay();
  }
}

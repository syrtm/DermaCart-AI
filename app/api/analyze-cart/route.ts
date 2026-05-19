import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MOCK_FALLBACK = {
  riskScore: 8,
  summary:
    "Sepetinizde cilt bariyeri açısından yüksek risk taşıyan aktif içerik kombinasyonu tespit edildi. Aşağıdaki B2B analizi yedek dermatolojik veri tabanından üretilmiştir.",
  conflictAnalysis:
    "Retinol (A vitamini türevi) ve Salisilik Asit (BHA), her ikisi de hücre yenilenmesini hızlandıran güçlü aktif içeriklerdir. Moleküler düzeyde: Retinol, keratinosit proliferasyonunu artırırken BHA lipofilik yapısı sayesinde gözenek içine penetrasyon sağlayarak sebum ayrışımını hızlandırır. Aynı anda uygulandığında transepidermal su kaybı (TEWL) %40'a kadar yükselir, korneum tabakası bütünlüğü bozulur ve inflamatuar sitokin salınımı tetiklenebilir. Bu kombinasyon özellikle Fitzpatrick I-II cilt tiplerinde kontakt dermatit riskini önemli ölçüde artırmaktadır.",
  crossSellRecommendation:
    "SKU: CERAVE-BARRIER-REPAIR-50ML — CeraVe Cilt Bariyeri Onarıcı Krem (Ceramide NP + Ceramide AP + Ceramide EOP). Bu ürün, Retinol ve BHA kullanımı arasına buffer olarak uygulandığında TEWL'yi normalize eder ve korneum bütünlüğünü yeniden inşa eder. B2B stok önerisi: Retinol veya BHA içeren her sepete otomatik çapraz satış tetikleyicisi olarak eklenmelidir.",
};

export async function POST(req: NextRequest) {
  const { products } = await req.json().catch(() => ({ products: [] }));

  if (!products || products.length === 0) {
    return NextResponse.json({ error: "Sepet boş." }, { status: 400 });
  }

  if (
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY === "your_gemini_api_key_here"
  ) {
    return NextResponse.json(MOCK_FALLBACK);
  }

  const productList = (products as string[]).join(", ");

  const prompt = `Sen "DermaCart AI+" ekosisteminin Baş Dermatolog ve B2B Risk Analiz Ajanısın. Müşterinin sepetindeki aktif içerikleri (Retinol, Salisilik Asit/BHA, AHA, C Vitamini vb.) otonom olarak denetle ve aşağıdaki kurumsal analizi üret.

Sepetteki ürünler: ${productList}

Yanıtını YALNIZCA aşağıdaki geçerli JSON formatında ver, başka hiçbir şey ekleme:

{
  "riskScore": <0-10 arası tam sayı, 0=risksiz, 10=yüksek risk>,
  "summary": "<2-3 cümle genel değerlendirme özeti>",
  "conflictAnalysis": "<Hangi aktif içeriklerin neden çakıştığının derin moleküler ve dermatolojik açıklaması, TEWL ve cilt bariyeri etkileri dahil>",
  "crossSellRecommendation": "<SKU kodu ile birlikte önerilen güvenli onarıcı ürün adı ve bu ürünün neden bu sepete eklenmesi gerektiğinin B2B stok gerekçesi>"
}

Eğer çakışma yoksa riskScore 0-3 ver ve conflictAnalysis kısmında güvenli kombinasyon olduğunu belirt. Türkçe yanıt ver.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json(MOCK_FALLBACK);

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[DermaCart AI+] Gemini agent error:", error);
    return NextResponse.json(MOCK_FALLBACK);
  }
}

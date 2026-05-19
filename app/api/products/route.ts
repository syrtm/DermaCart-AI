import { NextResponse } from "next/server";

const PRODUCT_CATALOG = [
  {
    id: 1,
    name: "The Purest Solutions Retinol Serum",
    brand: "The Purest Solutions",
    price: "₺349,90",
    badge: "Anti-Aging",
    badgeColor: "bg-purple-100 text-purple-700",
    description: "Kırışıklık karşıtı retinol formülü ile cilt yenileme ve yaşlanma karşıtı etki.",
    activeIngredient: "%0.3 Retinol",
    emoji: "🌙",
    stock: 42,
  },
  {
    id: 2,
    name: "COSRX %2 BHA Tonik",
    brand: "COSRX",
    price: "₺279,90",
    badge: "Gözenek Temizleyici",
    badgeColor: "bg-blue-100 text-blue-700",
    description: "Salisilik asit içeren BHA tonik; siyah noktalar ve gözenek görünümünü azaltır.",
    activeIngredient: "%2 Salisilik Asit",
    emoji: "💧",
    stock: 87,
  },
  {
    id: 3,
    name: "The Ordinary Niacinamide %10 Serum",
    brand: "The Ordinary",
    price: "₺199,90",
    badge: "Leke Karşıtı",
    badgeColor: "bg-yellow-100 text-yellow-700",
    description: "Yüksek konsantrasyonlu niacinamide ile leke azaltma ve gözenek sıkılaştırma.",
    activeIngredient: "%10 Niasinamid",
    emoji: "✨",
    stock: 63,
  },
  {
    id: 4,
    name: "CeraVe Hyalüronik Asit Nemlendirici",
    brand: "CeraVe",
    price: "₺459,90",
    badge: "Nemlendirici",
    badgeColor: "bg-teal-100 text-teal-700",
    description: "3 temel ceramide ve hyalüronik asit ile 24 saat derin nemlendirme sağlar.",
    activeIngredient: "Hyalüronik Asit + Ceramide",
    emoji: "💦",
    stock: 29,
  },
];

export async function GET() {
  // Simulated n8n / DB latency
  await new Promise((resolve) => setTimeout(resolve, 350));
  return NextResponse.json(PRODUCT_CATALOG);
}

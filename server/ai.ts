import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

export async function generateProductDescription({
  title,
  category,
  keywords,
}: {
  title: string;
  category: string;
  keywords?: string;
}) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from environment.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a high-end luxury fashion and home boutique copywriter for "K&H Online Store" (Arabic slogan: "كل ما يهم المرأة و المنزل").
Please create an enticing, poetic, and refined product description for:
Product Name: "${title}"
Category: "${category}"
Additional Highlights/Keywords: "${keywords || 'High quality, elegant craftsmanship, premium materials'}"

Return a valid JSON object matching this schema EXACTLY:
{
  "titleAr": "refined Arabic title",
  "titleFr": "refined French title",
  "descriptionAr": "An evocative and elegant 2-3 paragraph Arabic description highlighting craftsmanship, elegance, and comfort for the modern woman or home",
  "descriptionFr": "An elegant French description for the boutique",
  "descriptionEn": "An elegant English description for international clients",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "seoTitle": "Arabic SEO Title (under 60 chars)",
  "seoDescription": "Arabic SEO Meta Description (under 160 chars)"
}
Respond ONLY with the raw JSON object, without markdown formatting or backticks.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error: any) {
    console.error('Gemini API Error in generateProductDescription:', error);
    // Graceful fallback if AI API encounters quota or network errors
    return {
      titleAr: title,
      titleFr: title,
      descriptionAr: `منتج فاخر وحصري من متجر K&H يجمع بين الأناقة الرفيعة والجودة العالية ليلائم ذوقكِ المتميز.`,
      descriptionFr: `Produit exclusif et raffiné de la boutique K&H, alliant qualité supérieure et élégance intemporelle.`,
      descriptionEn: `An exclusive and refined selection from K&H Online Store, blending exquisite quality and timeless elegance.`,
      tags: [category, 'أزياء', 'منزل', 'فاخر', 'تونس'],
      seoTitle: `${title} - K&H متجر`,
      seoDescription: `اكتشفي ${title} بمتجر K&H في تونس. أفضل الأسعار وتوصيل سريع حتى باب منزلك مع الدفع عند الاستلام.`
    };
  }
}

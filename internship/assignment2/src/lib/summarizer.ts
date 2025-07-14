import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from "@google/generative-ai";
if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not defined in environment variables.");
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro",
  systemInstruction : `You are An expert in summarizing the blogs and when user sends you a text to summarize you summarize it properly.`
});

export async function scrapeBlogText(url: string): Promise<string> {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const text = $('p, span').map((_, el) => $(el).text()).get().join(' ');
  return text.trim();
}

export async function generateSummaryWithGemini(fullText: string): Promise<string> {
  const prompt = `Summarize the following blog content in English:\n\n${fullText}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function translateToUrduWithGemini(englishSummary: string): Promise<string> {
  const prompt = `Translate the following English text to Urdu without using any hindi words:\n\n${englishSummary}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}
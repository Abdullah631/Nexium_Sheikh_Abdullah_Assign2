import { NextApiRequest, NextApiResponse } from 'next';
import { scrapeBlogText } from '@/lib/scrapper';
import { generateStaticSummary } from '@/lib/summarizer';
import { translateToUrdu } from '@/lib/translator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    // ✅ Check if URL is missing or empty
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return res.status(400).json({ error: 'No URL provided. Please enter a blog URL to summarize.' });
    }

    const fullText = await scrapeBlogText(url);
    const summary = generateStaticSummary(fullText); // Dummy summary
    const urduSummary = translateToUrdu(summary); // Simulated translation

    return res.status(200).json({
      fullText,
      summary,
      urduSummary
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to summarize' });
  }
}

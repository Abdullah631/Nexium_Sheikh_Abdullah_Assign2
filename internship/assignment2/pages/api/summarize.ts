import { NextApiRequest, NextApiResponse } from 'next';
import { scrapeBlogText, generateSummaryWithGemini, translateToUrduWithGemini } from '@/lib/summarizer';
import { saveFullText } from '@/lib/mongodb';
import { saveToSupabase } from '@/lib/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || url.trim() === '') {
      return res.status(400).json({ error: 'No URL provided. Please enter a blog URL to summarize.' });
    }

    const fullText = await scrapeBlogText(url);
    const summary = await generateSummaryWithGemini(fullText);
    const urduSummary = await translateToUrduWithGemini(summary);

    let mongoStatus = 'saved';
    let supabaseStatus = 'saved';

    try {
      await saveFullText(url, fullText);
    } catch (err) {
      console.error('MongoDB Save Error:', err);
      mongoStatus = 'failed';
    }

    try {
      await saveToSupabase(url, summary, urduSummary);
    } catch (err) {
      console.error('Supabase Save Error:', err);
      supabaseStatus = 'failed';
    }

    return res.status(200).json({
      fullText,
      summary,
      urduSummary,
      saveStatus: {
        mongodb: mongoStatus,
        supabase: supabaseStatus,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to summarize' });
  }
}

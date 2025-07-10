import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function saveToSupabase(url: string, summary: string, urduSummary: string) {
  const { data, error } = await supabase.from('summaries').insert([
    { url, summary_en: summary, summary_ur: urduSummary }
  ]);

  if (error) {
    console.error('Supabase insert error:', error);
    return;
  }

  console.log('Data saved to Supabase:', data);
}

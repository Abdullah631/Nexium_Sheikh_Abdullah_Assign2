import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeBlogText(url: string): Promise<string> {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  // Extract paragraph text (modify selector based on blogs)
  const text = $('p, span').map((_, el) => $(el).text()).get().join(' ');
  return text.trim();
}

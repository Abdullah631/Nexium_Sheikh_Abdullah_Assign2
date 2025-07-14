import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeBlogText(url: string): Promise<string> {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const content = $('.article-content, .blog-post, .post-body, .post-content')
    .find('p, span')
    .map((_, el) => $(el).text())
    .get()
    .join(' ');

  return content.trim();
}

export function generateStaticSummary(text: string): string {
  const sentences = text.split('. ').filter(s => s.length > 30);
  return sentences.slice(0, 3).join('. ') + '.';
}

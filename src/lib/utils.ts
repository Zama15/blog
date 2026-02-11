export function truncateStr(sentence: string, k: number = 30): string {
  if (sentence.length < k) return sentence;

  return sentence.slice(0, k).concat("...");
}

export function escapeXML(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

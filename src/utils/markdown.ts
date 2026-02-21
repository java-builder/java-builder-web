export interface HeadingItem {
  id: string;
  title: string;
  level: number;
}

export const extractHeadings = (markdown: string): HeadingItem[] => {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    headings.push({ id, title, level });
  }

  return headings;
};

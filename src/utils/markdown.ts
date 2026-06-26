export interface HeadingItem {
  id: string;
  title: string;
  level: number;
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "") // remove non-alphanumeric except hyphen and spaces
    .trim()
    .replace(/\s+/g, "-") // replace multiple spaces with single hyphen
    .replace(/-+/g, "-"); // replace multiple hyphens with single hyphen
};

const cleanMarkdown = (text: string): string => {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // link [text](url) -> text
    .replace(/[*_`~]/g, ""); // strip bold, italic, code, strike
};

export const extractHeadings = (markdown: string): HeadingItem[] => {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawTitle = match[2].trim();
    const title = cleanMarkdown(rawTitle);
    const id = slugify(title);
    
    headings.push({ id, title, level });
  }

  return headings;
};

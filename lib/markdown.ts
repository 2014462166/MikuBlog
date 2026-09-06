import { unified } from "unified";
import type { Root, Element, RootContent } from "hast";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export type TocItem = { id: string; text: string; level: number };

/** 把标题文本转成稳定的锚点 id（兼容中文/日文等 Unicode） */
function slugify(text: string): string {
  const s = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // 去掉标点等符号，保留字母/数字/空格/连字符
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "section";
}

/** 收集树中的文本（含标题内 code/链接文字） */
function flattenText(node: RootContent): string {
  let out = "";
  const walk = (n: any) => {
    if (n.type === "text") out += n.value;
    else if (n.type === "element" && Array.isArray(n.children)) {
      n.children.forEach(walk);
    }
  };
  walk(node);
  return out;
}

/** 递归为 h1-h6 添加 id 并收集目录 */
function collectHeadings(tree: Root): TocItem[] {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();
  const walk = (node: any) => {
    if (!node || !Array.isArray(node.children)) return;
    for (const child of node.children) {
      if (child.type === "element") {
        const tag = (child.tagName ?? "") as string;
        if (/^h[1-6]$/.test(tag)) {
          const level = Number(tag.slice(1));
          const text = flattenText(child).trim();
          if (text) {
            let id = slugify(text);
            const n = (used.get(id) ?? 0) + 1;
            used.set(id, n);
            if (n > 1) id = `${id}-${n}`;
            if (child.properties) child.properties.id = id;
            toc.push({ id, text, level });
          }
        }
        walk(child);
      }
    }
  };
  walk(tree);
  return toc;
}

/**
 * Markdown → HTML（带语法高亮 + 标题锚点 + 目录）
 * - remark-gfm: 表格 / 删除线 / 任务列表
 * - rehype-raw : 允许内嵌 HTML（内容为本站作者所写，可信任）
 */
export async function renderMarkdown(markdown: string): Promise<{ html: string; toc: TocItem[] }> {
  const toc: TocItem[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    // 先补 id / 收集目录，再序列化
    .use(() => (tree: Root) => {
      toc.length = 0;
      toc.push(...collectHeadings(tree));
    })
    .use(rehypeStringify)
    .process(markdown);
  return { html: String(file), toc };
}

/** 兼容旧用法：只返回 HTML */
export async function markdownToHtml(markdown: string): Promise<string> {
  const { html } = await renderMarkdown(markdown);
  return html;
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { formatDate } from "./date";

export { formatDate };

/* ============ 类型 ============ */

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // "2026-09-01 07:00:01"
  description: string;
  tags: string[];
  cover?: string;
  featured?: boolean;
};

export type Post = PostMeta & { content: string };

export type ChatterMeta = {
  slug: string;
  title: string;
  date: string;
  description?: string;
  mood?: string;
};

export type Chatter = ChatterMeta & { content: string };

/* ============ 工具 ============ */

function readDir(kind: "posts" | "chatters") {
  const dir = path.join(process.cwd(), "content", kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .sort();
}

function parseFile(kind: "posts" | "chatters", fileName: string) {
  const full = path.join(process.cwd(), "content", kind, fileName);
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  const slug = fileName.replace(/\.mdx?$/, "");
  return { data, content, slug };
}

/* ============ 文章 ============ */

export function getAllPosts(): Post[] {
  return readDir("posts")
    .map((f) => {
      const { data, content, slug } = parseFile("posts", f);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "1970-01-01",
        description: data.description ?? "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        cover: data.cover,
        featured: Boolean(data.featured),
        content,
      } as Post;
    })
    .sort((a, b) =>
      new Date(a.date) < new Date(b.date)
        ? 1
        : new Date(a.date) > new Date(b.date)
          ? -1
          : 0,
    );
}

export function getPost(slug: string): Post | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

/* ============ 杂谈 ============ */

export function getAllChatters(): Chatter[] {
  return readDir("chatters")
    .map((f) => {
      const { data, content, slug } = parseFile("chatters", f);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "1970-01-01",
        description: data.description,
        mood: data.mood,
        content,
      } as Chatter;
    })
    .sort((a, b) =>
      new Date(a.date) < new Date(b.date)
        ? 1
        : new Date(a.date) > new Date(b.date)
          ? -1
          : 0,
    );
}

export function getChatter(slug: string): Chatter | null {
  return getAllChatters().find((c) => c.slug === slug) ?? null;
}

/* ============ 主题 tags 统计 ============ */

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPosts().forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags);
}

import Link from "next/link";
import { formatPostDate, type NewsPost } from "../lib/news";
import { Arrow } from "./site-ui";

export default function NewsList({ posts }: { posts: NewsPost[] }) {
  return (
    <ul className="divide-y divide-line border-t border-line">
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/news/${post.slug}`} className="group grid gap-4 py-7 sm:grid-cols-[140px_1fr_auto] sm:items-start">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[.09em] ${post.kind === "event" ? "text-amber-700" : "text-leaf-dark"}`}>
                {post.kind === "event" ? "Event" : "News"}
              </p>
              <p className="mt-1 text-sm text-moss">{formatPostDate(post)}</p>
            </div>
            <div>
              <h3 className="font-display text-xl font-medium leading-snug text-ink transition-colors group-hover:text-forest">{post.title}</h3>
              {post.summary && <p className="mt-2 text-[15px] leading-relaxed text-moss">{post.summary}</p>}
              {post.kind === "event" && post.location && <p className="mt-2 text-sm text-ink/70">{post.location}</p>}
            </div>
            <span className="hidden text-leaf-dark sm:block sm:pt-1.5"><Arrow /></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none
      text-lg leading-[1.75] text-slate-700
      prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-slate-900
      prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:leading-[1.3]
      prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:leading-[1.35]
      prose-p:leading-[1.75] prose-p:mb-6 prose-p:text-slate-600
      prose-li:leading-[1.7] prose-li:mb-1.5 prose-li:text-slate-600
      prose-ul:pl-5 prose-ol:pl-5
      prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-700 prose-blockquote:my-8
      prose-strong:text-slate-900 prose-strong:font-extrabold
      prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:text-slate-700 prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:shadow-lg
      prose-table:rounded-xl prose-table:overflow-hidden prose-table:shadow-sm prose-table:my-8 prose-table:w-full
      prose-th:bg-slate-50 prose-th:px-5 prose-th:py-3.5 prose-th:text-sm prose-th:font-bold prose-th:text-slate-700 prose-th:border-b prose-th:border-slate-200
      prose-td:px-5 prose-td:py-3 prose-td:text-base prose-td:border-b prose-td:border-slate-100 prose-td:text-slate-600
      prose-img:rounded-2xl prose-img:shadow-md prose-img:max-w-full prose-img:border prose-img:border-slate-200 prose-img:my-8
      prose-hr:border-slate-200 prose-hr:my-10
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children, ...props }) {
            const isInternal = href && (href.startsWith("/") || href.startsWith("https://www.kakapatches.com"));
            if (isInternal && href) {
              const internalPath = href.replace("https://www.kakapatches.com", "");
              return <Link href={internalPath} className="text-blue-600 font-semibold hover:underline">{children}</Link>;
            }
            return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline" {...props}>{children}</a>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

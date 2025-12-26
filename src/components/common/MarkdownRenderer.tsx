import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className} prose prose-sm max-w-none`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
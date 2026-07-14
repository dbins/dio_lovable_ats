import { useMemo, useState } from "react";
import { Copy, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  markdown: string;
}

function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push(
        <ul key={key++} className="ml-5 list-disc space-y-1 text-sm leading-relaxed text-foreground/90">
          {listBuffer.map((l, i) => (
            <li key={i}>{inline(l)}</li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  };

  const inline = (s: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let i = 0;
    while ((m = regex.exec(s))) {
      if (m.index > last) parts.push(s.slice(last, m.index));
      if (m[1]) parts.push(<strong key={i++}>{m[1]}</strong>);
      else if (m[2]) parts.push(<em key={i++}>{m[2]}</em>);
      last = m.index + m[0].length;
    }
    if (last < s.length) parts.push(s.slice(last));
    return parts;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^#{1,3}\s/.test(line)) {
      flushList();
      const level = line.match(/^#+/)![0].length;
      const text = line.replace(/^#+\s*/, "");
      if (level === 1) {
        blocks.push(
          <h2 key={key++} className="mt-6 text-2xl font-semibold tracking-tight text-foreground first:mt-0">
            {text}
          </h2>,
        );
      } else if (level === 2) {
        blocks.push(
          <h3 key={key++} className="mt-6 border-b border-border pb-1 text-sm font-semibold uppercase tracking-wider text-foreground/70">
            {text}
          </h3>,
        );
      } else {
        blocks.push(
          <h4 key={key++} className="mt-4 text-base font-semibold text-foreground">
            {text}
          </h4>,
        );
      }
    } else if (/^[-*]\s+/.test(line)) {
      listBuffer.push(line.replace(/^[-*]\s+/, ""));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      blocks.push(
        <p key={key++} className="text-sm leading-relaxed text-foreground/90">
          {inline(line)}
        </p>,
      );
    }
  }
  flushList();
  return blocks;
}

export function ResumeOutput({ markdown }: Props) {
  const [copied, setCopied] = useState(false);
  const rendered = useMemo(() => renderMarkdown(markdown), [markdown]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curriculo-otimizado.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      aria-label="Currículo otimizado"
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Currículo otimizado
            </h2>
            <p className="text-xs text-muted-foreground">
              Pronto para copiar ou baixar.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-full">
              {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
              {copied ? "Copiado" : "Copiar currículo"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-full">
              <Download className="mr-1.5 h-4 w-4" />
              Baixar como TXT
            </Button>
          </div>
        </div>
        <article className="space-y-2 p-6 sm:p-8">{rendered}</article>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Este currículo foi otimizado para melhorar a compatibilidade com sistemas ATS. Revise o
        conteúdo antes de utilizá-lo para garantir que todas as informações representem sua
        experiência profissional de forma precisa.
      </p>
    </section>
  );
}

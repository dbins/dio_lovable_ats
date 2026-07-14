import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { generateResume } from "@/lib/generate-resume.functions";
import { ResumeOutput } from "./resume-output";

const LS_RESUME = "ats:resume";
const LS_JOB = "ats:job";

interface FieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

function TextField({ id, label, placeholder, value, onChange }: FieldProps) {
  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <span className="text-xs tabular-nums text-muted-foreground">
          {value.length.toLocaleString("pt-BR")} caracteres
        </span>
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="min-h-[280px] w-full resize-y rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-foreground/30 focus-visible:ring-2 focus-visible:ring-foreground/10 sm:min-h-[380px]"
      />
    </div>
  );
}

export function ResumeForm() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const generate = useServerFn(generateResume);

  useEffect(() => {
    try {
      setResume(localStorage.getItem(LS_RESUME) ?? "");
      setJob(localStorage.getItem(LS_JOB) ?? "");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_RESUME, resume);
    } catch {}
  }, [resume]);
  useEffect(() => {
    try {
      localStorage.setItem(LS_JOB, job);
    } catch {}
  }, [job]);

  const handleSubmit = async () => {
    if (!resume.trim()) {
      toast.error("Por favor, informe seu currículo.");
      return;
    }
    if (!job.trim()) {
      toast.error("Por favor, informe a descrição da vaga.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await generate({ data: { resume, job } });
      setResult(res.markdown);
      setTimeout(() => {
        document.getElementById("resume-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <TextField
          id="resume"
          label="Currículo"
          placeholder="Cole aqui o texto completo do seu currículo..."
          value={resume}
          onChange={setResume}
        />
        <TextField
          id="job"
          label="Descrição da vaga"
          placeholder="Cole aqui a descrição completa da vaga..."
          value={job}
          onChange={setJob}
        />
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          size="lg"
          className="h-14 rounded-full px-8 text-base font-medium shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Gerar currículo otimizado
            </>
          )}
        </Button>
      </div>

      {result && (
        <div id="resume-result" className="pt-4">
          <ResumeOutput markdown={result} />
        </div>
      )}
    </div>
  );
}

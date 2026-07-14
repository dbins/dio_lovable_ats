import { createFileRoute } from "@tanstack/react-router";
import { ResumeForm } from "@/components/resume-form";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATS Resume Match — Otimize seu currículo para a vaga" },
      {
        name: "description",
        content:
          "Adapte seu currículo para uma vaga específica e gere uma versão otimizada para sistemas ATS, mantendo todas as informações verdadeiras.",
      },
      { property: "og:title", content: "ATS Resume Match" },
      {
        property: "og:description",
        content:
          "Transforme seu currículo em uma versão otimizada para a vaga, mantendo todas as informações verdadeiras.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Toaster />
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <header className="mb-12 text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            Otimização ATS
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            ATS Resume Match
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Transforme seu currículo em uma versão otimizada para a vaga, mantendo todas as
            informações verdadeiras.
          </p>
        </header>

        <ResumeForm />

        <footer className="mt-20 text-center text-xs text-muted-foreground">
          Feito para candidatos. Suas informações permanecem no seu navegador.
        </footer>
      </div>
    </main>
  );
}

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  resume: z.string().min(1),
  job: z.string().min(1),
});

const SYSTEM = `Você é um especialista em recrutamento, ATS (Applicant Tracking Systems) e escrita profissional de currículos.

Sua missão é reescrever o currículo do candidato para aumentar sua compatibilidade com a vaga informada.

Regras obrigatórias:
- Nunca invente experiências.
- Nunca invente empresas.
- Nunca invente cargos.
- Nunca invente tecnologias.
- Nunca invente certificações.
- Nunca invente formações.
- Nunca invente idiomas.
- Nunca invente resultados.
- Nunca invente números.

Você pode:
- reorganizar informações;
- melhorar a escrita;
- destacar competências existentes;
- utilizar palavras-chave da vaga somente quando forem compatíveis com a experiência do candidato;
- melhorar a estrutura do currículo;
- remover informações redundantes.

O currículo final deve ser:
- profissional;
- objetivo;
- ATS friendly;
- organizado;
- fácil de ler.

Estruture o currículo em Markdown usando exatamente estes cabeçalhos quando aplicável (omita seções sem informação real):
## Resumo profissional
## Competências
## Experiência profissional
## Formação
## Certificações
## Idiomas
## Informações adicionais

Retorne APENAS o currículo final em Markdown, sem comentários adicionais.`;

export const generateResume = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const userPrompt = `Currículo:\n\n${data.resume}\n\nDescrição da vaga:\n\n${data.job}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Muitas requisições. Tente novamente em instantes.");
      if (res.status === 402) throw new Error("Créditos de IA esgotados. Adicione créditos ao workspace.");
      throw new Error(`Erro ao gerar currículo: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("A IA não retornou nenhum conteúdo.");
    return { markdown: content };
  });

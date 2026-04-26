import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ReportInput {
  type: string;
  title: string;
  period: string;
  incidents: number;
  alerts: number;
  sites: string[];
  metrics?: Record<string, unknown>;
  customData?: string;
}

async function generateReportWithLLM(input: ReportInput): Promise<string> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured in Supabase secrets");
  }

  const prompt = `Tu es un expert en rédaction de rapports opérationnels pour les Jeux Olympiques de la Jeunesse 2026 (Dakar).

Génère un rapport COMPLET et PROFESSIONNEL basé sur ces informations:

**Type de Rapport:** ${input.type}
**Titre:** ${input.title}
**Période:** ${input.period}
**Nombre d'Incidents:** ${input.incidents}
**Nombre d'Alertes:** ${input.alerts}
**Sites Concernés:** ${input.sites && input.sites.length > 0 ? input.sites.join(", ") : "Tous les sites"}
${input.customData ? `**Informations Additionnelles:** ${input.customData}` : ""}

Génère un rapport structuré avec:
1. **Résumé Exécutif** (2-3 paragraphes clés)
2. **Contexte Opérationnel** (situation générale pendant la période)
3. **Analyse des Incidents** (détails par type et gravité)
4. **Analyse des Alertes** (priorités et réponses)
5. **Performance par Site** (tableau avec chiffres)
6. **Recommandations** (3-5 actions concrètes)
7. **Conclusion** (perspectives et suivi)

Utilise un ton professionnel, ajoute des chiffres réalistes et statistiques. Formate en Markdown avec # pour titres.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Anthropic API error response:", errorData);
      throw new Error(
        `Anthropic API error (${response.status}): ${errorData.error?.message || JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
      throw new Error("Invalid response structure from Anthropic API");
    }

    const content = data.content[0];

    if (content.type !== "text") {
      throw new Error(`Unexpected response type from Anthropic API: ${content.type}`);
    }

    return content.text;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Report generation error:", message);
    throw new Error(message);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const input: ReportInput = await req.json();

    if (!input.type || !input.title || !input.period) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: type, title, period",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const report = await generateReportWithLLM(input);

    return new Response(
      JSON.stringify({
        success: true,
        report,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert Cuemath curriculum designer specializing in building conceptual connections for Grades 4-8.

Given 2-4 math topics and grade level, create original 'bridge problems' of increasing difficulty that require students to synthesize the concepts.

For each problem:
- Create a meaningful real-world or abstract problem that naturally combines the topics.
- Explain the connections clearly.
- Provide a complete step-by-step solution highlighting where each concept is used.

Also generate a Mermaid.js flowchart or mindmap showing how the concepts interconnect (use simple graph TD syntax with short labels, no special characters or quotes in labels).

Output ONLY valid JSON:
{
  "weavings": [
    {
      "title": "catchy short title",
      "problem": "full problem statement",
      "loom_map": "graph TD\\n  A[Topic1] -->|connection| B[Topic2]\\n  B -->|connection| C[Combined]",
      "solution": "detailed step-by-step solution with concept highlights",
      "connections": "short explanation of why these concepts are linked in real life"
    }
  ]
}

IMPORTANT for loom_map: Use simple Mermaid graph TD syntax. No quotes around labels. Keep node labels short (1-3 words). Use -->|label| for edges. No special characters.

Make problems curriculum-aligned, age-appropriate, and focused on deep understanding rather than rote calculation.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { grade, topics, difficulty, count } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Grade: ${grade}
Topics: ${topics.join(", ")}
Difficulty: ${difficulty}
Number of bridge problems: ${count}

Create ${count} bridge problems that weave these concepts together.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from the response
    let parsed;
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (e) {
      console.error("Parse error:", e, "Content:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

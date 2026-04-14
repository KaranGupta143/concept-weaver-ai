import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import WeaveHeader from "@/components/WeaveHeader";
import WeaveForm from "@/components/WeaveForm";
import WeavingResults from "@/components/WeavingResults";
import HistoryPanel from "@/components/HistoryPanel";
import { WeavingRequest, WeavingResult } from "@/types/weaving";
import { useToast } from "@/hooks/use-toast";

type View = "form" | "results" | "history";

const Index = () => {
  const [view, setView] = useState<View>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<WeavingResult | null>(null);
  const [history, setHistory] = useState<WeavingResult[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { toast } = useToast();

  const handleWeave = async (req: WeavingRequest) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("weave-concepts", {
        body: { grade: req.grade, topics: req.topics, difficulty: req.difficulty, count: req.count },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult({ request: req, weavings: data.weavings || [] });
      setView("results");
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to generate problems", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from("weavings").insert({
        grade: result.request.grade,
        topics: result.request.topics,
        difficulty: result.request.difficulty,
        problem_count: result.request.count,
        weavings: result.weavings as any,
      });
      if (error) throw error;
      toast({ title: "Saved!", description: "Weaving saved to history." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to save", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from("weavings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      setHistory(
        (data || []).map((row: any) => ({
          id: row.id,
          request: {
            grade: row.grade,
            topics: row.topics,
            difficulty: row.difficulty,
            count: row.problem_count,
          },
          weavings: row.weavings as any,
          created_at: row.created_at,
        }))
      );
    } catch (e: any) {
      toast({ title: "Error", description: "Failed to load history", variant: "destructive" });
    } finally {
      setHistoryLoading(false);
    }
  };

  const showHistory = () => {
    setView("history");
    loadHistory();
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] weave-line">
      <WeaveHeader />
      <main className="container max-w-4xl mx-auto px-4 pb-12">
        {/* Nav tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView("form")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === "form"
                ? "gradient-weave text-primary-foreground shadow-md"
                : "bg-card text-[hsl(var(--foreground))] hover:bg-secondary"
            }`}
          >
            ✨ Create
          </button>
          <button
            onClick={showHistory}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === "history"
                ? "gradient-weave text-primary-foreground shadow-md"
                : "bg-card text-[hsl(var(--foreground))] hover:bg-secondary"
            }`}
          >
            📚 History
          </button>
        </div>

        {view === "form" && <WeaveForm onSubmit={handleWeave} isLoading={isLoading} />}
        {view === "results" && result && (
          <WeavingResults
            result={result}
            onBack={() => setView("form")}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}
        {view === "history" && (
          <HistoryPanel
            history={history}
            onSelect={(item) => { setResult(item); setView("results"); }}
            onBack={() => setView("form")}
            isLoading={historyLoading}
          />
        )}
      </main>
    </div>
  );
};

export default Index;

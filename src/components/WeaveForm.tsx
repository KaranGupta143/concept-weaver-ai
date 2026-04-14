import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WeavingRequest } from "@/types/weaving";

const TOPICS = [
  "Fractions", "Decimals", "Percentages", "Algebra",
  "Geometry", "Area & Perimeter", "Ratios", "Integers",
  "Probability", "Data Handling", "Patterns", "Measurement",
];

interface WeaveFormProps {
  onSubmit: (req: WeavingRequest) => void;
  isLoading: boolean;
}

const WeaveForm = ({ onSubmit, isLoading }: WeaveFormProps) => {
  const [grade, setGrade] = useState(6);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [count, setCount] = useState(3);

  const toggleTopic = (t: string) => {
    setSelectedTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : prev.length < 4 ? [...prev, t] : prev
    );
  };

  const addCustomTopic = () => {
    const t = customTopic.trim();
    if (t && !selectedTopics.includes(t) && selectedTopics.length < 4) {
      setSelectedTopics((prev) => [...prev, t]);
      setCustomTopic("");
    }
  };

  const handleSubmit = () => {
    if (selectedTopics.length < 2) return;
    onSubmit({ grade, topics: selectedTopics, difficulty, count });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="p-6 md:p-8 shadow-card bg-card border-[hsl(var(--border))]/50">
        <div className="space-y-6">
          {/* Hero */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[hsl(var(--foreground))]">
              Weave Your Concepts
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Select 2–4 math topics and watch them intertwine into powerful bridge problems.
            </p>
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">Grade Level</label>
            <div className="flex gap-2 flex-wrap">
              {[4, 5, 6, 7, 8].map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    grade === g
                      ? "gradient-weave text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">
              Topics <span className="text-muted-foreground">({selectedTopics.length}/4 selected)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTopic(t)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                    selectedTopics.includes(t)
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:border-primary/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomTopic()}
                placeholder="Add custom topic..."
                className="flex-1 px-3 py-2 rounded-lg bg-[hsl(var(--background))] border border-input text-sm text-[hsl(var(--foreground))] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button variant="outline" size="sm" onClick={addCustomTopic}>Add</Button>
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">Difficulty</label>
            <div className="flex gap-2">
              {(["Easy", "Medium", "Hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    difficulty === d
                      ? "gradient-weave text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[hsl(var(--foreground))]">Number of Problems</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                    count === n
                      ? "gradient-weave text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            variant="weave"
            size="lg"
            className="w-full text-base py-6"
            onClick={handleSubmit}
            disabled={selectedTopics.length < 2 || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 animate-weave-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4l16 16M20 4L4 20M12 2v20M2 12h20" strokeLinecap="round" />
                </svg>
                Weaving Concepts...
              </span>
            ) : (
              "🧶 Weave Concepts"
            )}
          </Button>
          {selectedTopics.length < 2 && (
            <p className="text-xs text-center text-muted-foreground">Select at least 2 topics to begin weaving</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default WeaveForm;

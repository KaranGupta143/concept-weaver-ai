import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import WeavingCard from "@/components/WeavingCard";
import { WeavingResult } from "@/types/weaving";

interface WeavingResultsProps {
  result: WeavingResult;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const WeavingResults = ({ result, onBack, onSave, isSaving }: WeavingResultsProps) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-[hsl(var(--foreground))]">Your Weavings</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Grade {result.request.grade} · {result.request.topics.join(" × ")} · {result.request.difficulty}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>← New Weaving</Button>
          <Button variant="weave" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "💾 Save to History"}
          </Button>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-6">
        {result.weavings.map((w, i) => (
          <WeavingCard key={i} weaving={w} index={i} />
        ))}
      </div>
    </motion.div>
  );
};

export default WeavingResults;

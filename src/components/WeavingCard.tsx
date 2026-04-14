import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MermaidDiagram from "@/components/MermaidDiagram";
import { WeavingProblem } from "@/types/weaving";

interface WeavingCardProps {
  weaving: WeavingProblem;
  index: number;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

const WeavingCard = ({ weaving, index, onRegenerate, isRegenerating }: WeavingCardProps) => {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <Card className="overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 border-[hsl(var(--border))]/50">
        {/* Header stripe */}
        <div className="h-1.5 gradient-weave" />
        <div className="p-6 space-y-5">
          {/* Title */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full gradient-weave text-primary-foreground text-sm font-bold font-heading">
                {index + 1}
              </span>
              <h3 className="text-lg font-heading font-semibold text-[hsl(var(--foreground))]">{weaving.title}</h3>
            </div>
          </div>

          {/* Loom Map */}
          {weaving.loom_map && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Concept Loom Map</p>
              <MermaidDiagram chart={weaving.loom_map} />
            </div>
          )}

          {/* Problem */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">The Challenge</p>
            <p className="text-[hsl(var(--foreground))] leading-relaxed">{weaving.problem}</p>
          </div>

          {/* Solution Toggle */}
          <div className="space-y-2">
            <Button variant="outline" size="sm" onClick={() => setShowSolution(!showSolution)}>
              {showSolution ? "Hide Solution" : "Show Solution"}
            </Button>
            {showSolution && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-secondary rounded-lg p-4"
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Step-by-Step Solution</p>
                <div className="text-[hsl(var(--foreground))] leading-relaxed whitespace-pre-line text-sm">{weaving.solution}</div>
              </motion.div>
            )}
          </div>

          {/* Connections */}
          <div className="bg-weave-surface rounded-lg p-4 border border-[hsl(var(--border))]/30">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Why These Concepts Are Linked</p>
            <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed">{weaving.connections}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 flex-wrap">
            {onRegenerate && (
              <Button variant="outline" size="sm" onClick={onRegenerate} disabled={isRegenerating}>
                {isRegenerating ? "Regenerating..." : "🔄 Regenerate"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default WeavingCard;

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeavingResult } from "@/types/weaving";

interface HistoryPanelProps {
  history: WeavingResult[];
  onSelect: (result: WeavingResult) => void;
  onBack: () => void;
  isLoading: boolean;
}

const HistoryPanel = ({ history, onSelect, onBack, isLoading }: HistoryPanelProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-[hsl(var(--foreground))]">Weaving History</h2>
        <Button variant="outline" onClick={onBack}>← Back</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading history...</div>
      ) : history.length === 0 ? (
        <Card className="p-8 text-center shadow-card border-[hsl(var(--border))]/50">
          <p className="text-muted-foreground">No weavings saved yet. Create your first one!</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {history.map((item, i) => (
            <motion.div key={item.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card
                className="p-4 shadow-card border-[hsl(var(--border))]/50 hover:shadow-card-hover transition-shadow cursor-pointer"
                onClick={() => onSelect(item)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-semibold text-[hsl(var(--foreground))]">
                      {item.request.topics.join(" × ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Grade {item.request.grade} · {item.request.difficulty} · {item.weavings.length} problems
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HistoryPanel;

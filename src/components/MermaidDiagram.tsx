import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    primaryColor: "#6d5cff",
    primaryTextColor: "#fff",
    primaryBorderColor: "#5a4bd4",
    lineColor: "#7c6cff",
    secondaryColor: "#e8e4ff",
    tertiaryColor: "#f0edff",
    fontFamily: "Space Grotesk, sans-serif",
  },
});

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !chart) return;
    setError(false);
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    mermaid.render(id, chart)
      .then(({ svg }) => {
        if (containerRef.current) containerRef.current.innerHTML = svg;
      })
      .catch(() => setError(true));
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-secondary text-sm text-muted-foreground text-center">
        Diagram could not be rendered
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto rounded-lg bg-weave-surface p-4 flex justify-center [&_svg]:max-w-full"
    />
  );
};

export default MermaidDiagram;

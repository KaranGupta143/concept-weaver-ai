import { motion } from "framer-motion";

const WeaveHeader = () => (
  <header className="w-full py-6 px-4">
    <div className="container max-w-5xl mx-auto flex items-center justify-between">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-lg gradient-weave flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-foreground">
            <path d="M4 4l16 16M20 4L4 20M12 2v20M2 12h20" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-xl font-heading font-bold text-[hsl(var(--foreground))] tracking-tight">
          Concept Weaver
        </h1>
      </motion.div>
      <p className="text-sm text-muted-foreground hidden sm:block">
        Math Concept Bridge Builder · Grades 4–8
      </p>
    </div>
  </header>
);

export default WeaveHeader;

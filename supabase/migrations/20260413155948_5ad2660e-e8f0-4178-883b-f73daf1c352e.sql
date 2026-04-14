CREATE TABLE public.weavings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grade INTEGER NOT NULL,
  topics TEXT[] NOT NULL,
  difficulty TEXT NOT NULL,
  problem_count INTEGER NOT NULL DEFAULT 3,
  weavings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.weavings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view weavings" ON public.weavings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert weavings" ON public.weavings FOR INSERT WITH CHECK (true);
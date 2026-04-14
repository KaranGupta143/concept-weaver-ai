export interface WeavingProblem {
  title: string;
  problem: string;
  loom_map: string;
  solution: string;
  connections: string;
}

export interface WeavingRequest {
  grade: number;
  topics: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  count: number;
}

export interface WeavingResult {
  id?: string;
  request: WeavingRequest;
  weavings: WeavingProblem[];
  created_at?: string;
}

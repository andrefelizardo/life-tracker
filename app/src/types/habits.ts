export type Habit = {
  id: number;
  name: string;
  qtt: number;
  lastIncrementedAt: string | null;
  goal?: number;
  mode?: "NORMAL" | "ON" | "OFF";
  resetOnFailure?: boolean;
  startDate?: string | null;
};

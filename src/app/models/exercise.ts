export interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weightKg?: number;
  notes?: string;
}

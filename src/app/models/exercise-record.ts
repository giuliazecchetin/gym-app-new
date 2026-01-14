export interface ExerciseRecord {
  id: number;
  exerciseId: number;
  exerciseName: string;
  date: string;
  weight: number;
  sets: number;
  reps: number;
  notes?: string;
}

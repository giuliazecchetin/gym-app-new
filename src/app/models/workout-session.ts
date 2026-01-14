export interface WorkoutSessionExercise {
  exerciseId: number;
  exerciseName: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface WorkoutSession {
  id: number;
  name: string;
  date: string;
  exercises: WorkoutSessionExercise[];
  totalDuration?: number;
  notes?: string;
}

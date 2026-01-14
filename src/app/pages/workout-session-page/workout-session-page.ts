import { Component, input, output, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Exercise } from '../../models/exercise';
import { WorkoutSession, WorkoutSessionExercise } from '../../models/workout-session';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-workout-session-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './workout-session-page.html',
  styleUrl: './workout-session-page.css'
})
export class WorkoutSessionPageComponent implements OnInit {
  availableExercises = input<Exercise[]>([]);
  savedSessions = input<WorkoutSession[]>([]);
  sessionToEdit = input<WorkoutSession | null>(null);
  sessionSaved = output<WorkoutSession>();
  sessionDeleted = output<number>();
  sessionLoaded = output<WorkoutSession>();
  cancelled = output<void>();

  sessionName: string = '';
  selectedExercises: WorkoutSessionExercise[] = [];
  isEditingSession: boolean = false;
  editingSessionId: number | null = null;
  showPreviousSessions: boolean = false;
  private toastService = inject(ToastService);

  constructor() {
    effect(() => {
      const session = this.sessionToEdit();
      if (session && !this.isEditingSession) {
        this.loadSessionForEditing(session);
      }
    });
  }

  ngOnInit() {
    const session = this.sessionToEdit();
    if (session) {
      this.loadSessionForEditing(session);
    }
  }

  loadSessionForEditing(session: WorkoutSession) {
    this.sessionName = session.name;
    this.selectedExercises = JSON.parse(JSON.stringify(session.exercises));
    this.isEditingSession = true;
    this.editingSessionId = session.id;
  }

  toggleExercise(exercise: Exercise) {
    const index = this.selectedExercises.findIndex(ex => ex.exerciseId === exercise.id);
    
    if (index === -1) {
      this.selectedExercises.push({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weightKg,
        notes: ''
      });
    } else {
      this.selectedExercises.splice(index, 1);
    }
  }

  removeExercise(index: number) {
    this.selectedExercises.splice(index, 1);
  }

  isExerciseSelected(exerciseId: number): boolean {
    return this.selectedExercises.some(ex => ex.exerciseId === exerciseId);
  }

  saveSession() {
    if (!this.sessionName.trim() || this.selectedExercises.length === 0) {
      this.toastService.error('Nome sessione e esercizi obbligatori!');
      return;
    }

    if (this.isEditingSession && this.editingSessionId) {
      const updatedSession: WorkoutSession = {
        id: this.editingSessionId,
        name: this.sessionName,
        date: new Date().toISOString(),
        exercises: [...this.selectedExercises],
        notes: ''
      };
      this.sessionSaved.emit(updatedSession);
    } else {
      const newSession: WorkoutSession = {
        id: Date.now(),
        name: this.sessionName,
        date: new Date().toISOString(),
        exercises: [...this.selectedExercises],
        notes: ''
      };
      this.sessionSaved.emit(newSession);
    }
    this.resetForm();
  }

  cancelSession() {
    this.resetForm();
    this.cancelled.emit();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadSession(session: WorkoutSession) {
    this.sessionName = session.name;
    this.selectedExercises = [...session.exercises];
  }

  deleteSession(id: number) {
    if (confirm('Sei sicuro di voler eliminare questa sessione?')) {
      this.sessionDeleted.emit(id);
    }
  }

  togglePreviousSessions() {
    this.showPreviousSessions = !this.showPreviousSessions;
  }

  private resetForm() {
    this.sessionName = '';
    this.selectedExercises = [];
    this.isEditingSession = false;
    this.editingSessionId = null;
  }
}

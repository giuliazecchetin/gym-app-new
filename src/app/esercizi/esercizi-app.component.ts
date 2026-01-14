import { Component, OnInit, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Exercise } from '../models/exercise';
import { WorkoutSession } from '../models/workout-session';
import { HomepageWorkoutComponent } from '../pages/homepage-workout/homepage-workout';
import { ExercisesPageComponent } from '../pages/exercises-page/exercises-page';
import { ExerciseFormPageComponent } from '../pages/exercise-form-page/exercise-form-page';
import { WorkoutSessionPageComponent } from '../pages/workout-session-page/workout-session-page';
import { SessionHistoryPageComponent } from '../pages/session-history-page/session-history-page';
import { ToastComponent } from '../components/toast/toast.component';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-esercizi',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ButtonModule, 
    HomepageWorkoutComponent, 
    ExercisesPageComponent, 
    ExerciseFormPageComponent, 
    WorkoutSessionPageComponent, 
    SessionHistoryPageComponent, 
    ToastComponent
  ],
  templateUrl: './esercizi-app.component.html',
  styleUrl: './esercizi-app.component.css',
  providers: [ToastService]
})
export class EserciziAppComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  
  private readonly STORAGE_KEY = 'gym_exercises';
  private readonly SESSION_STORAGE_KEY = 'gym_sessions';
  
  exercises: Exercise[] = [];
  selectedMuscleGroup: string = 'Tutti';
  showModal = false;
  editingId: number | null = null;
  showConfirm = false;
  confirmMessage = '';
  
  showSessionPage = false;
  showHistoryPage = false;
  sessions: WorkoutSession[] = [];
  sessionToEdit: WorkoutSession | null = null;
  
  get filteredExercises(): Exercise[] {
    if (this.selectedMuscleGroup === 'Tutti') {
      return this.exercises;
    }
    return this.exercises.filter(ex => ex.muscleGroup.toLowerCase() === this.selectedMuscleGroup.toLowerCase());
  }

  get uniqueMuscleGroups(): string[] {
    const groups = new Set(this.exercises.map(ex => ex.muscleGroup));
    return ['Tutti', ...Array.from(groups).sort()];
  }
  
  formData: Exercise = {
    id: 0,
    name: '',
    muscleGroup: '',
    sets: 3,
    reps: 10,
    weightKg: undefined,
    notes: ''
  };

  private defaultExercises: Exercise[] = [
    {
      id: 1,
      name: 'Panca piana con bilanciere',
      muscleGroup: 'petto',
      sets: 3,
      reps: 8,
      weightKg: 50,
      notes: 'Focus sulla tecnica, niente rimbalzi'
    },
    {
      id: 2,
      name: 'Lat machine avanti',
      muscleGroup: 'schiena',
      sets: 3,
      reps: 10,
      weightKg: 40,
      notes: 'Tirare al petto senza slanci'
    },
    {
      id: 3,
      name: 'Squat al multipower',
      muscleGroup: 'gambe',
      sets: 4,
      reps: 8,
      weightKg: 60,
      notes: 'Scendere almeno a parallelo'
    },
    {
      id: 4,
      name: 'Curl manubri in piedi',
      muscleGroup: 'bicipiti',
      sets: 3,
      reps: 12,
      weightKg: 10
    },
    {
      id: 5,
      name: 'French press bilanciere EZ',
      muscleGroup: 'tricipiti',
      sets: 3,
      reps: 10,
      weightKg: 25
    },
    {
      id: 6,
      name: 'Plank',
      muscleGroup: 'core',
      sets: 3,
      reps: 30,
      notes: '30 secondi a serie'
    }
  ];

  ngOnInit() {
    this.loadExercises();
    this.loadSessions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private loadExercises() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.exercises = JSON.parse(saved);
      } catch (error) {
        console.error('Errore nel caricamento degli esercizi:', error);
        this.exercises = [...this.defaultExercises];
        this.saveExercises();
      }
    } else {
      this.exercises = [...this.defaultExercises];
      this.saveExercises();
    }
  }

  private saveExercises() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.exercises));
  }

  insertExercise() {
    this.editingId = null;
    this.formData = {
      id: 0,
      name: '',
      muscleGroup: '',
      sets: 3,
      reps: 10,
      weightKg: undefined,
      notes: ''
    };
    this.showModal = true;
  }

  editExercise(id: number) {
    const exercise = this.exercises.find(ex => ex.id === id);
    if (exercise) {
      this.editingId = id;
      this.formData = { ...exercise };
      this.showModal = true;
    }
  }

  saveExercise(exercise: Exercise) {
    if (!exercise.name.trim() || !exercise.muscleGroup.trim()) {
      this.toastService.error('Nome e Gruppo muscolare obbligatori!');
      return;
    }

    if (this.editingId) {
      const index = this.exercises.findIndex(ex => ex.id === this.editingId);
      if (index !== -1) {
        this.exercises[index] = exercise;
      }
    } else {
      const newId = this.exercises.length > 0 ? Math.max(...this.exercises.map(ex => ex.id)) + 1 : 1;
      exercise.id = newId;
      this.exercises.push({ ...exercise });
    }

    this.saveExercises();
    const isEdit = !!this.editingId;
    const message = isEdit ? 'Esercizio modificato!' : 'Esercizio aggiunto!';
    this.toastService.success(message);
    this.closeModal();
  }

  closeConfirm() {
    this.showConfirm = false;
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
  }

  deleteExercise(id: number) {
    const confirmed = confirm(`Sei sicuro di voler eliminare questo esercizio?`);
    if (confirmed) {
      this.exercises = this.exercises.filter(ex => ex.id !== id);
      this.saveExercises();
      this.toastService.success('Esercizio eliminato!');
    }
  }

  openSessionPage() {
    this.showSessionPage = true;
    this.loadSessions();
  }

  closeSessionPage() {
    this.showSessionPage = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openHistoryPage() {
    this.showHistoryPage = true;
    this.loadSessions();
  }

  closeHistoryPage() {
    this.showHistoryPage = false;
  }

  onHistorySessionEdited(session: WorkoutSession) {
    this.sessionToEdit = { ...session };
    this.showSessionPage = true;
    this.showHistoryPage = false;
  }

  onHistorySessionDeleted(id: number) {
    this.sessions = this.sessions.filter(s => s.id !== id);
    this.saveSessions();
    this.toastService.success('Sessione eliminata!');
  }

  onHistorySessionDuplicated(session: WorkoutSession) {
    const newSession: WorkoutSession = {
      ...session,
      id: Date.now(),
      date: new Date().toISOString(),
      name: `${session.name} (Copia)`
    };
    this.sessions.push(newSession);
    this.saveSessions();
    this.toastService.success('Sessione duplicata', `"${newSession.name}"`);
  }

  onSessionSaved(session: WorkoutSession) {
    if (this.sessionToEdit) {
      const index = this.sessions.findIndex(s => s.id === this.sessionToEdit!.id);
      if (index !== -1) {
        this.sessions[index] = session;
        this.saveSessions();
        this.toastService.success('Sessione aggiornata', `"${session.name}"`);
      }
      this.sessionToEdit = null;
    } else {
      this.sessions.push(session);
      this.saveSessions();
      this.toastService.success('Sessione salvata', `"${session.name}"`);
    }
    this.showSessionPage = false;
  }

  onSessionDeleted(id: number) {
    this.sessions = this.sessions.filter(s => s.id !== id);
    this.saveSessions();
    this.toastService.success('Sessione eliminata!');
  }

  onSessionLoaded(session: WorkoutSession) {
    this.toastService.info('Sessione caricata', `"${session.name}"`);
  }

  private loadSessions() {
    const saved = localStorage.getItem(this.SESSION_STORAGE_KEY);
    if (saved) {
      try {
        this.sessions = JSON.parse(saved);
      } catch (error) {
        console.error('Errore nel caricamento delle sessioni:', error);
        this.sessions = [];
      }
    } else {
      this.sessions = [];
    }
  }

  private saveSessions() {
    localStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(this.sessions));
  }
}

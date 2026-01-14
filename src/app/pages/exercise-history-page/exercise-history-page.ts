import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise } from '../../models/exercise';
import { WorkoutSession } from '../../models/workout-session';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

interface ExerciseExecution {
  sessionId: number;
  sessionName: string;
  sessionDate: string;
  exerciseId: number;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

@Component({
  selector: 'app-exercise-history-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, ChartModule],
  templateUrl: './exercise-history-page.html',
  styleUrl: './exercise-history-page.css'
})
export class ExerciseHistoryPageComponent {
  @Input() selectedExercise: Exercise | null = null;
  @Input() allSessions: WorkoutSession[] = [];
  @Output() backClicked = new EventEmitter<void>();

  get exerciseHistory(): ExerciseExecution[] {
    if (!this.selectedExercise) return [];

    const history: ExerciseExecution[] = [];
    
    this.allSessions.forEach(session => {
      const exercise = session.exercises.find(ex => ex.exerciseId === this.selectedExercise!.id);
      if (exercise) {
        history.push({
          sessionId: session.id,
          sessionName: session.name,
          sessionDate: session.date,
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          notes: exercise.notes
        });
      }
    });

    return history.sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
  }

  getAverageSets(): string {
    if (this.exerciseHistory.length === 0) return '0';
    const sum = this.exerciseHistory.reduce((acc, ex) => acc + ex.sets, 0);
    return (sum / this.exerciseHistory.length).toFixed(1);
  }

  getAverageReps(): string {
    if (this.exerciseHistory.length === 0) return '0';
    const sum = this.exerciseHistory.reduce((acc, ex) => acc + ex.reps, 0);
    return (sum / this.exerciseHistory.length).toFixed(1);
  }

  hasWeight(): boolean {
    return this.exerciseHistory.some(ex => ex.weight !== undefined && ex.weight !== null);
  }

  getMaxWeight(): number {
    const weights = this.exerciseHistory
      .filter(ex => ex.weight !== undefined && ex.weight !== null)
      .map(ex => ex.weight as number);
    return weights.length > 0 ? Math.max(...weights) : 0;
  }

  get chartDataSets() {
    if (this.exerciseHistory.length === 0) return null;

    return {
      labels: this.exerciseHistory.map(ex => 
        new Date(ex.sessionDate).toLocaleDateString('it-IT', { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: 'Serie',
          data: this.exerciseHistory.map(ex => ex.sets),
          borderColor: '#e082d4',
          backgroundColor: 'rgba(224, 130, 212, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        },
        {
          label: 'Ripetizioni',
          data: this.exerciseHistory.map(ex => ex.reps),
          borderColor: '#00bcd4',
          backgroundColor: 'rgba(0, 188, 212, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2
        }
      ]
    };
  }

  get chartDataWeight() {
    if (!this.hasWeight()) return null;

    return {
      labels: this.exerciseHistory
        .filter(ex => ex.weight !== undefined && ex.weight !== null)
        .map(ex => new Date(ex.sessionDate).toLocaleDateString('it-IT', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Peso (kg)',
          data: this.exerciseHistory
            .filter(ex => ex.weight !== undefined && ex.weight !== null)
            .map(ex => ex.weight),
          borderColor: '#764ba2',
          backgroundColor: 'rgba(118, 75, 162, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#764ba2',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    };
  }

  get chartOptions() {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#ccc',
            font: { size: 12, weight: '500' }
          }
        }
      },
      scales: {
        y: {
          ticks: { color: '#888' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        x: {
          ticks: { color: '#888' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    };
  }

  goBack() {
    this.backClicked.emit();
  }
}

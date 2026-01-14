import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Exercise } from '../../models/exercise';
import { ExerciseRecord } from '../../models/exercise-record';
import { ToastService } from '../../services/toast.service';

Chart.register(...registerables);

interface ExerciseProgressData {
  exerciseId: number;
  exerciseName: string;
  records: ExerciseRecord[];
}

@Component({
  selector: 'app-exercise-progress-page',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule, 
    ButtonModule, 
    SelectModule, 
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    FloatLabelModule
  ],
  templateUrl: './exercise-progress-page.html',
  styleUrl: './exercise-progress-page.css'
})
export class ExerciseProgressPageComponent implements OnInit {
  @ViewChild('weightChart') weightChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('volumeChart') volumeChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('repsChart') repsChartRef!: ElementRef<HTMLCanvasElement>;

  exercises: Exercise[] = [];
  exerciseRecords: ExerciseRecord[] = [];
  selectedExercise: Exercise | null = null;
  progressData: ExerciseProgressData | null = null;
  
  weightChart: Chart | null = null;
  volumeChart: Chart | null = null;
  repsChart: Chart | null = null;

  // Modal per aggiungere/modificare record
  showModal = false;
  editingRecord: ExerciseRecord | null = null;
  formData: Partial<ExerciseRecord> = {
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    sets: 3,
    reps: 10,
    notes: ''
  };

  private readonly STORAGE_KEY = 'gym_exercises';
  private readonly RECORDS_STORAGE_KEY = 'gym_exercise_records';

  constructor(
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Carica esercizi
    const savedExercises = localStorage.getItem(this.STORAGE_KEY);
    if (savedExercises) {
      this.exercises = JSON.parse(savedExercises);
    }

    // Carica registrazioni esercizi
    const savedRecords = localStorage.getItem(this.RECORDS_STORAGE_KEY);
    if (savedRecords) {
      this.exerciseRecords = JSON.parse(savedRecords);
    }

    // Se ci sono esercizi, seleziona il primo
    if (this.exercises.length > 0) {
      this.selectedExercise = this.exercises[0];
      this.updateProgressData();
    }
  }

  onExerciseChange() {
    this.updateProgressData();
  }

  updateProgressData() {
    if (!this.selectedExercise) return;

    const exerciseId = this.selectedExercise.id;
    const records = this.exerciseRecords
      .filter(record => record.exerciseId === exerciseId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.progressData = {
      exerciseId: exerciseId,
      exerciseName: this.selectedExercise.name,
      records: records
    };
    
    // Aspetta che i canvas siano disponibili
    setTimeout(() => {
      this.createCharts();
    }, 0);
  }

  createCharts() {
    if (!this.progressData || this.progressData.records.length === 0) return;

    const labels = this.progressData.records.map(r => 
      new Date(r.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })
    );

    // Distruggi i grafici esistenti
    if (this.weightChart) this.weightChart.destroy();
    if (this.volumeChart) this.volumeChart.destroy();
    if (this.repsChart) this.repsChart.destroy();

    // Grafico Peso
    if (this.weightChartRef) {
      const weightData = this.progressData.records.map(r => r.weight);
      this.weightChart = new Chart(this.weightChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Peso (kg)',
            data: weightData,
            borderColor: '#9c27b0',
            backgroundColor: 'rgba(156, 39, 176, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#9c27b0',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: 'Progressione Peso',
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Peso (kg)'
              }
            }
          }
        }
      });
    }

    // Grafico Volume
    if (this.volumeChartRef) {
      const volumeData = this.progressData.records.map(r => r.weight * r.sets * r.reps);
      this.volumeChart = new Chart(this.volumeChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Volume Totale (kg)',
            data: volumeData,
            backgroundColor: 'rgba(233, 30, 99, 0.7)',
            borderColor: '#e91e63',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: 'Volume di Allenamento',
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Volume (kg)'
              }
            }
          }
        }
      });
    }

    // Grafico Ripetizioni e Serie
    if (this.repsChartRef) {
      const repsData = this.progressData.records.map(r => r.reps);
      const setsData = this.progressData.records.map(r => r.sets);
      
      this.repsChart = new Chart(this.repsChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Ripetizioni',
              data: repsData,
              borderColor: '#667eea',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              tension: 0.4,
              yAxisID: 'y'
            },
            {
              label: 'Serie',
              data: setsData,
              borderColor: '#764ba2',
              backgroundColor: 'rgba(118, 75, 162, 0.1)',
              tension: 0.4,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: 'Serie e Ripetizioni',
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Ripetizioni'
              }
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Serie'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          }
        }
      });
    }
  }

  getStats() {
    if (!this.progressData || this.progressData.records.length === 0) {
      return null;
    }

    const records = this.progressData.records;
    const firstRecord = records[0];
    const lastRecord = records[records.length - 1];

    const weightIncrease = lastRecord.weight - firstRecord.weight;
    const weightIncreasePercent = firstRecord.weight > 0 
      ? ((weightIncrease / firstRecord.weight) * 100).toFixed(1)
      : 0;

    const firstVolume = firstRecord.weight * firstRecord.sets * firstRecord.reps;
    const lastVolume = lastRecord.weight * lastRecord.sets * lastRecord.reps;
    const volumeIncrease = lastVolume - firstVolume;
    const volumeIncreasePercent = firstVolume > 0
      ? ((volumeIncrease / firstVolume) * 100).toFixed(1)
      : 0;

    return {
      totalRecords: records.length,
      currentWeight: lastRecord.weight,
      weightIncrease: weightIncrease,
      weightIncreasePercent: weightIncreasePercent,
      currentVolume: lastVolume,
      volumeIncrease: volumeIncrease,
      volumeIncreasePercent: volumeIncreasePercent
    };
  }

  // Gestione modal
  openAddModal() {
    if (!this.selectedExercise) {
      this.toastService.error('Seleziona prima un esercizio');
      return;
    }

    this.editingRecord = null;
    this.formData = {
      date: new Date().toISOString().split('T')[0],
      weight: this.selectedExercise.weightKg || 0,
      sets: this.selectedExercise.sets || 3,
      reps: this.selectedExercise.reps || 10,
      notes: ''
    };
    this.showModal = true;
  }

  openEditModal(record: ExerciseRecord) {
    this.editingRecord = record;
    this.formData = {
      date: record.date,
      weight: record.weight,
      sets: record.sets,
      reps: record.reps,
      notes: record.notes || ''
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingRecord = null;
  }

  saveRecord() {
    if (!this.selectedExercise) return;

    if (!this.formData.date || !this.formData.weight || !this.formData.sets || !this.formData.reps) {
      this.toastService.error('Compila tutti i campi obbligatori');
      return;
    }

    if (this.editingRecord) {
      // Modifica record esistente
      const index = this.exerciseRecords.findIndex(r => r.id === this.editingRecord!.id);
      if (index !== -1) {
        this.exerciseRecords[index] = {
          id: this.editingRecord.id,
          exerciseId: this.editingRecord.exerciseId,
          exerciseName: this.editingRecord.exerciseName,
          date: this.formData.date!,
          weight: this.formData.weight!,
          sets: this.formData.sets!,
          reps: this.formData.reps!,
          notes: this.formData.notes
        };
        this.toastService.success('Record modificato con successo');
      }
    } else {
      // Nuovo record
      const newRecord: ExerciseRecord = {
        id: Date.now(),
        exerciseId: this.selectedExercise.id,
        exerciseName: this.selectedExercise.name,
        date: this.formData.date!,
        weight: this.formData.weight!,
        sets: this.formData.sets!,
        reps: this.formData.reps!,
        notes: this.formData.notes
      };
      this.exerciseRecords.push(newRecord);
      this.toastService.success('Record aggiunto con successo');
    }

    this.saveRecords();
    this.updateProgressData();
    this.closeModal();
  }

  deleteRecord(record: ExerciseRecord) {
    if (confirm('Sei sicuro di voler eliminare questo record?')) {
      this.exerciseRecords = this.exerciseRecords.filter(r => r.id !== record.id);
      this.saveRecords();
      this.updateProgressData();
      this.toastService.success('Record eliminato');
    }
  }

  private saveRecords() {
    localStorage.setItem(this.RECORDS_STORAGE_KEY, JSON.stringify(this.exerciseRecords));
  }

  goBack() {
    this.router.navigate(['/esercizi']);
  }

  ngOnDestroy() {
    if (this.weightChart) this.weightChart.destroy();
    if (this.volumeChart) this.volumeChart.destroy();
    if (this.repsChart) this.repsChart.destroy();
  }
}

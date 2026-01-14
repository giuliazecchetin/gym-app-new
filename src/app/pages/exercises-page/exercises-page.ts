import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Exercise } from '../../models/exercise';
import { ExerciseListComponent } from '../../components/exercise-list/exercise-list';

@Component({
  selector: 'app-exercises-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ExerciseListComponent],
  templateUrl: './exercises-page.html',
  styleUrl: './exercises-page.css'
})
export class ExercisesPageComponent {
  @Input() exercises: Exercise[] = [];
  @Input() selectedMuscleGroup: string = 'Tutti';
  @Output() selectedMuscleGroupChange = new EventEmitter<string>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

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

  onMuscleGroupChange(value: string) {
    this.selectedMuscleGroupChange.emit(value);
  }

  onEdit(id: number) {
    this.edit.emit(id);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}

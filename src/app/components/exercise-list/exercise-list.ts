import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Exercise } from '../../models/exercise';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './exercise-list.html',
  styleUrl: './exercise-list.css'
})
export class ExerciseListComponent {
  exercises = input<Exercise[]>([]);
  edit = output<number>();
  delete = output<number>();
}

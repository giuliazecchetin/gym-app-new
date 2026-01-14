import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { ExerciseProgressPageComponent } from './pages/exercise-progress-page/exercise-progress-page';


export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'progressi', component: ExerciseProgressPageComponent },
  { 
    path: 'esercizi', 
    loadChildren: () => import('./esercizi/esercizi.routes').then(m => m.ESERCIZI_ROUTES)
  },
  { path: '**', redirectTo: '' }
];

import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';


export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { 
    path: 'esercizi', 
    loadChildren: () => import('./esercizi/esercizi.routes').then(m => m.ESERCIZI_ROUTES)
  },
  { path: '**', redirectTo: '' }
];

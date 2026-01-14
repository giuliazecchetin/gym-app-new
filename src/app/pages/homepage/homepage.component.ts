import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CardModule, ButtonModule, CarouselModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  constructor(private router: Router) {}
  features = [
    {
      icon: 'pi pi-list',
      title: 'Gestione Esercizi',
      description: 'Crea e organizza il tuo database personale di esercizi con tutte le informazioni necessarie'
    },
    {
      icon: 'pi pi-calendar-plus',
      title: 'Sessioni di Allenamento',
      description: 'Pianifica e traccia le tue sessioni di workout con facilità'
    },
    {
      icon: 'pi pi-chart-line',
      title: 'Monitoraggio Progressi',
      description: 'Visualizza i tuoi miglioramenti con grafici e statistiche dettagliate'
    },
    {
      icon: 'pi pi-history',
      title: 'Cronologia Completa',
      description: 'Rivedi tutti i tuoi allenamenti passati e analizza la tua crescita'
    }
  ];

  testimonials = [
    {
      name: 'Marco Rossi',
      text: 'La migliore palestra in cui sia mai stato! Personal trainer eccezionali.',
      rating: 5
    },
    {
      name: 'Laura Bianchi',
      text: 'Ambiente pulito, attrezzature top. Sono riuscita a raggiungere tutti i miei obiettivi!',
      rating: 5
    },
    {
      name: 'Giuseppe Verdi',
      text: 'Corsi fantastici e orari super flessibili. Consigliatissima!',
      rating: 5
    }
  ];

  goToExercises() {
    this.router.navigate(['/esercizi']);
  }

  scrollToFeatures() {
    const featuresSection = document.querySelector('.features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  }
}

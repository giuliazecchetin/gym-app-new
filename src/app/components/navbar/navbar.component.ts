import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private router = inject(Router);

  items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => this.router.navigate(['/'])
    },
    {
      label: 'Esercizi',
      icon: 'pi pi-bolt',
      command: () => this.router.navigate(['/esercizi'])
    },
    {
      label: 'Progressi',
      icon: 'pi pi-chart-line',
      command: () => this.router.navigate(['/progressi'])
    }
  ];
}

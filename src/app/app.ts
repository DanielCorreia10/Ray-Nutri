import { Component, OnInit } from '@angular/core';
import { 
  Router, 
  NavigationEnd, 
  RouterOutlet, 
  RouterLink, 
  RouterLinkActive 
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html', // 
  styleUrls: ['./app.css'],  
  standalone: true, 
  imports: [RouterOutlet, RouterLink, RouterLinkActive] 
})
export class AppComponent implements OnInit { 
  
  isConsultaRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Verifica se o caminho contém '/consulta' para trocar o banner
      this.isConsultaRoute = event.urlAfterRedirects.includes('/consulta');
    });
  }
}

// Exporta AppComponent com o alias App para corrigir o erro de importação do servidor
export { AppComponent as App };
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
  <nav>
  <ul>
    <li>
      <a routerLink="home">
        
      </a>
    </li>
    
  </ul>
</nav>
<router-outlet></router-outlet>
  `,
  styles: [
    "../node_modules/angular2-busy/build/style/busy.css",
    "styles.css"
  ]
})
export class AppComponent {
  title = 'energy-test';
  constructor(private routerModule: RouterModule){}

}


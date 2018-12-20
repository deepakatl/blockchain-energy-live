import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
export class AppComponent { }

@Component({
  selector: 'app-root',
  @Component({templateUrl: 'energy.component.html'})`
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

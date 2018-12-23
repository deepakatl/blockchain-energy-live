import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { WebHomeComponent } from './web-home/web-home.component';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { EnergyComponent } from './energy/energy.component';


const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', component: WebHomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'energy', component: EnergyComponent , canActivate: [AuthGuard]},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
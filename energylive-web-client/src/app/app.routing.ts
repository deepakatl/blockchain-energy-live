import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { WebHomeComponent } from './web-home/web-home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ApproveUserComponent } from './approve-user/approve-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { TariffComponent } from './tariff/tariff.component';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { EnergyComponent } from './energy/energy.component';


const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'adminhome', component: AdminHomeComponent, canActivate: [AuthGuard] },
    { path: 'approveuser', component: ApproveUserComponent, canActivate: [AuthGuard] },
    { path: 'updatetariff', component: TariffComponent, canActivate: [AuthGuard] },
    { path: 'updateuser', component: UpdateUserComponent, canActivate: [AuthGuard] },
    { path: '', component: WebHomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'energy', component: EnergyComponent , canActivate: [AuthGuard]},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
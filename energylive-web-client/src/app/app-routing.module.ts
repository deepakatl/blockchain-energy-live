import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GenerateComponent } from './energy/energy.component';
import { ConsumeComponent } from './energy/energy.component';
import { CountComponent } from './energy/energy.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';



const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'login',
        component: LoginComponent,


        children: [
          {
            path: 'generate',
            component: GenerateComponent
          },
          {
            path: 'consume',
            component: ConsumeComponent
          },
          {
            path: 'count',
            component: CountComponent
          }
        ]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule],
  // CommonModule

  declarations: []
})
export class AppRoutingModule { }

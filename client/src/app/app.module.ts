import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthguardService } from './services/authguard.service';
import { AppComponent } from './app.component';
import { AuthpagesComponent } from './authpages/authpages.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { LoginComponent } from './authpages/login/login.component';
import { ResetComponent } from './authpages/reset/reset.component';
import { RegisterComponent } from './authpages/register/register.component';
import { DashboardComponent } from './user-panel/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SpendingComponent } from './user-panel/spending/spending.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { NetworthComponent } from './user-panel/networth/networth.component';
import { TransactionsComponent } from './user-panel/transactions/transactions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DebtComponent } from './user-panel/debt/debt.component';
import { DebtTipsComponent } from './user-panel/debt-tips/debt-tips.component';
import { AccountsComponent } from './user-panel/accounts/accounts.component';
import { AmChartsModule } from '@amcharts/amcharts3-angular';
declare let google:any;


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetComponent,
    UserPanelComponent,
    DashboardComponent,
    SpendingComponent,
    NetworthComponent,
    TransactionsComponent,
    AuthpagesComponent,
    DebtComponent,
    DebtTipsComponent,
    AccountsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent},
      { path: 'register', component: RegisterComponent},
      { path: 'reset/:resetToken', component: ResetComponent},
      { path: '', redirectTo: '/login', pathMatch: 'full'},
      { path: 'dashboard', component: DashboardComponent , canActivate: [AuthguardService]},
      { path: 'spending', component: SpendingComponent , canActivate: [AuthguardService]},
      { path: 'networth', component: NetworthComponent , canActivate: [AuthguardService]},
      { path: 'transactions', component: TransactionsComponent , canActivate: [AuthguardService]},
      { path: 'accounts', component: AccountsComponent , canActivate: [AuthguardService]},
      { path: 'debt', component: DebtComponent , canActivate: [AuthguardService]},
      { path: 'debt-tips', component: DebtTipsComponent , canActivate: [AuthguardService]}
    ]),
    GoogleChartsModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AmChartsModule
  ],
  providers: [AuthguardService,{provide: LocationStrategy, useClass: PathLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }


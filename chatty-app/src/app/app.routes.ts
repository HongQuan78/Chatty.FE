import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ChatPageComponent } from './features/chat/chat-page/chat-page.component';
import { SettingsPageComponent } from './features/settings/settings-page/settings-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'chat', component: ChatPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' }
];

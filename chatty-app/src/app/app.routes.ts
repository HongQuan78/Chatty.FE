import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ChatPageComponent } from './features/chat/chat-page/chat-page.component';
import { SettingsPageComponent } from './features/settings/settings-page/settings-page.component';
import { ProfileComponent } from './features/profile/profile.component';
import { authGuard } from './core/guards/auth.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { guestGuard } from './core/guards/guest.guard';
export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'chat', component: ChatPageComponent, canActivate: [authGuard]},
  { path: 'settings', component: SettingsPageComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard], canDeactivate: [unsavedChangesGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'chat' },
];

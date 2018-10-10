import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgOidcClientModule, Config } from 'ng-oidc-client';
import { AppComponent } from './core/components/app/app.component';
import { HomeComponent } from './core/components/home/home.component';
import { OidcGuardService } from './core/providers/oidc-guard.service';
import { ProtectedComponent } from './core/components/protected/protected.component';
import { LoginComponent } from './core/components/login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { OidcInterceptorService } from './core/providers/oidc-interceptor.service';
import { UserModule } from './modules/user/user.module';
import { environment } from 'src/environments/environment';

export interface State {
  router: RouterReducerState;
}

export const rootStore: ActionReducerMap<State> = {
  router: routerReducer
};

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'protected',
    canActivate: [OidcGuardService],
    component: ProtectedComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AppComponent, ProtectedComponent, HomeComponent, LoginComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot(rootStore),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'ng-oidc-client',
      logOnly: true
    }),
    NgOidcClientModule.forRoot(environment.ngOidcClient),
    UserModule.forRoot({
      urls: {
        api: 'https://localhost:5001'
      }
    })
  ],
  providers: [
    OidcGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OidcInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

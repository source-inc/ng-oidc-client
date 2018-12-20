import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { LoonaModule } from '@loona/angular';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { NgOidcClientModule } from 'ng-oidc-client';
import { WebStorageStateStore } from 'oidc-client';
import { AppComponent } from './core/components/app/app.component';
import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';
import { ProtectedComponent } from './core/components/protected/protected.component';
import { UnauthorizedComponent } from './core/components/unauthorized/unauthorized.component';
import { OidcGuardService } from './core/providers/oidc-guard.service';
import { OidcInterceptorService } from './core/providers/oidc-interceptor.service';
import { MaterialModule } from './material/material.module';

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
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  { path: '**', redirectTo: '' }
];

export function getWebStorageStateStore() {
  return new WebStorageStateStore({ store: window.localStorage });
}

@NgModule({
  declarations: [AppComponent, ProtectedComponent, HomeComponent, LoginComponent, UnauthorizedComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    LoonaModule.forRoot(),
    NgOidcClientModule.forRoot({
      oidc_config: {
        authority: 'https:/ng-oidc-client-server.azurewebsites.net',
        client_id: 'ng-oidc-client-identity',
        redirect_uri: 'http://localhost:4200/callback.html',
        response_type: 'id_token token',
        scope: 'openid profile offline_access api1',
        post_logout_redirect_uri: 'http://localhost:4200/signout-callback.html',
        silent_redirect_uri: 'http://localhost:4200/renew-callback.html',
        accessTokenExpiringNotificationTime: 10,
        automaticSilentRenew: true,
        userStore: getWebStorageStateStore
      }
      // log: {
      //   logger: console,
      //   level: 0
      // },
      // useCallbackFlag: true
    }),
    MaterialModule
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

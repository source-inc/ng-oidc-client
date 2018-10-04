import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgOidcClientModule } from 'ng-oidc-client';
import { AppComponent } from './app.component';
import { ProtectedComponent } from './protected/protected.component';
import { HomeComponent } from './home/home.component';
import { OidcGuardService } from './oidc-guard.service';
import { OidcInterceptorService } from './oidc-interceptor.service';
import { LoginComponent } from './login/login.component';

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
    NgOidcClientModule.forRoot({
      environment: {
        // urls: {
        //   authority: 'http://ng-oidc-client.auth0.com',
        //   redirect_uri: 'http://localhost:4200/callback.html',
        //   post_logout_redirect_uri: 'http://localhost:4200/signout-callback.html',
        //   silent_redirect_uri: 'http://localhost:4200/renew-callback.html'
        // },
        // client: {
        //   id: 'ZKGJvKHLI7KYsjBP9HZFXPF4dX3TA6Eq',
        //   scope: 'openid profile offline_access'
        // }
        urls: {
          authority: 'https://localhost:5001',
          redirect_uri: 'http://localhost:4200/callback.html',
          post_logout_redirect_uri: 'http://localhost:4200/signout-callback.html',
          silent_redirect_uri: 'http://localhost:4200/renew-callback.html'
        },
        client: {
          id: 'ng-oidc-client-identity',
          scope: 'openid profile offline_access'
        }
      },
      accessTokenExpiringNotificationTime: 10,
      automaticSilentRenew: true,
      filterProtocolClaims: true,
      loadUserInfo: true
    })
  ],
  providers: [OidcGuardService, OidcInterceptorService],
  bootstrap: [AppComponent]
})
export class AppModule {}

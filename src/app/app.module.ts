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
import { WebStorageStateStore, Log } from 'oidc-client';

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
      oidc_config: {
        authority: 'https://localhost:5001',
        client_id: 'ng-oidc-client-identity',
        redirect_uri: 'http://localhost:4200/callback.html',
        response_type: 'id_token token',
        scope: 'openid profile offline_access api1',
        post_logout_redirect_uri: 'http://localhost:4200/signout-callback.html',
        silent_redirect_uri: 'http://localhost:4200/renew-callback.html',
        accessTokenExpiringNotificationTime: 10,
        automaticSilentRenew: true,
        userStore: new WebStorageStateStore({ store: window.localStorage })
      },
      log: {
        logger: console,
        level: Log.DEBUG
      }
    }),
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

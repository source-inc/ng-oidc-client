import { NgModule, APP_INITIALIZER } from '@angular/core';
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
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UnauthorizedComponent } from './core/components/unauthorized/unauthorized.component';

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

export const oidcConfigSettings: Config = {
  oidc_config: {
    authority: 'https:/ng-oidc-client-server.azurewebsites.net',
    client_id: 'ng-oidc-client-identity',
    redirect_uri: 'http://localhost:4200/callback.html',
    response_type: 'code',
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
};

// Oidc config on APP_INITIALIZER
// export function loadConfig(facade: OidcFacade) {
//   return () =>
//     new Promise(resolve => {
//       setTimeout(() => {
//         facade.configureOidcClient(configSettings);
//         resolve();
//       }, 2000);
//     });
// }

@NgModule({
  declarations: [AppComponent, ProtectedComponent, HomeComponent, LoginComponent, UnauthorizedComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot(rootStore, {
      runtimeChecks: {
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'ng-oidc-client',
      logOnly: true
    }),
    NgOidcClientModule.forRoot(oidcConfigSettings),
    UserModule.forRoot({
      urls: {
        api: 'https://localhost:5001'
      }
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
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: loadConfig,
    //   deps: [OidcFacade],
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

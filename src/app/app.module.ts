import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgOidcClientModule } from 'ng-oidc-client';
import { AppComponent } from './app.component';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Routes, RouterModule } from '@angular/router';

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
    component: AppComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [AppComponent],
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
        urls: {
          authority: 'http://ng-oidc-client.auth0.com',
          redirect_uri: 'http://localhost:4200/callback.html',
          post_logout_redirect_uri: 'http://localhost:4200/signout-callback.html',
          silent_redirect_uri: 'http://localhost:4200/renew-callback.html'
        },
        client: {
          id: 'ZKGJvKHLI7KYsjBP9HZFXPF4dX3TA6Eq',
          scope: 'openid profile offline_access'
        }
      },
      accessTokenExpiringNotificationTime: 10,
      automaticSilentRenew: true,
      filterProtocolClaims: true,
      loadUserInfo: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

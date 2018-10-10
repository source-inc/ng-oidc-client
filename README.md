# NG OIDC Client

An Angular 6+ package wrapping [oidc-client-js][1] to manage authentication with OIDC and OAuth2 in a reactive way using [NgRx][2].

![Screenshot of OIDC state in Redux DevTools][screenshot]

## Getting started 🚀
The configuration for the examples are based on running IdentityServer4 on localhost. A ready-to-go reference implementation for testing purposes can be found at [ng-oidc-client-server][4]. 

Install the package
```bash
npm install -s ng-oidc-client
```
if not already the case, install the necessary peer dependencies
```bash
npm install -s @ngrx/store 
npm install -s @ngrx/effects 
npm install -s oidc-client
```

Add the NgOidcClientModule to your AppModule
```diff
export interface State {
  router: RouterReducerState;
}
export const rootStore: ActionReducerMap<State> = {
  router: routerReducer
};

@NgModule({
  declarations: [AppComponent, ProtectedComponent, HomeComponent, LoginComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(rootStore),
    EffectsModule.forRoot([]),
+    NgOidcClientModule.forRoot({
+     authority: 'https://localhost:5001',
+     redirect_uri: 'http://localhost:4200/callback.html',
+     post_logout_redirect_uri: 'http://localhost:4200/signout-callback.html',
+     silent_redirect_uri: 'http://localhost:4200/renew-callback.html',
+     client_id: 'ng-oidc-client-identity',
+     scope: 'openid profile offline_access api1'
+   })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
For a complete list of configuration options please see the [official oidc-client-js documentation][3].

**Coming soon: Example configuration Using ng-oidc-client with Auth0 and Okta**

Inject the `OidcFacade` in your Component
```typescript
...
export class HomeComponent {
  constructor(private oidcFacade: OidcFacade) {}

  loginPopup() {
    this.oidcFacade.signinPopup();
  }

  logoutPopup() {
    this.oidcFacade.signoutPopup();
  }
}
```
Alternatively you can you also use `.signinRedirect();` or `.signoutRedirect();`. 

You will be able to authenticate against your configurated identity provider and the obtained user will be accessible in through the created state.

## Protecting Routes using an AuthGuard 💂
Create a new Service and implement the AuthGuard interface
```typescript
export class OidcGuardService implements CanActivate {
  constructor(private router: Router, private oidcFacade: OidcFacade) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.oidcFacade.identity$.pipe(
      take(1),
      switchMap(user => {
        console.log('Auth Guard - Checking if user exists', user);
        console.log('Auth Guard - Checking if user is expired:', user && user.expired);
        if (user && !user.expired) {
          return of(true);
        } else {
          this.router.navigate(['/login']);
          return of(false);
        }
      })
    );
  }
}
```
The guard needs to inject the `OidcFacade` to check if the user exists and is not expired. It is up to the application flow if the unauthenticated user is redirected to a login route or not.

Add the Guard to the list of providers in your AppModule
```diff
...
providers: [
+   OidcGuardService,
  ],
...
```

## Using HTTP Interceptor to add the Bearer token to API calls 🐻
In case an API requires a valid access token to interact with it, an HTTP Interceptor can be used to add the required Bearer token to each call. 

Create a new Service and implement the HttpInterceptor interface
```typescript
export class OidcInterceptorService implements HttpInterceptor {
  static OidcInterceptorService: any;
  constructor(private oidcFacade: OidcFacade) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.oidcFacade.identity$.pipe(
      switchMap(user => {
        if (user && !user.expired && user.access_token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.access_token}`
            }
          });
        }
        return next.handle(req);
      })
    );
  }
}
```
The interceptor needs to inject the `OidcFacade` to check if the user exists, is not expired and has an access token. The outgoing request will be cloned and an Authorization Header will be added to the request. Additionally, the requests should be filtered to only add the Bearer token where it is needed.

Add the Interceptor to the list of providers in your AppModule
```diff
...
providers: [
+   {
+     provide: HTTP_INTERCEPTORS,
+     useClass: OidcInterceptorService,
+     multi: true
+   }
  ],
...
```

# Docs
Coming soon

# Examples
Coming soon

# Licence
This software is licensed under the MIT


[screenshot]: https://github.com/Fileless/ng-oidc-client/blob/master/images/oidc-state-devtools-animated.gif
[1]: https://github.com/IdentityModel/oidc-client-js
[2]: https://github.com/ngrx/platform
[3]: https://github.com/IdentityModel/oidc-client-js/wiki#configuration
[4]: https://github.com/Fileless/ng-oidc-client-server

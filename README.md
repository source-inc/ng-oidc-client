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
+     oidc_config: {
+       authority: 'https://localhost:5001',
+       client_id: 'ng-oidc-client-identity',
+       redirect_uri: 'http://localhost:4200/callback.html',
+       response_type: 'id_token token',
+       scope: 'openid profile offline_access api1',
+       post_logout_redirect_uri: 'http://localhost:4200/signout-callback.html',
+       silent_redirect_uri: 'http://localhost:4200/renew-callback.html',
+       accessTokenExpiringNotificationTime: 10,
+       automaticSilentRenew: true,
+       userStore: new WebStorageStateStore({ store: window.localStorage })
+     },
+     log: {
+       logger: console,
+       level: Log.NONE
+     }
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

Create a new directory called `static` below the `src` folder, to serve the static callback HTML sites.
```bash
src/static
├── callback.html
├── renew-callback.html
└── signout-callback.html
```
Example for a `callback.html`
```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Callback</title>
  <link rel="icon"
        type="image/x-icon"
        href="favicon.png">
  <script src="oidc-client.min.js"
          type="application/javascript"></script>
</head>

<body>
  <script>
    var Oidc = window.Oidc;

    var config = {
      userStore: new Oidc.WebStorageStateStore({ store: window.localStorage })
    }

    if ((Oidc && Oidc.Log && Oidc.Log.logger)) {
      Oidc.Log.logger = console;
    }
    var isPopupCallback = JSON.parse(window.localStorage.getItem('ngoidc:isPopupCallback'));

    if (isPopupCallback) {
      new Oidc.UserManager(config).signinPopupCallback();
    } else {
      new Oidc.UserManager(config).signinRedirectCallback().then(t => {
        window.location.href = '/';
      });
    }
  </script>
</body>

</html>
```

Example for a `renew-callback.html`
```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Renew Callback</title>
    <link rel="icon"
          type="image/x-icon"
          href="favicon.png">
</head>

<body>
    <script src="oidc-client.min.js"></script>
    <script>
        var config = {
            userStore: new Oidc.WebStorageStateStore({ store: window.localStorage })
        }
        new Oidc.UserManager(config).signinSilentCallback().catch(function (e) {
            console.error(e);
        });
    </script>
</body>

</html>
```

Example for a `signout-callback.html`
```html
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Signout Callback</title>
  <link rel="icon"
        type="image/x-icon"
        href="favicon.png">
  <script src="oidc-client.min.js"
          type="application/javascript"></script>
</head>

<body>
  <script>
    var Oidc = window.Oidc;

    var config = {
      userStore: new Oidc.WebStorageStateStore({ store: window.localStorage })
    }

    if ((Oidc && Oidc.Log && Oidc.Log.logger)) {
      Oidc.Log.logger = console;
    }

    var isPopupCallback = JSON.parse(window.localStorage.getItem('ngoidc:isPopupCallback'));

    if (isPopupCallback) {
      new Oidc.UserManager(config).signoutPopupCallback();
    } else {
      new Oidc.UserManager(config).signoutRedirectCallback().then(test => {
        window.location.href = '/';
      });
    }
  </script>
</body>

</html>
```

Modify your `angular.json` to include the `static` assets and `oidc-client`
```diff
...
"assets": [
    "src/favicon.ico",
    "src/assets",
+   {
+     "glob": "**/*",
+     "input": "src/static",
+     "output": "/"
+   },
+   {
+     "glob": "oidc-client.min.js",
+     "input": "node_modules/oidc-client/dist",
+     "output": "/"
+   }
  ],
...
```

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

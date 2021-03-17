# Detailed Explanation
## OidcFacade
### Selectors
* `loading$ : Observable<boolean>` - used to indicate if the user is currently loading
* `expiring$ : Observable<boolean>` - indicates that a token is going to expire very soon
* `expired$ : Observable<boolean>` - indicates that the token is expired, a new token should be obtained
* `identity$ : Observable<OidcUser>` - returns an Observable to the obtained identity and is identical to [User from oidc-client][1]
* `errors$ : Observable<ErrorState>` - returns an Observable to Errors caught from `oidc-client`

### Methods
#### User
* `getOidcUser()`
* `removeOidcUser()`

#### Signin/-out
* `signinPopup(extraQueryParams?:any)`
* `signinRedirect(extraQueryParams?:any)`
* `signoutPopup(extraQueryParams?:any)`
* `signoutRedirect(extraQueryParams?:any)`
* `signinSilent()`
* `getSignoutUrl(extraQueryParams?:any)`

### Events
* registerEvent(event: OidcEvent, callback: (...ev: any[]) => void) - see full list of [events from oidc-client][2]

## OidcActions
**User/Identity related actions**
* GetOidcUser
* RemoveOidcUser
* UserExpired
* UserFound
* OnUserLoading
* UserDoneLoading
* UserLoadingError

**UserManager events from oidc-client**
* OnUserLoaded
* OnUserUnloaded
* OnAccessTokenExpiring
* OnAccessTokenExpired
* OnSilentRenewError
* OnUserSignedOut
* OnSessionChanged

**Signin/-out**
* SigninPopup
* SigninRedirect
* SigninSilent
* SignInError
* SignoutPopup
* SignoutRedirect
* SignOutError

**Errors**
* OidcError

[1]: https://github.com/IdentityModel/oidc-client-js/wiki#user
[2]: https://github.com/IdentityModel/oidc-client-js/wiki#events

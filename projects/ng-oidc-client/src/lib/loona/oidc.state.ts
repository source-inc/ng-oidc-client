import { Context, Effect, Mutation, State, Update } from '@loona/angular';
import { OidcActions } from '../actions/index';
import { IdentityGQL, NgOidcInfoGQL, UpdateNgOidcInfoGQL } from '../graphql/generated/graphql';
import { OnAccessTokenExpiring, OnUserUnloaded, OnUserSignedOut } from '../actions/oidc.action';

const defaultState = {
  identity: null,
  ngOidcInfo: {
    __typename: 'NgOidcInfo',
    expiring: false,
    loading: true,
    errors: []
  }
};
@State({
  defaults: defaultState
})
export class OidcState {
  constructor(private identityGQL: IdentityGQL, private ngOidcInfoGQL: NgOidcInfoGQL) {}

  @Mutation(OidcActions.UserFound)
  onUserFound(args, ctx: Context) {
    console.log('@onUserFound', args);
    args.identity.__typename = 'Identity';
    args.identity.profile.__typename = 'Profile';
    return args.identity;
  }

  @Update(OidcActions.UserFound)
  updateIdentity(mutation, ctx: Context) {
    console.log(`@Update OidcActions.UserFound`, mutation);
    ctx.patchQuery(this.identityGQL.document, state => {
      state.identity = mutation.result;
    });
    // set expiring to false
    ctx.patchQuery(this.ngOidcInfoGQL.document, state => {
      state.ngOidcInfo.expiring = false;
      state.ngOidcInfo.loading = false;
    });
  }

  @Mutation(OidcActions.OnAccessTokenExpiring)
  onAccessTokenExpiring(args, ctx: Context) {
    console.log('@Mutation expiring', args);
    args.info.__typename = 'NgOidcInfo';
    return args.info;
  }

  @Update(OidcActions.OnAccessTokenExpiring)
  updateAccessTokenExpiring(mutation, ctx: Context) {
    console.log('@update OnAccessTokenExpiring', mutation);
    ctx.patchQuery(this.ngOidcInfoGQL.document, state => {
      state.ngOidcInfo.expiring = mutation.result.expiring;
    });
  }

  @Effect(OidcActions.OnAccessTokenExpired)
  updateAccessTokenExpired(effect, ctx: Context) {
    console.log('@Effect updateAccessTokenExpired', effect);

    ctx.patchQuery(this.identityGQL.document, state => {
      if (state.identity != null) {
        state.identity.expired = true;
      }
    });

    // set expiring to false
    ctx.patchQuery(this.ngOidcInfoGQL.document, state => {
      state.ngOidcInfo.expiring = false;
    });
  }

  @Effect(OidcActions.OnUserUnloaded)
  onUserUnloaded(effect, ctx: Context) {
    console.log('@Effect OnUserUnloaded', effect);
    ctx.patchQuery(this.identityGQL.document, state => {
      state.identity = defaultState.identity;
    });

    ctx.patchQuery(this.ngOidcInfoGQL.document, state => {
      state.ngOidcInfo.expired = false;
    });
  }

  @Effect(OidcActions.OidcError)
  updateSilentRenewError(effect, ctx: Context) {
    console.log('@effect OnSilentRenewError', effect);
    ctx.patchQuery(this.ngOidcInfoGQL.document, state => {
      effect.payload.__typename = 'OidcError';
      if (state.ngOidcInfo.errors == null) {
        state.ngOidcInfo.errors = [];
      }
      state.ngOidcInfo.errors.push(effect.payload);
      state.ngOidcInfo.loading = false;
    });
  }
}

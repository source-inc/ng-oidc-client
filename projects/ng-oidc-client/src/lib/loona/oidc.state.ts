import { Context, Effect, Mutation, State, Update } from '@loona/angular';
import { OidcActions } from '../actions/index';
import { IdentityGQL, NgOidcInfoGQL } from '../graphql/generated/graphql';

@State({
  defaults: {
    identity: null,
    ngOidcInfo: {
      __typename: 'NgOidcInfo',
      expiring: false,
      loading: false
    }
  }
})
export class OidcState {
  constructor(private identityGQL: IdentityGQL, private ngOidcInfoGQL: NgOidcInfoGQL) {}

  @Mutation(OidcActions.UserFound)
  onUserFound(args, ctx: Context) {
    console.log({ identity: args });
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
  }

  @Mutation(OidcActions.OnAccessTokenExpiring)
  onAccessTokenExpiring(args, ctx: Context) {
    args.info.__typename = 'NgOidcInfo';
    return args.info;
  }

  @Update(OidcActions.OnAccessTokenExpiring)
  updateAccessTokenExpiring(mutation, ctx: Context) {
    ctx.patchQuery(this.ngOidcInfoGQL.document, state => {
      state.ngOidcInfo = mutation.result;
    });
  }

  @Effect(OidcActions.OnAccessTokenExpired)
  updateAccessTokenExpired(effect, ctx: Context) {
    ctx.patchQuery(this.identityGQL.document, state => {
      state.identity = effect.payload;
      state.identity.expired = true;
    });
  }
}

export type Maybe<T> = T | null;

// ====================================================
// Documents
// ====================================================

export namespace Identity {
  export type Variables = {};

  export type Query = {
    __typename?: 'Query';

    identity: Maybe<Identity>;
  };

  export type Identity = IdentityFields.Fragment;
}

export namespace IdentityFields {
  export type Fragment = {
    __typename?: 'Identity';

    id: string;
  };
}

// ====================================================
// START: Apollo Angular template
// ====================================================

import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';

import gql from 'graphql-tag';

// ====================================================
// GraphQL Fragments
// ====================================================

export const IdentityFieldsFragment = gql`
  fragment IdentityFields on Identity {
    id
  }
`;

// ====================================================
// Apollo Services
// ====================================================

@Injectable({
  providedIn: 'root'
})
export class IdentityGQL extends Apollo.Query<Identity.Query, Identity.Variables> {
  document: any = gql`
    query identity {
      identity {
        ...IdentityFields
      }
    }

    ${IdentityFieldsFragment}
  `;
}

// ====================================================
// END: Apollo Angular template
// ====================================================

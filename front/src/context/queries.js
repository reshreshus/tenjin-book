import { gql } from 'apollo-boost';

export const GET_CARD = gql`
    query Card($id: ID!) {
        card (id: $id) {
            deck_title
            template_title
            entries {
                id
                name
                content
                entry_type
            }
        }
    }
`;

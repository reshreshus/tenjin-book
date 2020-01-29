import { gql } from 'apollo-boost';

export const GET_CARD = gql`
    mutation Card($id: ID!) {
        card (id: $id) {
            id
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

export const ADD_CARD_ENTRY = gql`
    mutation AddCardEntry($id: ID, $name: String, $content: JSON, $entry_type: String, $card_id: ID) {
        addCardEntry(id: $id, name: $name, content: $content, entry_type: $entry_type, card_id: $card_id) {
            id
            content
        }
    }
`
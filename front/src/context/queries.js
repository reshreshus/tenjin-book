import { gql } from 'apollo-boost';

export const SAVE_BLOCKS = gql`
    mutation Blocks($blocks: [JSON]) {
        blocks (blocks: $blocks)
    }
`;

export const GET_BLOCKS = gql`
    {
        blocks
    }
`;

export const GET_CARD = gql`
    mutation Card($id: ID!) {
        card (id: $id) {
            id
            deck_id
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

export const SAVE_CARD = gql`
    mutation SaveCard($id: ID, $template_title:String, 
        $deck_title: String, $entries: [JSON]) { 
            saveCard(id: $id template_title: $template_title, 
            deck_title: $deck_title, entries: $entries) {
            id
            entries {
                content
            }
        }
    }
`;

export const ADD_CARD_ENTRY = gql`
    mutation AddCardEntry($id: Int, $name: String, $content: JSON, $entry_type: String, $card_id: ID) {
        addCardEntry(id: $id, name: $name, content: $content, entry_type: $entry_type, card_id: $card_id) {
            id
            content
        }
    }
`;
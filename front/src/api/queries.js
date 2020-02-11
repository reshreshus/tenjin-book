import { gql } from 'apollo-boost';


export const ADD_DECK = gql`
    mutation addDeck($parentID: String!) {
        addDeck(parentID: $parentID)
    }
`

export const DUPLICATE_BLOCK = gql`
    mutation duplicateBlock($id: String!) {
        duplicateBlock(id: $id)
    }
`

export const DELETE_BLOCK = gql`
    mutation deleteBlock($id: String!) {
        deleteBlock(id: $id)
    }
`

export const RENAME_BLOCK = gql`
    mutation renameBlock($id: String!, $newName: String!) {
        renameBlock(id: $id, newName: $newName) {
            data {
                name
            }
        }
    }
`

export const ADD_ITEM = gql`
    mutation addItem($type: String!, $parentID: String!){
        addItem(type: $type, parentID: $parentID)
    }
`
export const SAVE_BLOCKS = gql`
    mutation Blocks($newBlocks: JSON) {
        saveBlocks (newBlocks: $newBlocks)
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
            template_title
            entries {
                id
                name
                content
                type
            }
        }
    }
`;

export const SAVE_CARD = gql`
    mutation SaveCard($id: ID!, $template_title:String!, $entries: [JSON]) { 
            saveCard(id: $id, template_title: $template_title, entries: $entries) {
            id
            entries {
                content
            }
        }
    }
`;

export const ADD_CARD_ENTRY = gql`
    mutation AddCardEntry($id: Int!, $name: String!, $content: JSON!, $type: String!, $card_id: ID!) {
        addCardEntry(id: $id, name: $name, content: $content, type: $type, card_id: $card_id) {
            id
            content
        }
    }
`;
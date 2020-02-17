import { gql } from 'apollo-boost';

export const GET_DUE_CARDS_IDS = gql`
    mutation getDueCardsIds($deckId: String!) {
        getDueCardsIds(deckId: $deckId)
    }
`

export const ADD_DECK = gql`
    mutation addDeck($parentId: String!) {
        addDeck(parentId: $parentId)
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
    mutation addItem($type: String!, $parentId: String!){
        addItem(type: $type, parentId: $parentId)
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
            templateTitle
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
    mutation SaveCard($id: ID!, $templateTitle:String!, $entries: [JSON]) { 
            saveCard(id: $id, templateTitle: $templateTitle, entries: $entries) {
            id
            entries {
                content
            }
        }
    }
`;

export const ADD_CARD_ENTRY = gql`
    mutation AddCardEntry($id: Int!, $name: String!, $content: JSON!, $type: String!, $cardId: ID!) {
        addCardEntry(id: $id, name: $name, content: $content, type: $type, cardId: $cardId) {
            id
            content
        }
    }
`;
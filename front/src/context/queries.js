import { gql } from 'apollo-boost';

const getCardQuery = gql`
    query Card($id: String!)
    {
        card (id: $id) {
            deck_title
            template_title
            entries
        }
    }
`;
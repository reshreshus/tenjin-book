import React from 'react'
import { CollectionConsumer } from '../context/CollectionContext';

export default function AppStats() {
    return (
        <CollectionConsumer>
        {
            ({headerDeck}) => {
                return (
                    <div className="btn-contrast">
                        { headerDeck ? headerDeck.data.name : "Deck's Name" }
                    </div>
                )
            }
        }
        </CollectionConsumer>
    )
}

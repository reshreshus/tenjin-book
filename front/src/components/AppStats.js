import React from 'react'
import { CollectionConsumer } from '../context/CollectionContext';

export default function AppStats() {
    return (
        <CollectionConsumer>
        {
            ({deckForAddingItems}) => {
                return (
                    <div className="btn-contrast">
                        { deckForAddingItems ? deckForAddingItems.data.name : "Deck's Name" }
                    </div>
                )
            }
        }
        </CollectionConsumer>
    )
}

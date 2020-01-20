import React from 'react'
import Deck from './Deck'
import AddDeck from './AddDeck'

export default function Decks({decks}) {
    return (
        <div>
            {
                decks ? decks.map(deck => (
                    <Deck />
                )) : "Decks"
            }
            <AddDeck />
        </div>
    )
}

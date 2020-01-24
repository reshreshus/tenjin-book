import React from 'react'
import Deck from './Deck'
import AddDeck from './AddDeck'
import  {CollectionConsumer} from '../../context/CollectionContext';

export default function Decks() {
    return (
        <CollectionConsumer> 
        {
            ({decks}) => {
                return (
                    <div className="decks">
                        {
                            decks ? decks.map((d, i) => (
                                <Deck key={i} deck={d} />
                            )) : "NO DECKS"
                        }
                        <AddDeck />
                    </div>
                )
            }
        }  
        </CollectionConsumer>)
}

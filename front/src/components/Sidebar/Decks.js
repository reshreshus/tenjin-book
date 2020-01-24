import React, {useState} from 'react'
import Deck from './Deck'
import AddDeck from './AddDeck'
import  {CollectionConsumer} from '../../context/CollectionContext';

export default function Decks() {

    const [selectedDeckId, updateSelectedDeckId] = useState('');

    return (
        <CollectionConsumer> 
        {
            ({decks}) => {
                return (
                    <div className="decks">
                        {
                            decks ? decks.map((d, i) => (
                                <Deck key={i} selectedDeckId={selectedDeckId} deck={d}
                                 updateSelectedDeckId={updateSelectedDeckId}/>
                            )) : "NO DECKS"
                        }
                        <AddDeck />
                    </div>
                )
            }
        }  
        </CollectionConsumer>)
}

import React from 'react'
import {useParams} from 'react-router-dom';
import {CollectionConsumer} from '../context/CollectionContext';

export default function ShowDeck() {
    let { id } = useParams();
    console.log("show deck id" , id);
    return (
        <CollectionConsumer>  
        {
            ({getDeck}) => {
                const deck = getDeck(id);
                return (
                    <div className="show-deck">
                        <h1 className="title">( ･ิɷ･ิ)</h1>
                        {
                            (deck && deck.name) ? <div>
                            <h2 className="subtitle">This is a chosen deck. "{deck.name}"<br />
                            What will you do with it?</h2>
                            <div className="btn-contrast">
                                study
                            </div>
                            </div>
                            :
                            <h2 className="show-deck__subtitle">Grunt Grunt <br/>
                            You need to choose a deck to study
                            </h2>
                        }
                    </div>)
            }
        }  
        </CollectionConsumer>)
}

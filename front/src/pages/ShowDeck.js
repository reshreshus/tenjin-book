import React from 'react'
import { CollectionConsumer } from '../context/CollectionContext';

export default function ShowDeck() {
    // TODO: react doesn't like it
    return (
        <CollectionConsumer> 
        {
            ({contextBlock}) => {
                return (
                    <div className="info">
                        <h1 className="title">( ･ิɷ･ิ)</h1>
                        {
                            (contextBlock && contextBlock.data.name) ? <div>
                            <h2 className="subtitle">This is a chosen deck. "{contextBlock.data.name}"<br />
                            What will you do with it?</h2>
                            <div className="btn-contrast">
                                study 
                            </div>
                            </div>
                                :
                            <h2 className="subtitle">Grunt Grunt <br/>
                            You need to choose a deck to study
                            </h2>
                        }
                    </div>
                )
            }
        }
        </CollectionConsumer>
        )
}

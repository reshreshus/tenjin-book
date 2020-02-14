import React from 'react'
import { CollectionConsumer } from '../context/CollectionContext';
import {Link} from 'react-router-dom';

export default function ShowDeck() {
    // TODO: react doesn't like it
    return (
        <CollectionConsumer> 
        {
            ({contextBlock, updateEditingMode}) => {
                console.log("contextBlock", contextBlock);
                return (
                    <div className="info">
                        <h1 className="title">( ･ิɷ･ิ)</h1>
                        {
                            (contextBlock && contextBlock.data.name) ? <div>
                            <h2 className="subtitle">This is a chosen deck. "{contextBlock.data.name}"<br />
                            What will you do with it?</h2>
                            <Link to='/edit' onClick={() => updateEditingMode({
                                isStudying: true,
                                isEditing: false
                            })} className="btn-contrast">
                                study 
                            </Link>
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

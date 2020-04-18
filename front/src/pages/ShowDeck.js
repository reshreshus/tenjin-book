import React from 'react'
import { CollectionConsumer } from '../context/CollectionContext';
import {Link} from 'react-router-dom';

export default function ShowDeck() {
    // TODO: react doesn't like it
    return (
        <CollectionConsumer> 
        {
            ({contextTreeItem, updateEditingMode, updateCurrentlyUsedDeck, setCardToRepeat, updateDeckForAddingItems}) => {
                return (
                    <div className="info">
                        <h1 className="title">( ･ิɷ･ิ)</h1>
                        {
                            (contextTreeItem && contextTreeItem.data.name)
                            ?
                            <div>
                            <h2 className="subtitle">This is a chosen deck. "{contextTreeItem.data.name}"<br />
                            What will you do with it?</h2>
                            <Link to='/edit' onClick={() => {
                                // TODO: refactor
                                updateCurrentlyUsedDeck(contextTreeItem);
                                setCardToRepeat(contextTreeItem);
                                updateEditingMode({
                                    isStudying: true,
                                    isEditing: false
                                })
                            }} className="btn-contrast" style={{marginRight: "1rem"}}>
                                study
                            </Link>
                            <div className="btn-contrast" onClick={() => updateDeckForAddingItems(contextTreeItem)}>
                                Pick for Addition
                            </div>
                            </div>
                                :
                            <h2 className="subtitle">Grunt Grunt <br/>
                            You need to choose a deck to study
                            </h2>
                        }
                        {/* {console.log(JSON.stringify(tree, null, 2))} */}
                    </div>
                )
            }
        }
        </CollectionConsumer>
        )
}

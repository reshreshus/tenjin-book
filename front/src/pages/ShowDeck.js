import React from 'react'
import { CollectionConsumer } from '../context/CollectionContext';
import { Link, Redirect } from 'react-router-dom';

export default function ShowDeck() {
    // TODO: react doesn't like it
    return (
        <CollectionConsumer>
        {
            ({contextTreeItem, updateEditingMode, updateCurrentlyUsedDeck, setCardToRepeat, updateHeaderDeck}) => {
                if (contextTreeItem) {
                    if (contextTreeItem.data && contextTreeItem.data.type !== 'D') {
                        return (
                            <Redirect to='/edit'/>
                        );
                    } else if (contextTreeItem.data.name) {
                        return (
                            <div className="info">
                                <h1 className="title">( ･ิɷ･ิ)</h1>
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
                                <div className="btn-contrast" onClick={() => updateHeaderDeck(contextTreeItem)}>
                                    Pick for Addition
                                </div>
                                </div>
                            </div>
                        )
                    }
                }
                return (
                    <div>
                        <h1 className="title">( ･ิɷ･ิ)</h1>
                        <h2 className="subtitle">Grunt Grunt <br/>
                            You need to choose a deck to study
                        </h2>
                    </div>
                )
            }
        }
        </CollectionConsumer>
        )
}

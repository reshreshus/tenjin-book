import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import { CollectionConsumer } from '../context/CollectionContext'

export default function Repeat() {
    let linkState = useLocation().state;
    let block = linkState ? linkState.block : null;

    if (!block || !block.id) {
        return (<div className="info">
                    <h1 className="title">( ･ิɷ･ิ)</h1>
                    <h2 className="subtitle"> Something is wrong...</h2>
                </div>)
    }

    return (<CollectionConsumer >
        { ({addNewEntryContext, deleteEntryContext,
            chooseTypeC, card, isCardUpdating, saveCardServer,
            findLastDeck
            }) => {

                return (
                <div className="repeat-card">
                    
                </div>)
            }
        }
        </CollectionConsumer>)
}
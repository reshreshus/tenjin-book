import React from 'react'
import {useLocation} from 'react-router-dom';

export default function ShowDeck() {
    // TODO: react doesn't like it
    let linkState = useLocation().state
    let block = linkState ? linkState.block : null
    return (
        <div className="info">
            <h1 className="title">( ･ิɷ･ิ)</h1>
            {
                (block && block.name) ? <div>
                <h2 className="subtitle">This is a chosen deck. "{block.name}"<br />
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

import React from 'react'
import {useLocation} from 'react-router-dom';
import {CollectionConsumer} from '../context/CollectionContext';

export default function ShowDeck() {
    let { block } = useLocation().state;
    console.log("show deck" , block);
    return (
        <div className="show-deck">
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
        </div>)
}

import React, {useState} from 'react'
import Block from './Block'
import AddBlock from './AddBlock'
import  {CollectionConsumer} from '../../context/CollectionContext';

export default function Blocks() {
    return (
        <CollectionConsumer> 
        {
            ({blocks}) => {
                return (
                    <div className="blocks">
                        {
                            blocks ? blocks.map((d, i) => (
                                <Block block={d} key={i} block={d}/>
                            )) : "NO DECKS"
                        }
                        <AddBlock />
                    </div>
                )
            }
        }  
        </CollectionConsumer>)
}

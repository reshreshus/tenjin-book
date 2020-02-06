import React, {useState} from 'react';
import Block from './Block';
import  {CollectionConsumer} from '../../context/CollectionContext';

export default function Blocks() {
    return (
        <CollectionConsumer> 
        {
            ({blocks}) => {
                return (
                    <div className="blocks">
                        <Block block={blocks.items[blocks.rootId]}/>
                    </div>
                )
            }
        }  
        </CollectionConsumer>)
}

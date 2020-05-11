import React, {useState} from 'react';
import Block from './Block';
import  {CollectionConsumer} from '../../context/CollectionContext';

export default function Blocks() {

  return (
    <CollectionConsumer>
    {
      ({blocks}) => {
        if (blocks) {
          let block = blocks.items[blocks.rootId];
          block.id = blocks.rootId;
          return (
            <div className="blocks">
              <Block block={block}/>
            </div>
          )
        }

        return (
          <div>No data</div>
        )
      }
    }
    </CollectionConsumer>)
}

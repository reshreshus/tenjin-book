import React from 'react';
// import Navigation from "@atlaskit/navigation";
import Item from './Item';
import {CollectionConsumer} from '../../context/CollectionContext';

import Tree, {
    mutateTree,
    moveItemOnTree
  } from "@atlaskit/tree";

import { DragDropContext } from 'react-beautiful-dnd';

const renderItem = ({
    item: block,
    onExpand,
    onCollapse,
    provided,
    snapshot
    }) => {
    // console.log("render item", block);
    return (
        <div ref={provided.innerRef} 
        {...provided.draggableProps}
        {...provided.dragHandleProps}>
            <Item block={block} onExpand={onExpand} onCollapse={onCollapse} 
                provided={provided} snapshot={snapshot}/>
        </div>
    
    );
}



const Items = () => {
    return (
        <CollectionConsumer> 
        {
            ({blocks, updateBlocks}) => {

                const onExpand = (itemId) => {
                    console.log("onCollapse");
                    updateBlocks(mutateTree(blocks, itemId, { isExpanded: true }));
                };

                const onCollapse = (itemId) => {
                    console.log("onCollapse");
                    updateBlocks(mutateTree(blocks, itemId, { isExpanded: false }));
                };

                const onDragEnd = (
                    source,
                    destination
                    ) => {
                
                    if (!destination) {
                      return;
                    }
                
                    const newTree = moveItemOnTree(blocks, source, destination);
                    updateBlocks(newTree);
                };

                if (blocks) {
                    return (
                        
                        <div className="blocks">
                            <DragDropContext>
                                <Tree
                                    tree={blocks}
                                    renderItem={renderItem}
                                    onExpand={onExpand}
                                    onCollapse={onCollapse}
                                    onDragEnd={onDragEnd}
                                    isDragEnabled
                                    isNestingEnabled
                                />
                            </DragDropContext>
                        </div>
                    )
                }
                
                return (
                    <div>No data</div>
                )
            }
        }  
        </CollectionConsumer>
    )
}

export default Items;

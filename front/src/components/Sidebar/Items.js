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
        <div
            >
            <Item block={block} onExpand={onExpand} onCollapse={onCollapse} 
                provided={provided} snapshot={snapshot}/>
        </div>
    );
}



const Items = () => {
    return (
        <CollectionConsumer> 
        {
            ({blocks, updateBlocks, saveBlocksContext}) => {

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
                    // source and destination contain only parent id 
                    // and index in parent's children array
                    let parentOfDragged = blocks.items[source.parentId];
                    let draggedId = parentOfDragged.children[source.index];
                    const newTree = moveItemOnTree(blocks, source, destination);
                    newTree.items[draggedId].parentID = destination.parentId;

                    saveBlocksContext(newTree);
                };

                if (blocks) {
                    console.log("tree", blocks);
                    return (
                        
                        <div className="blocks">
                            <Tree
                                tree={blocks}
                                renderItem={renderItem}
                                onExpand={onExpand}
                                onCollapse={onCollapse}
                                onDragEnd={onDragEnd}
                                isDragEnabled
                                isNestingEnabled
                            />
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

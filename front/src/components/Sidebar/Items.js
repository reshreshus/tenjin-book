import React, {useEffect} from 'react';
// import Navigation from "@atlaskit/navigation";
import Item from './Item';
import {CollectionConsumer} from '../../context/CollectionContext';

import Tree, {
    mutateTree,
    moveItemOnTree
  } from "@atlaskit/tree";


const renderItem = ({
    item: treeItem,
    onExpand,
    onCollapse,
    provided,
    snapshot
    }) => {
    return (
        <div>
            <Item treeItem={treeItem} onExpand={onExpand} onCollapse={onCollapse} 
                provided={provided} snapshot={snapshot}/>
        </div>
    );
}



const Items = () => {
    return (
        <CollectionConsumer> 
        {
            ({tree, saveTreeContext, toggleExpanded}) => {

                const onExpand = (itemId) => {
                    toggleExpanded(itemId);
                };

                const onCollapse = (itemId) => {
                    // updateTree(mutateTree(tree, itemId, { isExpanded: false }));
                    toggleExpanded(itemId);
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
                    let parentOfDragged = tree.items[source.parentId];
                    let draggedId = parentOfDragged.children[source.index];
                    const newTree = moveItemOnTree(tree, source, destination);
                    newTree.items[draggedId].parentID = destination.parentId;

                    saveTreeContext(newTree);
                };

                if (tree) {
                    console.log("tree", tree);
                    return (
                        
                        <div className="tree">
                            <Tree
                                tree={tree}
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

import React, {useState} from 'react';
// import Navigation from "@atlaskit/navigation";
import Item from './Item';
import {CollectionConsumer} from '../../context/CollectionContext';

import Tree, { moveItemOnTree } from "@atlaskit/tree";


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

// supposes that only 'D' types have children
const removeHiddenItems = (tree, item, typeIsShown) => {
    item.children = item.children.filter(cId => {
        const child = tree.items[cId];
        console.log(child.data.type, typeIsShown[child.data.type]);
        if (child.data.type === 'D') {
            removeHiddenItems(tree, child, typeIsShown);
        } else if ( !typeIsShown[child.data.type] ) {
            return false;
        }
        return true;
    })
}

const Items = () => {
    const [_, updateSearchText] = useState(null);
    return (
        <CollectionConsumer>
        {
            ({tree, saveTreeContext, toggleExpanded, rootTreeItem,
                typeIsShown, updateTypeIsShown
            }) => {

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
                    newTree.items[draggedId].parentId = destination.parentId;
                    if (!rootTreeItem || rootTreeItem.id === '-1')
                        saveTreeContext(newTree);
                };

                if (tree) {
                    const sidebarTree = JSON.parse(JSON.stringify(tree))
                    if (rootTreeItem) {
                        sidebarTree.rootId = rootTreeItem.id;
                    }
                    removeHiddenItems(sidebarTree, sidebarTree.items[sidebarTree.rootId], typeIsShown);
                    console.log("sidebarTree", sidebarTree);
                    return (
                        <div>
                            {/* <input className="sidebar__search" type="text" onChange={e => updateSearchText(e.target.value)}/> */}
                            <div className="btn-contrast" style={{marginRight: '1rem'}} onClick={() => {
                                updateTypeIsShown({
                                    ...typeIsShown,
                                    'f': !typeIsShown.f
                                })
                            }}>f</div>
                            <div className="btn-contrast">T</div>
                            <div className="tree">
                                <Tree
                                    tree={sidebarTree}
                                    renderItem={renderItem}
                                    onExpand={onExpand}
                                    onCollapse={onCollapse}
                                    onDragEnd={onDragEnd}
                                    isDragEnabled
                                    isNestingEnabled
                                />
                            </div>
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

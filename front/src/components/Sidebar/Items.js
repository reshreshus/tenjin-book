import React, {useState} from 'react';
// import Navigation from "@atlaskit/navigation";
import Item from './Item';
import {CollectionConsumer} from '../../context/CollectionContext';

import Tree, { moveItemOnTree } from "@atlaskit/tree";

import fType from '../../assets/svg/f-type.svg';
import fTypeAdd from '../../assets/svg/f-type-add.svg';
import tType from '../../assets/svg/t-type.svg';
import tTypeAdd from '../../assets/svg/t-type-add.svg';
import addFolder from '../../assets/svg/add-folder.svg';

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
                typeIsShown, updateTypeIsShown, addDeckRootElementContext,
                addItemRootElementContext,
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
                        <div className="browser">
                            {/* <input className="sidebar__search" type="text" onChange={e => updateSearchText(e.target.value)}/> */}
                            <div className="browser__options">
                                <img className="btn browser__options-icon" src={fTypeAdd}
                                onClick={() => addItemRootElementContext('f')}
                                />
                                <img className="btn browser__options-icon" src={tTypeAdd}
                                onClick={() => addItemRootElementContext('T')}
                                />
                                <img className="btn browser__options-icon" src={addFolder}
                                onClick={() => addDeckRootElementContext()}
                                />

                                <img className={`btn browser__options-icon
                                ${!typeIsShown.f ? 'browser__options-icon--hidden': ''}`} src={fType}
                                onClick={() => {
                                    updateTypeIsShown({
                                        ...typeIsShown,
                                        'f': !typeIsShown.f
                                    })
                                }}/>
                                <img className={`btn browser__options-icon
                                ${!typeIsShown.T ? 'browser__options-icon--hidden': ''}`}
                                src={tType} onClick={() => {
                                    updateTypeIsShown({
                                        ...typeIsShown,
                                        'T': !typeIsShown.T
                                    })
                                }}/>
                            </div>
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

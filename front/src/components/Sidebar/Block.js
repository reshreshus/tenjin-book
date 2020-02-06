import React, {useEffect, useState, useRef} from 'react'
import ContentEditable from 'react-contenteditable'
import {Link} from 'react-router-dom';
import { CollectionConsumer } from '../../context/CollectionContext';



export default function Block({block}) {
    let contentEditable;
    const [name, updateName] = useState(block.name)
    // const [expanded, updateExpanded] = useState(block.expanded ? block.expanded : false)
    let node = useRef(null);
    useEffect(() => {
        contentEditable = React.createRef();
    })

    

    // const toggleCaret = () => {
    //     updateExpanded(!expanded);
    // }

    return (
        <CollectionConsumer> 
        {
            ({selectedBlockId, updateSelectedBlockIdAndCleanup, updateBlockName,
                openContextMenu, updateContextBlock, renameBlock, toggleExpanded, getCard,
                deleteBlock
            }) => {
                console.log("selectedBlockId", selectedBlockId);
                if (selectedBlockId === block.id) {
                    updateContextBlock(block);
                }
                
                const onBlockKeyDown = (e) => {
                    switch (e.key) {
                        case "Enter":
                            console.log("Enter")
                            e.preventDefault();
                            
                            updateSelectedBlockIdAndCleanup(block.id, node);
                            updateName(name);
                            updateBlockName(name)
                            renameBlock(name, [...block.path, block.idx]);
                            break;
                        case "Esc":
                            console.log("escape")
                            e.preventDefault();
                            updateSelectedBlockIdAndCleanup('', node);
                            break;
                        default:
                    }
                }

                const handleChange = e => {
                    updateName(e.target.value);
                };

                let link;
                if (block.type === 'D') {
                    link = 'show-deck'
                } else if (block.type === 'f') {
                    link = 'edit'
                // if root, show main page
                } else if (block.type === 'R') {
                    link = '/'
                }

                return (
                    <div className={`block`} ref={node}>  
                        <div className="block__inline">
                        {
                            block.children ? 
                            <span  className={`caret ${block.expanded ? 'caret-down': ''}`} 
                            onClick={() => {toggleExpanded(block)}}>
                                {/* &#9654; */}
                                <svg width="20" height="20" viewBox="0 0 20 20"><path d="M13.75 9.56879C14.0833 9.76124 14.0833 10.2424 13.75 10.4348L8.5 13.4659C8.16667 13.6584 7.75 13.4178 7.75 13.0329L7.75 6.97072C7.75 6.58582 8.16667 6.34525 8.5 6.5377L13.75 9.56879Z" stroke="none" fill="currentColor"></path></svg>
                                </span>
                            :
                            ""
                        }
                        <span className={`block__type ${block.type === 'D' ? '' : 'block__type--ca'}`}>
                            [{ block.type }]
                        </span>
                        <div className={`block__name ${block.id !== selectedBlockId ? '': 'block__name--active'}` }
                        onClick={() => {
                            updateSelectedBlockIdAndCleanup(block.id, node)
                            }} 
                            onContextMenu={(e) => {
                                updateSelectedBlockIdAndCleanup(block.id, node)
                                openContextMenu(e, block, updateContextBlock)
                            }}
                            // onKeyDown doesn't work on react-contenteditable ¯\_(ツ)_/¯
                            onKeyDown={(e) => {
                                onBlockKeyDown(e)
                            }}
                            >
                            <Link className={`block__link`}
                                to={{pathname: link
                                        , 
                                    state: {
                                    block: block
                                }}}
                                onClick={() => {
                                    if (block.type === 'f') {
                                        getCard(block.id);
                                        console.log("block", block);
                                    }
                                }}
                                >
                                <ContentEditable 
                                    key={block.id}
                                    innerRef={contentEditable}
                                    html={name}
                                    disabled={ false }
                                    // TODO: make unique blocks IDs, not classes
                                    className={`content-editable block-${block.id}`}
                                    onChange={(e)=>handleChange(e)}
                                />
                            </Link>
                        </div>
                        </div>
                        
                        {
                            block.children ? 
                                <div className={`block__children ${block.expanded ? 'active': ''}`}>
                                {
                                    block.children.map( c => (
                                    <Block block={c} key={c.id}/>
                                ))
                                }
                                </div>
                                : ""
                        }
                    </div>)
            }
            
        }
        </CollectionConsumer>
    )
}

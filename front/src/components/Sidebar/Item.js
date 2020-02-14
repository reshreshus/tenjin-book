import React, {useState, useEffect, useRef} from 'react';
import { CollectionConsumer } from '../../context/CollectionContext';
import {Link } from 'react-router-dom';
import ContentEditable from 'react-contenteditable';

const Item = ({
  block,
  onExpand,
  onCollapse,
  provided,
  snapshot
}) => {
  let contentEditable;
  const [name, updateName] = useState(null);
  // const [expanded, updateExpanded] = useState(block.expanded ? block.expanded : false)
  let node = useRef(null);
  let draggable = useRef(null);
  useEffect(() => {
      contentEditable = React.createRef();
      draggable.current.removeAttribute("tabIndex");
    //   node.current.setAttribute('tabIndex', 0)
  })
  if (!name) {
    if (block) {
      updateName(block.data.name);
    }
    return <div> Taram taram </div>
  }

  return (
    <CollectionConsumer> 
        {
            ({updateContextBlockAndCleanup,
                openContextMenu, renameBlockContext, getCardContext,
                contextBlock, isEditing, updateIsEditing
            }) => {
            const triggerBlockName = () => {
              // in case we navigate with tab
              if (!contextBlock || block.id !== contextBlock.id) {
                updateContextBlockAndCleanup(block, node);
              }
              if (block.data.type === 'f' || block.data.type === 'T') {
                getCardContext(block.id);
              }
            }
            const onBlockKeyDown = (e) => {
                switch (e.key) {
                    case "Enter": 
                        if (isEditing) {
                          e.preventDefault();
                          renameBlockContext(name, block.id);
                          updateIsEditing(false);
                        } else {
                          triggerBlockName();
                        }
                        break;
                    case "Esc":
                        e.preventDefault();
                        updateContextBlockAndCleanup(null, node);
                        break;
                    default:
                }
            }

            const handleChange = e => {
                updateName(e.target.value);
            };

            let link;
            if (block.data.type === 'D') {
                link = 'show-deck'
            } else if (block.data.type === 'f' || block.data.type === 'T') {
                link = 'edit'
            // if root, show main page
            } else if (block.data.type === 'R') {
                link = '/'
            }

            return (
              <div className={`block`} 
              ref={node}>
                {provided.placeholder}
                <div className="block__inline"
                 ref={provided.innerRef} 
                 {...provided.draggableProps}>
                  
                 <div className="caret-container">
                    {
                        block.hasChildren ? 
                        <span  className={`caret ${block.isExpanded ? 'caret-down': ''}`} 
                          onClick={() => block.isExpanded ? onCollapse(block.id) : onExpand(block.id)}>
                          <svg width="20" height="20" viewBox="0 0 20 20"><path d="M13.75 9.56879C14.0833 9.76124 14.0833 10.2424 13.75 10.4348L8.5 13.4659C8.16667 13.6584 7.75 13.4178 7.75 13.0329L7.75 6.97072C7.75 6.58582 8.16667 6.34525 8.5 6.5377L13.75 9.56879Z" stroke="none" fill="currentColor"></path></svg>
                        </span>
                        :
                        ""
                    }
                 </div>
                  {/* drag by block type */}
                  <span className={`block__type ${block.data.type === 'D' ? '' : 'block__type--ca'}
                  ${(contextBlock && block.id === contextBlock.id) ? 
                    'block__type--active':''}
                  `
                  }
                  ref={draggable}
                   {...provided.dragHandleProps}
                   // onKeyDown doesn't work on react-contenteditable ¯\_(ツ)_/¯
                   >
                      [{ block.data.type }]
                  </span>
                  <div className={`block__name` }
                      onKeyDown={(e) => {
                        onBlockKeyDown(e)
                      }}
                      >
                      <Link className={`block__link ${(contextBlock && block.id === contextBlock.id) ? 
                      'block__link--active':''}`}
                          to={{pathname: link
                                  , 
                              state: {
                              block: block
                          }}}
                          onClick={() => triggerBlockName()}
                          onContextMenu={(e) => {
                            updateContextBlockAndCleanup(block, node);
                            openContextMenu(e)
                          }}
                          >
                          <ContentEditable 
                              key={block.id}
                              innerRef={contentEditable}
                              html={name}
                              disabled={ !(isEditing && contextBlock.id === block.id) }
                              className="content-editable"
                              id={`block-${block.id}`}
                              onChange={(e)=>handleChange(e)}
                          />
                      </Link>
                  </div>
                </div>
              </div>
            );
          }
        }
  </CollectionConsumer> )
}

export default Item;
import React, {useState, useEffect, useRef} from 'react';
import { CollectionConsumer } from '../../context/CollectionContext';
import {Link } from 'react-router-dom';
import ContentEditable from 'react-contenteditable';

import fType from '../../assets/svg/f-type.svg';
import tType from '../../assets/svg/t-type.svg';
import dType from '../../assets/svg/folder.svg';

const Item = ({
  treeItem,
  onExpand,
  onCollapse,
  provided,
  snapshot
}) => {
  let contentEditable = useRef(null);
  const [name, updateName] = useState(null);
  let node = useRef(null);
  let draggable = useRef(null);
  useEffect(() => {
    // contentEditable = React.createRef();
    draggable.current.removeAttribute("tabIndex");
  })

  useEffect(() => {
    updateName(treeItem.data.name)
  }, [treeItem.data.name]);

  if (!name) {
  if (treeItem) {
    updateName(treeItem.data.name);
  }
  return <div> Taram taram </div>
  }

  const getItemIcon = (type) => {
  if (type === 'f')
    return fType;
  else if (type === 'T') {
    return tType;
  } else return dType;
  }

  const getProperItemsCount = (count) => {
  return count <= '1000' ? count : '1000+'
  }

  return (
  <CollectionConsumer>
    {
      ({updateContextTreeItemAndCleanup,
        openTreeContextMenu, renameTreeItemContext, setCardContext,
        contextTreeItem, isEditing, updateIsEditing, updateEditingMode
      }) => {
      const triggerTreeItemName = () => {
        updateContextTreeItemAndCleanup(treeItem, node);
        if (treeItem.data.type === 'f' || treeItem.data.type === 'T') {
        setCardContext(treeItem.id);
        }
      }
      const onTreeItemKeyDown = (e) => {
        switch (e.key) {
          case "Enter":
            if (isEditing) {
              e.preventDefault();
              renameTreeItemContext(name, treeItem.id);
              updateIsEditing(false);
            } else {
              triggerTreeItemName();
            }
            break;
          case "Esc":
            e.preventDefault();
            updateContextTreeItemAndCleanup(null, node);
            break;
          default:
        }
      }

      const handleChange = e => {
        updateName(e.target.value);
      };

      let link;
      if (treeItem.data.type === 'D') {
        link = 'show-deck'
      } else if (treeItem.data.type === 'f' || treeItem.data.type === 'T') {
        link = 'edit'
      // if root, show main page
      } else if (treeItem.data.type === 'R') {
        link = '/'
      }

      return (
        <div className="tree-item"
        ref={node}
        >

        <div className="tree-item__inline"
         ref={provided.innerRef}
         {...provided.draggableProps}
        >

         <div className="caret-container">
          {
            treeItem.hasChildren ?
            <span  className={`caret ${treeItem.isExpanded ? 'caret-down': ''}`}
              onClick={() => treeItem.isExpanded ? onCollapse(treeItem.id) : onExpand(treeItem.id)}>
              <svg width="20" height="20" viewBox="0 0 20 20"><path d="M13.75 9.56879C14.0833 9.76124 14.0833 10.2424 13.75 10.4348L8.5 13.4659C8.16667 13.6584 7.75 13.4178 7.75 13.0329L7.75 6.97072C7.75 6.58582 8.16667 6.34525 8.5 6.5377L13.75 9.56879Z" stroke="none" fill="currentColor"></path></svg>
            </span>
            :
            ""
          }
         </div>
          {/* drag by treeItem type */}
          <span
          className={`tree-item__type
          ${(contextTreeItem && treeItem.id === contextTreeItem.id) ?
          'tree-item__type--active':''}
          `
          }
          ref={draggable}
           {...provided.dragHandleProps}
           // onKeyDown doesn't work on react-contenteditable ¯\_(ツ)_/¯
           >
            {
            <img src={getItemIcon(treeItem.data.type)} fill="red" width="20px" height="20px"/>
            }
          </span>
          <div className={`tree-item__name` }
            onKeyDown={(e) => {
            onTreeItemKeyDown(e)
            }}
            style={snapshot.isDragging ? {
            background:  "lightblue" }: {}}
            >
            <Link className={`tree-item__link ${(contextTreeItem && treeItem.id === contextTreeItem.id) ? 
            'tree-item__link--active':''}`}
              to={link}
              onClick={() => {
              if (link === 'edit') {
                updateEditingMode({
                isStudying: false,
                isEditing: true
                })
              }
              triggerTreeItemName()
              }}
              onContextMenu={(e) => {
              updateContextTreeItemAndCleanup(treeItem, node);
              openTreeContextMenu(e)
              }}
              style={treeItem.data.status === 'dismissed' ?  {color: '#868219'} : {}}
              >
              <ContentEditable
                key={treeItem.id}
                innerRef={contentEditable}
                html={name}
                disabled={ !(isEditing && contextTreeItem.id === treeItem.id) }
                className="content-editable"
                id={`tree-item-${treeItem.id}`}
                onChange={(e)=>handleChange(e)}
              />
            </Link>
            {/* { treeItem.data.repetitionStatsSm2 ?
            treeItem.data.repetitionStatsSm2.nextDate : "" } */}
          </div>
          <div className="tree-item__params">
          {treeItem.data.dueItemsCount > 0 ? <span>
            | {getProperItemsCount(treeItem.data.dueItemsCount)}
          </span>: ''}
          </div>
        </div>
        </div>
      );
      }
    }
  </CollectionConsumer> )
}

export default Item;
import React from 'react'
import {useLocation} from 'react-router-dom';
import Editor from '../components/EditorJs/Editor';
import { CollectionConsumer } from '../context/CollectionContext'

export default function Edit() {        
    return (<CollectionConsumer >
        { ({contextTreeItem}) => {
                if (!contextTreeItem || !contextTreeItem.id) {
                    return (<div className="info">
                                <h1 className="title">( ･ิɷ･ิ)</h1>
                                <h2 className="subtitle"> Something is wrong...</h2>
                            </div>)
                }

                return (
                <Editor key={contextTreeItem.id} treeItem={contextTreeItem} />
                )
            }
        }
        </CollectionConsumer>)
}

import React from 'react'
import Editor from '../components/Editor/Editor';
import { CollectionConsumer } from '../context/CollectionContext'
import { Redirect } from 'react-router';

export default function Edit({history}) {
  return (<CollectionConsumer >
    { ({contextTreeItem}) => {
        if (!contextTreeItem || !contextTreeItem.id) {
          // return (<div className="info">
          //       <h1 className="title">( ･ิɷ･ิ)</h1>
          //       <h2 className="subtitle"> Hi, this is TenjinBook. </h2>
          //     </div>)
            return <Redirect to='/' />
        }

        return (
          <Editor key={contextTreeItem.id} treeItem={contextTreeItem} />
        )
      }
    }
    </CollectionConsumer>)
}

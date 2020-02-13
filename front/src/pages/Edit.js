import React from 'react'
import {useLocation} from 'react-router-dom';
import Editor from '../components/EditorJs/Editor';
import { CollectionConsumer } from '../context/CollectionContext'

export default function Edit() {        
    return (<CollectionConsumer >
        { ({contextBlock}) => {
                if (!contextBlock || !contextBlock.id) {
                    return (<div className="info">
                                <h1 className="title">( ･ิɷ･ิ)</h1>
                                <h2 className="subtitle"> Something is wrong...</h2>
                            </div>)
                }

                return (
                <Editor block={contextBlock} repeat={true} />
                )
            }
        }
        </CollectionConsumer>)
}

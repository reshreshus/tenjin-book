import React from 'react'
import {useLocation} from 'react-router-dom';
import EditorJs from '../components/Editor/EditorJs';

export default function Edit() {    
    let linkState = useLocation().state
    let block = linkState ? linkState.block : null
    
    if (!block || !block.id) {
        return (<div className="info">
                    <h1 className="title">( ･ิɷ･ิ)</h1>
                    <h2 className="subtitle"> You have chosen a dark path. <br />
                    No flashcard here..</h2>
                </div>)
    }
    return (
        <div>
            <EditorJs block={block} />
        </div>
    )
}

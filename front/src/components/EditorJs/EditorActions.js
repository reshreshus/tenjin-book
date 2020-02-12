import React from 'react';

const EditorActions = ({saveCard, addNewEntry, editorChanged, card}) => {
    return (
        <div className="editor__actions">
            <div onClick={() => addNewEntry(card.id)}className="btn btn-circ btn-plus-minus">+</div>
            <div onClick={() => saveCard()} className="btn btn-text">Save{editorChanged ? "*": ""}</div>
        </div>
    );
}

export default EditorActions;

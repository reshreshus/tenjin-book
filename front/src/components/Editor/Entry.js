import React, {useState, useEffect} from 'react'
import EntryMarkdown from './EntryMarkdown';
import EntryEditorJs from './EntryEditorJs';

export default function Entry({e, saveEditorInstance, chooseType,
    editorChanged, updateEditorChanged, deleteEntryEditor, onMarkdownEntryChange, updateEntryFormat
}) {
    const [isChoosingType, updateChoosingType] = useState(false);
    const [isChanged, updateIsChanged] = useState(false);
    const [isPreview, updateIsPreview] = useState(false);

    const onEditorChange = (value) => {
        onMarkdownEntryChange(e.id, value);
    }

    useEffect(() => {
        if (!editorChanged) {
            updateIsChanged(false);
        }
    }, [editorChanged])


    const updateAreChanged = () => {
        updateIsChanged(true);
        updateEditorChanged(true);
    }

    const openChoosingType = () => {
        updateChoosingType(true)
    }

    const closeChoosingType = () => {
        updateChoosingType(false)
    }

    const deleteEntry = () => {
        updateAreChanged();
        deleteEntryEditor(e.id);
    }

    const isEntryMarkdown = () => e.format === 'markdown';

    return (
        <div className="card-entry" >
            <div className="card-entry__header">
                {isChanged ? "*": ""}
                <div className={`card-entry__choose-type ${isChoosingType ? "": "hide"}`}>
                    {
                        ['A', 'Q', 'C'].map((type, i) => (
                            <div key={i}
                                className={`btn ${type===e.type ?
                                    'btn-circ' : ''}`}
                                onClick={()=>
                                    {
                                        closeChoosingType();
                                        if (e.type !== type) {
                                            updateAreChanged();
                                            chooseType(e.id, type);
                                        }
                                    }}
                                >
                                { type }
                            </div>
                    ))
                    }
                </div>

                <div onClick={() => {
                    openChoosingType(e.id)
                }}
                className={`card-entry__qa btn-circ ${isChoosingType ? "hide": ""}`}> { e.type }
                </div>

                <div className="card-entry__name">
                    {
                        e.name
                    }
                </div>
                <div className="card-entry__switch btn-contrast"
                    onClick={() => updateEntryFormat(e.id, isEntryMarkdown() ? "EditorJs" : "markdown")}>
                    {isEntryMarkdown() ? "markdown" : "EditorJs" }</div>
                {
                    isEntryMarkdown() ? (<div className="card-entry__switch btn-contrast"
                    onClick={() => updateIsPreview(!isPreview)}> switch</div>) : ""
                }
            </div>

            <div className="card-entry__field">
                    {
                    isEntryMarkdown() ?
                        <EntryMarkdown e={e} key={e.key}
                        isPreview={isPreview} source={e.content}
                        onChange={(value) => {
                            onEditorChange(value)
                            updateAreChanged();
                        }}
                        />
                        :
                        <EntryEditorJs entryKey={e.key}
                            instanceRef={instance => {
                                saveEditorInstance(instance, e);
                            }}
                            data={e.content}
                            onChange={() => {
                                updateAreChanged();
                            }}
                        />
                    }
                <div onClick={() => deleteEntry()} className="card-entry__remove btn-circ btn-plus-minus">-</div>
            </div>
        </div>
    )
}

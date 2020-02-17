import React, {useEffect, useState} from 'react';
import { CollectionConsumer } from '../../context/CollectionContext';
import HotkeysEditor from './HotkeysEditor';
import EditorActions from './EditorActions';
import EditorEntries from './EditorEntries';
import EditorHeader from './EditorHeader';

import RepeatEntries from './Repeat/RepeatEntries';

const Editor = ({block}) => {
    const [editorChanged, updateEditorChanged] = useState(false);
    const [entriesEditors, updateEntriesEditors] = useState(null);

    const [isQuestioning, updateIsQuestioning] = useState(true);

    useEffect(() => {
        updateEntriesEditors(new Array())
    }, [block]);
    return (
<CollectionConsumer >
    { ({addNewEntryContext, deleteEntryContext,
        chooseTypeC, card, isCardUpdating, saveCardContext,
        findLastDeck, editingMode,
        updateEditingMode
    }) => {
        
    if(!card || isCardUpdating) {
        return <div>loading</div>
    }
    const {template_title, entries} = card;
    const deckParent = findLastDeck(block);
    
    const deck_title = deckParent.data.name;
    
    const saveCard = async () => { 
        updateEditorChanged(false);
        // console.log("those editors!!", entriesEditors)
        entriesEditors.map( async ({entry, instance}) => {
            // console.log("instance", instance);
            const { blocks } = await instance.save();
            entry.content.blocks = blocks;
        })
        // this line probably doesn't make sense
        saveCardContext(await Object.assign({}, card))
    }

    const saveEditorInstance = (instance, entry) => {
        if (card.entries.length !== entriesEditors.length) {
            entriesEditors.push({
                "entry": entry,
                "instance": instance
            })
            
        }
    }

    // it works for some reason
    const deleteEntryEditor = (id) => {
        deleteEntryContext(id);
        updateEntriesEditors(entriesEditors.filter(eE => eE.entry.id != id));
        setTimeout(() => {
            console.log("entries editors", entriesEditors);
        }, 300);
        
    }

    const chooseType = (entryId, type) => {
        chooseTypeC(block.id, entryId, type);
    }

    const toggleEditing = () => {
        updateEditingMode({
            ...editingMode,
            isEditing: !editingMode.isEditing
        });
    }

    return (
        <div className="editor">
            <HotkeysEditor saveCard={saveCard} />
            <EditorHeader template_title={template_title} deck_title={deck_title} />
            {
                editingMode.isEditing ? (
                <div> 
                    
                    <EditorEntries entries={entries} entriesEditors={entriesEditors} blockId={block.id} 
                    saveEditorInstance={saveEditorInstance} deleteEntryEditor={deleteEntryEditor} 
                    chooseType={chooseType} updateEditorChanged={updateEditorChanged} editorChanged={editorChanged}
                    />
                    <EditorActions addNewEntry={addNewEntryContext} saveCard={saveCard} 
                    editorChanged={editorChanged} card={card}
                    />
                </div>
                ) : 
                <div> 
                    <RepeatEntries 
                        entries={entries} 
                        saveEditorInstance={saveEditorInstance}
                        updateEditorChanged={updateEditorChanged}
                        blockId={block.id} entriesEditors={entriesEditors}
                        isQuestioning={isQuestioning} updateIsQuestioning={updateIsQuestioning}
                        editingMode={editingMode} toggleEditing={toggleEditing}
                    />
                    <div onClick={() => saveCard()} className="btn btn-text editor__save">Save{editorChanged ? "*": ""}</div>
                </div>
            }
            

            <div onClick={()=> {
                toggleEditing();
                updateIsQuestioning(true);
                updateEntriesEditors(new Array());
            }} className="btn-contrast editor__preview-button"> 
            {
                !editingMode.isEditing ? 'Edit' : 
                (editingMode.isStudying ? 'Study' : 'Preview')
            }
            </div>

            
            
        </div>
    )
    }
    }
</CollectionConsumer>
    );
}

export default Editor;

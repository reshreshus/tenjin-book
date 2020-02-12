import React, {useEffect, useState} from 'react';
import { CollectionConsumer } from '../../context/CollectionContext';
import HotkeysEditor from './HotkeysEditor';
import EditorActions from './EditorActions';
import EditorEntries from './EditorEntries';
import EditorHeader from './EditorHeader';

import RepeatEntries from './Repeat/RepeatEntries';

const Editor = ({block, repeat=false}) => {
    const [editorChanged, updateEditorChanged] = useState(false);
    const [entriesEditors, updateEntriesEditors] = useState(null);

    const [isRepeatMode, updateIsRepeatMode] = useState(repeat);
    const [isQuestioning, updateIsQuestioning] = useState(true);

    // useEffect(() => {
    //     updateIsRepeatMode(repeat);
    // }, [repeat])

    useEffect(() => {
        updateEntriesEditors(new Array())
        updateIsRepeatMode(false);
    }, [block]);
    return (
<CollectionConsumer >
    { ({addNewEntryContext, deleteEntryC,
        chooseTypeC, card, isCardUpdating, saveCardServer,
        findLastDeck
    }) => {
        
    if(!card || isCardUpdating) {
        return <div>loading</div>
    }
    const {template_title, entries} = card;
    const deckParent = findLastDeck(block);
    
    const deck_title = deckParent.data.name;
    
    const saveCard = async () => { 
        updateEditorChanged(false);
        console.log("those editors!!", entriesEditors)
        entriesEditors.map( async ({entry, instance}) => {
            console.log("instance", instance);
            const { blocks } = await instance.save();
            entry.content.blocks = blocks;
        })
        // this line probably doesn't make sense
        saveCardServer(await Object.assign({}, card))
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
        deleteEntryC(id);
        updateEntriesEditors(entriesEditors.filter(eE => eE.entry.id != id));
        setTimeout(() => {
            console.log("entries editors", entriesEditors);
        }, 300);
        
    }

    const chooseType = (entryId, type) => {
        chooseTypeC(block.id, entryId, type);
    }

    return (
        <div className="editor">
            <HotkeysEditor saveCard={saveCard} />
            <EditorHeader template_title={template_title} deck_title={deck_title} />
            {
                !isRepeatMode ? (
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
                    />
                    <div onClick={() => saveCard()} className="btn btn-text editor__save">Save{editorChanged ? "*": ""}</div>
                </div>
            }
            

            <div onClick={()=> {
                updateIsRepeatMode(!isRepeatMode);
                updateIsQuestioning(true);
                updateEntriesEditors(new Array());
            }} className="btn-contrast editor__preview-button"> 
            {
                isRepeatMode ? 'Edit' : 'Preview'
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

import React, {useState} from 'react'
import MarkdownRender from '../MarkdownRender'
import EntryEditorJs from '../EntryEditorJs'

const Entry = ({e, saveEditorInstance, updateEditorChanged}) => {
    // TODO: isChanged not used
    const [isChanged, updateIsChanged] = useState(false);

    const updateAreChanged = () => {
        updateIsChanged(true);
        updateEditorChanged(true);
    }

    return (
        <div className="card-entry-repeat">
            <div className="card-entry-repeat__field">
                {
                e.format === 'markdown' ?
                <div className="card-entry__text-field">
                <MarkdownRender source={e.content}/>
                </div>
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
            </div>
        </div>
    );
}

export default Entry;

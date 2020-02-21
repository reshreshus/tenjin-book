import React, {useState} from 'react'

import EditorJs from 'react-editor-js';
import { EDITOR_JS_TOOLS } from '../editorJsTools'

const Entry = ({e, saveEditorInstance, updateEditorChanged}) => {
    // TODO: isChanged not used
    const [isChanged, updateIsChanged] = useState(false);

    const updateAreChanged = () => {
        updateIsChanged(true);
        updateEditorChanged(true);
    }

    return (
        <div className="card-entry-repeat">

            {/* <div className="card-entry-repeat__field"> */}
                <div className="card-entry-repeat__text-field" 
                    id={"editor-js-" + e.key}>
                    <EditorJs 
                        key={e.key}
                        instanceRef={instance => {
                            saveEditorInstance(instance, e);
                        }}
                        tools={EDITOR_JS_TOOLS}
                        holder={"editor-js-" + e.key}
                        data={e.content}
                        onChange={() => {
                            updateAreChanged();
                        }}
                    />
                </div>
            {/* </div> */}
        </div>
    );
}

export default Entry;

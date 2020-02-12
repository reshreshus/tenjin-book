import React from 'react';

const Entry = ({e, saveEditorInstance, updateAreChanged}) => {
    return (
        <div className="card-entry-repeat">

            <div className="card-entry-repeat__field">
                <div className="card-entry-repeat__text-field" 
                    id={"editor-js-" + e.id}>
                    <EditorJs 
                        key={e.id}
                        instanceRef={instance => {
                            saveEditorInstance(instance, e);
                        }}
                        tools={EDITOR_JS_TOOLS}
                        holder={"editor-js-" + e.id}
                        data={e.content}
                        onChange={() => {
                            updateAreChanged();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Entry;

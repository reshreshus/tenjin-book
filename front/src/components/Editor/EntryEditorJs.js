import React from 'react';
import EditorJs from 'react-editor-js';
// import EditorJs from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './editorJsTools';

const EntryEditorJs = ({entryKey, instanceRef, data, onChange}) => {
  return (
    <EditorJs
      // enableReInitialize={true}
      // autofocus={e.id === 0}
      key={entryKey}
      instanceRef={instanceRef}
      tools={EDITOR_JS_TOOLS}
      holder={"editor-js-" + entryKey}
      data={data}
      onChange={onChange}
    >
      <div className="card-entry__text-field"
        id={"editor-js-" + entryKey}></div>

    </EditorJs>
  );
}

export default EntryEditorJs;

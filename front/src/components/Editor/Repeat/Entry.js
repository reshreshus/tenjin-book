import React from 'react'
import MarkdownRender from '../MarkdownRender'
import EntryEditorJs from '../EntryEditorJs'

const Entry = ({e, saveEditorInstance, updateEditorChanged}) => {
  const updateAreChanged = () => {
    updateEditorChanged(true);
  }

  return (
    <div className="card-entry">
      <div className="card-entry__field--repeat">
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

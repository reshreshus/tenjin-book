import React from 'react'

export default function EditorHeader({deckParent, template_title}) {
  return (
    <div>
      {
        deckParent.data.img ?
        <img src={deckParent.data.img}
        // TODO: fix BEM?
        className="editor__header-img"
        alt="deck's header image" /> : ""
      }
      <div className="editor__header">
        <div className="editor__header-left">
          <div className="editor__subtitle text-blue-bright"> Deck </div>
          <div className="editor__title text-dark">
            { deckParent.data.name }
          </div>
        </div>
        <div className="editor__header-right">
          <div className="editor__subtitle text-blue-bright"> Template </div>
          <div className="editor__title text-dark">
            {template_title}
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react';

const CardEvaluation = ({editingMode, updateIsQuestioning, toggleEditing, evalutionOptions}) => {

  return (
    <div className="card-eval">
      {
        evalutionOptions.map((v, i) => (
          <div key={i} className="card-eval__option"
          onClick={() => {
            if (!editingMode.isStudying) {
              updateIsQuestioning(true);
              toggleEditing();
            } else {
              v.func();
            }
          }}
          style={{backgroundColor: v.color, color: 'white'}}>
            {v.desc}
            <br/>
            <div style={{fontSize: '13px', color: 'black'}}>
              [ {v.nextInterval()} ]
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default CardEvaluation;

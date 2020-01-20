import React from 'react'
import TextField from '../TextField';

export default function CardEntry({data}) {
    return (
        <div className="card-entry">
           
            <div className="card-entry__qa btn-primary btn-circ">
            {
                data.isQuestion ? 
                "Q" : "A"
            }
            </div> :
            <TextField />
            <div className="card-entry__remove btn-primary btn-circ">-</div>
            AMA CARD ENTRY
        </div>
    )
}

import React from 'react'
import TextField from '../TextField';

export default function CardEntry({data}) {
    console.log("card entry data", data);
    return (
        <div className="card-entry">
           
            <div className="card-entry__qa btn btn-circ">
            {
                data.isQuestion ? 
                "Q" : "A"
            }
            </div>
            <TextField data={data} id={data.entry_id}/>
            <div className="card-entry__remove btn btn-circ">-</div>
        </div>
    )
}

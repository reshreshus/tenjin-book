import React from 'react';

const CardEvaluation = ({editingMode, updateIsQuestioning, toggleEditing}) => {
 
    const evaluationSm15 = [
        {
            quality: 1,
            desc: "Totally Wrong",
            color: "#D47E78"
        },
        {
            quality: 2,
            desc: "Wrong",
            color: "#D47E78"
        },
        {
            quality: 3,
            desc: "Alright",
            color: "#8CD794"
        },
        {
            quality: 4,
            desc: "Good",
            color: "#688DED"
        },
        {
            quality: 5,
            desc: "Very Good",
            color: "#688DED"
        },
    ]

    return (
        <div className="card-eval">
            {
                evaluationSm15.map((v, i) => (
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
                        {v.desc} <br/> ( {v.value} )
                    </div>
                ))
            }
        </div>
    );
}

export default CardEvaluation;

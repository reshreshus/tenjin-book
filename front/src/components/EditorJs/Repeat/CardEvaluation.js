import React from 'react';

const CardEvaluation = ({isPreview, updateIsQuestioning}) => {

    const evaluationSm15 = [
        {
            value: 1,
            desc: "Totally Wrong",
            color: "#D47E78"
        },
        {
            value: 2,
            desc: "Wrong",
            color: "#D47E78"
        },
        {
            value: 3,
            desc: "Alright",
            color: "#8CD794"
        },
        {
            value: 4,
            desc: "Good",
            color: "#688DED"
        },
        {
            value: 5,
            desc: "Very Good",
            color: "#688DED"
        },
    ]

    return (
        <div className="card-eval">
            {
                evaluationSm15.map(v => (
                    <div className="card-eval__option" 
                    onClick={() => isPreview ? updateIsQuestioning(true) : v.onClick()}
                    style={{backgroundColor: v.color, color: 'white'}}> 
                        {v.desc} <br/> ( {v.value} )
                    </div>
                ))
            }
        </div>
    );
}

export default CardEvaluation;

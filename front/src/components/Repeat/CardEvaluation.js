import React from 'react';

const CardEvaluation = () => {
    return (
        <div className="card-eval">
            {
                [1, 2, 3, 4, 5].map(ans => (
                    <div className="card-eval__option"> 
                        {ans}
                    </div>
                ))
            }
        </div>
    );
}

export default CardEvaluation;

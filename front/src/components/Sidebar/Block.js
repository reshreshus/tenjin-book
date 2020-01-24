import React, {useEffect, useState, useRef} from 'react'
import ContentEditable from 'react-contenteditable'
import {Link} from 'react-router-dom';
import ReactDOM from "react-dom";

export default function Block({block, selectedBlockId, updateSelectedBlockId}) {
    // TODO: rename on F2
    let contentEditable;
    const [name, updateName] = useState(block.name)
    
    let node = useRef(null);
    useEffect(() => {
        contentEditable = React.createRef();
    })

    const handleChange = e => {
        updateName(e.target.value);
    };

    const onKeyDown = e => {
        // Finish editing when ENTER is pressed
        // TODO: get back to the previous value if ESC is pressed
        if (e.keyCode == 13) {
            e.preventDefault();
            updateSelectedBlockId('');
        }
    }

    const onBlockClick = (e) => {
        // e.preventDefault();
        updateSelectedBlockId(block.id)
    }

    const toggleCaret = () => {
        node.current.querySelector(".caret").classList.toggle("caret-down");
        node.current.querySelector(".block__children").classList.toggle("active");
    }

    return (
        <div className={`block`} ref={node}>  
            {
                block.children ? 
                <span  className="caret" onClick={() => {toggleCaret()}}>&#9654;</span>
                :
                ""
            }
            
            <div className={`block__name ${block.id !== selectedBlockId ? '': 'block__name--active'}` }
            onClick={(e)  => onBlockClick(e)} >
                <Link className={`block__link`}
                    // to={`/show-deck/${block.id}`} 
                    to={{pathname: `/show-deck/${block.id}`, 
                        state: {
                        block: block
                    }}}
                    >
                    <ContentEditable 
                        innerRef={contentEditable}
                        html={name}
                        disabled={ block.id !== selectedBlockId }
                        onChange={handleChange}
                        tagName='div'  // div by default but still
                        onKeyDown={onKeyDown}
                    />
                </Link>
            </div>
            {
                block.children ? 
                    <div className="block__children">
                    {
                        block.children.map( (c, i) => (
                        <Block block={c} key={i} selectedBlockId={selectedBlockId}
                                 updateSelectedBlockId={updateSelectedBlockId}/>
                    ))
                    }
                    </div>
                    : ""
            }
        </div>
            
    )
}

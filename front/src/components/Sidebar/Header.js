import React from 'react'
import {Link} from 'react-router-dom'
import { CollectionConsumer } from '../../context/CollectionContext';

export default function Header() {
    return (
        <CollectionConsumer>
        {
            ({updateSelectedBlockId}) => {
                return (
                    <div className="header">
                        <Link to="/" className="link" onClick={() => updateSelectedBlockId('')}>
                            <h1>ROI Notebook<br/>
                            </h1>
                        </Link>
                    </div>
                )
            }
        }
        </CollectionConsumer>
        
    )
}

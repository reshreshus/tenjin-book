import React from 'react'
import {Link} from 'react-router-dom'
import { CollectionConsumer } from '../../context/CollectionContext';
import dots from '../../assets/svg/dots-three-vertical.svg'

export default function Header() {
    return (
        <CollectionConsumer>
        {
            ({updateContextTreeItem}) => {
                return (
                    <div className="header">
                        <Link to="/" className="header__link link" onClick={() => updateContextTreeItem(null)}>
                            <img className="header__img" src="tenjinbook.png" height="50px"/>
                            <h1>Tenjin Book </h1> 
                        </Link>
                        <img src={dots} alt="dots" height="28px"/>
                    </div>
                )
            }
        }
        </CollectionConsumer>
        
    )
}

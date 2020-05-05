import React from 'react'
import {Link} from 'react-router-dom'
import { CollectionConsumer } from '../../context/CollectionContext';
import dots from '../../assets/svg/dots-three-vertical.svg'

export default function Header() {
    return (
        <CollectionConsumer>
        {
            ({updateContextTreeItem, openAppContextMenu}) => {
                return (
                    <div className="header">
                        <Link to="/" className="header__link link" onClick={() => updateContextTreeItem(null)}>
                            <img className="header__img" src="tenjinbook.png" height="50px" alt="header"/>
                            <h1 className="header__title">Tenjin Book </h1>
                        </Link>
                        <img className="header__options" src={dots} alt="dots" height="28px"
                            onClick={(e) => openAppContextMenu(e)}/>
                    </div>
                )
            }
        }
        </CollectionConsumer>
    )
}

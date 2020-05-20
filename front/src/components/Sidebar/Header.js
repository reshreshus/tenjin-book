import React from 'react'
import {Link} from 'react-router-dom'
import { CollectionConsumer } from '../../context/CollectionContext';
import dots from '../../assets/svg/dots-three-vertical.svg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBraille } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  return (
    <CollectionConsumer>
    {
      ({updateContextTreeItem, openAppContextMenu, sidebarIsShown, toggleLeftSidebar}) => {
        return (
          <div className={`header ${!sidebarIsShown ? 'header--wrapped' : ''}`}>
            <Link to="/" className="header__link link">
              <h1 className={`header__title ${!sidebarIsShown ? 'header__title--wrapped': ''}`} onClick={() => updateContextTreeItem(null)}>Tenjin Book </h1>
              <img className="header__img" src="tenjinbook.png" alt="header"
              onClick={() => {toggleLeftSidebar()}}
              />
            </Link>
            <FontAwesomeIcon
                className="header__options"
                icon={faBraille}
                size="lg"
                onClick={(e) => openAppContextMenu(e)}
                />
            {/* <img className="header__options" src={dots} alt="dots" height="28px"
              onClick={(e) => openAppContextMenu(e)}/> */}
          </div>
        )
      }
    }
    </CollectionConsumer>
  )
}

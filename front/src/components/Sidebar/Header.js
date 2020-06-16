import React from 'react'
import {Link} from 'react-router-dom'
import { CollectionConsumer } from '../../context/CollectionContext';
// import dots from '../../assets/svg/dots-three-vertical.svg'
import { ReactComponent as TenjinIcon } from '../../assets/svg/tenjin.svg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBraille } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  return (
    <CollectionConsumer>
    {
      ({updateContextTreeItem, openAppContextMenu, sidebarIsShown, toggleLeftSidebar, logoutContext}) => {
        return (
          <div className={`header ${!sidebarIsShown ? 'header--wrapped' : ''}`}>
            <div className="btn-ed" onClick={() => logoutContext()}>logout</div>
            <Link to="/" className="header__link link">
              <h1 className={`header__title ${!sidebarIsShown ? 'header__title--wrapped': ''}`} onClick={() => updateContextTreeItem(null)}>Tenjin Book </h1>
              <TenjinIcon className="header__img" onClick={() => {toggleLeftSidebar()}}/>
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
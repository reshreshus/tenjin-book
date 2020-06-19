import React from 'react'
import {Link} from 'react-router-dom'
import { CollectionConsumer } from '../../context/CollectionContext';
// import dots from '../../assets/svg/dots-three-vertical.svg'
import { ReactComponent as TenjinIcon } from '../../assets/svg/tenjin.svg';

export default function Header() {
  return (
    <CollectionConsumer>
    {
      ({updateContextTreeItem, user, sidebarIsShown, toggleLeftSidebar, logoutContext}) => {
        return (
          <div className={`header ${!sidebarIsShown ? 'header--wrapped' : ''}`}>
              { user && `Hi, ${user.username}` }
            <Link to="/" className="header__link link">
              <TenjinIcon className="header__img" onClick={() => {toggleLeftSidebar()}}/>
              <h1 className={`header__title ${!sidebarIsShown ? 'header__title--wrapped': ''}`}
              onClick={() => updateContextTreeItem(null)}>TB</h1>
            </Link>
              <div className="btn-ed" onClick={() => logoutContext()}>logout</div>
            {/* <FontAwesomeIcon
                className="header__options"
                icon={faBraille}
                size="lg"
                onClick={(e) => openAppContextMenu(e)}
                /> */}
          </div>
        )
      }
    }
    </CollectionConsumer>
  )
}
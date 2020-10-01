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
             <span className={`header__username ${!sidebarIsShown ? 'hide' : ''}`}> { user && `Hi, ${user.username}` } </span>
            <Link to="/" className="header__link link">
              <h1 className={`header__title ${!sidebarIsShown ? 'header__title--wrapped': ''}`}
              onClick={() => updateContextTreeItem(null)}>TB</h1>
            </Link>
            <TenjinIcon className="header__img" onClick={() => {toggleLeftSidebar()}}/>
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
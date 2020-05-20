import React from 'react'
import Header from './Header';
import Items from './Items';
import { CollectionConsumer } from '../../context/CollectionContext';

export default function Sidebar() {
  return (
    <CollectionConsumer>
    {
      ({sidebarIsShown}) => {
        return (
          <div className={`sidebar ${!sidebarIsShown ? 'sidebar--wrapped' : ''}`} style={!sidebarIsShown ? {width: '4rem'} : {}}>
            <Header />
            {sidebarIsShown && <Items />}
          </div>
        )
      }
    }
    </CollectionConsumer>
  )
}

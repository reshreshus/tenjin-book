import React from 'react'
import Header from './Header';
import Items from './Items';
import { CollectionConsumer } from '../../context/CollectionContext';

export default function Sidebar() {
  return (
    <CollectionConsumer>
    {
      ({showSidebars}) => {
        return (
          <div className={`sidebar ${!showSidebars[0] ? 'sidebar--wrapped' : ''}`}>
            <Header />
            {showSidebars[0] && <Items />}
          </div>
        )
      }
    }
    </CollectionConsumer>
  )
}

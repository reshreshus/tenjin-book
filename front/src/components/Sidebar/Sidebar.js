import React from 'react'
import Header from './Header';
import Blocks from './Blocks';
import Items from './Items';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <Header />
            {/* <Blocks /> */}
            <Items />
            
        </div>
    )
}

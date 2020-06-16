import React, { useEffect } from 'react'
import Game from './Game';
import { CollectionConsumer } from './context/CollectionContext';

export default function App() {
  return (
    <CollectionConsumer>
    {
      ({}) => {
        return (
          <Game />
        )
      }
    }
    </CollectionConsumer>
  )
}
import React from 'react'
import './styles/main.scss'
import {Switch, Route} from 'react-router-dom';

import EditCard from './pages/EditCard';
import RepeatCard from './pages/RepeatCard';

export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={EditCard}/>
        <Route exact path="/repeat" component={RepeatCard}/>
      </Switch>
    </div>
  )
}

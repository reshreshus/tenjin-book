import React, {useEffect} from 'react'
import './styles/main.sass'
import { Switch, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import AppStats from './components/AppStats';

import Home from './pages/Home';
import Edit from './pages/Edit';
import ShowDeck from './pages/ShowDeck';


export default function App() {

  return (
    <div className="app">
      <Sidebar />
      <div className="resizer"/>
      <div className="right-sidebar">
        <div className="right-sidebar__header">
          <AppStats />
        </div>
        <div className="right-sidebar__content">
          <Switch>
            <Route exact path="/edit/" component={() =>
              (<Edit card={{'deckTitle':'English', 'templateTitle': 'Basic'}}/>)}
              />
            <Route exact path="/show-deck/" component={ShowDeck} />
            <Route exact path="/" component={Home} />
          </Switch>
        </div>
      </div>
    </div>
  )
}
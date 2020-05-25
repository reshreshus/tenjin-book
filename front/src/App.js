import React, {useEffect} from 'react'
import './styles/main.sass'
import { Switch, Route } from 'react-router-dom';
import Game from './Game';
import Login from './pages/Login';

export default function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/*" component={Game} />
      </Switch>
    </div>
  )
}
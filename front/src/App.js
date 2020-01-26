import React, {useEffect} from 'react'
import './styles/main.scss'
import {Switch, Route} from 'react-router-dom';

import Sidebar from './components/Sidebar/Sidebar';

import Home from './pages/Home';
import Editor from './pages/Editor';
import ShowDeck from './pages/ShowDeck';
import RepeatCard from './pages/RepeatCard';
// import ContextMenu from './components/ContextMenu';



export default function App() {

  useEffect(() => {
    document.querySelectorAll('.resizer').forEach(e=>{
      // setting default widths
      // e.previousElementSibling.style.width=
      // e.nextElementSibling.style.width=
      // e.parentNode.offsetWidth/2-e.offsetWidth/2+'px';

      e.onmousedown=()=>{
        e.parentNode.onmousemove=ev=>{
          e.previousElementSibling.style.width=
          ev.clientX-e.offsetWidth/2+'px';
          e.nextElementSibling.style.width=
          e.parentNode.offsetWidth-ev.clientX-e.offsetWidth/2+'px';
        };
      };
      e.parentNode.onmouseup=
      ()=>{e.parentNode.onmousemove=undefined};
    });
  }, [])
  
  
  return (
    <div className="app">
      <Sidebar />
      {/* <ContextMenu /> */}
      <div className="resizer"/>
        <Switch>
          <Route exact path="/edit/" component={() =>
            (<Editor card={{'deckTitle':'English', 'templateTitle': 'Basic'}}/>)}
            />
          <Route exact path="/repeat" component={RepeatCard}/>
          // "?" after id means id is optional
          <Route exact path="/show-deck/" component={ShowDeck} />
          <Route exact path="/" component={Home} />
        </Switch>
    </div>
  )
}
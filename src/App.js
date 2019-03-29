import React from 'react'
import {Link} from 'react-router-dom'
import {Route, Switch} from 'react-router';
import Film from "./components/Film";
import Chat from "./components/Chat";
import Articles from "./components/Articles";
import MiniFilm from "./components/MiniFilm";
import VoteTest from "./components/VoteTest";
import './App.css';


const App = () => (
    <div className="App">

        {/*<div className="Navigation">*/}
        {/*<p className="links">*/}
        {/*<Link to="/" className="film">Film</Link>*/}
        {/*<Link to="/home" className="home">Home</Link>*/}
        {/*<Link to="main" className="points">Points</Link>*/}
        {/*<p className='title'>Лабораторная работа №4</p>*/}
        {/*</p>*/}
        {/*</div>*/}

        <Switch>
            <Route exact path='/' component={Film}/>
            <Route exact path='/chat' component={Chat}/>
            <Route exact path='/articles' component={Articles}/>
            <Route exact path='/votes' component={VoteTest}/>
            <Route pattern='/miniFilm' component={MiniFilm}/>
        </Switch>
    </div>

);

export default App;
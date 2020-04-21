import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RankingTable from './ranking'
import * as serviceWorker from './serviceWorker';

class LeagueRoot extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            leaguejson: require('./test.json')
        }
    }

    render(){
        return(
            <div>
                <h1>LeagueRoot Test dev</h1>
                <RankingTable
                    pickbanjson={this.state.leaguejson['pickbans']}
                    herojson={this.state.leaguejson['heroes']}/>
            </div>
        );
    }
}

ReactDOM.render(
  <LeagueRoot/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

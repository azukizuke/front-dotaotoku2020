import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './sidenav.css';
import RankingTable from './ranking';
import SideNav from './sidenav';
import CollapsibleMenu from './collapsiblemenu';
import * as serviceWorker from './serviceWorker';

class LeagueRoot extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            allleaguejson: this.props.allleaguejson,
            leagueid: '11863'
        }
        this.handleLeagueChange = this.handleLeagueChange.bind(this)
    }

    handleLeagueChange(leagueid){
        this.setState({leagueid: leagueid});
    }

    getDatefromUNIX(unixdate){
        const date = new Date(unixdate * 1000);

        let outstr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        return outstr;
    }

    render(){
        let lastdate = this.getDatefromUNIX(this.state.allleaguejson[this.state.leagueid].last_unixdate);
        return(
            <div>
                <SideNav
                    allleaguejson={this.state.allleaguejson}
                    leagueid={this.state.leagueid}
                    onLeagueChange = {this.handleLeagueChange}
                />
                <div className="main">
                    <h1>leaguename : {this.state.allleaguejson[this.state.leagueid].name}</h1>
                    <h4>試合数 : {this.state.allleaguejson[this.state.leagueid].match_num}</h4>
                    <h4>最後に取得したmatch_id : {this.state.allleaguejson[this.state.leagueid].last_matchid}</h4>
                    <h4>最終試合の日付 : {lastdate}</h4>
                    <CollapsibleMenu title = {"collapse ranking table"}>
                        <RankingTable
                            leaguejson = {this.state.allleaguejson[this.state.leagueid]}
                        />
                    </CollapsibleMenu>
                </div>
            </div>
        );
    }
}

let allleaguejson = require('./test.json')
ReactDOM.render(
  <LeagueRoot allleaguejson={allleaguejson} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

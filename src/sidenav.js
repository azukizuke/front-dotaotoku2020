import React from 'react';
import ReactDOM from 'react-dom';

export default class SideNav extends React.Component{
    constructor(props){
        super(props);
        //this.props.allleaguejson
    }
    render(){
        return(
            <div class="sidenav">
                <p>league index</p>
                <MakeLeagueList
                    allleaguejson={this.props.allleaguejson}
                    onLeagueChange = {this.props.onLeagueChange}
                />
            </div>
        );
    }
}

class MakeLeagueList extends React.Component{
    constructor(props){
        super(props);
        this.makeLeagueList = this.makeLeagueList.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {leagueid: this.props.leagueid};
        //this.props.allleaguejson
    }

    handleClick(e){
        this.props.onLeagueChange(e.target.value)
    }

    makeLeagueList(){
        let row = [];
        let outstr="";
        for (var key in this.props.allleaguejson){
            console.log(key);
            outstr=<li><button type="button" value={key} onClick={this.handleClick}>
                       {key}
                   </button></li>
            row.push(outstr);
                //<button type="button" onClick={this.handleClick}>
        }
        return row;
    }

    render(){
        let league_id_row = this.makeLeagueList();
        return(
            <div>
                <ul>
                    {league_id_row}
                </ul>
            </div>
        );
    }
}

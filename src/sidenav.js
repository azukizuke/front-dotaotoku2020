import React from 'react';
import ReactDOM from 'react-dom';
import CollapsibleMenu from './collapsiblemenu';

export default class SideNav extends React.Component{
    render(){
        return(
            <div className="sidenav">
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
        this.handleClick = this.handleClick.bind(this);
        this.state = {leagueid: this.props.leagueid};
        this.makeLeagueList = this.makeLeagueList.bind(this);
        this.makeOutputYearList = this.makeOutputYearList.bind(this);
        //this.props.allleaguejson
    }

    handleClick(e){
        this.props.onLeagueChange(e.target.value)
    }

    makeLeagueList(){
        let row = [];
        let outstr="";
        for (var key in this.props.allleaguejson){
            outstr=
                   <li key={this.props.allleaguejson[key]['name']}>
                   <button type="button" value={key} onClick={this.handleClick}>
                       {this.props.allleaguejson[key]['name']}
                   </button>
                   </li>
            row.push(outstr);
        }
        return row;
    }

    makeYearList(){
        let yearlist = []; 
        // get unique year list
        for (var leagueid in this.props.allleaguejson){
            if (!yearlist.includes(this.props.allleaguejson[leagueid]['year'])){
                yearlist.push(this.props.allleaguejson[leagueid]['year']);
            }
        }
        // sort year list
        let sorted_yearlist = yearlist;
        sorted_yearlist.sort((a, b) => (b - a));
        return yearlist;
    }

    makeOutputYearList(){
        const yearlist = this.makeYearList();
        let outrow = [];
        let outstr = "";
        let league_id_row = this.makeLeagueList();

        for (var year of yearlist){
            outstr = 
                <li key={year}>
                    <CollapsibleMenu title = {year}>
                        <ul>
                            {league_id_row}
                        </ul>
                    </CollapsibleMenu>
                </li>
            outrow.push(outstr)
        }
        return outrow;
    }

    render(){
        let year_row = this.makeOutputYearList();
        return(
            <div>
                 <ul>
                    {year_row}
                 </ul>
            </div>
        );
    }
}

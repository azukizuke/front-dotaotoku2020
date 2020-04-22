import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RankingTable from './ranking'
import * as serviceWorker from './serviceWorker';

class CollapsibleMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isCollapse: false,
            title: this.props.title
        };
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        this.setState(state => ({
            isCollapse: !state.isCollapse
        }));
    }

    render(){
        let output;
        if (this.state.isCollapse){
            output = null;
        } else {
            output =this.props.children;
        }
        return(
            <div>
                <button type="button" onClick={this.handleClick}>
                    {this.state.title}
                </button>
                    {output}
            </div>
        );
    }
}

class LeagueRoot extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            allleaguejson: this.props.allleaguejson
        }
    }

    render(){
        return(
            <div>
                <h1>LeagueRoot Test dev</h1>
                <CollapsibleMenu
                    title = {"collapse ranking table"}
                >
                    <RankingTable
                        leaguejson = {this.state.allleaguejson['11863']}
                    />
                </CollapsibleMenu>
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

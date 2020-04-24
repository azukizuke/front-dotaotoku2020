import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './sidenav.css';
import RankingTable from './ranking';
import SideNav from './sidenav';
import CollapsibleMenu from './collapsiblemenu';
import * as serviceWorker from './serviceWorker';

class LeagueRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props;
    this.handleLeagueChange = this.handleLeagueChange.bind(this);
  }

  static getDatefromUNIX(unixdate) {
    const date = new Date(unixdate * 1000);
    const outstr = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
    return outstr;
  }

  handleLeagueChange(leagueid) {
    this.setState({ leagueid });
  }

  render() {
    const { allleaguejson, leagueid } = this.state;
    const lastdate = LeagueRoot.getDatefromUNIX(allleaguejson[leagueid].last_unixdate);
    return (
      <div>
        <SideNav
          allleaguejson={allleaguejson}
          leagueid={leagueid}
          onLeagueChange={this.handleLeagueChange}
        />
        <div className="main">
          <h1>
            leaguename :
            {allleaguejson[leagueid].name}
          </h1>
          <h4>
            試合数 :
            {allleaguejson[leagueid].match_num}
          </h4>
          <h4>
            最後に取得したmatch_id :
            {allleaguejson[leagueid].last_matchid}
          </h4>
          <h4>
            最終試合の日付 :
            {lastdate}
          </h4>
          <CollapsibleMenu title="collapse ranking table">
            <RankingTable
              leaguejson={allleaguejson[leagueid]}
            />
          </CollapsibleMenu>
        </div>
      </div>
    );
  }
}

const allleaguejson = require('./test.json');

ReactDOM.render(
  <LeagueRoot allleaguejson={allleaguejson} leagueid="11863" />,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

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
    this.makeLeagueOutput = this.makeLeagueOutput.bind(this);
    this.makeStartPage = this.makeStartPage.bind(this);
  }

  static getDatefromUNIX(unixdate) {
    const date = new Date(unixdate * 1000);
    const outstr = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
    return outstr;
  }

  handleLeagueChange(leagueid) {
    this.setState({ leagueid });
  }

  makeStartPage() {
    return (
      <div className="main">
        <h1>start page</h1>
        <p>
          左がわのアレからリーグ選択してください
        </p>
      </div>
    );
  }

  makeLeagueOutput() {
    const { allleaguejson, leagueid } = this.state;
    const lastdate = LeagueRoot.getDatefromUNIX(allleaguejson[leagueid].last_unixdate);
    return (
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
    );
  }

  render() {
    const { allleaguejson, leagueid } = this.state;
    let mainpage;
    if (leagueid === 'startpage') {
      mainpage = this.makeStartPage();
    } else {
      mainpage = this.makeLeagueOutput();
    }
    return (
      <div>
        <SideNav
          allleaguejson={allleaguejson}
          leagueid={leagueid}
          onLeagueChange={this.handleLeagueChange}
        />
        {mainpage}
      </div>
    );
  }
}

const allleaguejson = require('./test.json');

ReactDOM.render(
  <LeagueRoot allleaguejson={allleaguejson} leagueid="startpage" />,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

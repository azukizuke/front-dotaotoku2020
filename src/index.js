import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import './index.css';
import './sidenav.css';
import './hero.css';
import RankingTable from './ranking';
import SideNav from './sidenav';
import CollapsibleMenu from './collapsiblemenu';
import * as serviceWorker from './serviceWorker';
import Hero from './hero';

class LeagueRoot extends React.Component {
  static makeStartPage() {
    return (
      <div className="main">
        <h1>start page</h1>
        <p>
          左がわのアレからリーグ選択してください
          まだまだ絶賛作りまくり中なのでテストデータとかおかしなところあります。
        </p>
        <p>
          ver毎にDB作っていないので、古い情報はよく壊れます
        </p>
        <h3>hero roleに関して</h3>
        <p>
          各試合毎に書くヒーローのロールを自動的に取得しています。下記の順序で取得しています。pos4がjungleでメチャ稼いだりするとずれる。
        </p>
        <ol>
          <li>チーム内で一番セントリーワードを買ったヒーローをpos5</li>
          <li>pos5を除く、10分間でLH数が一番低いヒーローをpos4</li>
          <li>midレーンに行ったヒーローをpos2</li>
          <li>残ったヒーローの稼いだgoldが多いほうがpos1</li>
          <li>残りがpos3</li>
        </ol>
        <p>各種レーン情報はopendota情報を利用しています。</p>
        <h3>各ヒーローのskill</h3>
        <p>
          verごとにヒーローのスキルリストを作るのが正しいですが、めんどくさいしマイナーパッチですぐずれるので、
          雛形はありますが大体は試合中に取得したスキル/タレントをそのまま配列に突っ込んでいます。
        </p>
        <p>なのでアビリティの順序がよく壊れるので、気をつけてください。</p>
        <h3>その他</h3>
        <p>各試合の詳細情報はほぼ全部opendotaの情報を引っこ抜いています。ありがとうございます。</p>
      </div>
    );
  }

  static getOutputDuration(durationArr) {
    const sumDuration = durationArr.reduce((sum, duration) => sum + duration, 0);
    const meanDuration = parseInt(sumDuration / durationArr.length, 10);
    const minutes = parseInt(meanDuration / 60, 10);
    const second = parseInt(meanDuration % 60, 10);
    const output = `${minutes}:${second}`;
    return output;
  }

  constructor(props) {
    super(props);
    this.state = this.props;
    this.handleLeagueChange = this.handleLeagueChange.bind(this);
    this.makeLeagueOutput = this.makeLeagueOutput.bind(this);
    this.makeLeagueStats = this.makeLeagueStats.bind(this);
    this.handleClickHero = this.handleClickHero.bind(this);
    this.handleClickHeroOverLay = this.handleClickHeroOverLay.bind(this);
  }

  static getDatefromUNIX(unixdate) {
    const date = new Date(unixdate * 1000);
    const outstr = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
    return outstr;
  }

  handleLeagueChange(leagueid) {
    this.setState({ leagueid });
  }

  handleClickHero(heroid) {
    this.setState({ heroid });
    this.setState({ isHeroPage: true });
  }

  handleClickHeroOverLay() {
    this.setState({ heroid: -1 });
    this.setState({ isHeroPage: false });
  }

  makeLeagueStats() {
    const { allleaguejson, leagueid } = this.state;
    const lastdate = LeagueRoot.getDatefromUNIX(allleaguejson[leagueid].last_unixdate);
    const outputDuration = LeagueRoot.getOutputDuration(allleaguejson[leagueid].duration_arr);
    return (
      <div className="leagueStats">
        <h1>
          {allleaguejson[leagueid].name}
        </h1>
        <table className="leagueStats">
          <tbody>
            <tr>
              <td className="leagueStats">試合数</td>
              <td className="leagueStats">{allleaguejson[leagueid].match_num}</td>
            </tr>
            <tr>
              <td className="leagueStats">最後に取得したmatch_id</td>
              <td className="leagueStats">{allleaguejson[leagueid].last_matchid}</td>
            </tr>
            <tr>
              <td className="leagueStats">最終試合の日付</td>
              <td className="leagueStats">{lastdate}</td>
            </tr>
            <tr>
              <td className="leagueStats">平均試合時間</td>
              <td className="leagueStats">{outputDuration}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  makeLeagueOutput() {
    const { allleaguejson, leagueid } = this.state;
    const leagueStats = this.makeLeagueStats();
    return (
      <div className="main">
        {leagueStats}
        <h3>ヒーローアイコンをクリックすると色々見れるようにしました 随時追加していきます</h3>
        <CollapsibleMenu title="PickBan ランキング開閉" buttonClass="buttonMainBorder">
          <RankingTable
            leaguejson={allleaguejson[leagueid]}
            onClickHero={this.handleClickHero}
          />
        </CollapsibleMenu>
      </div>
    );
  }

  render() {
    const {
      allleaguejson,
      leagueid,
      heroid,
      isHeroPage,
    } = this.state;
    let mainpage;
    if (leagueid === 'startpage') {
      mainpage = LeagueRoot.makeStartPage();
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
        <Hero
          heroid={heroid}
          league={allleaguejson[leagueid]}
          isHeroPage={isHeroPage}
          onClickOverLay={this.handleClickHeroOverLay}
        />
      </div>
    );
  }
}

const allleaguejson = require('./test.json');

ReactDOM.render(
  <LeagueRoot
    allleaguejson={allleaguejson}
    leagueid="startpage"
    heroid={0}
    isHeroPage={false}
  />,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

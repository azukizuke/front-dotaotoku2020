import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import RankingTable from './ranking';
import SideNav from './sidenav';
import CollapsibleMenu from './collapsiblemenu';
import * as serviceWorker from './serviceWorker';
import Hero from './hero';
import LeagueStats from './leagueStats';
import CompareLeague from './compareLeague';
import AllHeroLayout from './allHeroLayout';
import HoverStats from './hoverStats';
// css
import './index.css';
import './sidenav.css';
import './hero.css';
import './skillStats.css';
import './ranking.css';
import './talentStats.css';
import './lastItemStats.css';
import './startItemStats.css';
import './neutralItemStats.css';
import './purchaseStats.css';
import './compareLeague.css';
import './allHeroLayout.css';
import './leagueStats.css';
import './hoverStats.css';

class LeagueRoot extends React.Component {
  static makeStartPage(sideWidth) {
    return (
      <div
        className="main"
        style={{ marginLeft: sideWidth }}
      >
        <h1>ウルトラお得情報ロボ2</h1>
        <p>
          もともと色々やっていたやつを作り直したくなったのでやっています。
        </p>
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
    const {
      allleaguejson,
      heroid,
      leagueid,
      isHeroPage,
    } = this.props;
    this.state = {
      allleaguejson,
      heroid,
      leagueid,
      isHeroPage,
      isSideOpen: true,
      isHover: false,
      hoverValue: null,
    };
    this.handleLeagueChange = this.handleLeagueChange.bind(this);
    this.makeLeagueOutput = this.makeLeagueOutput.bind(this);
    this.handleClickHero = this.handleClickHero.bind(this);
    this.handleSideOpen = this.handleSideOpen.bind(this);
    this.handleClickHeroOverLay = this.handleClickHeroOverLay.bind(this);
    this.handleHover = this.handleHover.bind(this);
  }

  static getDatefromUNIX(unixdate) {
    const date = new Date(unixdate * 1000);
    const outstr = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
    return outstr;
  }

  handleLeagueChange(leagueid) {
    this.setState({ leagueid });
  }

  handleHover(isHover, value) {
    const pageX = value[0].pageX - document.documentElement.scrollLeft
    const pageY = value[0].pageY - document.documentElement.scrollTop
    const fixInfo = {
      pageX,
      pageY,
    }
    this.setState({
      isHover,
      hoverValue: [fixInfo, value[1]],
    });
  }

  handleSideOpen() {
    const { isSideOpen } = this.state;
    this.setState({ isSideOpen: !isSideOpen });
  }

  handleClickHero(heroid) {
    this.setState({ heroid });
    this.setState({ isHeroPage: true });
  }

  handleClickHeroOverLay() {
    this.setState({ heroid: -1 });
    this.setState({ isHeroPage: false });
  }

  makeLeagueOutput(sideWidth) {
    const { allleaguejson, leagueid } = this.state;
    return (
      <div
        className="main"
        style={{ marginLeft: sideWidth }}
      >
        <LeagueStats league={allleaguejson[leagueid]} />
        <h3>ヒーローアイコンをクリックすると色々見れるようにしました 随時追加していきます</h3>
        <CollapsibleMenu title="PickBan ランキング" buttonClass="buttonMainBorder">
          <RankingTable
            leaguejson={allleaguejson[leagueid]}
            onClickHero={this.handleClickHero}
            handleHover={this.handleHover}
          />
        </CollapsibleMenu>
        <CollapsibleMenu title="リーグ比較" buttonClass="buttonMainBorder">
          <CompareLeague
            league={allleaguejson[leagueid]}
            allLeagueDict={allleaguejson}
            onClickHero={this.handleClickHero}
          />
        </CollapsibleMenu>
        <CollapsibleMenu title="全ヒーローリスト" buttonClass="buttonMainBorder">
          <AllHeroLayout
            league={allleaguejson[leagueid]}
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
      isSideOpen,
      isHover,
      hoverValue,
    } = this.state;
    const sideWidth = isSideOpen ? '20%' : '5%';
    let mainpage;
    if (leagueid === 'startpage') {
      mainpage = LeagueRoot.makeStartPage(sideWidth);
    } else {
      mainpage = this.makeLeagueOutput(sideWidth);
    }

    return (
      <div>
        <SideNav
          allleaguejson={allleaguejson}
          leagueid={leagueid}
          onLeagueChange={this.handleLeagueChange}
          handleSideOpen={this.handleSideOpen}
          isSideOpen={isSideOpen}
          sideWidth={sideWidth}
        />
        {mainpage}
        <Hero
          heroid={heroid}
          league={allleaguejson[leagueid]}
          isHeroPage={isHeroPage}
          onClickOverLay={this.handleClickHeroOverLay}
        />
        <HoverStats
          isHover={isHover}
          hoverValue={hoverValue}
        />
      </div>
    );
  }
}

LeagueRoot.defaultProps = {
  allleaguejson: {},
  heroid: 0,
  leagueid: 0,
  isHeroPage: false,
};

LeagueRoot.propTypes = {
  allleaguejson: PropTypes.object,
  heroid: PropTypes.number,
  leagueid: PropTypes.number,
  isHeroPage: PropTypes.bool,
};

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

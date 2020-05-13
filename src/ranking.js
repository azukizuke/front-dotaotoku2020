import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as images from './image';

export default class RankingTable extends React.Component {
  makeRankingRender(key, title, mode, tableClass) {
    const { leaguejson, onClickHero, handleHover } = this.props;
    return (
      <div className="pickban_ranking_items">
        <Ranking
          ranking={leaguejson.pickbans[key]}
          herojson={leaguejson.heroes}
          matchNum={leaguejson.match_num}
          title={title}
          pbkey={key}
          mode={mode}
          tableClass={tableClass}
          rank={10}
          onClickHero={onClickHero}
          handleHover={handleHover}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        <p>
          一番左の列は大会を通してpick/ban両方の数が多いヒーローを表示してます
          <br />
          各%はpick+ban両方 - pickのみ - banのみのカウントを試合数で割ったものです。
          緑がpick 赤がban
        </p>
        <p>
          右4列は、各roleとしてpickされた回数を表示してます。パーセンテージはそのroleとしてpickされたのみ。緑色のバーです
          <br />
          あとその下の汚いbarは各role毎のpick割合を出そうといま色々してます。ちょっとすごいごちゃごちゃしてますが。どうにかうまいこと表現できないもんか
          <br />
          roleは自動で判定しています。
        </p>
        <div className="pickban_ranking">
          {this.makeRankingRender('all', 'all', 'nofilter', 'rankingOdd')}
          {this.makeRankingRender('pos1', 'autopos1', 'nofilter', 'rankingEven')}
          {this.makeRankingRender('pos2', 'autopos2', 'nofilter', 'rankingOdd')}
          {this.makeRankingRender('pos3', 'autopos3', 'nofilter', 'rankingEven')}
          {this.makeRankingRender('pos4', 'autopos4', 'nofilter', 'rankingOdd')}
          {this.makeRankingRender('pos5', 'autopos5', 'nofilter', 'rankingEven')}
        </div>
      </div>
    );
  }
}

RankingTable.defaultProps = {
  leaguejson: false,
  onClickHero: undefined,
  handleHover: undefined,
};

RankingTable.propTypes = {
  leaguejson: PropTypes.objectOf(PropTypes.number),
  onClickHero: PropTypes.func,
  handleHover: PropTypes.func,
};


class Ranking extends React.Component {
  static makeSortKeys(ranking) {
    const sortedKeys = [];
    Object.keys(ranking).map((key) => sortedKeys.push(key));
    sortedKeys.sort((a, b) => ranking[b] - ranking[a]);
    return sortedKeys;
  }

  static makePickBanBar(percentAll, percentPick, percentBan, inputStr) {
    return (
      <div className="pickBanBar" style={{ width: `${percentAll}%` }}>
        <div className="pickBar" style={{ flexGrow: percentPick }}>
          {inputStr}
        </div>
        <div className="banBar" style={{ flexGrow: percentBan }} />
      </div>
    );
  }

  static makeRoleBarChild(percentPos, color) {
    return (
      <div
        className="pickBar"
        style={{ flexGrow: percentPos, backgroundColor: color }}
      />
    );
  }

  static makeRoleBar(hero, matchNum, percentPick) {
    const percentPos1 = parseInt((hero.pickbans.pos1 / hero.pickbans.pick) * 100, 10);
    const percentPos2 = parseInt((hero.pickbans.pos2 / hero.pickbans.pick) * 100, 10);
    const percentPos3 = parseInt((hero.pickbans.pos3 / hero.pickbans.pick) * 100, 10);
    const percentPos4 = parseInt((hero.pickbans.pos4 / hero.pickbans.pick) * 100, 10);
    const percentPos5 = parseInt((hero.pickbans.pos5 / hero.pickbans.pick) * 100, 10);
    return (
      <div className="pickBanBar" style={{ width: `${percentPick}%` }}>
        {Ranking.makeRoleBarChild(percentPos1, 'rgba(255,102,102,1)', 1)}
        {Ranking.makeRoleBarChild(percentPos2, 'rgba(102,0,255,1)', 2)}
        {Ranking.makeRoleBarChild(percentPos3, 'rgba(51,153,255,1)', 3)}
        {Ranking.makeRoleBarChild(percentPos4, 'rgba(102,51,0,1)', 4)}
        {Ranking.makeRoleBarChild(percentPos5, 'rgba(255,0,255,1)', 5)}
      </div>
    );
  }

  static makeWinBar(hero) {
    const winPercent = parseInt((hero.win_stats / hero.pickbans.pick) * 100, 10);
    const backgroundColor = 'rgba(0,0,255,0.2)';
    return (
      <div
        className="winBar"
        style={{
          backgroundColor,
          width: `${winPercent}%`,
        }}
      >
        勝率: {winPercent}%
      </div>
    );
  }

  static makeHoverStr(percentPos1, percentPos2, percentPos3, percentPos4, percentPos5) {
    return (
      <div>
        各roleの割合
        <div style={{ backgroundColor: `rgba(255,0,0,${percentPos1 / 100})` }}>
          {`pos1: ${percentPos1}%`}
        </div>
        <div style={{ backgroundColor: `rgba(255,0,0,${percentPos2 / 100})` }}>
          {`pos2: ${percentPos2}%`}
        </div>
        <div style={{ backgroundColor: `rgba(255,0,0,${percentPos3 / 100})` }}>
          {`pos3: ${percentPos3}%`}
        </div>
        <div style={{ backgroundColor: `rgba(255,0,0,${percentPos4 / 100})` }}>
          {`pos4: ${percentPos4}%`}
        </div>
        <div style={{ backgroundColor: `rgba(255,0,0,${percentPos5 / 100})` }}>
          {`pos5: ${percentPos5}%`}
        </div>
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.makeRankingOutput = this.makeRankingOutput.bind(this);
    this.isFilterRole = this.isFilterRole.bind(this);
    this.makeStats = this.makeStats.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  isFilterRole(heroid) {
    const { herojson, mode } = this.props;
    if (mode === 'nofilter') {
      return true;
    }
    return (herojson[heroid].hero_role[mode]);
  }

  handleClick(e) {
    const { onClickHero } = this.props;
    onClickHero(e.target.alt);
  }

  handleMouseOver(e) {
    const { handleHover } = this.props;
    const percentPos1 = (e.currentTarget.getAttribute('data-pos1'));
    const percentPos2 = (e.currentTarget.getAttribute('data-pos2'));
    const percentPos3 = (e.currentTarget.getAttribute('data-pos3'));
    const percentPos4 = (e.currentTarget.getAttribute('data-pos4'));
    const percentPos5 = (e.currentTarget.getAttribute('data-pos5'));
    const info = {
      pageX: e.pageX,
      pageY: e.pageY,
    };
    const value = Ranking.makeHoverStr(
      percentPos1,
      percentPos2,
      percentPos3,
      percentPos4,
      percentPos5,
    );
    handleHover(true, [info, value]);
  }

  handleMouseOut(e) {
    const { handleHover } = this.props;
    const info = {
      pageX: e.pageX,
      pageY: e.pageY,
    };
    handleHover(false, [info, 'test']);
  }

  makeHeroImage(heroid) {
    const { herojson } = this.props;
    return (
      <img
        src={images.default[herojson[heroid].imagefile]}
        alt={heroid}
        value={heroid}
        onClick={this.handleClick}
        className="image_hero"
      />
    );
  }


  makeStats(heroid) {
    const { herojson, matchNum, pbkey } = this.props;
    const hero = herojson[heroid];
    const percentAll = parseInt((herojson[heroid].pickbans.all * 100) / matchNum, 10);
    const percentPick = parseInt((herojson[heroid].pickbans.pick * 100) / matchNum, 10);
    const percentBan = parseInt((herojson[heroid].pickbans.ban * 100) / matchNum, 10);
    const percentRole = parseInt((herojson[heroid].pickbans[pbkey] * 100) / matchNum, 10);
    const percentPos1 = parseInt((hero.pickbans.pos1 / hero.pickbans.pick) * 100, 10);
    const percentPos2 = parseInt((hero.pickbans.pos2 / hero.pickbans.pick) * 100, 10);
    const percentPos3 = parseInt((hero.pickbans.pos3 / hero.pickbans.pick) * 100, 10);
    const percentPos4 = parseInt((hero.pickbans.pos4 / hero.pickbans.pick) * 100, 10);
    const percentPos5 = parseInt((hero.pickbans.pos5 / hero.pickbans.pick) * 100, 10);
    const winPercent = parseInt((hero.win_stats / hero.pickbans.pick) * 100, 10);

    const strAll = `${percentAll}%`;
    const strPick = `${percentPick}%`;
    const strBan = `${percentBan}%`;
    const strRole = `${percentRole}%`;
    const strWin = Ranking.makeWinBar(hero);

    if (pbkey === 'all') {
      return (
        <div>
          <div>{`${strAll}-${strPick}-${strBan}`}</div>
          <div>{Ranking.makePickBanBar(percentAll, percentPick, percentBan)}</div>
          <div>{strWin}</div>
        </div>
      );
    }
    return (
      <div
        data-value={strRole}
        data-pos1={percentPos1}
        data-pos2={percentPos2}
        data-pos3={percentPos3}
        data-pos4={percentPos4}
        data-pos5={percentPos5}
        onMouseOver={this.handleMouseOver}
        onMouseMove={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        <div>{strRole}</div>
        <div>{Ranking.makePickBanBar(percentRole, percentRole, 0)}</div>
        <div>{Ranking.makeRoleBar(hero, matchNum, percentPick)}</div>
      </div>
    );
  }

  makeRankingOutput() {
    const row = [];
    const { rank, ranking } = this.props;
    const sortedKeys = Ranking.makeSortKeys(ranking);
    let counter = 0;

    sortedKeys.some((heroid) => {
      if (this.isFilterRole(heroid)) {
        row.push(
          <tr key={heroid}>
            <td className="rankingTdImage">{this.makeHeroImage(heroid)}</td>
            <td className="rankingTdStats">{this.makeStats(heroid)}</td>
          </tr>,
        );
        counter += 1;
      }
      if (counter === rank) {
        counter = 0;
        return true;
      }
      return false;
    });
    return row;
  }

  render() {
    const { tableClass, title, pbkey } = this.props;
    const rankingRow = this.makeRankingOutput();
    let outputStat = '';
    if (pbkey === 'all') {
      outputStat = 'all - pick - ban';
    } else {
      outputStat = 'pick';
    }
    return (
      <div>
        <table className={tableClass}>
          <thead>
            <tr>
              <th className="rankingTableHeader" colSpan="2">{title}</th>
            </tr>
            <tr>
              <th className="rankingTableHeaderImage">hero</th>
              <th className="rankingTableHeader">{outputStat}</th>
            </tr>
          </thead>
          <tbody>
            {rankingRow}
          </tbody>
        </table>
      </div>
    );
  }
}

Ranking.defaultProps = {
  mode: 'noprops',
  rank: 99,
  ranking: {},
  herojson: {},
  tableClass: '',
  pbkey: '',
  title: '',
  matchNum: 0,
  onClickHero: undefined,
  handleHover: undefined,
};

Ranking.propTypes = {
  ranking: PropTypes.object,
  herojson: PropTypes.object,
  matchNum: PropTypes.number,
  mode: PropTypes.string,
  pbkey: PropTypes.string,
  title: PropTypes.string,
  rank: PropTypes.number,
  tableClass: PropTypes.string,
  onClickHero: PropTypes.func,
  handleHover: PropTypes.func,
};

import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as images from './image';

export default class RankingTable extends React.Component {
  makeRankingRender(key, title, mode, tableClass) {
    const { leaguejson, onClickHero } = this.props;
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
          それ以外は、各roleとしてpickされた回数を表示してます。pickのみ。
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
};

RankingTable.propTypes = {
  leaguejson: PropTypes.objectOf(PropTypes.number),
  onClickHero: PropTypes.func,
};


class Ranking extends React.Component {
  static makeSortKeys(ranking) {
    const sortedKeys = [];
    Object.keys(ranking).map((key) => sortedKeys.push(key));
    sortedKeys.sort((a, b) => ranking[b] - ranking[a]);
    return sortedKeys;
  }

  static makePickBanBar(percentAll, percentPick, percentBan) {
    return (
      <div className="pickBanBar" style={{ width: `${percentAll}%` }}>
        <div className="pickBar" style={{ flexGrow: percentPick }} />
        <div className="banBar" style={{ flexGrow: percentBan }} />
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.makeRankingOutput = this.makeRankingOutput.bind(this);
    this.isFilterRole = this.isFilterRole.bind(this);
    this.makeStats = this.makeStats.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
    const percentAll = parseInt((herojson[heroid].pickbans.all * 100) / matchNum, 10);
    const percentPick = parseInt((herojson[heroid].pickbans.pick * 100) / matchNum, 10);
    const percentBan = parseInt((herojson[heroid].pickbans.ban * 100) / matchNum, 10);
    const percentRole = parseInt((herojson[heroid].pickbans[pbkey] * 100) / matchNum, 10);

    const strAll = `${percentAll}%`;
    const strPick = `${percentPick}%`;
    const strBan = `${percentBan}%`;
    const strRole = `${percentRole}%`;

    if (pbkey === 'all') {
      return (
        <div>
          <ul>
            <li>{`${strAll}-${strPick}-${strBan}`}</li>
            <li>{Ranking.makePickBanBar(percentAll, percentPick, percentBan)}</li>
          </ul>
        </div>
      );
    }
    return (
      <div>
        <ul>
          <li>{strRole}</li>
          <li>{Ranking.makePickBanBar(percentRole, percentRole, 0)}</li>
        </ul>
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
};

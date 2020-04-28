import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as images from './image';

export default class RankingTable extends React.Component {
  makeRankingRender(key, title, mode, tableClass) {
    const { leaguejson } = this.props;
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
        />
      </div>
    );
  }

  render() {
    return (
      <div>
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
};

RankingTable.propTypes = {
  leaguejson: PropTypes.objectOf(PropTypes.number),
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
  }

  isFilterRole(heroid) {
    const { herojson, mode } = this.props;
    if(mode === 'nofilter') {
        return true
    }
    return (herojson[heroid].hero_role[mode]);
  }


  makeHeroImage(heroid) {
    const { herojson } = this.props;
    return (
      <img
        src={images.default[herojson[heroid].imagefile]}
        alt={heroid}
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
    console.log(percentRole)

    const strAll = `${percentAll}%`;
    const strPick = `${percentPick}%`;
    const strBan = `${percentBan}%`;
    const strRole = `pick: ${percentRole}%`;

    if(pbkey === "all"){
      return (
        <div>
          <ul>
            <li>{strAll}-{strPick}-{strBan}</li>
            <li>{Ranking.makePickBanBar(percentAll, percentPick, percentBan)}</li>
          </ul>
        </div>
      );
    } else {
      return (
        <div>
          <ul>
            <li>{strRole}</li>
          </ul>
        </div>
      );
    }
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
            <td>{this.makeHeroImage(heroid)}</td>
            <td>{this.makeStats(heroid)}</td>
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
    const { mode, tableClass, title } = this.props;
    const rankingRow = this.makeRankingOutput();
    return (
      <div>
        <table className={tableClass}>
          <thead>
            <tr>
              <th colSpan="2">{title}</th>
            </tr>
            <tr>
              <th>heroid</th>
              <th>stat</th>
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
  ranking: false,
  herojson: false,
  tableClass: '',
  matchNum: 0,
};

Ranking.propTypes = {
  ranking: PropTypes.objectOf(PropTypes.number),
  herojson: PropTypes.objectOf(PropTypes.number),
  matchNum: PropTypes.number,
  mode: PropTypes.string,
  rank: PropTypes.number,
  tableClass: PropTypes.string,
};

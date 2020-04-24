import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as images from './image';

export default class RankingTable extends React.Component {
  makeRankingRender(key, mode) {
    const { leaguejson } = this.props;
    return (
      <div className="pickban_ranking_items">
        <Ranking
          ranking={leaguejson.pickbans[key]}
          herojson={leaguejson.heroes}
          matchNum={leaguejson.match_num}
          mode={mode}
          rank={10}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        test ranking table Component
        <div className="pickban_ranking">
          {this.makeRankingRender('all', 'pos1')}
          {this.makeRankingRender('all', 'pos2')}
          {this.makeRankingRender('all', 'pos3')}
          {this.makeRankingRender('all', 'pos4')}
          {this.makeRankingRender('all', 'pos5')}
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

  constructor(props) {
    super(props);
    this.makeRankingOutput = this.makeRankingOutput.bind(this);
    this.isFilterRole = this.isFilterRole.bind(this);
    this.makeStats = this.makeStats.bind(this);
  }

  isFilterRole(heroid) {
    const { herojson, mode } = this.props;
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
    const { herojson, matchNum } = this.props;
    const percentAll = parseInt((herojson[heroid].pickbans.all * 100) / matchNum, 10);
    const percentPick = parseInt((herojson[heroid].pickbans.pick * 100) / matchNum, 10);
    const percentBan = parseInt((herojson[heroid].pickbans.ban * 100) / matchNum, 10);

    const strAll = `all: ${percentAll}%`;
    const strPick = `pick: ${percentPick}%`;
    const strBan = `ban: ${percentBan}%`;

    return (
      <div>
        <ul>
          <li>{strAll}</li>
          <li>{strPick}</li>
          <li>{strBan}</li>
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
    const { mode } = this.props;
    const rankingRow = this.makeRankingOutput();
    return (
      <div>
        {mode}
        <table>
          <thead>
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
  matchNum: 0,
};

Ranking.propTypes = {
  ranking: PropTypes.objectOf(PropTypes.number),
  herojson: PropTypes.objectOf(PropTypes.number),
  matchNum: PropTypes.number,
  mode: PropTypes.string,
  rank: PropTypes.number,
};

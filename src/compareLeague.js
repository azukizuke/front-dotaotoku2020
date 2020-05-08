import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as images from './image';

export default class CompareLeague extends React.Component {
  static getPreLeague(allLeagueDict, league) {
    const sorted = Object.entries(allLeagueDict).sort(
      (a, b) => b[1].last_unixdate - a[1].last_unixdate,
    );
    // last object cant compare so length - 1
    for (let i = 0; i < (sorted.length - 1); i += 1) {
      if (sorted[i][0] === league.league_id) {
        const preLeague = sorted[i + 1][1];
        return preLeague;
      }
    }
    return null;
  }

  static getHeroChangeRanking(league, preLeague, rank) {
    const changeArr = Object.entries(preLeague.heroes).map((entry) => {
      const preHero = entry[1];
      const currentHero = league.heroes[entry[0]];
      const prePercent = parseInt((preHero.pickbans.all / preLeague.match_num) * 100, 10);
      const currentPercent = parseInt((currentHero.pickbans.all / league.match_num) * 100, 10);
      const changePercent = currentPercent - prePercent;
      return [preHero.heroid, changePercent];
    });
    const topRank = changeArr.sort((a, b) => b[1] - a[1]).slice(0, rank);
    const bottomRank = changeArr.sort((a, b) => a[1] - b[1]).slice(0, rank);
    return [topRank, bottomRank];
  }


  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.outputRow = this.outputRow.bind(this);
  }

  handleClick(e) {
    const { onClickHero } = this.props;
    onClickHero(e.target.alt);
  }

  outputRow(league, preLeague, heroChangeRanking, rank) {
    const outputRow = [];
    for (let i = 0; i < rank; i += 1) {
      const topHeroID = heroChangeRanking[0][i][0];
      const bottomHeroID = heroChangeRanking[1][i][0];
      const topPercent = heroChangeRanking[0][i][1];
      const bottomPercent = heroChangeRanking[1][i][1];
      outputRow.push(
        <tr>
          <td>
            {i + 1}
          </td>
          <td>
            <img
              onClick={this.handleClick}
              src={images.default[league.heroes[topHeroID].imagefile]}
              alt={topHeroID}
              className="compareLeagueImage"
            />
            <br />
            {`+${topPercent}%`}
          </td>
          <td>
            <img
              src={images.default[league.heroes[bottomHeroID].imagefile]}
              alt={bottomHeroID}
              className="compareLeagueImage"
              onClick={this.handleClick}
            />
            <br />
            {`${bottomPercent}%`}
          </td>
        </tr>,
      );
    }
    return outputRow;
  }

  render() {
    const { league, allLeagueDict } = this.props;
    const rank = 10;
    const preLeague = CompareLeague.getPreLeague(allLeagueDict, league);
    if (preLeague === null) {
      return (
        <div>
          比較リーグはなし
        </div>
      );
    }
    const heroChangeRanking = CompareLeague.getHeroChangeRanking(league, preLeague, rank);
    const outputRow = this.outputRow(league, preLeague, heroChangeRanking, rank);
    return (
      <div>
        <p>
          一つ前のリーグと比較し、pick + banのパーセンテージが大きいヒーローです。
          <br />
          取得期間での最終試合の日時でソーティングしてます
        </p>
        <p>
          {`比較リーグ：${preLeague.name}`}
        </p>
        <table>
          <tbody>
            {outputRow}
          </tbody>
        </table>
      </div>
    );
  }
}

CompareLeague.defaultProps = {
  league: {},
  allLeagueDict: {},
  onClickHero: undefined,
};

CompareLeague.propTypes = {
  league: PropTypes.object,
  allLeagueDict: PropTypes.object,
  onClickHero: PropTypes.func,
};

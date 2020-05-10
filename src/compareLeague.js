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

  static outputBar(percent, child, isBlue) {
    const color = (isBlue) ? [0, 0, 255, 0.4] : [0, 255, 0, 0.5];
    const backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
    return (
      <div
        className="compareLeagueBarGreen"
        style={{
          width: percent,
          backgroundColor: backgroundColor,
        }}
      >
        {child}
      </div>
    );
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

      const topCurrentPercent = parseInt(
        ((league.heroes[topHeroID].pickbans.all / league.match_num) * 100), 10,
      );
      const topPrePercent = parseInt(
        ((preLeague.heroes[topHeroID].pickbans.all / preLeague.match_num) * 100), 10,
      );
      const bottomCurrentPercent = parseInt(
        ((league.heroes[bottomHeroID].pickbans.all / league.match_num) * 100), 10,
      );
      const bottomPrePercent = parseInt(
        ((preLeague.heroes[bottomHeroID].pickbans.all / preLeague.match_num) * 100), 10,
      );
      outputRow.push(
        <tr>
          <td className="compareLeagueNum">
            {i + 1}
          </td>
          <td className="compareLeagueTdImage">
            <img
              onClick={this.handleClick}
              src={images.default[league.heroes[topHeroID].imagefile]}
              alt={topHeroID}
              className="compareLeagueImage"
            />
          </td>
          <td className="compareLeagueChange">
            {`+${topPercent}%`}
          </td>
          <td className="compareLeagueBar">
            {CompareLeague.outputBar(topPrePercent, `前:${topPrePercent}%`, true)}
            {CompareLeague.outputBar(topCurrentPercent, `今:${topCurrentPercent}%`, false)}
          </td>
          <td className="compareLeagueImage">
            <img
              src={images.default[league.heroes[bottomHeroID].imagefile]}
              alt={bottomHeroID}
              className="compareLeagueImage"
              onClick={this.handleClick}
            />
          </td>
          <td className="compareLeagueChange">
            {`${bottomPercent}%`}
          </td>
          <td className="compareLeagueBar">
            {CompareLeague.outputBar(bottomPrePercent, `前:${bottomPrePercent}%`, true)}
            {CompareLeague.outputBar(bottomCurrentPercent, `今:${bottomCurrentPercent}%`, false)}
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
          一つ前のリーグと比較し、pick + banのパーセンテージ変化が大きいヒーローです。
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

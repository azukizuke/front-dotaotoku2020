import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class LeagueStats extends React.Component {
  static getOutputDuration(durationArr) {
    const sumDuration = durationArr.reduce((sum, duration) => sum + duration, 0);
    const meanDuration = parseInt(sumDuration / durationArr.length, 10);
    const minutes = parseInt(meanDuration / 60, 10);
    const output = `${minutes}分`;
    return output;
  }

  static getDatefromUNIX(unixdate) {
    const date = new Date(unixdate * 1000);
    const outstr = `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()}`;
    return outstr;
  }

  static outputMatchID(matchArr) {
    const sortArr = matchArr;
    sortArr.sort((a, b) => (a - b));
    const firstMatchID = sortArr[0];
    const lastMatchID = sortArr.slice(-1)[0];
    return (`${firstMatchID} ~ ${lastMatchID}`);
  }

  static outputDate(unixDataArr) {
    const sortArr = unixDataArr;
    sortArr.sort((a, b) => (a - b));
    const firstDateOutput = LeagueStats.getDatefromUNIX(sortArr[0]);
    const lastDateOutput = LeagueStats.getDatefromUNIX(sortArr.slice(-1)[0]);
    return (`${firstDateOutput} ~ ${lastDateOutput}`);
  }

  static outputRadiantWinrate(matchNum, radiantWinNum) {
    const direWinNum = matchNum - radiantWinNum;
    const radiantPercent = parseInt((radiantWinNum / matchNum) * 100, 10);
    const direPercent = parseInt((direWinNum / matchNum) * 100, 10);
    return (
      <div>
        {`${radiantPercent}% - ${direPercent}%`}
        <div className="leagueStatsBar">
          <div
            className="leagueStatsBarGreen"
            style={{ flexGrow: radiantPercent }}
          />
          <div
            className="leagueStatsBarRed"
            style={{ flexGrow: direPercent }}
          />
        </div>
      </div>
    );
  }

  render() {
    const { league } = this.props;
    const outputDate = LeagueStats.outputDate(league.unixdate_arr);
    const outputMatchID = LeagueStats.outputMatchID(league.match_id_arr);
    const outputDuration = LeagueStats.getOutputDuration(league.duration_arr);
    const outputRadiantWinrate = LeagueStats.outputRadiantWinrate(
      league.match_num,
      league.radiant_win_num,
    );
    return (
      <div className="leagueStats">
        <h1>
          {league.name}
        </h1>
        <table className="leagueStats">
          <tbody>
            <tr>
              <td className="leagueStats">leagueID</td>
              <td className="leagueStats">{league.league_id}</td>
            </tr>
            <tr>
              <td className="leagueStats">試合数</td>
              <td className="leagueStats">{league.match_num}</td>
            </tr>
            <tr>
              <td className="leagueStats">match_id 計測期間</td>
              <td className="leagueStats">{outputMatchID}</td>
            </tr>
            <tr>
              <td className="leagueStats">日付 計測期間</td>
              <td className="leagueStats">{outputDate}</td>
            </tr>
            <tr>
              <td className="leagueStats">平均試合時間</td>
              <td className="leagueStats">{outputDuration}</td>
            </tr>
            <tr>
              <td className="leagueStats">Radiant-Dire 勝率</td>
              <td className="leagueStats">{outputRadiantWinrate}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
LeagueStats.defaultProps = {
  league: {},
};

LeagueStats.propTypes = {
  league: PropTypes.objectOf(PropTypes.number),
};

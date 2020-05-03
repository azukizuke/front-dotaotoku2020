import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class LeagueStats extends React.Component {
  static getOutputDuration(durationArr) {
    const sumDuration = durationArr.reduce((sum, duration) => sum + duration, 0);
    const meanDuration = parseInt(sumDuration / durationArr.length, 10);
    const minutes = parseInt(meanDuration / 60, 10);
    const second = parseInt(meanDuration % 60, 10);
    const output = `${minutes}:${second}`;
    return output;
  }

  static getDatefromUNIX(unixdate) {
    const date = new Date(unixdate * 1000);
    const outstr = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`;
    return outstr;
  }

  render() {
    const { league } = this.props;
    const lastdate = LeagueStats.getDatefromUNIX(league.last_unixdate);
    const outputDuration = LeagueStats.getOutputDuration(league.duration_arr);
    return (
      <div className="leagueStats">
        <h1>
          {league.name}
        </h1>
        <table className="leagueStats">
          <tbody>
            <tr>
              <td className="leagueStats">試合数</td>
              <td className="leagueStats">{league.match_num}</td>
            </tr>
            <tr>
              <td className="leagueStats">最後に取得したmatch_id</td>
              <td className="leagueStats">{league.last_matchid}</td>
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
}

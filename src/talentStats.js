import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class TalentStats extends React.Component {
  static getSortLevelArr(talentDict) {
    const arr = Object.keys(talentDict).sort((a, b) => (b - a));
    return (arr);
  }

  static makeLevelOutput(level, talentArr, hero, league) {
    // get sum of talent count
    const countSum = Object.values(talentArr).reduce(
      (sum, count) => sum + count
    );

    const outputArr = Object.entries(talentArr).map(
      ([talentID, count]) => {
        const talentName = league.abilities[talentID].dname;
        // const percent = parseInt((count / hero.pickbans.pick) * 100, 10);
        const percent = parseInt((count / countSum) * 100, 10);
        const color = `rgba(250,50,50,${percent / 100})`;
        return (
          <td
            className="talentStatsTd"
            style={{ backgroundColor: color }}
          >
            {talentName}
            <br />
            {`${percent}%`}
          </td>
        );
      },
    );
    return outputArr;
  }

  static makeOutputTalentStats(hero, sortLevelArr, league) {
    const outputArr = sortLevelArr.map((level) => {
      const talentArr = hero.talentstats[level];
      const levelOutput = TalentStats.makeLevelOutput(level, talentArr, hero, league);
      return (
        <tr>
          <td className="talentStats">
            {10 + ((level - 1) * 5)}
          </td>
          {levelOutput}
        </tr>
      );
    });
    return outputArr;
  }

  render() {
    const { league, heroid } = this.props;
    const hero = league.heroes[heroid];
    const sortLevelArr = TalentStats.getSortLevelArr(hero.talentstats);
    const outputTalentStats = TalentStats.makeOutputTalentStats(hero, sortLevelArr, league);
    return (
      <div>
        <p>
          ※talentが3種類以上表示されていることに関して※
          <br />
          大会中でのアップデートによるタレント変更や、僕が大本の情報を更新していないときに発生します。ごめんね。
        </p>
        <table className="talentStatsTable">
          {outputTalentStats}
        </table>
      </div>
    );
  }
}

TalentStats.defaultProps = {
  heroid: 1,
  league: -1,
};

TalentStats.propTypes = {
  league: PropTypes.objectOf(PropTypes.number),
  heroid: PropTypes.number,
};

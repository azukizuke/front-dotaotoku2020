import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as images from './image';

export default class SkillStats extends React.Component {
  static makeSkillPercent(count, matchNum) {
    const percent = parseInt((count / matchNum) * 100, 10);
    const output = `${percent}%`;
    const color = `rgba(250,50,50,${percent / 100})`;
    return (
      <td
        className="heroSkillStats"
        style={{
          backgroundColor: color,
        }}
      >
        {output}
      </td>
    );
  }

  static outputHeader(maxLevel) {
    const headerLevelRow = [];
    for (let i = 1; i <= maxLevel; i += 1) {
      headerLevelRow.push(
        <th className="heroSkillStats">{i}</th>,
      );
    }
    return (
      <tr>
        <th className="heroSkillStatsTdImage">-</th>
        {headerLevelRow}
      </tr>
    );
  }

  static getLevelCountArr(skillDict, skillOrder, maxlevel) {
    const levelCountArr = [];
    for (let i = 1; i <= maxlevel; i += 1) {
      let countSum = 0;
      Object.values(skillOrder).map((skillID) => {
        countSum += skillDict[skillID][i];
        return true;
      });
      levelCountArr.push(countSum);
    }
    return levelCountArr;
  }

  static outputSkillBody(hero, league) {
    const outputRow = [];
    const skillOrder = hero.ability_ids_order;
    const skillDict = hero.skill_stats_fix;
    const abilityDict = league.abilities;
    const levelCountArr = SkillStats.getLevelCountArr(skillDict, skillOrder, 25);
    Object.values(skillOrder).map(
      (skillID) => {
        let level = -1;
        const skillrow = Object.values(skillDict[skillID]).map((count) => {
          level += 1;
          return SkillStats.makeSkillPercent(count, levelCountArr[level]);
        });
        outputRow.push(
          <tr>
            <td className="heroSkillStatsTdImage">
              <img
                src={images.default[abilityDict[skillID].img]}
                alt={skillID}
                value={skillID}
                className="heroSkillImage"
              />
            </td>
            {skillrow}
          </tr>,
        );
        return true;
      },
    );
    return outputRow;
  }

  render() {
    const { hero, league } = this.props;
    const outputHeader = SkillStats.outputHeader(25);
    const outputRow = SkillStats.outputSkillBody(hero, league);
    return (
      <table className="heroSkillStatsTable">
        <thead>
          {outputHeader}
        </thead>
        <tbody>
          {outputRow}
        </tbody>
      </table>
    );
  }
}

SkillStats.defaultProps = {
  league: {},
  hero: {},
};

SkillStats.propTypes = {
  league: PropTypes.object,
  hero: PropTypes.object,
};

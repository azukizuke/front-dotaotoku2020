import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as images from './image';

export default class NeutralItemStats extends React.Component {
  static sortedDict(itemDict) {
    return Object.entries(itemDict).sort((a, b) => b[1] - a[1]);
  }

  static outputRow(itemDict, league, hero) {
    return Object.values(itemDict).map((arr) => {
      const itemID = arr[0];
      const count = arr[1];
      const percent = parseInt((count / hero.pickbans.pick) * 100, 10);
      return (
        <tr>
          <td>
            <img
              src={images.default[league.item_dict[itemID].img]}
              alt={league.item_dict[itemID].name}
              className="neutralItemStatsImage"
            />
          </td>
          <td>
            {`${percent}%`}
          </td>
        </tr>
      );
    });
  }

  render() {
    const { hero, league } = this.props;
    const neutralItemDict = hero.lastneutralitems;
    const sortedNeutralItemDict = NeutralItemStats.sortedDict(neutralItemDict);
    const outputRow = NeutralItemStats.outputRow(sortedNeutralItemDict, league, hero);
    return (
      <div>
        <p>
          試合終了時に所持しているニュートラルアイテムの所持率です
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

NeutralItemStats.defaultProps = {
  hero: [],
  league: [],
};

NeutralItemStats.propTypes = {
  hero: PropTypes.object,
  league: PropTypes.object,
};

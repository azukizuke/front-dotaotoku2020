import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as images from './image';

export default class StartItemStats extends React.Component {
  static sortedKeys(startItemStats) {
    return Object.entries(startItemStats).sort((a, b) => (b[1].count) - a[1].count);
  }

  static outputSkillArr(startItemArr, league, backgroundColor) {
    return startItemArr.map((itemId) => {
      const itemImageName = league.item_dict[itemId].img;
      return (
        <td
          className="startItemStatsTdImage"
          style={{ backgroundColor }}
        >
          <img
            src={images.default[itemImageName]}
            alt={itemId}
            value={itemId}
            className="startItemImage"
          />
        </td>
      );
    });
  }

  static outputRow(sortedArr, league, hero) {
    const outputRow = sortedArr.map((arr) => {
      const dict = arr[1];
      const percent = parseInt((dict.count / hero.pickbans.pick) * 100, 10);
      const backgroundColor = `rgba(255, 0, 0, ${percent/100})`
      return (
        <tr
          className="startItemStatsTr"
          style={{ backgroundColor }}
        >
          <td
            className="startItemStatsTdParam"
            style={{ backgroundColor }}
          >
            {`${percent}%`}
          </td>
          {StartItemStats.outputSkillArr(dict.startitems, league, backgroundColor)}
        </tr>
      );
    });
    return outputRow;
  }

  render() {
    const { hero, league } = this.props;
    const startItemStats = hero.start_item_stats;
    const sortedArr = StartItemStats.sortedKeys(startItemStats);
    const outputRow = StartItemStats.outputRow(sortedArr, league, hero);
    return (
      <div>
        <p>
          0秒時点までに購入したアイテム組み合わせの割合を表示しています。
          <br />
          貰ったり売ったりした場合のデータは正常に取得ができていないので、おかしそうな部分が出ちゃいます。
        </p>
        <table className="startItemStatsTable">
          <tbody>
            {outputRow}
          </tbody>
        </table>
      </div>
    );
  }
}

StartItemStats.defaultProps = {
  league: {},
  hero: {},
};

StartItemStats.propTypes = {
  league: PropTypes.object,
  hero: PropTypes.object,
};

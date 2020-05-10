import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as images from './image';

export default class LastItemStats extends React.Component {
  static sortedItemIdArr(itemStats) {
    const itemIdArr = Object.entries(itemStats).sort((a, b) => b[1] - a[1]);
    return itemIdArr;
  }

  static outputRow(itemIdArr, hero, itemDict) {
    const outputRow = itemIdArr.map(([itemId, count]) => {
      const countPercent = parseInt((count / hero.pickbans.pick) * 100, 10);
      const colorAlpha = countPercent / 100;
      const backgroundColor = `rgba(255, 0, 0, ${colorAlpha})`;
      return (
        <div
          className="lastItemChildren"
          style={{ backgroundColor }}
        >
          <img
            src={images.default[itemDict[itemId].img]}
            alt={itemId}
            value={itemId}
            className="lastItemImage"
          />
          <br />
          {`${countPercent}%`}
        </div>
      );
    });
    return outputRow;
  }

  render() {
    const { hero, league } = this.props;
    const sortedItemIdArr = LastItemStats.sortedItemIdArr(hero.lastitems);
    const outputRow = LastItemStats.outputRow(sortedItemIdArr, hero, league.item_dict);
    return (
      <div>
        <p>
          各アイテムに関して試合終了時に持っていた回数をpickされた回数で割ったものです
        </p>
        <div className="lastItemParent">
          <br />
          {outputRow}
        </div>
      </div>
    );
  }
}

LastItemStats.defaultProps = {
  league: {},
  hero: {},
};

LastItemStats.propTypes = {
  league: PropTypes.object,
  hero: PropTypes.object,
};

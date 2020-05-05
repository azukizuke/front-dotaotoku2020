import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class LastItemStats extends React.Component {
  static sortedItemIdArr(itemStats) {
    const itemIdArr = Object.entries(itemStats).sort((a, b) => b[1] - a[1]);
    return itemIdArr;
  }

  static outputRow(itemIdArr, hero) {
    const outputRow = itemIdArr.map(([itemId, count]) =>{
      const countPercent = parseInt((count / hero.pickbans.pick) * 100);
      return(
        <tr>
          <td>
            {itemId}
          </td>
          <td>
            {countPercent}%
          </td>
        </tr>
      );
    });
    return outputRow
  }

  render() {
    const { hero } = this.props;
    const sortedItemIdArr = LastItemStats.sortedItemIdArr(hero.lastitems);
    const outputRow = LastItemStats.outputRow(sortedItemIdArr, hero);
    return (
      <table>
        <thead>
          <tr>
            <th>item</th>
            <th>count / match</th>
          </tr>
        </thead>
        <tbody>
          {outputRow}
        </tbody>
      </table>
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

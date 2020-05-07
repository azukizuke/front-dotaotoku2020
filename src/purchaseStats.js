import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as images from './image';

export default class PurchaseStats extends React.Component {
  static sortedDict(dict) {
    return Object.entries(dict).sort((a, b) => b[1] - a[1]);
  }

  static outputItemRow(hero, league, arr) {
    return arr.map(([itemID, count]) => {
      const percent = parseInt((count / hero.pickbans.pick) * 100, 10);
      return (
        <td>
          <img
            src={images.default[league.item_dict[itemID].img]}
            alt={league.item_dict[itemID].name}
            className="purchaseStatsImage"
          />
          <br />
          {`${percent}%`}
        </td>
      );
    });
  }

  static outputRow(hero, league, purchaseStats) {
    return Object.entries(purchaseStats).map((dict) => {
      const order = dict[0];
      const purchaseDict = dict[1];
      const sortedDict = PurchaseStats.sortedDict(purchaseDict);
      const outputItemRow = PurchaseStats.outputItemRow(hero, league, sortedDict);
      return (
        <table>
          <tbody>
            <tr>
              <td>
                {`${Number(order) + 1}番目`}
              </td>
              {outputItemRow}
            </tr>
          </tbody>
        </table>
      );
    });
  }

  render() {
    const { hero, league } = this.props;
    const outputRow = PurchaseStats.outputRow(hero, league, hero.purchasestats);
    return (
      <div>
        <p>
          ノイズ多いのでずっと調整中です。
          <br />
          試合開始からN番目に購入するアイテムに関して収集し、多い物順に並べています
          <br />
          ただ、そのまま入れるとノイズ多すぎて崩壊するので、下記の条件を前提としています。手動調整はもうしない。めんどくさい。
          <ul>
            <li>・消耗品は除く(opendota db上のconsumable)</li>
            <li>・620円以下の合成ではないアイテムは除く(blinkだしたい)</li>
            <li>・0秒から前の購入品は除く</li>
          </ul>
          結局これでもノイズはやっぱりすごいので、ほんとに参考といった感じで。なんとなく左の列の順序が多いかな？くらいの。
        </p>
        {outputRow}
      </div>
    );
  }
}

PurchaseStats.defaultProps = {
  league: {},
  hero: {},
};

PurchaseStats.propTypes = {
  league: PropTypes.object,
  hero: PropTypes.object,
};

import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as images from './image';
import TalentStats from './talentStats';
import SkillStats from './skillStats';
import LastItemStats from './lastItemStats';
import StartItemStats from './startItemStats';
import NeutralItemStats from './neutralItemStats';
import PurchaseStats from './purchaseStats';
import CollapsibleMenu from './collapsiblemenu';

export default class Hero extends React.Component {
  static outHeroStats(hero) {
    const winPercent = parseInt((hero.win_stats / hero.pickbans.pick) * 100, 10);
    const winOutput = `${winPercent}%( ${hero.pickbans.pick}試合 ${hero.win_stats}勝 )`;
    const roleOutput = `${hero.pickbans.pos1}-${hero.pickbans.pos2}-${hero.pickbans.pos3}-${hero.pickbans.pos4}-${hero.pickbans.pos5}`;
    return (
      <div>
        <table className="leagueStats">
          <tbody>
            <tr>
              <td className="leagueStats">pick数</td>
              <td className="leagueStats">{hero.pickbans.pick}</td>
            </tr>
            <tr>
              <td className="leagueStats">ban数</td>
              <td className="leagueStats">{hero.pickbans.ban}</td>
            </tr>
            <tr>
              <td className="leagueStats">勝率</td>
              <td className="leagueStats">{winOutput}</td>
            </tr>
            <tr>
              <td className="leagueStats">各posPick数</td>
              <td className="leagueStats">{roleOutput}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.makeHeroPage = this.makeHeroPage.bind(this);
    this.makeOverLay = this.makeOverLay.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleClick() {
    const { onClickOverLay, isHeroPage } = this.props;
    const func = isHeroPage ? onClickOverLay : undefined();
    func();
  }

  handleKeyPress(e) {
    const { onClickOverLay, isHeroPage } = this.props;
    const func = isHeroPage ? onClickOverLay : undefined();
    if (e.which === 27) {
      func();
    }
  }

  makeHeroPage() {
    const { heroid, isHeroPage, league } = this.props;
    if (!isHeroPage) {
      return (null);
    }
    const hero = league.heroes[heroid];
    const display = isHeroPage ? 'block' : 'none';
    const zIndex = isHeroPage ? 100 : -100;
    return (
      <div
        onKeyDown={this.handleKeyPress}
        className="heropage"
        role="application"
        tabIndex="0"
        style={{
          display,
          zIndex,
        }}
      >
        <h2>{hero.localized_name}</h2>
        <img
          className="heropageImage"
          src={images.default[hero.imagefile]}
          alt={heroid}
          value={heroid}
        />
        {Hero.outHeroStats(hero)}
        <CollapsibleMenu title="スキル取得の分布" buttonClass="buttonMainBorder">
          <p>lv19くらいからちょっと表示が変ですがどうせタレントしかないし今はこうします。そのうち直します。</p>
          <SkillStats
            league={league}
            hero={hero}
          />
        </ CollapsibleMenu>
        <CollapsibleMenu title="タレント取得の分布" buttonClass="buttonMainBorder">
          <TalentStats
            league={league}
            heroid={heroid}
          />
        </ CollapsibleMenu>
        <CollapsibleMenu title="試合終了時アイテムの分布" buttonClass="buttonMainBorder">
          <LastItemStats
            league={league}
            hero={hero}
          />
        </ CollapsibleMenu>
        <CollapsibleMenu title="試合開始時アイテムの分布" buttonClass="buttonMainBorder">
          <StartItemStats
            league={league}
            hero={hero}
          />
        </ CollapsibleMenu>
        <CollapsibleMenu title="ニュートラルアイテムの分布" buttonClass="buttonMainBorder">
          <NeutralItemStats
            league={league}
            hero={hero}
          />
        </ CollapsibleMenu>
        <CollapsibleMenu title="買い物順の分布 ※ノイズ大きいので注意※" buttonClass="buttonMainBorder">
          <PurchaseStats
            league={league}
            hero={hero}
          />
        </ CollapsibleMenu>
      </div>
    );
  }

  makeOverLay() {
    const { isHeroPage } = this.props;
    const display = isHeroPage ? 'block' : 'none';
    const zIndex = isHeroPage ? 50 : -100;
    return (
      <div
        className="heroOverlay"
        role="application"
        style={{
          display,
          zIndex,
        }}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyPress}
        tabIndex="0"
      >
        <h2>test overlay</h2>
      </div>
    );
  }

  render() {
    const heropage = this.makeHeroPage();
    const overlay = this.makeOverLay();
    return (
      <div>
        {heropage}
        {overlay}
      </div>
    );
  }
}

Hero.defaultProps = {
  heroid: 1,
  league: -1,
  isHeroPage: false,
  onClickOverLay: undefined,
};

Hero.propTypes = {
  heroid: PropTypes.number,
  league: PropTypes.number,
  isHeroPage: PropTypes.bool,
  onClickOverLay: PropTypes.func,
};

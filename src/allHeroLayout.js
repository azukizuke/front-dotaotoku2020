import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as images from './image';

export default class AllHeroLayout extends React.Component {
  constructor(props) {
    super(props);
    this.outputRow = this.outputRow.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const { onClickHero } = this.props;
    onClickHero(e.target.alt);
  }

  outputRow(league) {
    return Object.entries(league.heroes).map((entry) => {
      const hero = entry[1];
      return (
        <div className="allHeroLayoutChild">
          <img
            src={images.default[hero.imagefile]}
            alt={hero.heroid}
            className="allHeroLayoutImage"
            onClick={this.handleClick}
          />
          <br />
          {hero.localized_name}
        </div>
      );
    });
  }

  render() {
    const { league } = this.props;
    const outputRow = this.outputRow(league);
    return (
      <div className="allHeroLayoutParent">
        {outputRow}
      </div>
    );
  }
}

AllHeroLayout.defaultProps = {
  league: {},
  onClickHero: undefined,
};

AllHeroLayout.propTypes = {
  league: PropTypes.object,
  onClickHero: PropTypes.func,
};

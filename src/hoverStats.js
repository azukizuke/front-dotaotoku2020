import React from 'react';
// eslint-disable-next-line
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';

export default class HoverStats extends React.Component {
  render() {
    const { isHover, hoverValue } = this.props;
    if (!isHover) {
      return null;
    }

    const e = hoverValue[0];
    const value = hoverValue[1];
    const margin = 5;

    return (
      <div
        className="hoverStats"
        style={{
          left: e.pageX + margin,
          top: e.pageY + margin,
        }}
      >
        {value}
      </div>
    );
  }
}

HoverStats.defaultProps = {
  isHover: false,
  hoverValue: [],
};

HoverStats.propTypes = {
  isHover: PropTypes.bool,
  hoverValue: PropTypes.array,
};

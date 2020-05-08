import React from 'react';
// eslint-disable-next-line
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class CollapsibleMenu extends React.Component {
  static outputTitle(isViewStatus, isCollapse, title) {
    if (isViewStatus) {
      if (isCollapse) {
        return `∨    ${title}`
      } else {
        return `∧    ${title}`
      }
    }
    return title;
  }

  constructor(props) {
    super(props);
    this.state = {
      isCollapse: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((state) => ({
      isCollapse: !state.isCollapse,
    }));
  }

  render() {
    let output;
    const { isCollapse } = this.state;
    const {
      title,
      children,
      buttonClass,
      isViewStatus,
    } = this.props;
    const outputTitle = CollapsibleMenu.outputTitle(isViewStatus, isCollapse, title)

    if (isCollapse) {
      output = null;
    } else {
      output = children;
    }

    return (
      <div>
        <button
          type="button"
          onClick={this.handleClick}
          className={buttonClass}
        >
          {outputTitle}
        </button>
        {output}
      </div>
    );
  }
}

CollapsibleMenu.defaultProps = {
  children: 'none',
  title: 'none',
  isViewStatus: true,
  buttonClass: 'defaultButton',
};

CollapsibleMenu.propTypes = {
  children: PropTypes.node,
  title: PropTypes.number,
  isViewStatus: PropTypes.bool,
  buttonClass: PropTypes.string,
};

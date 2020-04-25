import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class CollapsibleMenu extends React.Component {
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
    const { title, children, buttonClass } = this.props;
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
          {title}
        </button>
        {output}
      </div>
    );
  }
}

CollapsibleMenu.defaultProps = {
  children: 'none',
  title: 'none',
  buttonClass: 'defaultButton',
};

CollapsibleMenu.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  buttonClass: PropTypes.string,
};

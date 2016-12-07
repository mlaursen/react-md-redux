import React, { PureComponent, PropTypes } from 'react';

export default class Home extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return <h1 className="md-text-container">Hello, World!</h1>;
  }
}

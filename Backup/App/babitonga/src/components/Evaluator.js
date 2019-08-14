import React from 'react';

export default class Evaluator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {busy: true};

    console.log(props);
    props.task.evaluate(value => {
      this.setState({
        busy: false,
        result: value
      });
    })
  }

  render() {
    const View = this.props.view;

    if (this.state.busy) {
      return <span>Computando...</span>
    } else {
      return <View result={this.state.result}/>;
    }
  }
}

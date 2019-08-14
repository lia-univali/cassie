import React from 'react';

export default class Evaluator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {busy: true};

    props.task.evaluate(value => {
      this.setState({
        busy: false,
        result: value
      });

      if (props.onComplete) props.onComplete();
    })
  }

  render() {
    const { formatter = v => v } = this.props;

    if (this.state.busy) {
      return <span>Computando...</span>;
    } else {
      return <span>{formatter(this.state.result)}</span>;
    }
  }
}

import React from 'react';
import {console} from 'react-native-console-view';
import {Button} from 'react-native';

export default class Test extends React.PureComponent {
  constructor(props) {
    super();
  }

  componentDidMount() {
    console.log('asdasdasdasdasd', this.props)
  }

  render() {
    console.log('Тут будет вывод какой нить инфы', this.props)
    return (
      <Button title={'asdasdasdasd'} onPress={() => console.log('asdasdasdasdasdasd')} />
    );
  }
}

import React from 'react'
import { ImageBackground, StatusBar, View, FlatList, Text, SafeAreaView, ActivityIndicator } from 'react-native'
import { user } from '../../redux/actions/userActions'
import { connect } from 'react-redux'
import { Body, Header, Left, Title, Button, Icon, ListItem } from 'native-base'

const bg = require('../../images/bg.png')

const historyData = [
  {
    id: 1,
    summ: '+1000',
    type: 'Зачисление на счет',
    date: '2020-03-01 10:00:00',
    fin: 'Внесено наличными'
  },
  {
    id: 2,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 3,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 4,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 5,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 6,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 7,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 8,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 9,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 10,
    summ: '+1000',
    type: 'Зачисление на счет',
    date: '2020-03-01 10:00:00',
    fin: 'Внесено наличными'
  },
  {
    id: 11,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 12,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 13,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 14,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 15,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 16,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 17,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  },
  {
    id: 18,
    summ: '-500',
    type: 'Вывод со счета',
    date: '2020-02-28 11:00:00',
    fin: 'Перевод в Citibank'
  }
]

class History extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      history: []
    }

    this.initData = () => {
      // TODO Запрашиваем данные из базы
      this.setState({ history: historyData, isLoading: false })
    }
  }

  componentDidMount = async () => {
    this.initData()
  }

  renderItem(item) {
    return (
      <ListItem last key={item.item.id.toString()} onPress={() => {}} style={{ backgroundColor: '#fff' }}>
        <View style={{ width: 60, alignSelf: 'flex-start' }}>
          <Text style={{ color: item.item.summ.indexOf('-') ? 'green' : 'red', fontWeight: 'bold' }}>{item.item.summ}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold' }}>{item.item.type}</Text>
          <Text>{item.item.date}</Text>
          <Text>{item.item.fin}</Text>
        </View>
      </ListItem>
    )
  }

  keyExtractor = (item, index) => item.id.toString()

  renderFlatList() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList data={this.state.history} renderItem={this.renderItem} keyExtractor={this.keyExtractor} />
      </SafeAreaView>
    )
  }

  renderIndicator() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
        <ActivityIndicator color={'#fff'} size={'large'} />
      </View>
    )
  }

  renderBodyScreen() {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f141c' }}>
        <ImageBackground source={bg} style={{ flex: 1 }} resizeMode={'stretch'}>
          <Header style={{ backgroundColor: 'transparent' }}>
            <Left />
            <Body style={{ flex: 4, alignItems: 'flex-end' }}>
              <Title style={{ color: '#fff' }}>Мои транзакции</Title>
            </Body>
          </Header>
          <StatusBar barStyle="light-content" />
          {this.state.isLoading ? this.renderIndicator() : this.renderFlatList()}
        </ImageBackground>
      </View>
    )
  }

  render() {
    return this.renderBodyScreen()
  }
}

const mapStateToProps = state => {
  return {
    userData: state.userReducer.userData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    reduxUser: userData => dispatch(user(userData))
  }
}

// Exports
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(History)

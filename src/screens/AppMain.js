import React from 'react'
import { Text, View, Animated, TouchableOpacity, Dimensions, StatusBar, ImageBackground, AppState } from 'react-native'
import { connect } from 'react-redux'
import { user } from '../../redux/actions/userActions'
import { Header, Left, Body, Title, Button } from 'native-base'
import { Icon } from 'react-native-elements'
import MaterialAnimatedView from './MaterialAnimatedView'
import { ThemeUtils, Color } from '../utils'
import styles from '../styles/style'
import { BarChart } from 'react-native-chart-kit'
import { t } from '../utils/i18n'

const bg = require('../../images/bg.png')

const historyData = [
  {
    id: 0,
    title: 'МОИ ДОХОДЫ'
  },
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

class AppMain extends React.PureComponent {
  constructor(props, content) {
    super(props, content)

    this.state = {
      scrollY: new Animated.Value(0)
    }

    this._getHeaderBackgroundColor = () => {
      const { scrollY } = this.state

      return scrollY.interpolate({
        inputRange: [0, 140],
        outputRange: ['rgba(0,0,0,0.0)', Color.HEADER_COLOR],
        extrapolate: 'clamp',
        useNativeDriver: true
      })
    }

    this._getNormalTitleOpacity = () => {
      const { scrollY } = this.state

      return scrollY.interpolate({
        inputRange: [0, 20, 50],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
        useNativeDriver: true
      })
    }

    this._getListViewTopPosition = () => {
      const { scrollY } = this.state

      return scrollY.interpolate({
        inputRange: [0, 250],
        outputRange: [ThemeUtils.relativeWidth(90) - ThemeUtils.APPBAR_HEIGHT - 10, 0],
        extrapolate: 'clamp',
        useNativeDriver: true
      })
    }

    //For header image opacity
    this._getHeaderImageOpacity = () => {
      const { scrollY } = this.state

      return scrollY.interpolate({
        inputRange: [0, 140],
        outputRange: [1, 0],
        extrapolate: 'clamp',
        useNativeDriver: true
      })
    }

    this._getHeaderTitleOpacity = () => {
      const { scrollY } = this.state

      return scrollY.interpolate({
        inputRange: [0, 140],
        outputRange: [0, 1],
        extrapolate: 'clamp',
        useNativeDriver: true
      })
    }

    this._getZIndexOpacity = () => {
      const { scrollY } = this.state

      return scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 100]
      })
    }

    this.renderArtistCard = (index, item) => {
      if (index === 0) {
        return (
          <MaterialAnimatedView key={index.toString()} index={index}>
            <View style={styles.cardTopContainer}>
              <View style={{ paddingTop: 8, paddingLeft: 10 }}>
                <Icon name={'equalizer'} color={'#a5a5a5'} />
              </View>
              <View style={{ flex: 6, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'rgb(70,103,109)', fontSize: 16, fontWeight: 'bold' }}>{t('myincome')}</Text>
              </View>
              <View style={{ paddingTop: 8, paddingRight: 10 }}>
                <Icon name={'search'} color={'#a5a5a5'} />
              </View>
            </View>
          </MaterialAnimatedView>
        )
      } else {
        return (
          <MaterialAnimatedView key={index.toString()} index={index}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                backgroundColor: '#f5f5f5',
                elevation: 5,
                shadowRadius: 3,
                shadowOffset: {
                  width: 3,
                  height: 3
                },
                padding: 15,
                // marginVertical: ThemeUtils.relativeWidth(1),
                // marginHorizontal: ThemeUtils.relativeWidth(2),
                flexDirection: 'row',
                // alignItems: 'center'
                borderBottomWidth: 1,
                borderBottomColor: '#e6e6e6'
              }}
              onPress={() => {}}
            >
              <View style={styles.rowDataLeft}>
                <Text style={{ fontWeight: 'bold' }}>{'Январь'}</Text>
              </View>
              <View style={styles.rowDataRight}>
                <Text style={{ color: item.summ.indexOf('-') ? 'green' : 'red', fontWeight: 'bold' }}>{item.summ}</Text>
              </View>
            </TouchableOpacity>
          </MaterialAnimatedView>
        )
      }
    }
  }

  componentDidMount = async () => {}

  render() {
    const headerBackgroundColor = this._getHeaderBackgroundColor()
    const normalTitleOpacity = this._getNormalTitleOpacity()
    const listViewTop = this._getListViewTopPosition()
    const headerTitleOpacity = this._getHeaderTitleOpacity()
    const headerImageOpacity = this._getHeaderImageOpacity()
    const zIndexOpacity = this._getZIndexOpacity()
    const { last_name, first_name, middle_name } = this.props.userData
    const { apple, android, facebook } = this.props.userData
    let name = last_name ? first_name + ' ' + last_name : ''

    if (!name && android) {
      name = android.user.name
    }

    if (!name && apple) {
      name = apple.appleAuthRequestResponse.fullName.givenName + ' ' + apple.appleAuthRequestResponse.fullName.familyName
    }

    if (!name && facebook) {
      name = facebook.user.name
    }

    const data = {
      labels: ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Авг'],
      datasets: [
        {
          data: [60, 65, 68, 70, 75, 83, 80],
          colors: [(opacity = 1) => 'red', (opacity = 1) => '#ff00ff', (opacity = 1) => `rgba(255, 0, 50, ${opacity})`]
        }
      ]
    }

    const chartConfig = {
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
      backgroundGradientFrom: '#1E2923',
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: '#08130D',
      backgroundGradientToOpacity: 0.5,
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16,
        backgroundColor: 'transparent'
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#ffa726'
      },
      data: data.datasets
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#0f141c' }}>
        <ImageBackground source={bg} style={{ flex: 1 }} resizeMode={'stretch'}>
          <Header style={{ backgroundColor: 'transparent' }}>
            <Left />
            <Body style={{ flex: 6, alignItems: 'flex-end' }}>
              <Title style={{ color: '#fff' }}>{name}</Title>
            </Body>
          </Header>
          <StatusBar barStyle="light-content" />
          <View style={{ flex: 1 }}>
            <View style={{ paddingLeft: 30, paddingTop: 10, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 38, fontWeight: 'bold', color: '#fff' }}>$1234</Text>
                <Text style={{ paddingTop: 17, color: '#fff', fontSize: 20 }}>.00</Text>
              </View>
              <Text style={{ color: '#fff', fontSize: 20 }}>{t('bonus')} $200</Text>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  paddingRight: 10,
                  marginTop: ThemeUtils.relativeHeight(2)
                }}
              >
                <Button
                  vertical
                  style={{ width: 100, backgroundColor: 'transparent' }}
                  onPress={() => this.props.navigation.navigate('Calc')}
                >
                  <Icon name="assessment" color="#ffe500" />
                  <Text style={{ color: '#ffe500' }}>{t('calc1')}</Text>
                  <Text style={{ color: '#ffe500' }}>{t('calc2')}</Text>
                </Button>
                <Button
                  vertical
                  style={{ width: 100, backgroundColor: 'transparent' }}
                  onPress={() => this.props.navigation.navigate('Payment')}
                >
                  <Icon name="payment" color="#ffe500" />
                  <Text style={{ color: '#ffe500' }}>{t('put1')}</Text>
                  <Text style={{ color: '#ffe500' }}>{t('put2')}</Text>
                </Button>
                <Button
                  vertical
                  style={{ width: 100, backgroundColor: 'transparent' }}
                  onPress={() => this.props.navigation.navigate('Exit')}
                >
                  <Icon name="exit-to-app" color="#ffe500" />
                  <Text style={{ color: '#ffe500' }}>{t('exit1')}</Text>
                  <Text style={{ color: '#ffe500' }}>{t('exit2')}</Text>
                </Button>
              </View>
            </View>
            <Animated.View
              style={{ marginTop: ThemeUtils.relativeHeight(20), position: 'absolute', opacity: headerImageOpacity, zIndex: 10 }}
            >
              <View style={{ marginTop: ThemeUtils.relativeHeight(5), paddingLeft: 10 }}>
                <BarChart
                  data={data}
                  width={Dimensions.get('window').width - 20} // from react-native
                  height={200}
                  yAxisLabel="$"
                  yAxisSuffix="k"
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={chartConfig}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    backgroundColor: 'transparent'
                  }}
                />
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>{t('income')}</Text>
                </View>
              </View>
            </Animated.View>
            <Animated.ScrollView
              overScrollMode={'never'}
              style={{ flex: 1, zIndex: zIndexOpacity }}
              scrollEventThrottle={5}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }])}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      translateY: listViewTop
                    }
                  ]
                }}
              >
                {historyData.map((item, index) => this.renderArtistCard(index, item))}
              </Animated.View>
            </Animated.ScrollView>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userReducer.userData
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    reduxUser: (userData) => dispatch(user(userData))
  }
}

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(AppMain)

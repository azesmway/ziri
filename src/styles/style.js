import { StyleSheet } from 'react-native'
import { ThemeUtils, Color } from '../utils'

const HEADER_IMAGE_HEIGHT = ThemeUtils.relativeHeight(30)
export default StyleSheet.create({
  container: {
    flex: 1
  },
  /*header style*/
  headerLeftIcon: {
    position: 'absolute',
    left: ThemeUtils.relativeWidth(2)
  },
  headerRightIcon: {
    position: 'absolute',
    right: ThemeUtils.relativeWidth(2)
  },
  headerStyle: {
    height: ThemeUtils.APPBAR_HEIGHT,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    fontSize: ThemeUtils.fontLarge,
    fontWeight: 'bold'
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: ThemeUtils.fontNormal
  },
  headerSubTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: ThemeUtils.fontXSmall
  },
  /*Top Image Style*/
  headerImageStyle: {
    height: HEADER_IMAGE_HEIGHT,
    width: '100%',
    top: 0,
    alignSelf: 'center',
    position: 'absolute'
  },
  /*profile image style*/
  profileImage: {
    position: 'absolute',
    zIndex: 100
  },
  /*profile title style*/
  profileTitle: {
    position: 'absolute',
    zIndex: 100,
    textAlign: 'center',
    color: Color.BLACK,
    top: ThemeUtils.relativeHeight(35),
    left: 0,
    right: 0,
    fontSize: ThemeUtils.fontXLarge
  },
  /*song count text style*/
  songCountStyle: {
    position: 'absolute',
    textAlign: 'center',
    fontWeight: '400',
    top: ThemeUtils.relativeHeight(40),
    left: 0,
    right: 0,
    fontSize: ThemeUtils.fontNormal
  },
  artistCardContainerStyle: {
    backgroundColor: Color.CARD_BG_COLOR,
    elevation: 5,
    shadowRadius: 3,
    shadowOffset: {
      width: 3,
      height: 3
    },
    padding: 15,
    marginVertical: ThemeUtils.relativeWidth(1),
    marginHorizontal: ThemeUtils.relativeWidth(2),
    flexDirection: 'row',
    alignItems: 'center'
  },
  artistImage: {
    height: ThemeUtils.relativeWidth(15),
    width: ThemeUtils.relativeWidth(15),
    borderRadius: ThemeUtils.relativeWidth(7.5)
  },
  songTitleStyle: {
    fontSize: ThemeUtils.fontNormal,
    color: Color.BLACK
  },
  cardTextContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb'
  },
  cardTopContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  rowDataLeft: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 20
  },
  rowDataRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 20
  }
})

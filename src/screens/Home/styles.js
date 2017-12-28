const React = require("react-native");
const { Dimensions, Platform } = React;

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default {
  containerBanner: {
    width: 700,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    width: null,
    height: null
  },
  newsPoster: {
    height: deviceHeight / 4 + 20,
    width: deviceWidth,
    position: "relative",
    resizeMode:"cover"
  },
  ioschannelHeader: {
    fontSize: 20,
    fontWeight: "900",
    alignSelf: "center",
    padding: 20,
    paddingTop: 30
  },
  achannelHeader: {
    fontSize: 20,
    fontWeight: "900",
    alignSelf: "center",
    padding: 20,
    marginTop: 10,
    textAlign: "center"
  },
  followBtn: {
    alignSelf: "center",
    backgroundColor: "#fff"
  },
  noOfFollowers: {
    fontSize: 12,
    fontWeight: "900",
    alignSelf: "center",
    textAlign: "center",
    padding: 20,
    paddingTop: 10,
    marginTop: 10
  },
  newsContentWrap: {
    flexDirection: "column",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  newsHeader: {
    color: "#444",
    fontWeight: "bold"
  },
  newsContent: {
    paddingTop: 20,
    paddingBottom: 20
  },
  newsLink: {
    color: Platform.OS === "android" ? "#777" : "#666",
    fontSize: 12,
    alignSelf: "flex-start",
    fontWeight: "bold"
  },
  timeIcon: {
    fontSize: 20,
    paddingRight: 10,
    color: "#666",
    marginLeft: Platform.OS === "android" ? 15 : 0,
    paddingLeft: Platform.OS === "android" ? 15 : 20,
    marginTop: Platform.OS === "android" ? -1 : -3
  },
  imageHeader: {
    height: 25,
    width: 95,
    resizeMode: "contain"
  },
  trending:{
    color: "#444",
    fontWeight: "bold",
    margin:20,
    alignSelf: "flex-start",
  },
  more:{
    color: "#01cca1",
    fontWeight: "bold",
    margin:20,
  },
  trendingMoreE:{
    flex: 1, flexDirection: 'row',
    color: "#444",
    fontWeight: "bold",
    //alignSelf: "flex-end",
    justifyContent: 'flex-end'
    },
  horizontalContainer:{
    margin:20,
    width: 250,
    height: 150,
    backgroundColor: '#12a19e' 
  },
  viewtext:{
    fontSize: 17,
    fontWeight: "900",
    marginLeft: 20,
    marginTop: deviceHeight / 4 -45
  },
  Carousal:{
    width:deviceWidth,
    height:deviceHeight / 4
  },
  channelImg: {
    height: deviceHeight / 4 + 10,
    width: deviceWidth / 2 + 2,
    margin:10
  },
  ioschannelImgText: {
    fontSize: 12,
    fontWeight: "900",
    padding: 20,
    paddingLeft: 10,
    paddingBottom: 0,
    marginBottom: 0,
    marginLeft: 20,
    marginTop: deviceHeight / 6 + 10
  },
  achannelImgText: {
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 10,
    marginTop: deviceHeight / 4 - 25
  },
  text:{
    color:'black',
    marginTop:130
  },
  GAcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  sendEventTest: {
    color: 'blue',
    fontSize: 16,
    textAlign: 'center'
  }
};

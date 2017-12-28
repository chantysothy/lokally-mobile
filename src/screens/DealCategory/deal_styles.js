const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default {
  channelImg: {
    height: deviceHeight / 4 + 10,
    width: deviceWidth / 2 + 2,
  },
  ioschannelImgText: {
    fontSize: 12,
    fontWeight: "900",
    padding: 20,
    paddingLeft: 0,
    paddingBottom: 0,
    marginBottom: 0,
    marginLeft: 20,
    marginTop: deviceHeight / 6 + 10
  },
  achannelImgText: {
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 20,
    marginTop: deviceHeight / 4 - 20,
    color:'#000000'
  },
  item: {
    flex: 1,
    height: 170,
  },
  list: {
    flex: 1
  }
};

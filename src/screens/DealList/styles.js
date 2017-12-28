const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  container: {
    flex: 1,
    width: null,
    height: null
  },
  newsPoster: {
    height: deviceHeight / 4 + 20,
    width: null,
    position: "relative"
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
  card: {
    backgroundColor: "#fff",
    marginTop: null,
    marginBottom: null,
    marginLeft: null,
    marginRight: null
  },
  cardHeader: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    paddingBottom: 0
  },
  cardItem: {
    backgroundColor: "transparent",
    paddingTop: 5
  },
  commentName: {
    fontSize: deviceWidth < 330 ? 15 : 15,
    paddingLeft:10,
    marginRight:70,
    color: "#444",
    fontWeight: "bold"
  }
};

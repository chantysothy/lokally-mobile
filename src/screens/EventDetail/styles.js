const React = require("react-native");
const { Dimensions, Platform } = React;
const primary = require("../../theme/variables/commonColor").brandPrimary;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  container: {
    flex: 1,
    width: null,
    height: null
  },
  newsContent: {
    flexDirection: "column",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  newsHeader: {
    color: "#222",
    fontWeight: "500",
    fontSize: 14
  },
  newsCommentContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 15,
    borderLeftWidth: 2,
    borderLeftColor: primary
  },
  newsComment: {
    color: primary,
    fontWeight: "500",
    fontSize: 14
  },
  newsLink: {
    color: Platform.OS === "android" ? "#777" : "#666",
    fontSize: 12,
    alignSelf: "flex-start",
    fontWeight: "bold"
  },
  eventAddress:{
    color: Platform.OS === "android" ? "#777" : "#666",
    fontSize: 15,
    alignSelf: "flex-start",
    fontWeight: "bold"
  },
  newsTypeView: {
    borderBottomWidth: 1,
    borderBottomColor: Platform.OS === "android" ? "#777" : "#666",
    alignSelf: "flex-end"
  },
  newsTypeText: {
    color: Platform.OS === "android" ? "#777" : "#666",
    fontSize: 12,
    fontWeight: "bold",
    paddingBottom: 2
  },
  newsPoster: {
    width: null,
    flex: 1,
    height: deviceHeight / 2.4,
    resizeMode:"cover"
  },
  newsPosterHeader: {
    fontWeight: "900"
  },
  newsPosterContent: {
    marginTop: deviceHeight / 3,
    flexDirection: "column",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1
  },
  timeIcon: {
    fontSize: 20,
    marginLeft: Platform.OS === "android" ? 15 : 0,
    paddingLeft: Platform.OS === "android" ? 0 : 20,
    paddingRight: 5,
    marginTop: Platform.OS === "android" ? -1 : -3,
    color: "#666"
  },
  headerStyle: {
    paddingLeft: 0,
    paddingRight: 0
  },
  headerIcons: {
    fontSize: 30,
    backgroundColor: "transparent"
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -5,
    marginLeft: Platform.OS === "android" ? -5 : undefined
  },
  headerBtns: {
    padding: 10
  },
  headerTextIcon: {
    fontSize: 28,
    paddingTop: 10,
    marginTop: Platform.OS === "android" ? -10 : 0
  },
  mapContainer: {
    //...StyleSheet.absoluteFillObject,
    height: 200,
    width: deviceWidth-20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    top: 0,
    left: 10,
    right: 0,
    bottom: 0,
    marginBottom:10
  },
  map: {
    //...StyleSheet.absoluteFillObject,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  htmlContent:{
    fontSize:30,
    color:'black'
  },
  commentBox: {
    backgroundColor: "#EEE",
    alignItems: "center",
    paddingLeft: 10
  },
  attachIconContainer: {
    padding: 10
  },
  attachIcon: {
    color: "#797979",
    fontSize: 27
  },
  input: {
    color: "#222",
    alignSelf: "center"
  }
};

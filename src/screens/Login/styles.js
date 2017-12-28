const React = require("react-native");
const { Dimensions, Platform } = React;
const commonColor = require("../../theme/variables/commonColor");

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  background: {
    flex: 1,
    width: null,
    height: deviceHeight,
    backgroundColor: "transparent"  //"rgba(0,0,0,0.1)"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent:'center'
  },
  logo: {
    resizeMode: "contain",
    height: deviceHeight / 8,
    alignSelf: "center",
  },
  form: {
    flex: 1,
    marginTop:15,
    paddingLeft: 20,
    paddingRight: 20
  },
  formErrorIcon: {
    color: "#fff",
    marginTop: 5,
    right: 10
  },
  formErrorText1: {
    fontSize: Platform.OS === "android" ? 12 : 15,
    color: commonColor.brandDanger,
    textAlign: "right",
    top: -10
  },
  formErrorText2: {
    fontSize: Platform.OS === "android" ? 12 : 15,
    color: "transparent",
    textAlign: "right",
    top: -10
  },
  loginBtn: {
    marginTop: 7,
    height: 50
  },
  otherLinksContainer: {
    paddingTop: deviceHeight < 600 ? 5 : Platform.OS === "android" ? 10 : 15,
    flexDirection: "row"
  },
  helpBtns: {
    opacity: 0.9,
    fontWeight: "bold",
    color: "#fff",
    fontSize: Platform.OS === "android" ? 12 : 12
  },
  inputGrp: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.3)",
    marginBottom: 8,
    borderWidth: 0,
    borderColor: "transparent"
  },
  input: {
    paddingLeft: 10,
    color: "#fff"
  },
  skipBtn: {
    alignSelf: "flex-end",
    marginTop: 10,
    borderWidth: 0.3,
    borderColor: "#FFF",
    position: "absolute",
    bottom: 15,
    right: 0
  },
  app_name:{
    paddingTop: deviceHeight/3,
    alignSelf:'center',
    justifyContent:'center',
    fontSize: deviceWidth > 400 ? 20 : 30,
    fontWeight:'bold',
  },
  app_name_suffix:{
    color:'white',
    fontSize: 10,
    lineHeight: deviceWidth > 400 ? 14 : 20
  }
};

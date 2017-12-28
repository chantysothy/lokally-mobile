import { bindActionCreators } from "redux";
import { configDetails,authenticate,loginAction,loginSuccess } from "./../../actions";
import { connect } from "react-redux";
import Login from "./login.js";

const mapStateToProps = state => {
  return {
    config: state.config.config,
    acessToken : state.login.acessTokenValue,
    login: state.login.loginData,
    register: state.login.registerData,
    };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ configDetails: configDetails,authenticate:authenticate,loginAction:loginAction,loginSuccess:loginSuccess }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
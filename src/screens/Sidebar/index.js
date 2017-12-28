import { bindActionCreators } from "redux";
import { configDetails,getUser,logOutUser,tokenRenual} from "./../../actions";
import { connect } from "react-redux";
import SideBar from "./slidebar.js";

const mapStateToProps = state => {
  return {
    config: state.config.config,
    login: state.login.loginData,
    profile: state.login.userData,
    error:state.config.tokenError,
    token:state.config.token
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ configDetails: configDetails,tokenRenual:tokenRenual,getUser:getUser,logOutUser:logOutUser }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);

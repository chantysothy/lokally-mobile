import { bindActionCreators } from "redux";
import {  getAllTag,userregister } from "./../../actions";
import { connect } from "react-redux";
import Registration from "./registration.js";

const mapStateToProps = state => {
  return {
    register: state.login.userData,
    registerStatus:state.login.registerData,
    tagData:state.login.tags
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getAllTag:getAllTag,userregister:userregister}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
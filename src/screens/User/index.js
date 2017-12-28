import { bindActionCreators } from "redux";
import {  updateUserValue ,getAllTag,tokenRenual} from "./../../actions";
import { connect } from "react-redux";
import UpdateUser from './UpdateUser'

const mapStateToProps = state => {
  return {
    userProfileStatus:state.login.userUpdatedData,
    tagData:state.login.tags,
    error:state.config.tokenError,
    token:state.config.token
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getAllTag:getAllTag,updateUserValue:updateUserValue,tokenRenual:tokenRenual}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUser);
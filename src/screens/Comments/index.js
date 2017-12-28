import { bindActionCreators } from "redux";
import { getAllEventsCategories } from "./../../actions";
import { connect } from "react-redux";
import Comments from "./comments";
import { getUser,tokenRenual,userComments,getComments } from "../../actions";

const mapStateToProps = state => {
  return {
    error:state.config.tokenError,
    token:state.config.token,
    comment:state.common.comments,
    commentData:state.common.commentData,
    totalData:state.common.totalComment
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getComments:getComments,userComments:userComments,getUser:getUser,tokenRenual:tokenRenual}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);

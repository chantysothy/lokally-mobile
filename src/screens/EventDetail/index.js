import { bindActionCreators } from "redux";
import { getAllEventsCategories } from "./../../actions";
import { connect } from "react-redux";
import EventDetail from "./eventDetail";
import { userLike,getUser,tokenRenual } from "../../actions";

const mapStateToProps = state => {
  return {
    error:state.config.tokenError,
    token:state.config.token,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ userLike:userLike,getUser:getUser,tokenRenual:tokenRenual}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetail);

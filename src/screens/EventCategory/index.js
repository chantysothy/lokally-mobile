import { bindActionCreators } from "redux";
import { getAllEventsCategories } from "./../../actions";
import { connect } from "react-redux";
import EventCategoryPage from "./eventsCategory.js";

const mapStateToProps = state => {
  return {
    eventsCategory: state.event.eventsCategory
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getAllEventsCategories: getAllEventsCategories }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EventCategoryPage);

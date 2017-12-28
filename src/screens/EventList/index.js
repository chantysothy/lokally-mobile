import { bindActionCreators } from "redux";
import { getAllEvents } from "./../../actions";
import { connect } from "react-redux";
import EventList from "./eventList.js";

const mapStateToProps = state => {
  return {
    listOfEvents: state.event.events,
    totalData:state.event.eventsCount
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getAllEvents: getAllEvents }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
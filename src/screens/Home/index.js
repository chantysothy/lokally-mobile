import { bindActionCreators } from "redux";
import {getAllDealTtrend,getAllEventsTrend,getAllNewsTrend} from "./../../actions";
import { connect } from "react-redux";
import Home from "./Home.js";

const mapStateToProps = state => {
  return {
    Events: state.event.EventTrend,
    News: state.news.NewsTrend,
    Deal: state.deal.dealTrend,
    config: state.config.config,
    userProfile : state.login.userData,
    cookie : state.login.cookie
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({getAllEventsTrend:getAllEventsTrend,getAllDealTtrend:getAllDealTtrend,getAllNewsTrend:getAllNewsTrend}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
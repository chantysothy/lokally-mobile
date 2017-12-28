import { bindActionCreators } from "redux";
import { getAllDeal } from "./../../actions";
import { connect } from "react-redux";
import DealList from "./dealList.js";

const mapStateToProps = state => {
  return {
    deals: state.deal.deal,
    totalData:state.deal.dealCount
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getAllDeal: getAllDeal }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DealList);
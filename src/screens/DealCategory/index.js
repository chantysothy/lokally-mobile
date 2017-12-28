import { bindActionCreators } from "redux";
import { getAllDealCategories } from "./../../actions";
import { connect } from "react-redux";
import DealCategoryPage from "./dealCategory.js";

const mapStateToProps = state => {
  return {
    dealCategory: state.deal.dealCategory
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getAllDealCategories: getAllDealCategories }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DealCategoryPage);

import { bindActionCreators } from "redux";
import { getAllNewsCategories } from "./../../actions";
import { connect } from "react-redux";
import NewsCategoryPage from "./newsCategory.js";

const mapStateToProps = state => {
  return {
    newsCategory: state.news.newsCategory
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getAllNewsCategories: getAllNewsCategories }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsCategoryPage);


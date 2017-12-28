import { bindActionCreators } from "redux";
import { getAllNews } from "./../../actions";
import { connect } from "react-redux";
import NewsList from "./newsList.js";

const mapStateToProps = state => {
  return {
    News: state.news.news,
    totalData:state.news.newsCount
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getAllNews: getAllNews }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsList);
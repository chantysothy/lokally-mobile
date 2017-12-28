import React from "react";
import { StackNavigator, DrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import Login from "./screens/Login/";
import Sidebar from "./screens/Sidebar";

import Profile from "./screens/Profile/";
import Settings from "./screens/Settings";

import EventCategoryPage from "./screens/EventCategory/";
import EventList from "./screens/EventList";
import EventDetail from "./screens/EventDetail";

import NewsCategoryPage from "./screens/NewsCategory/";
import NewsList from "./screens/NewsList";
import NewsDetail from "./screens/NewsDetail";

import DealCategoryPage from "./screens/DealCategory/";
import DealList from "./screens/DealList";
import DealDetail from "./screens/DealDetail";
import Comments from "./screens/Comments"
import Home from "./screens/Home";
import Registration from "./screens/Registration"; 
import UpdateUser from "./screens/User";
import SearchContainer from "./screens/Search";
import ImageZoomRender from './screens/imageZoom';

const Drawer = DrawerNavigator(
  {
    Home:{screen:Home},
    EventCategoryPage : { screen: EventCategoryPage },
    NewsCategoryPage : {screen:NewsCategoryPage},
    DealCategoryPage:{screen:DealCategoryPage},
    Profile: { screen: Profile },
    Settings: { screen: Settings }
  },
  {
    initialRouteName: "Home",
    contentComponent: props => <Sidebar {...props} />
  }
);

const App = StackNavigator(
  {
    Login: { screen: Login },
    EventList:{screen:EventList},
    EventDetail:{screen:EventDetail},
    NewsList:{screen:NewsList},
    NewsDetail:{screen:NewsDetail},
    DealList:{screen:DealList},
    DealDetail:{screen:DealDetail},
    Registration:{screen:Registration},
    Drawer: { screen: Drawer },
    Comments:{screen:Comments},
    UpdateUser:{screen:UpdateUser},
    SearchContainer:{screen:SearchContainer},
    ImageZoomRender:{screen:ImageZoomRender}
  },
  {
    index: 0,
    initialRouteName: "Login",
    initialRouteParams: prop => this.props.configJSON,
    headerMode: "none"
  }
);

export default () =>
  <Root>
    <App />
  </Root>;

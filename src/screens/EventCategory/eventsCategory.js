import React, { Component } from "react";
import {Dimension,Container,Header,Left, Right, Body, Button, Icon, Content, Text, Title,Spinner, Card, CardItem, Item, Thumbnail, Form, Label, Input} from "native-base";
import {Image, View, ScrollView, Dimensions, Alert, TouchableOpacity, Platform} from "react-native";
import styles from "./category_styles.js";
import Grid from 'react-native-grid-component';
import SearchBar from 'react-native-searchbar'; 
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const orientation = (deviceWidth > deviceHeight) ? 'LANDSCAPE' : 'PORTRAIT';
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
import Orientation from 'react-native-orientation';

export default class EventCategoryPage extends Component {
  constructor(props) {
    super(props);
    tracker.trackScreenView('Event Category');    
    this.state = {
      fetched: true,
      eventsCategory: [],
      results:''
    };
    this._handleResults = this._handleResults.bind(this);
  }

  componentWillMount() {
  Orientation.lockToPortrait();
   this.props.getAllEventsCategories().then(data => {
      this.setState({
        eventsCategory:this.props.eventsCategory,
        fetched: true
      });
    });
  }
  _handleResults(results) {
    this.setState({ results });
  }

  _renderItem = (data, i) => 
          <View  style={[styles.item]} key={i}>
             <TouchableOpacity
                  onPress={() =>
                    {
                      tracker.trackEvent('Event',data.name);
                      this.props.navigation.navigate("EventList", {tagName:data.name,banner:data.tag_images ? data.tag_images[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrHY5zywHTlDyhezSmEXnF7aan7ezaIh62ElV56Jqre-kXaIoHZw"})}
                    }>
                <Image
                  source={{uri:data.tag_images ? data.tag_images[0] :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrHY5zywHTlDyhezSmEXnF7aan7ezaIh62ElV56Jqre-kXaIoHZw"}}
                  style={styles.channelImg}
                >
                <Text
                    style={
                      Platform.OS === "android"
                        ? styles.achannelImgText
                        : styles.ioschannelImgText
                    }
                  >
                    {data.name} 
                  </Text>
                </Image>
              </TouchableOpacity>
          </View>

    events(){
      return <Grid
          style={styles.list}
          renderItem={this._renderItem}
          data={this.state.eventsCategory}
          itemsPerRow={2} />
    }

    render() {
      return (
        <Container>
          <Header>
            <Button
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
              transparent>
              <Icon name="menu" />
            </Button>
            <Body style={{ flexDirection: "row" }}>
              <Title>Events Category</Title>
              <Button
              style={{alignSelf:'flex-end',marginLeft:deviceWidth/4+20,marginTop:10}}
              onPress={() => this.props.navigation.navigate("SearchContainer",{search:this.state.eventsCategory,routePath:'EventList'})}
              transparent>
              <Icon  name="search" />
            </Button>
            </Body>
          </Header>
          <Content showsVerticalScrollIndicator={false}>
            {this.state.fetched === true && this.state.eventsCategory.length
              ? <View>
                  {this.events()}
                </View>
              : <Spinner style={{marginTop:200}} color='white'/>}    
          </Content>
        </Container>
      );
    }
}
import React, { Component } from "react";
import {Container,Header,Left, Right, Body, Button, Icon, Content, Text, Title,Spinner, Card, CardItem, Item, Thumbnail, Form, Label, Input} from "native-base";
import {Image, View, ScrollView, Dimensions, Alert, TouchableOpacity, Platform} from "react-native";
import styles from "./category_styles.js";
import Grid from 'react-native-grid-component';
import SearchBar from 'react-native-searchbar';
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
import Orientation from 'react-native-orientation';

export default class NewsCategoryPage extends Component {
  constructor(props) {
    super(props);
    tracker.trackScreenView('News Category');
    this.state = {
      fetched: true,
      newsCategory: [],
      results:''
    };
    this._handleResults = this._handleResults.bind(this);
  }
  _handleResults(results) {
    this.setState({ results });
  }
  componentWillMount() {
    Orientation.lockToPortrait();
    this.props.getAllNewsCategories().then(data => {
      this.setState({
        newsCategory:this.props.newsCategory,
        fetched: true
      });
    });
  }


  _renderItem = (data, i) => 
          <View  style={[styles.item]} key={i}>
             <TouchableOpacity
                  onPress={() =>
                    {
                      tracker.trackEvent('News',data.name);
                      this.props.navigation.navigate("NewsList", {tagName:data.name,banner:data.tag_images ? data.tag_images[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHiFmcCg3P_ZgzQq71S8y0NqAoLwtJF05xGYh-a9bIqfcxyYru"})}
                    }>
                <Image
                  source={{uri:data.tag_images ? data.tag_images[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHiFmcCg3P_ZgzQq71S8y0NqAoLwtJF05xGYh-a9bIqfcxyYru"}}
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

    news(){
      return <Grid
          style={styles.list}
          renderItem={this._renderItem}
          data={this.state.newsCategory}
          itemsPerRow={2}
        />
    }

    render() {
      return (
        <Container>
          <Header>
            <Button
              onPress={() => this.props.navigation.navigate("DrawerOpen")}
              transparent
            >
              <Icon name="menu" />
            </Button>
            <Body style={{ flexDirection: "row" }}>
              <Title>News Category</Title>
              <Button
              style={{alignSelf:'flex-end',marginLeft:deviceWidth/4+30,marginTop:10}}
              onPress={() => this.props.navigation.navigate("SearchContainer",{search:this.state.newsCategory,routePath:'NewsList'})}
              transparent>
              <Icon  name="search" />
            </Button>
            </Body>
          </Header>
          <Content showsVerticalScrollIndicator={false}>
            {this.state.fetched === true && this.state.newsCategory.length
              ? <View>
                  {this.news()}
                </View>
              : <Spinner style={{marginTop:200}} color='white'/>}    
          </Content>
        </Container>
      );
    }
}



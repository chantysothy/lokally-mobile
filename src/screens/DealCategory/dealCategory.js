import React, { Component } from "react";
import {Container,Header,Left, Right, Body, Button, Icon, Content, Text, Title,Spinner, Card, CardItem, Item, Thumbnail, Form, Label, Input} from "native-base";
import {Image, View, TouchableOpacity, Platform,Dimensions} from "react-native";
import styles from "./deal_styles.js";
import Grid from 'react-native-grid-component';
import SearchBar from 'react-native-searchbar';
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
import Orientation from 'react-native-orientation';

export default class DealCategoryPage extends Component {
  constructor(props) {
    super(props);
    tracker.trackScreenView('Deal Category');  
    this.state = {
      fetched: true,
      dealCategory: [],
      results:''
    };
    this._handleResults = this._handleResults.bind(this);
  }

  componentWillMount() {
    Orientation.lockToPortrait();
    this.props.getAllDealCategories().then(data => {
      this.setState({
        dealCategory:this.props.dealCategory,
        fetched: true
      });
    });
  }
  _handleResults(results) {
    this.setState({ results });
  }
  _renderItem = (data, i) => 
          <View  style={styles.item} key={i}>
             <TouchableOpacity
                onPress={() =>{
                    tracker.trackEvent('Deals',data.name);
                    this.props.navigation.navigate("DealList", {tagName:data.name,banner:data.tag_images ? data.tag_images[0] :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPSqAqGclJSd4phB6EmUWv2_05-WXBGdDzmcoMyMv971rnmTSjXg"})}
                  }>
                <Image
                  source={{uri:data.tag_images ? data.tag_images[0]:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPSqAqGclJSd4phB6EmUWv2_05-WXBGdDzmcoMyMv971rnmTSjXg"}}
                  style={styles.channelImg}>
                  <Text
                    style={
                      Platform.OS === "android"
                        ? styles.achannelImgText
                        : styles.ioschannelImgText
                    }>
                    {data.name} 
                  </Text>
                </Image>
              </TouchableOpacity>
          </View>

    deals(){
      return <Grid 
          style={styles.list}
          renderItem={this._renderItem}
          data={this.state.dealCategory}
          itemsPerRow={2}
        />
    }

    render() {
      let navigation = this.props.navigation
      return (
        <Container>
          <Header>
            <Button
              onPress={() => navigation.navigate("DrawerOpen")}
              transparent>
              <Icon name="menu" />
            </Button>
            <Body style={{ flexDirection: "row" }}>
              <Title>Deal Category</Title>
              <Button
              style={{alignSelf:'flex-end',marginLeft:deviceWidth/4+40,marginTop:10}}
              onPress={() =>navigation.navigate("SearchContainer",{search:this.state.dealCategory,routePath:'DealList'})}
              transparent>
              <Icon  name="search" />
            </Button>
            </Body>
          </Header>
          <Content showsVerticalScrollIndicator={false}>
            {this.state.fetched === true && this.state.dealCategory.length
              ? <View>
                  {this.deals()}
                </View>
              : <Spinner style={{marginTop:200}} color='white'/>}    
          </Content>
        </Container>
      );
    }
}

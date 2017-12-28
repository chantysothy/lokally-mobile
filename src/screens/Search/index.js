import React, { Component } from "react";
import { Image, Dimensions, TouchableOpacity, Platform } from "react-native";
import {
  Container,
  Header,
  Content,
  Text,
  Button,
  Icon,
  Title,
  Right,
  Body,
  Left,
  View,
  Spinner,
  Card,
  CardItem,
  Thumbnail
} from "native-base";
import SearchBar from "react-native-searchbar";
import Orientation from "react-native-orientation";
const headerLogo = require("../../assets/logo.png");

import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
const tracker = new GoogleAnalyticsTracker("UA-110943333-1");

const items = [];

export default class SearchContainer extends Component {
  constructor(props) {
    super(props);
    tracker.trackScreenView("Search");
    this.state = {
      items: [],
      results: []
    };
    this._handleResults = this._handleResults.bind(this);
  }
  componentWillMount() {
    Orientation.lockToPortrait();
    items = [];
    this.props.navigation.state.params.search.map(search =>
      items.push(search.name)
    );
  }
  _handleResults(results) {
    this.setState({ results });
  }
  sendSearchResult(result, pushData) {
    switch (pushData) {
      case "EventList":
        tracker.trackEvent("Search Event", result);
        this.props.navigation.navigate("EventList", {
          tagName: result,
          banner:
            "https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/" +
            result +
            ".jpg"
        });
        return;
      case "NewsList":
        tracker.trackEvent("Search News", result);
        this.props.navigation.navigate("NewsList", {
          tagName: result,
          banner:
            "https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/" +
            result +
            ".jpg"
        });
        return;
      case "DealList":
        tracker.trackEvent("Search Tags", result);
        this.props.navigation.navigate("DealList", {
          tagName: result,
          banner:
            "https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/" +
            result +
            ".jpg"
        });
        return;
      default:
        this.props.navigation.navigate("EventList", {
          tagName: result,
          banner:
            "https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/" +
            result +
            ".jpg"
        });
        return;
    }
  }
  render() {
    //console.warn("res",this.state.results.length)
    return (
      <Container>
        <Header hasTabs>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon active name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Image
              source={headerLogo}
              style={{ height: 30, width: 115, resizeMode: "contain" }}
            />
          </Body>
          <Right />
        </Header>
        <Content>
          <View>
            <TouchableOpacity onPress={() => this.searchBar.show()}>
              <View
                style={{
                  backgroundColor: "#01cca1",
                  alignSelf: "center",
                  width: 200,
                  height: 30,
                  marginTop: 5
                }}
              >
                <Text
                  style={{ color: "white", alignSelf: "center", padding: 3 }}
                >
                  Show Search Bar
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{ marginTop: 60 }}>
              {this.state.results.map((result, i) => {
                return (
                  <View key={i}>
                    <TouchableOpacity
                      onPress={() =>
                        this.sendSearchResult(
                          result,
                          this.props.navigation.state.params.routePath
                        )}
                    >
                      <View
                        style={{
                          borderRadius: 10,
                          alignSelf: "center",
                          backgroundColor: "white",
                          width: 250,
                          height: 40,
                          marginTop: 10
                        }}
                      >
                        <Text
                          numberOfLines={3}
                          style={{
                            color: "black",
                            alignSelf: "center",
                            padding: 10
                          }}
                        >
                          {typeof result === "object" &&
                          !(result instanceof Array)
                            ? "Result Not Found!"
                            : result}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
              {this.state.results.length === 0
                ? <Text
                    style={{
                      color: "black",
                      alignSelf: "center",
                      justifyContent: "center",
                      paddingTop: 100
                    }}
                  >
                    No result found
                  </Text>
                : <Text />}
            </View>
            <SearchBar
              ref={ref => (this.searchBar = ref)}
              data={items}
              handleResults={this._handleResults}
              showOnLoad
              hideBack={true}
            />
          </View>
        </Content>
      </Container>
    );
  }
}

{
  /* <TouchableOpacity onPress={() => this.searchBar.show()}>
            <View style={{ backgroundColor: 'green', height: 100, marginTop: 50 }}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.searchBar.hide()}>
            <View style={{ backgroundColor: 'red', height: 100 }}/>
          </TouchableOpacity> */
}

//     <View key={i}>
//     <TouchableOpacity onPress={()=>{this.props.navigation.navigate("EventList", {tagName:result,banner:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrHY5zywHTlDyhezSmEXnF7aan7ezaIh62ElV56Jqre-kXaIoHZw"})}}>
//         <View style={{ backgroundColor: 'green', height: 40, marginTop: 50 }}>
//             <Text numberOfLines={3} style={{color:'white',alignSelf:'center',padding:10}}>
//             {typeof result === 'object' && !(result instanceof Array) ? 'Result Not Found!'
//                     : result}
//             </Text>
//         </View>
//     </TouchableOpacity>
// </View>

/*
import React, { Component } from 'react';
import {Image,Dimensions,
  TouchableOpacity,Platform
} from 'react-native';
import {Container,Header,Content,Text,Button,Icon,Title,Right,Body,View,Spinner,Card,
    CardItem,
    Thumbnail} from "native-base";
import SearchBar from 'react-native-searchbar';
import Grid from 'react-native-grid-component';
import styles from './NewsList/styles';
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const items = [];

export default class SearchContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items:[],
      results: []
    };
    this._handleResults = this._handleResults.bind(this);
  }
  componentWillMount(){
      this.props.navigation.state.params.search.map(search=>items.push(search.key))
  }
  _handleResults(results) {
    this.setState({ results });
  }
  _renderItem = (data, i) => 
  <View key={i}>
    <Text style={{color:'black'}}>{data}</Text>
  </View>

  render() {
    console.warn("res",this.state.results.length)
    return (
      <View>
        <View style={{ marginTop: 40}}>
        {this.state.results.length > 0 ?<Grid
          style={{flex: 1}}
          renderItem={this._renderItem}
          data={this.state.results}
          itemsPerRow={2} />:<View/>}
          {/* {
            this.state.results.map((result, i) => {
              return ( 
                    <View key={i}>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate("EventList", {tagName:result,banner:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrHY5zywHTlDyhezSmEXnF7aan7ezaIh62ElV56Jqre-kXaIoHZw"})}}>
                            <View style={{ backgroundColor: 'green', height: 40, marginTop: 50 }}>
                                <View>
                                {typeof result === 'object' && !(result instanceof Array) ? 'Result Not Found!' 
                                        : }
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
              );
            })
          } 
          {this.state.results.length === 0  ?
            <Text style={{color:'black',alignSelf:'center',justifyContent:'center',paddingTop:100}}>No result found</Text>
             :<Text/>}
         </View>
         <SearchBar
           ref={(ref) => this.searchBar = ref}
           data={items}
           handleResults={this._handleResults}
           showOnLoad
         />
       </View>
     );
   }
 }

*/

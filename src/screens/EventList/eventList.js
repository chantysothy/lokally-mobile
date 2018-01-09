import React, { Component } from "react";
import { Image, TouchableOpacity, Platform, ScrollView,Dimensions } from "react-native";
import {Container,Header,Content,Text,Button,Icon,Title,Right,Body,View,Spinner} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import styles from "./styles";
const primary = require("../../theme/variables/commonColor").brandPrimary;
import striptags from 'striptags';
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
let count = 0; 
import Orientation from 'react-native-orientation';

class EventList extends Component {
  constructor(props){
    super(props);
    tracker.trackScreenView('Event List');
    this.state = {
      fetched: false,
      event:[],
      follow:"Follow",
      isFetching:false
    };
}

componentWillMount() {
  Orientation.lockToPortrait();
  count = 0;
  this.props.getAllEvents(this.props.navigation.state.params.tagName,count).then(data => {
     this.setState({
        event:this.props.listOfEvents,
        fetched: true,
     });
   });
 }
 fetchNextData(){
    this.setState({isFetching:true})
    count+=5;
    this.props.getAllEvents(this.props.navigation.state.params.tagName,count).then(data => {
      this.setState({
        fetched: true,
        isFetching:false
      })
    });
 }
follow(value){
  if(value==="Follow"){
    this.setState({follow:"Following"})
  }else{
    this.setState({follow:"Follow"})
  }
}
render() {
  const navigation = this.props.navigation;
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        <Header>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon active name="arrow-back" />
            </Button>
          <Body style={{ flexDirection: "row" }}>
            <Title>Events List</Title>
          </Body>
          <Right />
        </Header>
        <Content showsVerticalScrollIndicator={false}>
          <View>
            <Image
              source={{uri:this.props.navigation.state.params.banner}}
              style={styles.newsPoster}>
              <View>
                <Text
                  style={
                    Platform.OS === "android"
                      ? styles.achannelHeader
                      : styles.ioschannelHeader}>
                  {this.props.navigation.state.params.tagName.toUpperCase()}
                </Text>
                <Button
                  rounded
                  style={styles.followBtn}
                  onPress={(e) => this.follow(this.state.follow)} >
                  <Text
                    style={
                      Platform.OS === "android"
                        ? {
                            color: primary,
                            fontSize: 13,
                            fontWeight: "900",
                            textAlign: "center"
                          }
                        : { color: primary, fontSize: 13, fontWeight: "900" }}>
                    {this.state.follow}
                  </Text>
                </Button>
                <View style={{ padding: 0 }}>
                  <Text style={styles.noOfFollowers}>234K Followers</Text>
                </View>
              </View>
            </Image>
          </View>
          <ScrollView>
          {this.state.fetched === true ? 
          <View foregroundColor={"white"} style={{ backgroundColor: "#fff" }}>
            { this.props.listOfEvents.map((event, key) => (
              <TouchableOpacity key={key}
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                      tracker.trackEvent('Event',this.props.navigation.state.params.tagName);
                      navigation.navigate("EventDetail",{eventDetail:event,tagName:this.props.navigation.state.params.tagName,tagBanner:this.props.navigation.state.params.banner})}
                    }>
                  <View style={styles.newsContentWrap}>
                    <Text numberOfLines={2} style={styles.HeaderTitle}>
                      {event._source.event_title}
                    </Text>
                    <Grid style={styles.newsContent}>
                    {event._source.event_description ? 
                      <Col style={{ flexDirection: "row",justifyContent:'space-between' }}>
                          <Text numberOfLines={2} style={styles.newsLink}>
                              {striptags(event._source.event_description)}
                           </Text>
                      </Col> :<Text/>}
                    </Grid>                    
                    <Grid style={{paddingBottom:20}}>
                      <Col style={{ flexDirection: "row",justifyContent:'space-between' }}>
                        {event._source.event_date ?
                          <Text style={styles.newsLink}><Icon name="ios-calendar-outline" style={styles.timeIcon} />  {event._source.event_date}</Text>
                        :<Text/>}
                        {event._source.event_time_from && event._source.event_time_to ?
                          <Text style={styles.newsLink}><Icon name="ios-time-outline" style={styles.timeIcon} />  {event._source.event_time_from}  to {event._source.event_time_to}</Text>
                        :<Text/>}
                      </Col>
                    </Grid>
                  </View>
              </TouchableOpacity>))}          
          </View>: <Spinner style={{marginTop:200}} color='#01cca1'/>}
          </ScrollView>
          {this.state.fetched === true && this.props.totalData > count+5 ?
            <Button style={{borderRadius:10,alignSelf:'center',padding:10,margin:20}} onPress={()=>this.fetchNextData()}><Text>More</Text></Button>
          :<View/>} 
          {this.state.isFetching === true ? <Spinner style={{marginTop:10}} color='#01cca1'/> :<View/>}
        </Content>
      </Container>
    );
  }
}

export default EventList;

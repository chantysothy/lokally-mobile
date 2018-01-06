import React, { Component } from "react";
import { Image, TouchableOpacity, ScrollView,Platform ,Alert,Dimensions,NetInfo,Linking} from "react-native";
import {Container,Header,Content,Text,Button,Icon,Title,Right,Body,View,Spinner} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import styles from "./styles";
const primary = require("../../theme/variables/commonColor").brandPrimary;
import Carousel from 'react-native-looped-carousel-improved';
const { width, height } = Dimensions.get('window');
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
import Orientation from 'react-native-orientation';
let initalOrientation ='' ;
let bannerImage = [];

class Home extends Component {
  constructor(props){
    super(props);
    tracker.trackScreenView('Home');
    this.state = {
        eventFetched: false,
        newsFetched:false,
        dealFetched:false,
    };
}

componentWillMount() {
    //Orientation.lockToPortrait();
    NetInfo.isConnected.fetch().then(isConnected => {
        if(isConnected === false){
            Alert.alert("Network","Please check your network connection to continue",
            [
              { text: 'Ok', onPress: () => { () => { this.props.navigation.navigate('Login') } }, style: 'cancel' },
            ],
            { cancelable: false })
        }
      }); 
    this.props.getAllEventsTrend().then(()=>
        this.setState({event:this.props.Events.hits,eventFetched:true}))
    this.props.getAllNewsTrend().then(()=>{
        this.setState({news:this.props.News.hits,newsFetched:true})})
    this.props.getAllDealTtrend().then(()=>{
        this.setState({deal:this.props.Deal.hits,dealFetched:true})})
    bannerImage = this.props.config ? this.props.config.app_banner : '';
}
tracker(event,routeValue){
    switch(routeValue){
        case 'EVENTS':
            tracker.trackEvent('Event',event._source.tags[0]);
            this.props.navigation.navigate("EventDetail",{eventDetail:event,tagName:event._source.tags ? event._source.tags[0] : ""})
        return          
        case 'NEWS':
            tracker.trackEvent('News',event._source.tags[0]);
            this.props.navigation.navigate("NewsDetail",{newsDetail:event,tagName:event._source.tags ? event._source.tags[0] : ""})
        return   
        case 'DEALS':
            tracker.trackEvent('Deals',event._source.tags[0]);
            this.props.navigation.navigate("DealDetail",{dealDetail:event,tagName:event._source.tags ? event._source.tags[0] : ""})
        return    
        default :
            tracker.trackEvent('Home');
        return 
    }
    
}


render() {
const navigation = this.props.navigation;
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        <Header>
            <Button
                onPress={() => this.props.navigation.navigate("DrawerOpen")}
                transparent
            >
                <Icon name="menu" />
            </Button>
          <Body style={{ flexDirection: "row" }}>
            <Title>LOKALLY</Title>
          </Body>
          <Right/>
              {/* <Button transparent>
              <Icon name='md-stats' style={styles.headerTextIcon} onPress={()=>{this.openApp()}}/>
              </Button> 
            </Right>  */}
        </Header>
        <Content showsVerticalScrollIndicator={false}>
        {bannerImage.length > 0 ?
            <View >           
            <Carousel
                delay={4000}
                style={styles.Carousal}
                autoplay
                >
                {bannerImage.map((banner,key)=>
                <Image
                    key={key}
                    source={{uri:banner}}
                    style={styles.newsPoster}>
                </Image> )}                 
            </Carousel>
          </View>:<View/>}
          <View foregroundColor={"white"} style={{ backgroundColor: "#fff" }}>   
          <View style={{flex: 1,flexDirection: "row",marginTop: 10}}>
                <View style={{ width:'75%'}}>
                    <Text  style={styles.trending}>TRENDING EVENTS</Text>
                </View>
                <View style={{ width:'25%',paddingRight:5}}>
                    <Text onPress={()=>this.props.navigation.navigate('EventCategoryPage')}  style={styles.more}>MORE</Text>
                </View>
            </View>       
            <View>                
                    {this.state.eventFetched && this.props.Events.hits ?
                     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {this.props.Events.hits.hits.map((event,key)=>
                            <TouchableOpacity
                                    key={key}
                                    onPress={() => {this.tracker(event,"EVENTS")}}>
                                <Image
                                    source={{uri: event._source.event_images ? event._source.event_images[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrHY5zywHTlDyhezSmEXnF7aan7ezaIh62ElV56Jqre-kXaIoHZw"}}
                                    style={styles.channelImg}>
                                    <Text
                                        numberOfLines={1}
                                        style={
                                            Platform.OS === "android"
                                            ? styles.achannelImgText
                                            : styles.ioschannelImgText
                                        }>
                                        {event._source.event_title} 
                                    </Text>
                                </Image>
                            </TouchableOpacity>)}               
                    </ScrollView>
                    : <Spinner style={{alignItems:'center'}} color='#01cca1'/>}
            </View>
            <View style={{flex: 1,flexDirection: "row",marginTop: 10}}>
                <View style={{ width:'75%'}}>
                    <Text  style={styles.trending}>TRENDING NEWS</Text>
                </View>
                <View style={{ width:'25%',paddingRight:5}}>
                    <Text onPress={()=>this.props.navigation.navigate('NewsCategoryPage')} style={styles.more}>MORE</Text>
                </View>
            </View>
            <View>
                {this.state.newsFetched && this.props.News.hits ?
                     <ScrollView horizontal  showsHorizontalScrollIndicator={false}>
                        {this.props.News.hits.hits.map((news,key)=>
                            <TouchableOpacity
                                    key={key}
                                    onPress={() =>this.tracker(news,'NEWS')}>
                                <Image
                                    source={{uri: news._source.news_images ? news._source.news_images[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHiFmcCg3P_ZgzQq71S8y0NqAoLwtJF05xGYh-a9bIqfcxyYru"}}
                                    style={styles.channelImg}>
                                    <Text
                                        numberOfLines={1}
                                        style={
                                            Platform.OS === "android"
                                            ? styles.achannelImgText
                                            : styles.ioschannelImgText
                                        }>
                                        {news._source.news_title} 
                                    </Text>
                                </Image>
                            </TouchableOpacity>)}               
                    </ScrollView>
                    : <Spinner style={{alignItems:'center'}} color='#01cca1'/>}
            </View>
            <View style={{flex: 1,flexDirection: "row",marginTop: 10}}>
                <View style={{ width:'75%'}}>
                    <Text  style={styles.trending}>TRENDING DEALS</Text>
                </View>
                <View style={{ width:'25%',paddingRight:5}}>
                    <Text onPress={()=>this.props.navigation.navigate('DealCategoryPage')} style={styles.more}>MORE</Text>
                </View>
            </View>
            <View>
                {this.state.dealFetched && this.props.Deal.hits ?
                    <ScrollView horizontal  showsHorizontalScrollIndicator={false}>
                       {this.props.Deal.hits.hits.map((deal,key)=>
                           <TouchableOpacity
                                    key={key}
                                   onPress={() =>this.tracker(deal,'DEALS')}>
                               <Image
                                   source={{uri:deal._source.deal_images ? deal._source.deal_images[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPSqAqGclJSd4phB6EmUWv2_05-WXBGdDzmcoMyMv971rnmTSjXg"}}
                                   style={styles.channelImg}>
                                   <Text
                                        numberOfLines={1}
                                       style={
                                           Platform.OS === "android"
                                           ? styles.achannelImgText
                                           : styles.ioschannelImgText
                                       }>
                                       {deal._source.deal_title} 
                                   </Text>
                               </Image>
                           </TouchableOpacity>)}               
                   </ScrollView>
                   :<Spinner style={{alignItems:'center'}} color='#01cca1'/>}
            </View>         
          </View>
        </Content>
      </Container>
    );
  }
}

export default Home;

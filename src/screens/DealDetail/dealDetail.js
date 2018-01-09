import React, { Component } from "react";
import {Image,TouchableOpacity,TouchableHighlight,View as RNView,Alert,Linking,AsyncStorage} from "react-native";
import {Container,Header,Content,Text,Button,Icon,Body,View,Right} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import Carousel from "react-native-carousel-view";
import SendIntentAndroid from 'react-native-send-intent';
import styles from "./styles";
import HTMLView from 'react-native-htmlview';
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
import Orientation from 'react-native-orientation';
import MapView from 'react-native-maps';
import {eventsLike,getUserLike,share} from '../../utilities/config';
const find = ' ';
const re = new RegExp(find, 'g');

class DealDetail extends Component {
 
  constructor(props) {
    super(props);
    tracker.trackScreenView('Deal');
    this.state={
      access:'',
      userLike:'',
      eventData:[],
      userId:''
    }
  }
  componentWillMount(){
    Orientation.lockToPortrait();
    this.getLikesCount(this.props.navigation.state.params.dealDetail._id);
    AsyncStorage.getItem('accessToken',(err,value)=>{
      if(value != null){
        this.setState({access:value})
        this.getLikesDetail()
      }
    })
    AsyncStorage.getItem('userId',(err,value)=>{
      if(value != null){
        this.setState({userId:value})
      }
    })
  }
  getLikesDetail(){
    getUserLike(this.props.navigation.state.params.dealDetail._id,this.state.access).then((val)=>{
      this.setState({userLike:val})
    }).catch(err=>{
      {this.props.error.length === 0 
        ? ""
        :this.props.tokenRenual(this.state.access).then((data)=> {
          this.props.getUser(this.props.token).then(data=>{
            AsyncStorage.setItem('accessToken',this.props.token);
            getUserLike(this.props.navigation.state.params.dealDetail._id,this.state.access).then((val)=>{
              this.setState({userLike:val})
            })
          })
      })
    }
    })
  }
  getLikesCount(id) {
    eventsLike(id).then((data)=>{
      if(data){
        this.setState({eventData:data})
      }      
    })
}
  share(deal){
    let shareObj = {
      "user_id" : this.props.navigation.state.params.dealDetail._id ,
      "item_id" : this.state.userId,
      "shared_to" : "clustrex",
      "shared_via" : "facebook" 
    }
    let link = "https://www.lokally.in/deals/"+deal._id+"/"+deal._source.deal_title.replace(re, '%20') 
    SendIntentAndroid.sendText({
      title: 'Select the app to share',
      text: "Deal title:"+deal._source.deal_title+"\nDeal starts date :"+deal._source.deal_start_date+"\nVisit:"+link,
      type: SendIntentAndroid.TEXT_PLAIN
    });
    share(shareObj,this.state.access).then((data)=>console.warn(JSON.stringify(data)))
   }

   phoneDial(event){
    SendIntentAndroid.sendPhoneDial(event._source.contact_number);
   }
   openMap(address){
    SendIntentAndroid.openMaps(address);
   }
   openbrowser = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('URL Error','Dont know how to open URI:'+ url)
      }
    });
  };
  ZoomImage(){
    this.props.navigation.navigate('ImageZoomRender',{url:this.props.navigation.state.params.dealDetail._source.deal_images[0]})
  }
  userLikes(){
    var obj={};
    obj={
      "user_id" : this.state.userId,
      "item_id" : this.props.navigation.state.params.dealDetail._id  
    }        
    this.props.userLike(obj,this.state.access).then((data)=>{
      this.getLikesCount(this.props.navigation.state.params.dealDetail._id)
      this.getLikesDetail()
    })
    {this.props.error.length === 0 
        ? ""
        :this.props.tokenRenual(this.state.access).then((data)=> {
          this.props.getUser(this.props.token).then(data=>{       
            AsyncStorage.setItem('accessToken',this.props.token);
            this.props.userLike(obj,this.props.token)
          })
      })
    }
   }
   email(event){
    SendIntentAndroid.sendMail(event._source.contact_email_id,"Regarding event"+event._source.event_title,"");
   }
  render() {
    let navigation =  this.props.navigation;
    let deal = this.props.navigation.state.params.dealDetail;
    let tagName = this.props.navigation.state.params.tagName;
    let eventData =  this.state.eventData;
    return (
      <Container>
        <Header
          style={styles.headerStyle}>
          <Body
            style={{ flexDirection: "row"}}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon active name="arrow-back" style={styles.headerIcons} />
            </Button>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='md-share' style={styles.headerTextIcon} onPress={()=>{this.share(this.props.navigation.state.params.dealDetail)}}/>
            </Button>
          </Right>
        </Header>
        {deal ?
        <Content
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#fff" }} >
          <View style={{ flex: 1}}>
            <View>
              <TouchableHighlight onPress={()=>this.ZoomImage()}>
                <Image
                  source={{uri:deal._source.deal_images[0] ? deal._source.deal_images[0] :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPSqAqGclJSd4phB6EmUWv2_05-WXBGdDzmcoMyMv971rnmTSjXg"}}
                  style={styles.newsPoster}/>
              </TouchableHighlight>
            </View>
            <View style={{ backgroundColor: "#fff" }}>
                <Grid>
                  <Col style={{ flexDirection: "row" }}>
                    {this.state.userLike.user_liked === true ? 
                      <Button onPress={()=>{this.userLikes()}}>
                        <Icon active name="thumbs-up" />
                        <Text>{eventData.likes}</Text><Text style={{paddingLeft:5}}>Likes</Text>
                      </Button>
                      : <Button transparent onPress={()=>{this.userLikes()}}>
                        <Icon active name="thumbs-up" />
                        <Text>{eventData.likes}</Text><Text style={{paddingLeft:5}}>Likes</Text>
                    </Button>}                  
                  </Col>
                  <Col >
                    <Button transparent onPress={()=>{navigation.navigate('Comments',{id:deal._id,banner:deal._source.deal_images[0],dataReturn:eventData.comments,returnData: this.getLikesCount.bind(this)})}}>
                      <Icon active name="chatbubbles" />
                      <Text>{eventData.comments}</Text><Text style={{paddingLeft:5}}>Comments</Text>
                      </Button>
                  </Col>
                  <Col style={{marginTop:15,marginRight:10}}>
                    <TouchableOpacity style={styles.newsTypeView} onPress={()=>{navigation.navigate('DealList',{tagName:tagName,banner:this.props.navigation.state.params.tagBanner ? this.props.navigation.state.params.tagBanner : "https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/"+tagName+".jpg"})}}>
                      <Text style={styles.newsTypeText}>{tagName.toUpperCase()}</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
            </View>
            <View style={{ backgroundColor: "#fff" }}>
              <View style={styles.newsContent}>
                <Grid>
                  <Col style={{ flexDirection: "row" }}>
                    <TouchableOpacity>
                      <Text style={styles.eventAddress} numberOfLines={1}>{deal._source.deal_title.toUpperCase()}</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
                {deal._source.sold_by ?
                  <Grid style={{ paddingBottom: 20 }}>
                    <Col style={{ flexDirection: "row" }}>
                      <Text style={styles.eventAddress}>
                        # {deal._source.sold_by}
                      </Text>
                      </Col>
                  </Grid> : <View/>}
              </View>
              {deal._source.deal_body ?
                <View style={styles.newsContentBody}>
                    <HTMLView
                          value={deal._source.deal_body}					
                          stylesheet={styles.newsHeader}/>
                </View>
              :<View/>}
              {deal._source.applicable_for ?
                  <Grid style={{ paddingLeft: 20 }}>
                    <Col style={{ flexDirection: "row" }}>
                      <TouchableOpacity>
                        <Text style={styles.newsHeader} numberOfLines={2}>Applicable for : <Text style={styles.newsComment}>{deal._source.applicable_for}</Text></Text>
                      </TouchableOpacity>
                    </Col>
                  </Grid>
              :<View/>}
              {deal._source.deal_price ?
                <View style={{ padding: 20 }}>
                  <Text style={styles.newsHeader}>Deal : <Text style={styles.newsComment}>{deal._source.deal_price }</Text></Text>
                </View> 
              :<View/>}       
              {deal._source.payment ?
                <View style={{ paddingLeft: 20 }}>
                  <Text style={styles.newsHeader}>&#8377; <Text style={styles.newsComment}>{deal._source.payment }</Text></Text>
                </View> 
              : <View/>}
              {deal._source.location ?
              <View style={{ padding: 20 }}>
                <Text style={styles.newsComment} onPress={()=>this.openMap(parseFloat(deal._source.deal_lat)+","+parseFloat(deal._source.deal_lng))}><Icon name='ios-map-outline' style={styles.timeIcon}/>  {this.props.navigation.state.params.dealDetail._source.location.replace(/\n/g, " ")}</Text>
              </View>
              :<View/>}              
              {deal._source.deal_start_date ? 
                <View style={{ paddingLeft: 20}}>
                  <Text style={styles.newsComment}><Icon name='ios-calendar-outline' style={styles.timeIcon}/>  {deal._source.deal_start_date}  {deal._source.deal_end_date ? `to `+deal._source.deal_end_date : ''}</Text>
                </View> 
              : <View/>}
              <Grid  style={{ padding: 20}}>
                {deal._source.deal_time_from  ?
                    <Col style={{ flexDirection: "row",alignItems:'flex-start'}}>
                      <TouchableOpacity>
                        <Text style={styles.newsComment}> <Icon name='ios-timer-outline' style={styles.timeIcon}/>  {deal._source.deal_time_from} {deal._source.deal_time_to ?  `to `+deal._source.deal_time_to : ''}</Text>
                      </TouchableOpacity>
                    </Col>
                :<View/>}
              </Grid>              
              <View style={{ padding: 20 }}>
                {deal._source.contact_name ?
                  <View style={styles.newsCommentContainer}>
                    <Text style={styles.newsComment}><Icon name='md-person' style={styles.timeIcon}/>  {deal._source.contact_name}</Text>
                  </View>:<View/>}
                  {deal._source.contact_number ?
                  <View style={styles.newsCommentContainer}>                    
                    <Text style={styles.newsComment} onPress={()=>{this.phoneDial(deal)}}><Icon name='ios-phone-portrait' style={styles.timeIcon}/>  {deal._source.contact_number}</Text>
                  </View>:<View/>}
                  {deal._source.contact_email_id ?
                  <View style={styles.newsCommentContainer}>
                    <Text style={styles.newsComment} onPress={()=>{this.email(deal)}}>
                      <Icon name='md-mail' style={styles.timeIcon}/>   {deal._source.contact_email_id}
                    </Text>
                  </View>:<View/>} 
                  {deal._source.website ?
                  <View style={styles.newsCommentContainer}>
                    <Text style={styles.newsComment} onPress={()=>{this.openbrowser(deal._source.website)}}>
                    <Icon name='md-globe' style={styles.timeIcon}/>   {deal._source.website}
                    </Text>
                  </View> :<View/>}
               </View>
               {deal._source.terms_and_condition.length > 0 ?
                <View>
                  <Text style={styles.terms_and_condition}>Terms and Condition</Text>
                  <View style={{ padding: 20 }}>
                    {deal._source.terms_and_condition.map((term,key)=>
                        <View style={styles.newsCommentContainer} key={key}>
                          <Text style={styles.newsComment}>
                            {term}
                          </Text>
                        </View>)}               
                  </View>
                </View>
                :<View/>}
               {deal._source.tags && deal._source.tags.length > 1 ?
                <View style={{ paddingLeft: 10,paddingBottom:20 }}>
                  <Grid>
                    {deal._source.tags.map((tag,key)=>
                      <View style={{ flexDirection: "row",paddingRight:5,marginTop:10}} key={key}>
                          <Button bordered style={{padding:0,borderRadius:10,borderColor:'#01cca1'}} onPress={()=>{navigation.navigate('DealList',{tagName:tag,banner:"https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/"+tag+".jpg"})}}><Text>{tag}</Text></Button>
                      </View>)}
                  </Grid>
                </View>
                :<View/>}
                {deal._source.deal_lat && deal._source.deal_lng ?
                <View style ={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    region={{
                      latitude: parseFloat(deal._source.deal_lat),
                      longitude: parseFloat(deal._source.deal_lng),
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    }}
                  >
                  <MapView.Marker
                      coordinate={{
                        latitude:parseFloat(deal._source.deal_lat),
                        longitude: parseFloat(deal._source.deal_lng)
                        }}
                      />
                  </MapView>
                </View>
                :<Text/>}
            </View>
          </View>
        </Content>:<Content/>}
      </Container>
    );
  }
}

export default DealDetail;

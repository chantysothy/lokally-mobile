import React, { Component } from "react";
import {Image,StyleSheet,TouchableOpacity,TouchableHighlight,View as RNView,Dimensions,Linking,WebView,Alert, AsyncStorage} from "react-native";
import {Item,Input,Container,Header,Content,Text,Button,Icon,Body,View,Right,Left} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import SendIntentAndroid from 'react-native-send-intent';
import styles from "./styles";
import MapView from 'react-native-maps';
import HTMLView from 'react-native-htmlview';
import Comments from './../Comments';
import { eventsLike,getUserLike,share } from '../../utilities/config';
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
import Orientation from 'react-native-orientation';
import Share from 'react-native-share';
const find = ' ';
const re = new RegExp(find, 'g');

class EventDetail extends Component {
 
  constructor(props) {
    super(props);
    tracker.trackScreenView('Event');
    this.state={markers:[],eventData:[],comment:false,access:'',userId:'',userLike:''}
  }
  
  componentDidMount(){
    Orientation.lockToPortrait();
    this.getLikesCount(this.props.navigation.state.params.eventDetail._id)
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
    let id = this.props.navigation.state.params.eventDetail._id;
    let accessToken = this.state.access
    getUserLike(id,accessToken).then((val)=>{
      this.setState({userLike:val})
    }).catch(err=>{
      {this.props.error.length === 0 
        ? ""
        :this.props.tokenRenual(accessToken).then((data)=> {
          this.props.getUser(this.props.token).then(data=>{
            AsyncStorage.setItem('accessToken',this.props.token);
            getUserLike(id,accessToken).then((val)=>{
              this.setState({userLike:val})
            })
          })
      })
    }
    })
  }

  share(event){
    let shareObj = { 
      "user_id" : this.props.navigation.state.params.eventDetail._id,
      "item_id" : this.state.userId,
      "shared_to" : "clustrex",
      "shared_via" : "facebook" 
    }
    let url = "http://maps.google.com/maps?q="+event._source.event_lat+","+event._source.event_lng+"&ll="+event._source.event_lat+","+event._source.event_lng+"&z=17"
    let link = "https://www.lokally.in/events/"+event._id+"/"+event._source.event_title.replace(re, '%20') 
    SendIntentAndroid.sendText({
      title: 'Select the app to share',
      text: "Event Title:"+event._source.event_title+"\nDate:"+event._source.event_date+"\nAddress:"+event._source.event_address+"\nFrom Time:"+event._source.event_time_from+"\nTo Time:"+event._source.event_time_to+"\nVisit:"+link+"\nClick link to get direction "+url,
      type: SendIntentAndroid.TEXT_PLAIN
    })
    share(shareObj,this.state.access).then((data)=>console.log(JSON.stringify(data)))
   }
   openMap(address){
    SendIntentAndroid.openMaps(address);
   }
   getLikesCount(id) {
      eventsLike(id).then((data)=>{
        if(data){
          this.setState({eventData:data})
        }      
      })
  }
   email(event){
    SendIntentAndroid.sendMail(event._source.contact_email,"Regarding event"+event._source.event_title,"");
   }

   phoneDial(event){
    SendIntentAndroid.sendPhoneDial(event._source.contact_number);
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
   addEventToCalender(event){
      let title = event._source.event_title.replace(re, '%20');
    SendIntentAndroid.addCalendarEvent({
      title: event._source.event_title,
      description: "https://www.lokally.in/events/"+event._id+"/"+title,
      startDate: event._source.event_date,
      endDate: event._source.event_date,
      recurrence: 'yearly',
      location: event._source.event_address
    });
   }
   ZoomImage(){
     this.props.navigation.navigate('ImageZoomRender',{url:this.props.navigation.state.params.eventDetail._source.event_images[0]})
   }
   userLikes(){
    var obj={};
    obj={
      "user_id" : this.state.userId,
      "item_id" : this.props.navigation.state.params.eventDetail._id  
    }        
    this.props.userLike(obj,this.state.access).then((data)=>{
      this.getLikesCount(this.props.navigation.state.params.eventDetail._id)
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
  render() {
    let event = this.props.navigation.state.params.eventDetail;
    let eventData = this.state.eventData;
    let tagName = this.props.navigation.state.params.tagName;
    let navigation = this.props.navigation;
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
              <Icon name='ios-calendar' style={styles.headerTextIcon} onPress={()=>{this.addEventToCalender(event)}}/>
              </Button>
              <Button transparent>
              <Icon name='md-share' style={styles.headerTextIcon} onPress={()=>{this.share(event)}}/>
              </Button>
            </Right>
        </Header>
        {event ?
        <Content
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#fff" }}>
          <View style={{ flex: 1 }}>
            <View >
            <TouchableHighlight onPress={()=>this.ZoomImage()}>
              <Image
                source={{uri:event._source.event_images ? event._source.event_images[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrHY5zywHTlDyhezSmEXnF7aan7ezaIh62ElV56Jqre-kXaIoHZw"}}
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
                    <Button transparent onPress={()=>{navigation.navigate('Comments',{id:event._id,banner:event._source.event_images[0],dataReturn:eventData.comments,returnData: this.getLikesCount.bind(this)})}}>
                      <Icon active name="chatbubbles" />
                      <Text>{eventData.comments}</Text><Text style={{paddingLeft:5}}>Comments</Text>
                      </Button>
                  </Col>
                  <Col style={{marginTop:15,marginRight:10}}>
                    <TouchableOpacity style={styles.newsTypeView} onPress={()=>{navigation.navigate('EventList',{tagName:tagName,banner:this.props.navigation.state.params.tagBanner ? this.props.navigation.state.params.tagBanner :"https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/"+tagName+".jpg"})}}>
                      <Text style={styles.newsTypeText}>{tagName ? tagName.toUpperCase() : event._source.tags[0].toUpperCase()}</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
            </View>
            <View style={{ backgroundColor: "#fff" }}>
              <View style={styles.newsContent}>
                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <TouchableOpacity>
                      <Text style={styles.eventAddress} numberOfLines={2}>{event._source.event_title.toUpperCase()}</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
                {event._source.event_description ?
                <HTMLView
                    value={event._source.event_description}					
                    stylesheet={styles.htmlContent}	
                />
                :<View/>}
                 {event._source.applicable_for ?
                 <Grid>
                  <Col style={{ flexDirection: "row" }}>
                    <TouchableOpacity>
                      <Text style={styles.newsHeader} numberOfLines={2}>Applicable for : {event._source.applicable_for}</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
                :<View/>}
              </View>
              {event._source.event_address ?
              <View style={{ padding: 20 }}>
                <Text style={styles.newsHeader} onPress={()=>this.openMap(parseFloat(event._source.event_lat)+","+parseFloat(event._source.event_lng))}><Icon name='ios-map-outline' style={styles.timeIcon}/>  {event._source.event_address.replace(/\n/g, " ")}</Text>
              </View>
              :<View/>}
              <View>
                <Grid>
                  {event._source.event_date ? 
                    <View style={{ paddingLeft: 20}}>
                      <Text style={styles.newsHeader}>
                          <Icon name='ios-calendar-outline' style={styles.timeIcon}/>  {event._source.event_date}
                              {event._source.expire_by ? 
                                <Text style={styles.newsHeader}> to {event._source.expire_by}</Text>:''}
                      </Text>
                 </View> : <View/>}
                </Grid>  
                <Grid style={{ padding: 20 }}>
                  {event._source.event_time_from ?
                  <Col style={{ flexDirection: "row",alignItems:'flex-start'}}>
                    <TouchableOpacity>
                      <Text style={styles.newsHeader}><Icon name='ios-timer-outline' style={styles.timeIcon}/>  {event._source.event_time_from} {event._source.event_time_to ?  `to `+event._source.event_time_to : ''}</Text>
                    </TouchableOpacity>
                  </Col>
                  :<View/>}
                </Grid>
                <Grid>
                  {event._source.payment ?
                  <Col style={{paddingLeft:20,alignItems:'flex-start'}}>
                    <TouchableOpacity>
                    <Text style={styles.newsHeader}> &#8377; {event._source.payment}</Text>
                    </TouchableOpacity>
                  </Col> :<View/>}
                </Grid>
              </View>
              <View style={{ padding: 20 }}>
              {event._source.contact_name ?
                <View style={styles.newsCommentContainer}>
                  <Text style={styles.newsComment}>
                  <Icon name='md-person' style={styles.timeIcon}/>  {event._source.contact_name}
                  </Text>
                </View> : <View/>}
                {event._source.contact_number ?
                <View style={styles.newsCommentContainer}>
                  <Text style={styles.newsComment} onPress={()=>{this.phoneDial(event)}}>
                    <Icon name='ios-phone-portrait' style={styles.timeIcon}/>  {event._source.contact_number}
                  </Text>
                </View> : <View/>}
                {event._source.contact_email ?
                <View style={styles.newsCommentContainer}>
                  <Text style={styles.newsComment} onPress={()=>{this.email(event)}}>
                    <Icon name='md-mail' style={styles.timeIcon}/>  {event._source.contact_email}
                  </Text>
                </View> : <View/>}  
                {event._source.website ?
                <View style={styles.newsCommentContainer}>
                  <Text style={styles.newsComment} onPress={()=>{this.openbrowser(event._source.website)}}>
                    <Icon name='md-globe' style={styles.timeIcon}/>  {event._source.website}
                  </Text>
                </View> : <View/>}
                
               </View>
               {event._source.tags && event._source.tags.length > 1 ?
                <View style={{ paddingLeft: 10,paddingBottom:20}}>
                  <Grid>
                    {event._source.tags.map((tag,key)=>
                      <View style={{ flexDirection: "row",paddingRight:5,marginTop:10}} key={key}>
                          <Button bordered style={{padding:0,borderRadius:10,borderColor:'#01cca1'}} onPress={()=>{navigation.navigate('EventList',{tagName:tag,banner:"https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/"+tag+".jpg"})}}><Text>{tag}</Text></Button>
                      </View>)}
                  </Grid>
                </View>
                :<View/>}
            </View>
          {event._source.event_lat != "" && event._source.event_lng != "" ?
             <View style ={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                  latitude: parseFloat(event._source.event_lat),
                  longitude: parseFloat(event._source.event_lng),
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
                >
                <MapView.Marker
                  coordinate={{
                    latitude:parseFloat(event._source.event_lat),
                    longitude:parseFloat(event._source.event_lng)
                    }}
                  />
              </MapView>
            </View>:<View/>}
            <View>
              {this.state.comment === true ? <Comments /> : 
              <View/>}
            </View>
          </View>
        </Content>:<Content/>}
      </Container>
    );
  }
}



export default EventDetail;

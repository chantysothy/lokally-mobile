import React, { Component } from "react";
import {Image,StyleSheet,TouchableOpacity,TouchableHighlight,View as RNView,Dimensions,Linking,WebView,Alert, AsyncStorage} from "react-native";
import {Item,Input,Container,Header,Content,Text,Button,Icon,Body,View,Right,Left} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import SendIntentAndroid from 'react-native-send-intent';
import styles from "./styles";
import MapView from 'react-native-maps';
import HTMLView from 'react-native-htmlview';
import Comments from './../Comments';
import {eventsLike,getUserLike} from '../../utilities/config';
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
import Orientation from 'react-native-orientation';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

class EventDetail extends Component {
 
  constructor(props) {
    super(props);
    tracker.trackScreenView('Event');
    this.state={markers:[],eventData:[],comment:false,access:'',userLike:''}
  }
  
  componentDidMount(){
    Orientation.lockToPortrait();
    this.getLikesCount();
    AsyncStorage.getItem('accessToken',(err,value)=>{
      if(value != null){
        this.setState({access:value})
        this.getLikesDetail()
      }
    })
  }
  getLikesDetail(){
    getUserLike(this.props.navigation.state.params.eventDetail._id,this.state.access).then((val)=>{
      this.setState({userLike:val})
    }).catch(err=>{
      {this.props.error.length === 0 
        ? ""
        :this.props.tokenRenual(this.state.access).then((data)=> {
          this.props.getUser(this.props.token).then(data=>{
            AsyncStorage.setItem('accessToken',this.props.token);
            getUserLike(this.props.navigation.state.params.eventDetail._id,this.state.access).then((val)=>{
              this.setState({userLike:val})
            })
          })
      })
    }
    })
  }
  getLikesCount(){
    {this.props.navigation.state.params.eventDetail ?
      eventsLike(this.props.navigation.state.params.eventDetail._id).then((data)=>{
        if(data){
          this.setState({eventData:data})
        }
        
      })
      :<View/>}
  }
  share(event){
    let url = "http://maps.google.com/maps?q="+event._source.event_lat+","+event._source.event_lng+"&ll="+event._source.event_lat+","+event._source.event_lng+"&z=17"
    SendIntentAndroid.sendText({
      title: 'Select the app to share',
      text: "Event Title:"+event._source.event_title+"\n"+"Date:"+event._source.event_date+"\n"+"Address:"+event._source.event_address+"\n"+"From Time:"+event._source.event_time_from+"\n"+"To Time:"+event._source.event_time_to+"\n"+"Click link to get direction "+url,
      type: SendIntentAndroid.TEXT_PLAIN
    });
   }

   openMap(address){
    SendIntentAndroid.openMaps(address);
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
      var find = ' ';
      var re = new RegExp(find, 'g');
      let title = event._source.event_title.replace(re, '%20');
    SendIntentAndroid.addCalendarEvent({
      title: event._source.event_title,
      description: "https://www.lokally.in/homepage/eventdetails/"+event._id+"/"+title,
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
    AsyncStorage.getItem('userId',(err,value)=>{
      if(value != null){
        obj={
          "user_id" : value,
          "item_id" : this.props.navigation.state.params.eventDetail._id  
        }        
        this.props.userLike(obj,this.state.access).then((data)=>{
          this.getLikesCount()
          this.getLikesDetail()
        })
      }
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
  /*randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }*/
  render() {
    //console.warn(JSON.stringify(this.props.navigation.state.params.eventDetail ))
    //console.warn(this.props.navigation.state.params.tagBanner)
    //console.warn("err",this.props.error,"yok",this.props.token)
    return (
      <Container>
        <Header
          style={styles.headerStyle}>
          <Body
            style={{ flexDirection: "row"}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon active name="arrow-back" style={styles.headerIcons} />
            </Button>
           </Body>
          <Right>
              <Button transparent>
              <Icon name='ios-calendar' style={styles.headerTextIcon} onPress={()=>{this.addEventToCalender(this.props.navigation.state.params.eventDetail)}}/>
              </Button>
              <Button transparent>
              <Icon name='md-share' style={styles.headerTextIcon} onPress={()=>{this.share(this.props.navigation.state.params.eventDetail)}}/>
              </Button>
            </Right>
        </Header>
        <Content
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#fff" }}>
          <View style={{ flex: 1 }}>
            <View >
            <TouchableHighlight onPress={()=>this.ZoomImage()}>
              <Image
                source={{uri:this.props.navigation.state.params.eventDetail  ? this.props.navigation.state.params.eventDetail._source.event_images ? this.props.navigation.state.params.eventDetail._source.event_images[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrHY5zywHTlDyhezSmEXnF7aan7ezaIh62ElV56Jqre-kXaIoHZw" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrHY5zywHTlDyhezSmEXnF7aan7ezaIh62ElV56Jqre-kXaIoHZw"}}
                style={styles.newsPoster}/>
              </TouchableHighlight>
            </View>
            <View style={{ backgroundColor: "#fff" }}>
                <Grid>
                  <Col style={{ flexDirection: "row" }}>
                    {this.state.userLike.user_liked === true ? 
                      <Button onPress={()=>{this.userLikes()}}>
                        <Icon active name="thumbs-up" />
                        <Text>{this.state.eventData.likes}</Text><Text style={{paddingLeft:5}}>Likes</Text>
                      </Button>
                    : <Button transparent onPress={()=>{this.userLikes()}}>
                        <Icon active name="thumbs-up" />
                        <Text>{this.state.eventData.likes}</Text><Text style={{paddingLeft:5}}>Likes</Text>
                    </Button>}
                      
                  </Col>
                  <Col >
                    <Button transparent onPress={()=>{this.props.navigation.navigate('Comments',{id:this.props.navigation.state.params.eventDetail._id,banner:this.props.navigation.state.params.eventDetail._source.event_images[0],dataReturn:this.state.eventData.comments})}}>
                      <Icon active name="chatbubbles" />
                      <Text>{this.state.eventData.comments}</Text><Text style={{paddingLeft:5}}>Comments</Text>
                      </Button>
                  </Col>
                  <Col style={{marginTop:15,marginRight:10}}>
                    <TouchableOpacity style={styles.newsTypeView} onPress={()=>{this.props.navigation.navigate('EventList',{tagName:this.props.navigation.state.params.tagName,banner:this.props.navigation.state.params.tagBanner ? this.props.navigation.state.params.tagBanner :"https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/"+this.props.navigation.state.params.tagName+".jpg"})}}>
                      <Text style={styles.newsTypeText}>{this.props.navigation.state.params.tagName ? this.props.navigation.state.params.tagName.toUpperCase() : this.props.navigation.state.params.eventDetail._source.tags[0].toUpperCase()}</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
            </View>
            <View style={{ backgroundColor: "#fff" }}>
              <View style={styles.newsContent}>
                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <TouchableOpacity>
                      <Text style={styles.eventAddress} numberOfLines={2}>{this.props.navigation.state.params.eventDetail ? this.props.navigation.state.params.eventDetail._source.event_title :''}</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
                {this.props.navigation.state.params.eventDetail ?  this.props.navigation.state.params.eventDetail._source.applicable_for ?
                 <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <TouchableOpacity>
                      <Text style={styles.eventAddress} numberOfLines={2}>Applicable for : {this.props.navigation.state.params.eventDetail ? this.props.navigation.state.params.eventDetail._source.applicable_for :''}</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
                :<View/>:<View/>}
                {this.props.navigation.state.params.eventDetail ? this.props.navigation.state.params.eventDetail._source.event_description ?
                <HTMLView
                    value={this.props.navigation.state.params.eventDetail ? this.props.navigation.state.params.eventDetail._source.event_description :'<p></p>'}					
                    stylesheet={styles.htmlContent}	
                />
                :<View/>:<View/>}
              </View>
              {this.props.navigation.state.params.eventDetail ? this.props.navigation.state.params.eventDetail._source.event_address ?
              <View style={{ padding: 20 }}>
                <Text style={styles.newsHeader} onPress={()=>this.openMap(parseFloat(this.props.navigation.state.params.eventDetail._source.event_lat)+","+parseFloat(this.props.navigation.state.params.eventDetail._source.event_lng))}><Icon name='ios-map-outline' style={styles.timeIcon}/>  {this.props.navigation.state.params.eventDetail._source.event_address.replace(/\n/g, " ")}</Text>
              </View>
              :<View/>:<View/>}
              <View>
                <Grid style={{ paddingLeft: 20 }}>
                  {this.props.navigation.state.params.eventDetail ? this.props.navigation.state.params.eventDetail._source.event_time_from
                  ?
                  <Col style={{ flexDirection: "row",alignItems:'flex-start'}}>
                    <TouchableOpacity>
                      <Text style={styles.newsHeader}><Icon name='ios-timer-outline' style={styles.timeIcon}/>  {this.props.navigation.state.params.eventDetail._source.event_time_from} {this.props.navigation.state.params.eventDetail._source.event_time_to ?  "-" : ''} {this.props.navigation.state.params.eventDetail._source.event_time_to ?  this.props.navigation.state.params.eventDetail._source.event_time_to : ''}</Text>
                    </TouchableOpacity>
                  </Col>
                  :<View/>:<View/>}
                  {this.props.navigation.state.params.eventDetail ? this.props.navigation.state.params.eventDetail._source.payment ?
                  <Col style={{marginRight:20,alignItems:'flex-end'}}>
                    <TouchableOpacity>
                    <Text style={styles.newsHeader}> &#8377; {this.props.navigation.state.params.eventDetail._source.payment}</Text>
                    </TouchableOpacity>
                  </Col> :<View/>:<View/>}
                </Grid>
              </View>
              <View style={{ padding: 20 }}>
              {this.props.navigation.state.params.eventDetail ? this.props.navigation.state.params.eventDetail._source.contact_name ?
                <View style={styles.newsCommentContainer}>
                  <Text style={styles.newsComment}>
                  <Icon name='md-person' style={styles.timeIcon}/>  {this.props.navigation.state.params.eventDetail._source.contact_name}
                  </Text>
                </View> : <View/>:<View/>}
                {this.props.navigation.state.params.eventDetail ? this.props.navigation.state.params.eventDetail._source.contact_number ?
                <View style={styles.newsCommentContainer}>
                  <Text style={styles.newsComment} onPress={()=>{this.phoneDial(this.props.navigation.state.params.eventDetail)}}>
                    <Icon name='ios-phone-portrait' style={styles.timeIcon}/>  {this.props.navigation.state.params.eventDetail._source.contact_number}
                  </Text>
                </View> : <View/>:<View/>}
                {this.props.navigation.state.params.eventDetail ? this.props.navigation.state.params.eventDetail._source.contact_email ?
                <View style={styles.newsCommentContainer}>
                  <Text style={styles.newsComment} onPress={()=>{this.email(this.props.navigation.state.params.eventDetail)}}>
                    <Icon name='md-mail' style={styles.timeIcon}/>  {this.props.navigation.state.params.eventDetail._source.contact_email}
                  </Text>
                </View> : <View/>:<View/>}  
                {this.props.navigation.state.params.eventDetail ? this.props.navigation.state.params.eventDetail._source.website ?
                <View style={styles.newsCommentContainer}>
                  <Text style={styles.newsComment} onPress={()=>{this.openbrowser(this.props.navigation.state.params.eventDetail._source.website)}}>
                    <Icon name='md-globe' style={styles.timeIcon}/>  {this.props.navigation.state.params.eventDetail._source.website}
                  </Text>
                </View> : <View/> : <View/>}
                
               </View>
               {this.props.navigation.state.params.eventDetail ? this.props.navigation.state.params.eventDetail._source.tags && this.props.navigation.state.params.eventDetail._source.tags.length > 1 ?
                <View style={{ paddingLeft: 20,paddingBottom:20 }}>
                  {/* <Text style={styles.newsHeader}>Tags</Text>                     */}
                  <Grid>
                    {this.props.navigation.state.params.eventDetail._source.tags.map((tag,key)=>
                      <View style={{ flexDirection: "row",paddingRight:10,marginTop:10}} key={key}>
                          <Button bordered style={{padding:0,borderRadius:10,borderColor:'#01cca1'}} onPress={()=>{this.props.navigation.navigate('EventList',{tagName:tag,banner:"https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/"+tag+".jpg"})}}><Text>{tag}</Text></Button>
                      </View>)}
                  </Grid>
                </View>
                :<View/>:<View/>}
            </View>
          {this.props.navigation.state.params.eventDetail ?
             <View style ={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                  latitude: parseFloat(this.props.navigation.state.params.eventDetail._source.event_lat),
                  longitude: parseFloat(this.props.navigation.state.params.eventDetail._source.event_lng),
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
                >
                <MapView.Marker
                  coordinate={{
                    latitude:parseFloat(this.props.navigation.state.params.eventDetail._source.event_lat),
                    longitude:parseFloat(this.props.navigation.state.params.eventDetail._source.event_lng)
                    }}
                  />
              </MapView>
            </View>:<View/>}
            <View>
              {this.state.comment === true ? <Comments /> : 
              <View/>}
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}



export default EventDetail;

import React, { Component } from "react";
import {Image,TouchableOpacity,TouchableHighlight,Platform,View as RNView,AsyncStorage} from "react-native";
import {Container,Header,Content,Text,Button,Icon,Body,View,Right} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import SendIntentAndroid from 'react-native-send-intent';
import styles from "./styles";
import MapView from 'react-native-maps';
import HTMLView from 'react-native-htmlview';
import {eventsLike,getUserLike,share} from '../../utilities/config';
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
import Orientation from 'react-native-orientation';
const find = ' ';
const re = new RegExp(find, 'g');

class NewsDetail extends Component {

  constructor(props) {
    super(props);
    tracker.trackScreenView('News');
    this.state={
      eventData:[],
      userLike:'',
      access:'',
      userId:''
    }
  }
  componentDidMount(){
    Orientation.lockToPortrait();
    this.getLikesCount(this.props.navigation.state.params.newsDetail._id);
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
    getUserLike(this.props.navigation.state.params.newsDetail._id,this.state.access).then((val)=>{
      this.setState({userLike:val})
    }).catch(err=>{
      {this.props.error.length === 0 
        ? ""
        :this.props.tokenRenual(this.state.access).then((data)=> {
          this.props.getUser(this.props.token).then(data=>{
            AsyncStorage.setItem('accessToken',this.props.token);
            getUserLike(this.props.navigation.state.params.newsDetail._id,this.state.access).then((val)=>{
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
  share(news){
    let shareObj = {
      "user_id" : this.props.navigation.state.params.newsDetail._id ,
      "item_id" : this.state.userId,
      "shared_to" : "clustrex",
      "shared_via" : "facebook" 
    }
    let link = "https://www.lokally.in/news/"+news._id+"/"+news._source.news_title.replace(re, '%20') 
    SendIntentAndroid.sendText({
      title: 'Select the app to share',
      text: "News Title:"+news._source.news_title+"\n"+"Date:"+news._source.news_date+"\n Visit:"+link,
      type: SendIntentAndroid.TEXT_PLAIN
    });
    share(shareObj,this.state.access).then((data)=>console.log(JSON.stringify(data)))
   }
   userLikes(){
    var obj = {};
    obj={
      "user_id" : this.state.userId,
      "item_id" : this.props.navigation.state.params.newsDetail._id  
    }        
    this.props.userLike(obj,this.state.access).then((data)=>{
      this.getLikesCount(this.props.navigation.state.params.newsDetail._id )
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
  ZoomImage(){
    this.props.navigation.navigate('ImageZoomRender',{url:this.props.navigation.state.params.newsDetail._source.news_images[0]})
  }
  render() {
    let news = this.props.navigation.state.params.newsDetail;
    let tagName =   this.props.navigation.state.params.tagName;
    let eventData = this.state.eventData;
    return (
      <Container>
        <Header
          style={styles.headerStyle}
        >
          <Body
            style={{ flexDirection: "row"}}
          >
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon active name="arrow-back" style={styles.headerIcons} />
            </Button>
           </Body>
          <Right>
              <Button transparent>
                <Icon name='md-share' style={styles.headerTextIcon} onPress={()=>{this.share(news)}}/>
              </Button>
            </Right>
        </Header>
        {news ?
        <Content
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#fff" }} >
          <View style={{ flex: 1 }}>
            <View>
              <TouchableHighlight onPress={()=>this.ZoomImage()}>
                <Image
                  source={{uri:news ? news._source.news_images[0] :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHiFmcCg3P_ZgzQq71S8y0NqAoLwtJF05xGYh-a9bIqfcxyYru"}}
                  style={styles.newsPoster}
                />
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
                  <Col>
                    <Button transparent onPress={()=>{this.props.navigation.navigate('Comments',{id:news._id,banner:news._source.news_images[0],dataReturn:eventData.comments,returnData: this.getLikesCount.bind(this)})}}>
                      <Icon active name="chatbubbles" />
                      <Text>{eventData.comments}</Text><Text style={{paddingLeft:5}}>Comments</Text>
                      </Button>
                  </Col>
                  <Col style={{marginTop:15,marginRight:10}}>
                    <TouchableOpacity style={styles.newsTypeView} onPress={()=>{this.props.navigation.navigate('NewsList',{tagName:tagName,banner:this.props.navigation.state.params.tagBanner ? this.props.navigation.state.params.tagBanner : "https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/"+tagName+".jpg"})}}>
                      <Text style={styles.newsTypeText}>{tagName.toUpperCase()}</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
            </View>
            <View style={{ backgroundColor: "#fff" }}>
              <View style={styles.newsContent}>
                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <TouchableOpacity>
                      <Text style={styles.eventAddress} numberOfLines={2}>{news ? news._source.news_title.toUpperCase() : <Text/>}</Text>
                    </TouchableOpacity>
                  </Col>                  
                </Grid>
                {news._source.news_author ? 
                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <Text style={styles.newsLink}>
                      Posted By: { news._source.news_author} {news._source.news_date ? `at `+news._source.news_date : ""}<Text/>
                    </Text>
                    </Col>
                </Grid>:<View/>}
                {news._source.news_body ?
                <Grid style={{ paddingBottom: 20 }}>
                  <Col>
                      {/* {this.props.navigation.state.params.newsDetail._source.news_body
                                .split('. ').map((item,key) => <Text style={styles.displaylinebreak} key={key}>{item}</Text>)} */}
                     <HTMLView
                        value={news._source.news_body}					
                        stylesheet={styles.displaylinebreak}/>
                    </Col>
                </Grid>:<View/>}
              </View>
              {news._source.tags && news._source.tags.length > 1 ?
                <View style={{ paddingLeft: 10,paddingBottom:20 }}>
                  <Grid>
                    {news._source.tags.map((tag,key)=>
                      <View style={{ flexDirection: "row",paddingRight:5,marginTop:10}} key={key}>
                          <Button bordered style={{padding:0,borderRadius:10,borderColor:'#01cca1'}} onPress={()=>{this.props.navigation.navigate('NewsList',{tagName:tag,banner:"https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/"+tag+".jpg"})}}><Text>{tag}</Text></Button>
                      </View>)}
                  </Grid>
                </View>
                :<View/>}
            </View>
            {news._source.news_location_lat && news._source.news_location_lng ?
            <View style ={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={{
                  latitude: parseFloat(news._source.news_location_lat),
                  longitude: parseFloat(news._source.news_location_lng),
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
              >
              <MapView.Marker
                  coordinate={{
                    latitude:parseFloat(news._source.news_location_lat),
                    longitude: parseFloat(news._source.news_location_lng)
                    }}
                  />
              </MapView>
            </View>
            :<Text/>}
          </View>
        </Content>:<Content/>}
      </Container>
    );
  }
}


export default NewsDetail;

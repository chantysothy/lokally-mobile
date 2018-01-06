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
import {eventsLike,getUserLike} from '../../utilities/config';

class DealDetail extends Component {
 
  constructor(props) {
    super(props);
    tracker.trackScreenView('Deal');
    this.state={
      access:'',
      userLike:'',
      eventData:[]
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
    SendIntentAndroid.sendText({
      title: 'Select the app to share',
      text: "Deal Title:'"+deal._source.deal_title+"\n"+"Deal Brand"+deal._source.brand+"\n"+"Offer expires at "+deal._source.deal_end_date,
      type: SendIntentAndroid.TEXT_PLAIN
    });
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
  ZoomImage(){
    this.props.navigation.navigate('ImageZoomRender',{url:this.props.navigation.state.params.dealDetail._source.deal_images[0]})
  }
  userLikes(){
    var obj={};
    AsyncStorage.getItem('userId',(err,value)=>{
      if(value != null){
        obj={
          "user_id" : value,
          "item_id" : this.props.navigation.state.params.dealDetail._id  
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
  render() {
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
              <Icon name='md-share' style={styles.headerTextIcon} onPress={()=>{this.share(this.props.navigation.state.params.dealDetail)}}/>
            </Button>
          </Right>
        </Header>
        <Content
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#fff" }} >
          <View style={{ flex: 1}}>
            <View>
              <TouchableHighlight onPress={()=>this.ZoomImage()}>
                <Image
                  source={{uri:this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.deal_images[0] :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPSqAqGclJSd4phB6EmUWv2_05-WXBGdDzmcoMyMv971rnmTSjXg"}}
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
                <Button transparent onPress={()=>{this.props.navigation.navigate('Comments',{id:this.props.navigation.state.params.dealDetail._id,banner:this.props.navigation.state.params.dealDetail._source.deal_images[0],dataReturn:this.state.eventData.comments,returnData: this.getLikesCount.bind(this)})}}>
                  <Icon active name="chatbubbles" />
                  <Text>{this.state.eventData.comments}</Text><Text style={{paddingLeft:5}}>Comments</Text>
                  </Button>
              </Col>
                  <Col style={{marginTop:15,marginRight:10}}>
                    <TouchableOpacity style={styles.newsTypeView} onPress={()=>{this.props.navigation.navigate('DealList',{tagName:this.props.navigation.state.params.tagName,banner:this.props.navigation.state.params.tagBanner ? this.props.navigation.state.params.tagBanner : "https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/"+this.props.navigation.state.params.tagName+".jpg"})}}>
                      <Text style={styles.newsTypeText}>{this.props.navigation.state.params.tagName.toUpperCase()}</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
            </View>
            <View style={{ backgroundColor: "#fff" }}>
              <View style={styles.newsContent}>
                <Grid>
                  <Col style={{ flexDirection: "row" }}>
                    <TouchableOpacity>
                      <Text style={styles.eventAddress} numberOfLines={1}>{this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.deal_title:""}</Text>
                    </TouchableOpacity>
                  </Col>
                </Grid>
                {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.sold_by ?
                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <Text style={styles.eventAddress}>
                      # {this.props.navigation.state.params.dealDetail._source.sold_by}
                    </Text>
                    </Col>
                </Grid>:<View/>:<View/>}
              </View>
              {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.brand ?
              <View style={{ padding: 20 }}>
                <Text style={styles.newsHeader}>Brand : <Text style={styles.newsComment}>{this.props.navigation.state.params.dealDetail._source.brand }</Text></Text>
              </View> : <View/>:<View/>}       
              {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.payment ?
              <View style={{ padding: 20 }}>
                <Text style={styles.newsHeader}>Payment : <Text style={styles.newsComment}>{this.props.navigation.state.params.dealDetail._source.payment }</Text></Text>
              </View> : <View/>:<View/>}              
              {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.product_code ?
              <View style={{ paddingLeft: 20 }}>
                <Text style={styles.newsHeader}>Product Code : <Text style={styles.newsComment}>{this.props.navigation.state.params.dealDetail._source.product_code}</Text></Text>
              </View> : <View/>:<View/>}
              {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.deal_type ? 
                <View style={{ padding: 20 }}>
                <Text style={styles.newsHeader}>Deal Type : <Text style={styles.newsComment}>{this.props.navigation.state.params.dealDetail._source.deal_type}</Text></Text>
              </View> : <View/>:<View/>}
              {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.city ? 
                <View style={{ paddingLeft: 20 }}>
                <Text style={styles.newsHeader}>City : <Text style={styles.newsComment}>{this.props.navigation.state.params.dealDetail._source.city}</Text></Text>
              </View> : <View/>:<View/>} 
              {this.props.navigation.state.params.dealDetail ?this.props.navigation.state.params.dealDetail._source.type ? 
                <View style={{ padding: 20 }}>
                <Text style={styles.newsHeader}>Type : <Text style={styles.newsComment}>{this.props.navigation.state.params.dealDetail._source.type}</Text></Text>
              </View> : <View/>:<View/>}
              {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.deal_end_date ? 
                <View style={{ paddingLeft: 20 ,paddingBottom:20}}>
                <Text style={styles.newsHeader}>Validity : <Text style={styles.newsComment}>{this.props.navigation.state.params.dealDetail._source.deal_end_date}</Text></Text>
              </View> : <View/>:<View/>}
              {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.deal_body ?
                <View style={styles.newsContentBody}>
                    <HTMLView
                          value={this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.deal_body:''}					
                          stylesheet={styles.newsHeader}	
                      />
                </View>
              :<View/>:<View/>}
              
              <View style={{ padding: 20 }}>
                {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.contact_name ?
                  <View style={styles.newsCommentContainer}>
                    <Text style={styles.newsComment}>
                    <Icon name='md-person' style={styles.timeIcon}/>  {this.props.navigation.state.params.dealDetail._source.contact_name}
                    </Text>
                  </View> : <View/>:<View/>}
                  {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.contact_number ?
                  <View style={styles.newsCommentContainer}>
                    <Text style={styles.newsComment} onPress={()=>{this.phoneDial(this.props.navigation.state.params.dealDetail)}}>
                    <Icon name='ios-phone-portrait' style={styles.timeIcon}/>  {this.props.navigation.state.params.dealDetail._source.contact_number}
                    </Text>
                  </View> : <View/>:<View/>}
                  {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.website ?
                  <View style={styles.newsCommentContainer}>
                    <Text style={styles.newsComment} onPress={()=>{this.openbrowser(this.props.navigation.state.params.dealDetail._source.website)}}>
                    <Icon name='md-globe' style={styles.timeIcon}/>  {this.props.navigation.state.params.dealDetail._source.website}
                    </Text>
                  </View> : <View/>:<View/>}
               </View>
               {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.tags && this.props.navigation.state.params.dealDetail._source.tags.length > 1 ?
                <View style={{ paddingLeft: 20,paddingBottom:20 }}>
                  {/* <Text style={styles.newsHeader}>Tags</Text>                     */}
                  <Grid>
                    {this.props.navigation.state.params.dealDetail._source.tags.map((tag,key)=>
                      <View style={{ flexDirection: "row",paddingRight:10,marginTop:10}} key={key}>
                          <Button bordered style={{padding:0,borderRadius:10,borderColor:'#01cca1'}} onPress={()=>{this.props.navigation.navigate('DealList',{tagName:tag,banner:"https://s3.ap-south-1.amazonaws.com/lokally-images/tag-images/"+tag+".jpg"})}}><Text>{tag}</Text></Button>
                      </View>)}
                  </Grid>
                </View>
                :<View/>:<View/>}
               {this.props.navigation.state.params.dealDetail ? this.props.navigation.state.params.dealDetail._source.terms_and_condition.length > 0 ?
                <View>
                  <Text style={styles.terms_and_condition}>Terms and Condition</Text>
                  <View style={{ padding: 20 }}>
                    {this.props.navigation.state.params.dealDetail._source.terms_and_condition.map((term,key)=>
                        <View style={styles.newsCommentContainer} key={key}>
                          <Text style={styles.newsComment}>
                            {term}
                          </Text>
                        </View>)}               
                  </View>
                </View>
                :<View/>:<View/>}
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

export default DealDetail;

// @flow
import React, { Component } from "react";
import { Image, View,Platform,TouchableOpacity, Alert,ScrollView,AsyncStorage ,TouchableHighlight} from "react-native";
import {Container,Header,Text,Input,Button,Icon,Body,Item,Tabs,Tab,Content,Right,List,Spinner,Card,CardItem,Label,Thumbnail} from "native-base";
import styles from "./style";
import Orientation from 'react-native-orientation';
const datas =["hai","hello"]
import {getCommentsById,deleteCommentById} from "../../utilities/config";
import moment from 'moment';

const bg = require("../../assets/bg-transparent.png");
let count = 0; 
// import Timestamp from 'react-timestamp';
// import TimeAgo from 'react-native-timeago';

class Comments extends Component {
 
  constructor(props) {
    super(props);
    this.state={
        comments:[],
        access:'',
        message:"",
        disable:false,
        userId:'',
        fetched:false,
        isfetching:false
    }
  }
  componentWillMount(){
    count = 0;
    Orientation.lockToPortrait();
    AsyncStorage.getItem('accessToken',(err,value)=>{
        if(value != null){
          this.setState({access:value})
        }
      })
      this.props.getComments(this.props.navigation.state.params.id,count).then((data)=>{
        this.setState({fetched:true})
      })
    AsyncStorage.getItem('userId',(err,value)=>{
      if(value != null){
        this.setState({userId:value})
      }
    })
  }
  loadMore(){
    this.setState({isFetching:true})
    count+=5
    this.props.getComments(this.props.navigation.state.params.id,count).then((data)=>{
      this.setState({fetched:true,isFetching:false})
    })
  }
  deleteComment(id){
    deleteCommentById(id,this.state.access).then((data)=>{
      console.warn(JSON.stringify(data))
    })
    console.warn(id,this.state.access)

  }
  sendComment(){
    this.setState({disable:true})
    var obj={};
    AsyncStorage.getItem('userId',(err,value)=>{
      if(value != null){
        this.setState({userId:value})
        obj={
            "comment" : this.state.message,
            "item_id" : this.props.navigation.state.params.id,  
            "user_id" : value          
        }
        if(this.state.message != ""){
          this.props.userComments(obj,this.state.access).then(data=>{
            if(this.props.comment.status){
              count=0
              this.props.getComments(this.props.navigation.state.params.id,count).then((data)=>{
                this.setState({comments:data})
              })
            }else{
                Alert.alert("Failure","Something went wrong please try again after some time")
            }
          })
        }
      }
    })
    {this.props.error.length === 0 
        ? ""
        :this.props.tokenRenual(this.state.access).then((data)=> {
          this.props.getUser(this.props.token).then(data=>{       
            AsyncStorage.setItem('accessToken',this.props.token);
            if(this.state.message != ""){
              this.props.userComments(obj,this.state.access).then(data=>{
                if(this.props.comment.status){
                  count=0
                  getCommentsById(this.props.navigation.state.params.id,count).then((data)=>{
                    this.setState({comments:data})
                  })
                }else{
                    Alert.alert("Failure","Something went wrong please try again after some time")
                }
              })
            }
          })
      })
    }
  }
  timestamp(time){
    var newDate = new Date(Number(time))
    return newDate
  }
  render() {
    //console.warn(JSON.stringify(this.props.commentData))
    return (
      <Container>
        <Image source={bg} style={styles.container}>
            <Header
              style={styles.headerStyle}>
              <Body
                style={{ flexDirection: "row"}}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                  <Icon active name="arrow-back" style={styles.headerIcons} />
                </Button>
              </Body>
              <Right/>
            </Header> 
          <Content scrollEnabled={true}
            extraScrollHeight={-13}
            contentContainerStyle={styles.commentHeadbg}>
             <Image
              source={{uri:this.props.navigation.state.params.banner  ? this.props.navigation.state.params.banner: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrHY5zywHTlDyhezSmEXnF7aan7ezaIh62ElV56Jqre-kXaIoHZw"}}
              style={styles.newsPoster}/>
            <ScrollView>
            {this.props.commentData.length > 0
              ?<View style={{ backgroundColor: "#FFF" }}>
                <List
                  dataArray={this.props.commentData}
                  renderRow={data =>
                    <Card style={styles.card}  onLongPress ={(e)=>{console.warn(' onLongPress');}}>
                      <CardItem style={styles.cardHeader} header>
                        <Thumbnail
                          small
                          source={{uri:'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png'}}
                          style={
                            Platform.OS === "android"
                              ? { borderRadius: 40, alignSelf: "flex-start" }
                              : { alignSelf: "flex-start" }
                          }
                        />
                        <View>
                          <Text style={styles.commentName}>
                            {this.state.userId === data._source.user_id ? "You" : data._source.user_name === "-" || !data._source.user_name ? "User" : data._source.user_name }
                          </Text>
                          {data._source.created_date ?
                          <Text style={styles.date}>
                              {/* <Icon name="ios-time-outline" style={styles.timeIcon} /> */}
                              {this.timestamp(data._source.created_date).toString().substring(3,21)}
                          </Text>:<Text/>} 
                          <Text style={styles.commentText}>
                          {data._source.comment}
                          </Text>                          
                        </View>
                        {/* <View style={styles.commentLikeView}>
                            <Button transparent medium onPress={()=>this.editComment()}>
                                <Icon name="md-brush" style={styles.attachIconEdit} />
                            </Button>
                            <Button transparent medium  onPress={()=>this.deleteComment(data._id)}>
                                <Icon name="md-trash" style={styles.attachIconDelete} />
                            </Button>
                        </View>
                        {data._source.created_date ?
                        <View style={styles.commentDateView}>
                            <Icon name="ios-time-outline" style={styles.timeIcon} />
                             <Text style={styles.date}>
                              {/* <Timestamp time={data._source.created_date}  format='ago' precision={1} component={Text}/> */}
                              {/* <TimeAgo time={moment.unix(data._source.created_date)}/> *}
                              {this.timestamp(data._source.created_date).toString().substring(3,21)}
                             </Text>
                        </View>
                        :<View/>} */}
                      </CardItem>
                    </Card>}
                />
              </View>
              :<Button style={{backgroundColor:'white',borderRadius:10,marginTop:120,alignSelf: "center"}}><Text style={{ color:'black'}}>No Comments Available</Text></Button>}
               {this.state.fetched === true && this.props.totalData > count+5 ?
                <Button style={{backgroundColor:'white',borderRadius:10,marginTop:20,marginBottom:20,alignSelf: "center"}} onPress={()=>this.loadMore()}><Text style={{ color:'black'}}>More Comments</Text></Button>
              :<View/>} 
              {this.state.isFetching === true ? <Spinner style={{marginTop:10}} color='#fff'/> :<View/>}
              </ScrollView>
            <View style={styles.commentBox}>
              <Item style={{ alignItems: "center" }} inlineLabel>
                <Icon name="ios-text" style={styles.attachIcon} />
                <Input
                  onChangeText={(text) => { this.setState({ message: text }) }}
                  placeholder="Enter your comment"
                  placeholderTextColor="#797979"
                  style={styles.input}
                />
                {this.state.disable === false ? 
                <Button transparent medium style={{ alignSelf: "center" }} onPress={()=>this.sendComment()}>
                    <Icon name="md-send" style={styles.attachIcon} />
                </Button>
                :<Button transparent medium style={{ alignSelf: "center" }}>
                    <Icon name="md-send" style={styles.attachIcon} />
                </Button>}
              </Item>
            </View>
          </Content>
        </Image>
      </Container>
    );
  }
}

export default Comments;

/*

// @flow
import React, { Component } from "react";
import { Image, View,Platform,TouchableOpacity, Alert,ScrollView,AsyncStorage ,TouchableHighlight} from "react-native";
import {Container,Header,Text,Input,Button,Icon,Body,Item,Tabs,Tab,Content,Right,List,Spinner,Card,CardItem,Label,Thumbnail} from "native-base";
import styles from "./style";
import Orientation from 'react-native-orientation';
const datas =["hai","hello"]
import {getCommentsById} from "../../utilities/config";

const bg = require("../../assets/bg-transparent.png");
let count = 0; 

class Comments extends Component {
 
  constructor(props) {
    super(props);
    this.state={
        comments:[],
        access:'',
        message:"",
        disable:false,
        userId:'',
        fetched:false,
        isfetching:false
    }
  }
  componentWillMount(){
    count = 0;
    Orientation.lockToPortrait();
    AsyncStorage.getItem('accessToken',(err,value)=>{
        if(value != null){
          this.setState({access:value})
        }
      })
    this.props.getComments(this.props.navigation.state.params.id,count).then((data)=>{
      if(this.props.commentData){
        this.setState({fetched:true,isfetching:false})
      }
    })
    AsyncStorage.getItem('userId',(err,value)=>{
      if(value != null){
        this.setState({userId:value})
      }
    })
  }
  loadMore(){
    this.setState({isFetching:true})
    count+=5
    this.props.getComments(this.props.navigation.state.params.id,count).then((data)=>{
      this.setState({fetched:true,isFetching:false})
    })
  }
  sendComment(){
    this.setState({disable:true})
    var obj={};
    AsyncStorage.getItem('userId',(err,value)=>{
      if(value != null){
        this.setState({userId:value})
        obj={
            "comment" : this.state.message,
            "item_id" : this.props.navigation.state.params.id,  
            "user_id" : value          
        }
        if(this.state.message != ""){
          this.props.userComments(obj,this.state.access).then(data=>{
            if(this.props.comment.status){
              count=0
              this.props.getComments(this.props.navigation.state.params.id,count).then((data)=>{
                    this.setState({comments:data.hits.hits,message:"",disable:false,fetched:true,isFetching:false})
                })
            }else{
                Alert.alert("Failure","Something went wrong please try again after some time")
            }
          })
        }
      }
    })
    {this.props.error.length === 0 
        ? ""
        :this.props.tokenRenual(this.state.access).then((data)=> {
          this.props.getUser(this.props.token).then(data=>{       
            AsyncStorage.setItem('accessToken',this.props.token);
            if(this.state.message != ""){
              this.props.userComments(obj,this.state.access).then(data=>{
                if(this.props.comment.status){
                  count=0
                  this.props.getComments(this.props.navigation.state.params.id,count).then((data)=>{
                        this.setState({message:"",disable:false,fetched:true,isFetching:false})
                    })
                }else{
                    Alert.alert("Failure","Something went wrong please try again after some time")
                }
              })
            }
          })
      })
    }
  }
  render() {
    return (
      <Container>
        <Image source={bg} style={styles.container}>
            <Header
              style={styles.headerStyle}>
              <Body
                style={{ flexDirection: "row"}}>
                <Button transparent onPress={() => this.props.navigation.goBack()}>
                  <Icon active name="arrow-back" style={styles.headerIcons} />
                </Button>
              </Body>
              <Right/>
            </Header> 
          <Content scrollEnabled={true}
            extraScrollHeight={-13}
            contentContainerStyle={styles.commentHeadbg}>
            <ScrollView>
            <Card style={styles.card}>
                <CardItem style={styles.cardHeaderImage}>
                  <TouchableHighlight >
                    <Image
                        source={{uri:this.props.navigation.state.params.banner  ? this.props.navigation.state.params.banner: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrHY5zywHTlDyhezSmEXnF7aan7ezaIh62ElV56Jqre-kXaIoHZw"}}
                         style={styles.newsPoster}/>
                  </TouchableHighlight>
                </CardItem>
              </Card>
            {this.props.commentData.length > 0
              ?<View style={{ backgroundColor: "#FFF" }}>
                <List
                  dataArray={this.props.commentData}
                  renderRow={data =>
                    <Card style={styles.card}>
                      <CardItem style={styles.cardHeader} header>
                        <Thumbnail
                          small
                          source={{uri:'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png'}}
                          style={
                            Platform.OS === "android"
                              ? { borderRadius: 40, alignSelf: "flex-start" }
                              : { alignSelf: "flex-start" }
                          }
                        />
                        <View>
                          <Text style={styles.commentName}>
                            {this.state.userId === data._source.user_id ? "You" : data._source.user_id}
                          </Text>
                          <Text style={styles.commentText}>
                          {data._source.comment}
                          </Text>                          
                        </View>
                      </CardItem>
                    </Card>}
                />
              </View>
              :<Button style={{backgroundColor:'white',borderRadius:10,marginTop:120,alignSelf: "center"}}><Text style={{ color:'black'}}>No Comments Available</Text></Button>}
              {this.state.fetched === true && this.props.totalData > count+5 ?
                <Button style={{borderRadius:10,backgroundColor:'white',alignSelf:'center',padding:10,margin:20}} onPress={()=>this.loadMore()} ><Text style={{color:'black'}}>Load More Comments</Text></Button>
              :<View/>} 
          {this.state.isFetching === true ? <Spinner style={{marginTop:10}} color='white'/> :<View/>}
            </ScrollView>
            <View style={styles.commentBox}>
              <Item style={{ alignItems: "center" }} inlineLabel>
                <Icon name="ios-text" style={styles.attachIcon} />
                <Input
                  onChangeText={(text) => { this.setState({ message: text }) }}
                  placeholder="Enter your comment"
                  placeholderTextColor="#797979"
                  style={styles.input}
                />
                {this.state.disable === false ? 
                <Button transparent medium style={{ alignSelf: "center" }} onPress={()=>this.sendComment()}>
                    <Icon name="md-send" style={styles.attachIcon} />
                </Button>
                :<Button transparent medium style={{ alignSelf: "center" }}>
                    <Icon name="md-send" style={styles.attachIcon} />
                </Button>}
              </Item>
            </View>
          </Content>
        </Image>
      </Container>
    );
  }
}

export default Comments;
*/
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
let id = "";
let banner = "";
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
        isfetching:false,
        commented:false
    }
  }
  componentWillMount(){
    count = 0;
    Orientation.lockToPortrait();
    id = this.props.navigation.state.params.id;
    banner = this.props.navigation.state.params.banner;
    AsyncStorage.getItem('accessToken',(err,value)=>{
        if(value != null){
          this.setState({access:value})
        }
      })
    {this.props.navigation.state.params.dataReturn != 0 ?
      this.getComment()      
    :
    this.props.getComments(this.props.navigation.state.params.id,count,5).then((data)=>{
      this.setState({fetched:true,isfetching:false})
    })}
    
    AsyncStorage.getItem('userId',(err,value)=>{
      if(value != null){
        this.setState({userId:value})
      }
    })
  }
  getComment(){
    this.setState({isfetching:true})
    this.props.getComments(this.props.navigation.state.params.id,count,5).then((data)=>{
      this.setState({fetched:true,isfetching:false})
    })
  }
  loadMore(){
    this.setState({isFetching:true})
    count+=5
    this.props.getComments(this.props.navigation.state.params.id,count,5).then((data)=>{
      this.setState({fetched:true,isFetching:false})
    })
  }
  deleteComment(id){
    deleteCommentById(id,this.state.access).then((data)=>{
      console.warn(JSON.stringify(data))
    })
  }
  sendComment(){
    this.setState({disable:true,isfetching:true})
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
            this.setState({commented:true})
            if(this.props.comment.status){
              count = this.props.totalData+1
              this.props.getComments(this.props.navigation.state.params.id,0,this.props.totalData+1).then((data)=>{
                this.setState({comments:data,isfetching:false,commented:false})
              })
              //this.props.navigation.navigate('Comments',{id:id,banner:banner,dataReturn:this.props.totalData+1})
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
                  this.setState({isfetching:true})
                  getCommentsById(this.props.navigation.state.params.id,count,5).then((data)=>{
                    this.setState({comments:data,isfetching:false})
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
    return (
      <Container>
        <Image source={bg} style={styles.container}>
            <Header
              style={styles.headerStyle}>
              <Body
                style={{ flexDirection: "row"}}>
                <Button transparent 
                        onPress={() => {
                          this.props.navigation.state.params.returnData(this.props.navigation.state.params.id);
                          this.props.navigation.goBack()
                        }}>
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
              ?
              <View style={{ backgroundColor: "#FFF" }}>
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
              :
              this.props.navigation.state.params.dataReturn === 0 ?
                <Button style={{backgroundColor:'white',borderRadius:10,marginTop:100,alignSelf: "center"}}>
                    <Text style={{ color:'black'}}>No Comments Available</Text>
                </Button>
              :
              <Spinner style={{marginTop:50}} color='#fff'/>  
              }
              {this.state.fetched === true && this.state.isfetching === false && this.props.totalData > count+5 &&
                <Button style={{backgroundColor:'white',borderRadius:10,marginTop:20,marginBottom:20,alignSelf: "center"}} onPress={()=>this.loadMore()}>
                  <Text style={{ color:'black'}}>More Comments</Text>
                </Button>
              }            
              </ScrollView>
              {!this.state.commented ?
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
              :<View/>}
          </Content>
        </Image>
      </Container>
    );
  }
}

export default Comments;
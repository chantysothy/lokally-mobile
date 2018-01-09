import React, { Component } from "react";
import {Image,TouchableOpacity,Platform} from "react-native";
import {Container,Header,Content,Text,Button,Icon,Title,Right,Body,View,Spinner,Card,CardItem,Thumbnail} from "native-base";
import styles from "./styles";
const primary = require("../../theme/variables/commonColor").brandPrimary;
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
let count = 0;
import Orientation from 'react-native-orientation';

class DealList extends Component {
  constructor(props){
    super(props);
    tracker.trackScreenView('Deal List');
    this.state = {
      fetched: false,
      deal:[],
      follow:"Follow",
      isFetching:false
    };
}

componentWillMount() {
  Orientation.lockToPortrait();
  count = 0;
  this.props.getAllDeal(this.props.navigation.state.params.tagName,count).then(data => {
     this.setState({
        deal:this.props.deals,
        fetched: true
     });
   });
}
fetchNextData(){
  this.setState({isFetching:true})
  count+=5;
  this.props.getAllDeal(this.props.navigation.state.params.tagName,count).then(data => {
    this.setState({
       fetched: true,
       isFetching: false
    });
  });
}
 follow(value){
  if(value==="Follow"){
    this.setState({follow:"Following"})
  }else this.setState({follow:"Follow"})
}

  render() {
    let navigation = this.props.navigation;
    let tagName = this.props.navigation.state.params.tagName;
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        <Header>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon active name="arrow-back" />
            </Button>
            <Body style={{ flexDirection: "row" }}>
              <Title>Deal List</Title>
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
                      : styles.ioschannelHeader
                  }>
                  {tagName.toUpperCase()}
                </Text>
                <Button
                  rounded
                  style={styles.followBtn}
                  onPress={() => this.follow(this.state.follow)}
                >
                  <Text
                    style={
                      Platform.OS === "android"
                        ? {
                            color: primary,
                            fontSize: 13,
                            fontWeight: "900",
                            textAlign: "center"
                          }
                        : { color: primary, fontSize: 13, fontWeight: "900" }
                    }
                  >
                    {this.state.follow}
                  </Text>
                </Button>
                <View style={{ padding: 0 }}>
                  <Text style={styles.noOfFollowers}>234K Followers</Text>
                </View>
              </View>
            </Image>
          </View>
          {this.state.fetched === true ? 
          <View foregroundColor={"white"} style={{ backgroundColor: "#fff" }}>          
            {this.props.deals.map((deal, key) => (
              <TouchableOpacity key={key}
              style={{ flexDirection: "row" }}
              onPress={() => {
                    tracker.trackEvent('Deal',tagName);
                    navigation.navigate("DealDetail",{dealDetail:deal,tagName:tagName,tagBanner:this.props.navigation.state.params.banner})}
                  }>
              <Card style={styles.card} >
              <CardItem style={styles.cardHeader} header>
                <Thumbnail
                  large
                  source={{uri:deal._source.deal_images ? deal._source.deal_images[0]:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPSqAqGclJSd4phB6EmUWv2_05-WXBGdDzmcoMyMv971rnmTSjXg"}}
                  style={
                    Platform.OS === "android"
                      ? { borderRadius: 10, alignSelf: "flex-start" }
                      : { alignSelf: "flex-start" }
                  }/>
                <View>
                  <Text numberOfLines={3} style={styles.commentName}>
                    {deal._source.deal_title}
                  </Text>
                </View>
              </CardItem>
            </Card>
            </TouchableOpacity>))}           
          </View>: <Spinner style={{marginTop:200}} color='#01cca1'/>}
          {this.state.fetched === true && this.props.totalData > count+5 ?
            <Button style={{borderRadius:10,alignSelf:'center',padding:10,margin:20}} onPress={()=>this.fetchNextData()}><Text>More</Text></Button>
          :<View/>} 
          {this.state.isFetching === true ? <Spinner style={{marginTop:10}} color='#01cca1'/> :<View/>}
        </Content>
      </Container>
    );
  }
}

export default DealList;

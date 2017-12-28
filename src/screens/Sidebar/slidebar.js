import React, { Component } from "react";
import { Image, TouchableOpacity, AsyncStorage } from "react-native";
import { NavigationActions } from "react-navigation";
import {Container,Content,Text,Icon,ListItem,Thumbnail,View} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import styles from "./style";
import Orientation from 'react-native-orientation';

export default class SideBar extends Component {
  constructor(props){
    super(props);
    this.state={
      profileData:[],
      accessToken:'',
      userName:''
    }
  }
  componentWillMount(){
    Orientation.lockToPortrait();
    this.props.configDetails();
    AsyncStorage.getItem('accessToken',(err,value)=>{
      if(value != null){        
        this.setState({accessToken:value})
        this.props.getUser(value).then((data)=>{
          this.setState({profileData:this.props.profile ? this.props.profile :''})
        })
      }
    })
    /*AsyncStorage.getItem('userName',(err,value)=>{
      if(value != null){        
        this.setState({userName:value})
      }
    })
    {this.props.error.length === 0 ? "":
      this.props.tokenRenual(this.state.accessToken).then((data)=> {
        this.props.getUser(this.props.token).then(data=>{
          this.setState({profileData:this.props.profile ? this.props.profile :''})
            AsyncStorage.setItem('accessToken',this.props.token);
            this.setState({accessToken:this.props.token})
        })
      })}*/
    }

  logOut(){
    this.props.logOutUser();
      AsyncStorage.removeItem('userId');
      AsyncStorage.removeItem('accessToken');
      this.props.navigation.navigate('Login')
  }
  render() {
    //console.warn("slider",this.props.profile,this.props.token,this.state.accessToken)
    const navigation = this.props.navigation;
    return (
      <Container>
        <Image
          source={require("../../assets/sidebar-transparent.png")}
          style={styles.background}>
          <Content style={styles.drawerContent}>
          <ListItem
              button
              onPress={() => {
                navigation.navigate("EventCategoryPage");
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-calendar" />
              <Text style={styles.linkText}>EVENTS</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => {
                navigation.navigate("NewsCategoryPage");
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-notifications"/>
              <Text style={styles.linkText}>NEWS</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => {
                navigation.navigate("DealCategoryPage");
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-cash" />
              <Text style={styles.linkText}>DEALS</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => {
                navigation.navigate("Profile",{profileFullData:this.props.profile ? this.props.profile :'',accessToken:this.state.accessToken});
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-person-outline" />
              <Text style={styles.linkText}> PROFILE</Text>
            </ListItem>
            {/* <ListItem
              button
              onPress={() => {
                navigation.navigate("Settings");
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-settings-outline" />
              <Text style={styles.linkText}>SETTINGS</Text>
            </ListItem> */}
          </Content>
          
          <View style={styles.logoutContainer}>
            <View style={styles.logoutbtn} foregroundColor={"white"}>
              <Grid>
                <Col>
                  <TouchableOpacity
                    onPress={() => {
                     this.logOut()
                    }}
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: "transparent"
                    }}
                  >
                    <Text style={{ fontWeight: "bold", color: "#fff" }}>
                      LOG OUT
                    </Text>
                    {this.props.profile.length === 0 ? <View/>
                    : 
                    <Text note style={{ color: "#fff" }}>
                      {this.props.profile._source.name ? this.props.profile._source.name : 'USER'}
                    </Text>}
                  </TouchableOpacity>
                </Col>
                {this.props.profile.length === 0 ? <View/>
                :
                <Col>
                  <TouchableOpacity
                    style={{ alignSelf: "flex-end" }}
                    onPress={()=>navigation.navigate("Profile",{profileFullData:this.props.profile ? this.props.profile :''})}
                  >
                    <Thumbnail
                      source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO-sr2-p_GpmNGLEXp9Uz6KXfZO69i9hGrQGn7AW_MgC5bueBP'}}
                      style={styles.profilePic}
                    />
                  </TouchableOpacity>
                </Col>}
              </Grid>
            </View>
          </View>
        </Image>
      </Container>
    );
  }
}

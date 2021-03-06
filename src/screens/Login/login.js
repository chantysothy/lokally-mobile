import React, { Component } from "react";
import { Image, Platform, StatusBar,Alert ,AsyncStorage,Dimensions,NetInfo} from "react-native";
import {Container,Content,Text,Item,Input,Button,Icon,View,Left,Right,Spinner} from "native-base";
import RNAccountKit from 'react-native-facebook-account-kit';
import styles from "./styles";
import codePush from "react-native-code-push";
const bg = require("../../assets/bg.png");
const logo = require("../../assets/logo.png");
import OneSignal from 'react-native-onesignal'; 
const deviceOneSignal={};
let pushNotificationdata = 'false'; 
let idNotification ='';
let dataNotificationResult = [];
import {notification} from './../../utilities/config';
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import Orientation from 'react-native-orientation';

class Login extends Component {  
  constructor(props) {
    super(props);
    this.state={
      oneSignal:[],
      authenticate:''
    }
  }
  componentWillMount() {
    Orientation.lockToPortrait();
    NetInfo.isConnected.fetch().then(isConnected => {
      if(isConnected === false){
        Alert.alert("Network","Please check your network connection to continue",
        [
          { text: 'Ok', onPress: () => { () => { this.props.navigation.navigate('Login') } }, style: 'cancel' },
        ],
        { cancelable: false })
      }
    });    
    this.props.configDetails();    
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);
  }
  onReceived(notification) {
    console.log(notification)
  }
  onOpened(openResult) {
    let navTo = openResult.notification.payload.additionalData;
    pushNotificationdata = navTo.navto;
    idNotification=navTo.id
    if(idNotification != ''){
      notification(idNotification).then((data)=>{
        dataNotificationResult=data.hits.hits[0]
      })
    }
  }
  onRegistered(notifData) {
      console.warn("Device had been registered for push notifications!", notifData);
  }
  onIds(device) {
        deviceOneSignal =device
  }
  viewNavigateTo(pushData,val){
    switch (pushData) {
      case 'Home':
        this.props.navigation.navigate('Home',{
          userLogin:val
        });
      return          
      case 'EventDetail':
        this.props.navigation.navigate('EventDetail',{
          userLogin:val,
          eventDetail:dataNotificationResult,
          tagName:""
        });
      return   
      case 'NewsDetail':
        this.props.navigation.navigate('NewsDetail',{
          userLogin:val,
          newsDetail:dataNotificationResult,
          tagName:""
        });
      return 
      case 'DealDetail':
        this.props.navigation.navigate('DealDetail',{
          userLogin:val,
          dealDetail:dataNotificationResult,
          tagName:""
        });
        return    
      default :
      this.props.navigation.navigate('Home',{
        userLogin:val
      });
      return 
    }
}
  componentDidMount() {
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE
    });
  
    this.checkAuthenticate()
  }
  checkAuthenticate(){
    AsyncStorage.getItem('userId',(err,value)=>{
      if(value === null){        
        this.setState({authenticate:false})
      }else{
        this.success(value)
      }
    })
  }
  phoneLogin(){
    RNAccountKit.loginWithPhone()
    .then((fbtoken) => {
      if (!fbtoken) {
        console.log('Login cancelled')
      } else {
        RNAccountKit.getCurrentAccount()
        .then((account) => {
          this.props.authenticate(account.phoneNumber.number,fbtoken.token).then(data=>{        
            if(this.props.acessToken.is_new_user === true){
              AsyncStorage.setItem('mobileDeviceInfo',JSON.stringify(deviceOneSignal));
              this.props.navigation.navigate("Registration",{phoneNo:account.phoneNumber.number,oneSignal:deviceOneSignal,userDetail:this.props.acessToken})
            }else{
              this.props.loginSuccess(this.props.acessToken.userid)
              AsyncStorage.setItem('userId',this.props.acessToken.userid);
              AsyncStorage.setItem('accessToken',this.props.acessToken.access_token);
              AsyncStorage.setItem('mobileDeviceInfo',JSON.stringify(deviceOneSignal));
              this.props.navigation.navigate("Drawer",{userLogin:this.props.acessToken.userid,token:this.props.acessToken.access_token})
            }
          })
        })
      }
    })
  }

  success(val){
    if(pushNotificationdata === false){
      setTimeout(() => {
        this.viewNavigateTo('Home',val)         
      }, 1000);
    }else{
      setTimeout(() => {
        this.viewNavigateTo(pushNotificationdata,val)         
      }, 1000);
    }
  }
  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
          <Image source={bg} style={styles.background}>
          <Content>
              <View style={{alignSelf: "center",marginBottom:25,marginRight:20}}>  
                <Text style={styles.app_name}>{this.props.config ?  this.props.config.app_name :""}
                  {this.props.config ? this.props.config.app_name ?
                    <Text style={styles.app_name_suffix}>.IN</Text>
                  :'':''}
                </Text>
              </View> 
              <View style={{marginRight:20}}>
                <Image source={logo} style={styles.logo} />
              </View>
              {this.state.authenticate === false ?
                <View style={styles.form}>
                  <Button style={{alignSelf: "center",marginBottom:20,borderColor:'white'}} onPress={()=>this.phoneLogin()} ><Text>LOGIN WITH PHONE NUMBER</Text></Button>
                </View>
              :<Spinner style={{alignItems:'center',marginBottom:280,marginRight:20}} color='#01cca1'/>}
            </Content>
        </Image>
      </Container>
    );
  }
}
export default Login;
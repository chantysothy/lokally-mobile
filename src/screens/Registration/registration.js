import React, { Component } from "react";
import {Platform,Image,TouchableOpacity,View as RNView,Dimensions,Linking,StatusBar,Alert} from "react-native";
import {
  Container,
  Content,
  Text,
  Button,
  Icon,
  Item,
  Input,
  View,
  Toast,
  Left,
  Right,
  Form,Label
} from "native-base";
import styles from "./styles";
import commonColor from "../../theme/variables/commonColor";
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
const oneSignalKey = [];
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
import AutoTags from 'react-native-tag-autocomplete';
let AllTag = [];
let accessTokenValue = '';
import Orientation from 'react-native-orientation';

class Registration extends Component {
 
  constructor(props) {
    super(props);
    tracker.trackScreenView('Registration');
    this.state={
      name:'',
      email:'',
      dobDate:'',
      dobText:moment(new Date()).format('DD-MMM-YYYY'),
      gender:'',
      addressLine1:'',
      addressLine2:'',
      city:'',
      pincode:'',
      tagsSelected:[],
      tags:[]
    }
    const obj={
      user_id:this.props.navigation.state.params.oneSignal.userId,
      token:this.props.navigation.state.params.oneSignal.pushToken,
      platform:Platform.OS
    }
    oneSignalKey.push(obj)
  }
  componentWillMount(){
    Orientation.lockToPortrait();
    accessTokenValue = this.props.navigation.state.params.userDetail.access_token ;
    this.props.getAllTag().then((data)=>{
      this.props.tagData.map(data=>this.state.tags.push({name:data._source.name}))
    })
    //console.warn(JSON.stringify(this.props.navigation.state.params.userDetail))
  }
  onDOBPress = () => {
    let dobDate = this.state.dobDate;

    if(!dobDate || dobDate == null){
      dobDate = new Date();
      this.setState({
        dobDate: dobDate,
      });
    }
    //To open the dialog
    this.refs.dobDialog.open({
      date: dobDate,
      maxDate: new Date() //To restirct future date
    });

  }
  onDOBDatePicked = (date) => {
    this.setState({
      dobDate: date,
      dobText: moment(date).format('DD-MMM-YYYY')
    });
  }

  handleDelete = index => {
    //tag deleted, remove from our tags array
    let tagsSelected = this.state.tagsSelected;
    tagsSelected.splice(index, 1);
    this.setState({ tagsSelected });
  }

  handleAddition = contact => {
    //suggestion clicked, push it to our tags array
    if(this.state.tagsSelected.includes(contact) === false){
      this.setState({ tagsSelected: this.state.tagsSelected.concat([contact]) });
    }
  }
  /*componentWillUnmount(){
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
  }*/
  
  signUp(){
    if(this.state.name == '' || this.state.email == '' || this.state.pincode == ''){
      Alert.alert(
        'Please fill Mandatory fields',
        "Name,email,pincode are mantatory "
      )
    }
    else{
      this.state.tagsSelected.map(data=>AllTag.push(data.name))
      let userObj = {
          _index: this.props.navigation.state.params.userDetail._index,
          _type: this.props.navigation.state.params.userDetail._type,
          _id: this.props.navigation.state.params.userDetail.userid,
          _score: 1,
          _source:{
            "mobile_number" :this.props.navigation.state.params.phoneNo,  
            "name" : this.state.name,
            "address1" : this.state.addressLine1,
            "address2" : this.state.addressLine2,
            "dob" : this.state.dobText === moment(new Date()).format('DD-MMM-YYYY') ? '' :this.state.dobText,
            "latitude" : "",
            "longitude" : "",
            "email" : this.state.email,
            "gender" : this.state.gender,
            "city" : this.state.city,
            "pincode" : this.state.pincode,
            "tags" : AllTag,
            "device_infos" :oneSignalKey
            }
      }
      /*let userObj={
        "mobile_number" : this.props.navigation.state.params.phoneNo,  
        "name" : this.state.name,
        "address1" : this.state.addressLine1,
        "address2" : this.state.addressLine2,
        "dob" : this.state.dobText === moment(new Date()).format('DD-MMM-YYYY') ? '' :this.state.dobText,
        "latitude" : "",
        "longitude" : "",
        "email" : this.state.email,
        "gender" : this.state.gender,
        "state" : 'Tamilnadu',
        "city" : this.state.city,
        "pincode" : this.state.pincode,
        "tags" : AllTag,
        "device_infos" :oneSignalKey
      }*/
      //console.warn(JSON.stringify(userObj),accessTokenValue)
      this.props.userregister(userObj,accessTokenValue).then((data)=>{
        //console.warn(JSON.stringify(this.props.registerStatus))
        //console.warn("status",JSON.stringify(this.props.registerStatus))
         if(this.props.registerStatus.status === "success"){

            Alert.alert(
            'Registration',
            "Successfully Registered...Please login to continue",
            [
              { text: 'OK', onPress: () => {this.props.navigation.navigate('Login')}, style: 'cancel' },
            ],
            { cancelable: false }
          )
        }else{
          Alert.alert(
            'Registration Failed',
            "Something went wrong.Please try after some time",
            [
              { text: 'OK', onPress: () => {this.props.navigation.navigate('Login')}, style: 'cancel' },
            ],
            { cancelable: false }
          )
        }
      })
    }
    
  }
  render() {
    //console.warn(JSON.stringify(this.props.navigation.state.params.userDetail),JSON.stringify(this.props.navigation.state.params.phoneNo))
    var gender = [
      {label: 'Male   ', value: 'Male' },
      {label: 'Female', value: 'Female' }
    ];
    return (
      <Container>
        <StatusBar
          backgroundColor={commonColor.statusBarColor}
          barStyle="light-content"
        />
        <Image
          source={require("../../assets/bg-signup.png")}
          style={styles.background}
        >
          <Content padder>
            <Text style={styles.signupHeader}>CREATE ACCOUNT</Text>
            <View style={styles.signupContainer}>
              <Form>
                <Item floatingLabel>
                  <Label style={{color:'white'}}>Name</Label>
                  <Input onChangeText={(text) => { this.setState({ name: text }) }}/>
                </Item>
                <Item floatingLabel>
                  <Label style={{color:'white'}}>Email</Label>
                  <Input onChangeText={(text) => { this.setState({ email: text }) }}/>
                </Item>
                <View style={{flex: 1,flexDirection:'row', marginTop:20,marginBottom:-10}}> 
                  <Text style={{marginTop:20,marginLeft:10,marginBottom:30,marginRight:40}}>DOB</Text>                 
                  <TouchableOpacity style={{alignItems:'center'}} onPress={this.onDOBPress.bind(this)} >                    
                    <View style={styles.datePickerBox}>
                      <Text style={styles.datePickerText}>{this.state.dobText}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                  <View style={{flex: 1,flexDirection:'row', marginTop:20,marginBottom:-10}}>
                    <Text style={{marginLeft:10,marginBottom:5,marginRight:30}}>Gender</Text>                    
                    <View style={{alignItems:'center'}}>
                      <RadioForm
                      radio_props={gender}
                      initial={'Men'}
                      formHorizontal={true}
                      labelHorizontal={true}
                      buttonColor={'white'}
                      buttonInnerColor={'white'}
                      buttonOuterColor={'white'}
                      buttonSize={5}
                      buttonOuterSize={25}
                      onPress={(value) => {this.setState({gender:value})}}
                    />
                    </View>
                  </View>
                <Item floatingLabel>
                  <Label style={{color:'white'}}>Address Line 1</Label>
                  <Input onChangeText={(text) => { this.setState({ addressLine1: text }) }}/>
                </Item>
                <Item floatingLabel>
                  <Label style={{color:'white'}}>Address Line 2</Label>
                  <Input onChangeText={(text) => { this.setState({ addressLine2: text }) }}/>
                </Item>
                <Item floatingLabel>
                  <Label style={{color:'white'}}>City</Label>
                  <Input onChangeText={(text) => { this.setState({ city: text }) }}/>
                </Item>
                <Item floatingLabel>
                  <Label style={{color:'white'}}>Pincode</Label>
                  <Input onChangeText={(text) => { this.setState({pincode: text }) }}/>
                </Item>
                <View style={{margin:20,marginBottom:20}}>
                <AutoTags
                  suggestions={this.state.tags}
                  tagsSelected={this.state.tagsSelected}
                  placeholder="Interested in.."
                  handleAddition={this.handleAddition}
                  handleDelete={this.handleDelete}
                  tagsOrientedBelow={true}
                />
              </View>  
              </Form>
              <Button
                  rounded
                  bordered
                  block
                  onPress={() => this.signUp()}
                  style={styles.signupBtn}
                >
                <Text style={{ color: "#FFF" }}>Register</Text>
              </Button>
            </View>
            <DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
          </Content>
        </Image>
      </Container>
    );
  }
}

export default Registration;

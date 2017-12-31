// @flow
import React, { Component } from "react";
import { Image, TouchableOpacity, Platform, Dimensions,Alert,AsyncStorage} from "react-native";
import Orientation from 'react-native-orientation';

import {Container,Header,Content,Text,Button,Icon,Title,Right,Body,View,Card,CardItem,Thumbnail,Form,Item,Label,Input,Spinner} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import styles from "./styles";
import commonColor from "../../theme/variables/commonColor";
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const headerLogo = require("../../assets/header-logo.png");
const primary = require("../../theme/variables/commonColor").brandPrimary;
const originalData =[];
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
import AutoTags from 'react-native-tag-autocomplete';
let AllTag = [];
let accessTokenValue = '';
let tagsValue=[];

class UpdateUser extends Component {
  constructor(props) {
    super(props);
    tracker.trackScreenView('User Update');
    this.state={
      name:'',
      email:'',
      dobDate:'',
      dobText:moment(new Date()).format('DD-MMM-YYYY'),
      gender:'Male',
      addressLine1:this.props.navigation.state.params.Data._source.address1 === "" ? "Address Line 1" : this.props.navigation.state.params.Data._source.address1,
      addressLine2:this.props.navigation.state.params.Data._source.address2 === "" ? "Address Line 2" : this.props.navigation.state.params.Data._source.address2,
      city:this.props.navigation.state.params.Data._source.city === "" ? "City" : this.props.navigation.state.params.Data._source.city,
      pincode:this.props.navigation.state.params.Data._source.pincode === "" ? "Pincode" : this.props.navigation.state.params.Data._source.pincode,
      tagsSelected:[],
      tags:[],
      disable:false
    }
  }
  componentWillMount(){
    Orientation.lockToPortrait();
    AllTag=[];
    tagsValue = [];
    accessTokenValue = this.props.navigation.state.params.accessToken
    this.state.name = this.props.navigation.state.params.Data._source.name
    this.state.email = this.props.navigation.state.params.Data._source.email
    this.state.gender = this.props.navigation.state.params.Data._source.gender
    this.state.dobText = this.props.navigation.state.params.Data._source.dob ? this.props.navigation.state.params.Data._source.dob : moment(new Date()).format('DD-MMM-YYYY')
    this.state.addressLine1 = this.props.navigation.state.params.Data._source.address1
    this.state.addressLine2 = this.props.navigation.state.params.Data._source.address2
    this.state.city = this.props.navigation.state.params.Data._source.city
    this.state.pincode = this.props.navigation.state.params.Data._source.pincode
    tagsValue= this.props.navigation.state.params.Data._source.tags
    this.props.navigation.state.params.Data._source.tags.map(tag=>this.state.tagsSelected.push({name:tag}))
    this.props.getAllTag().then((data)=>{
      this.props.tagData.map(data=>this.state.tags.push({name:data._source.name}))
    })
    {this.props.error.length === 0 
      ? ""
      :this.props.tokenRenual(accessTokenValue).then((data)=>
        this.props.getUser(this.props.token).then(data=>{      
          AsyncStorage.setItem('accessToken',this.props.token);
        })
      )
    }
  }
      
  onDOBPress = () => {
    let dobDate = this.state.dobDate;
    let dobText = this.state.dobText;
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
    let tagsSelected = this.state.tagsSelected;
    tagsSelected.splice(index, 1);
    tagsValue.splice(index,1)
    //this.props.navigation.state.params.Data._source.tags(index,1)
    this.setState({ tagsSelected });
  }

  handleAddition = contact => {
     //console.warn("1",JSON.stringify(this.state.tagsSelected))
     //console.warn("Added",contact.name,tagsValue.includes(contact.name)) 
     //console.warn("Already",this.props.navigation.state.params.Data._source.tags.includes(contact.name))
    if(tagsValue.includes(contact.name) === false && this.state.tagsSelected.includes(contact) === false){
      //console.warn(contact)
      this.setState({ tagsSelected: this.state.tagsSelected.concat([contact]) });
      tagsValue.push(contact.name)
    }
  }
  UpdateUser(){
    this.state.tagsSelected.map(data=>AllTag.push(data.name))
    let userObj = {
      "_index":this.props.navigation.state.params.Data._index,
      "_type":this.props.navigation.state.params.Data._type,
      "_id":this.props.navigation.state.params.Data._id,
      _score: 1,
      _source:{
          "mobile_number" : this.props.navigation.state.params.Data._source.mobile_number,  
          "name" : this.state.name,
          "address1" : this.state.addressLine1,
          "address2" : this.state.addressLine2,
          "dob" : this.state.dobText === moment(new Date()).format('DD-MMM-YYYY') ? this.props.navigation.state.params.Data._source.dob : this.state.dobText,
          "latitude" : this.props.navigation.state.params.Data._source.latitude,
          "longitude" : this.props.navigation.state.params.Data._source.longitude,
          "email" : this.state.email,
          "gender" : this.state.gender,
          "city" : this.state.city,
          "pincode" : this.state.pincode,
          "tags" : AllTag,
          "device_infos" :this.props.navigation.state.params.Data._source.device_infos
        }
      }
    originalData=this.props.navigation.state.params.Data;
    if(userObj._source.name === "" || userObj._source.email === "" || userObj._source.pincode === ""){
      Alert.alert(
        'Please fill Mandatory fields',
        "Name,email,pincode are mantatory "
      )
    }
    else{
      this.setState({disable :true})
     this.props.updateUserValue(userObj,accessTokenValue).then(data=>{
        if(this.props.userProfileStatus.status === 'success'){
          Alert.alert(
            'Updated Successfully',
            "Successfully Updated "+userObj._source.name,
            [
              { text: 'OK', onPress: () => { this.props.navigation.navigate('Login')}, style: 'cancel' },
            ],
            { cancelable: false }
          )
        }else{
          Alert.alert(
            'Updation Failed',
            "Something went wrong.Please try after some time",
            [
              { text: 'OK', onPress: () => { this.props.navigation.navigate('Login')}, style: 'cancel' },
            ],
            { cancelable: false }
          )
        }     
      })
      
    }
  
  }
  
  render() {
    var gender = [
      {label: 'Male   ', value: 'Male' },
      {label: 'Female', value: 'Female' }
    ];
    const navigation = this.props.navigation;
    return (
      <Container style={{ backgroundColor: "#fff" }}>
        <Header>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon active name="arrow-back" />
          </Button>
          <Body style={{ flexDirection: "row" }}>
            <Title>Update User</Title>
          </Body>
          <Right />
        </Header>

        <Content showsVerticalScrollIndicator={false}>
          <View>
            <Form>
              <Item floatingLabel>
                <Label >Name</Label>
                <Input
                  value={this.state.name}
                  onChangeText={text => {
                    this.setState({ name: text });
                  }}
                />
              </Item>
              <Item floatingLabel>
              <Label >Email</Label>
                <Input
                  value={this.state.email}
                  onChangeText={text => {
                    this.setState({ email: text });
                  }}
                />
              </Item>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 20,
                  marginBottom: -10
                }}
              >
                <Text
                  style={{
                    marginTop: 20,
                    marginLeft: 10,
                    marginBottom: 30,
                    marginRight: 40,
                    color: "#000"
                  }}
                >
                  DOB
                </Text>
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={this.onDOBPress.bind(this)}
                >
                  <View style={styles.datePickerBox}>
                    <Text style={styles.datePickerText}>
                      {this.state.dobText}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 20,
                  marginBottom: -10
                }}
              >
                <Text
                  style={{ marginLeft: 10, marginBottom: 5, marginRight: 30,color: "#000" }}
                >
                  Gender
                </Text>

                <View style={{ alignItems: "center" }}>
                  <RadioForm
                    radio_props={gender}
                    initial={this.state.gender === "Male" ? 0 : 1}
                    formHorizontal={true}
                    labelHorizontal={true}
                    buttonColor={"black"}
                    buttonInnerColor={"black"}
                    buttonOuterColor={"black"}
                    buttonSize={5}
                    buttonOuterSize={25}
                    onPress={value => {
                      this.setState({ gender: value });
                    }}
                  />
                </View>
              </View>
              <Item floatingLabel>
              <Label >Address Line 1</Label>
                <Input
                  value={this.state.addressLine1}
                  onChangeText={text => {
                    this.setState({ addressLine1: text });
                  }}
                />
              </Item>
              <Item floatingLabel>
                <Label >Address Line 2</Label>
                <Input
                  value={this.state.addressLine2}
                  onChangeText={text => {
                    this.setState({ addressLine2: text });
                  }}
                />
              </Item>
              <Item floatingLabel>
                <Label >City</Label>
                <Input
                  value={this.state.city}
                  onChangeText={text => {
                    this.setState({ city: text });
                  }}
                />
              </Item>
              <Item floatingLabel>
                <Label >Pincode</Label>
                <Input
                  value={this.state.pincode}
                  onChangeText={text => {
                    this.setState({ pincode: text });
                  }}
                />
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
            {this.state.disable === false ?
              <Button
                rounded
                bordered
                block
                onPress={() => this.UpdateUser()}
                style={styles.signupBtn}
              >
                <Text style={{ color: "#000" }}>Update</Text>
              </Button>
            : <Spinner style={{marginTop:10}} color='#01cca1'/>}
          </View>
          <DatePickerDialog
            ref="dobDialog"
            onDatePicked={this.onDOBDatePicked.bind(this)}
          />
        </Content>
      </Container>
    );
  }
}

export default UpdateUser;

// @flow
import React, { Component } from "react";
import { Image, TouchableOpacity, ListView,Platform ,Dimensions,AsyncStorage} from "react-native";
import { bindActionCreators } from "redux";
import { getUser,tokenRenual } from "./../../actions";
import { connect } from "react-redux";
import {Container,Content,Text, Thumbnail, View, List, ListItem, Button, Icon,Spinner} from "native-base";
import { Grid, Col } from "react-native-easy-grid";
import CustomHeader from "../../components/CustomHeader";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import styles from "./styles";
import {  GoogleAnalyticsTracker  } from 'react-native-google-analytics-bridge';
const tracker = new GoogleAnalyticsTracker('UA-110943333-1');
import Orientation from 'react-native-orientation';

class Profile extends Component {
  constructor(props) {
    super(props);
    tracker.trackScreenView('Profile');
    this.state={
      dataTest:[]
    }
  }
  componentWillMount(){
    Orientation.lockToPortrait();
    {this.props.navigation.state.params.profileFullData ? 
        this.props.getUser(this.props.navigation.state.params.accessToken)
    :''}
    {this.props.profile ? this.setState({dataTest:this.props.profile}):''}
    {this.props.error.length === 0 ? ""
        :
        this.props.tokenRenual(this.props.navigation.state.params.accessToken).then((data)=> {
        this.props.getUser(this.props.token).then(data=>{
          //console.warn("5",this.props.navigation.state.params.accessToken,this.props.token)
          {this.props.profile ? 
            this.setState({dataTest:this.props.profile})
          :''}       
          AsyncStorage.setItem('accessToken',this.props.token);
        })
    })}
  }
  /*deleteRow(secId: string, rowId: string, rowMap: any) {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const newData = [...this.state.listViewData];
    newData.splice(rowId, 1);
    this.setState({ listViewData: newData });
  }*/

  render() {
    //console.warn("er",this.props.token,this.props.error,this.props.profile)
    const navigation = this.props.navigation;
    return (
      <Container>
        <Image
          source={require("../../assets/bg-transparent.png")}
          style={styles.container}
        >
          <CustomHeader hasTabs navigation={navigation} />

          <View style={styles.profileInfoContainer}>
            <View style={{ alignSelf: "center" }}>
              <Thumbnail
                source={{
                  uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO-sr2-p_GpmNGLEXp9Uz6KXfZO69i9hGrQGn7AW_MgC5bueBP"
                }}
                style={styles.profilePic}
              />
            </View>
            {/* <View style={styles.profileInfo}>
              <Text style={styles.profileUser}>
                {this.props.profile ? this.props.profile.hits.hits[0]._source.name : ''}
              </Text>
            </View> */}
          </View>
          {this.state.dataTest.length === 0 ? <Spinner style={{marginTop:200}} color='white'/>
          :<Content
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: "#fff" }}
          >
            <View style={{ backgroundColor: "#fff" }}>
              <View style={styles.newsContent}>
              <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <Grid >
                      <Col style={{ flexDirection: "row" }}>
                      {this.state.dataTest._source.name ?
                        <Text style={styles.newsHeader}>
                          Name:  <Text style={styles.newsHeaderValue}>{this.state.dataTest._source.name}</Text>
                        </Text>  
                      :<Text/>}                    
                      </Col>
                    </Grid>
                  </Col>
                  {this.state.dataTest.length === 0 ? <View/>
                  : <Col style={{ flexDirection: "row" }}>
                    <Grid>
                      <Col style={{ flexDirection: "row" ,alignSelf:'flex-end',marginBottom:-40,marginLeft:deviceWidth/4+10}}>
                        <Button transparent style={{marginTop:-70}} onPress={()=>{this.props.navigation.navigate('UpdateUser',{userProfileData:this.props.profile,Data:this.props.profile,accessToken:this.props.navigation.state.params.accessToken})}}>
                          <Icon name="color-filter" style={styles.newsHeader} ></Icon>
                          {/* <Icon theme={fontAwesome} name='icon-edit' />  */}
                        </Button> 
                      </Col>
                  </Grid>
                  </Col>}
                </Grid>
                {this.state.dataTest._source.dob ?
                <Grid style={{ paddingBottom: 20 }}>
                    <Col style={{ flexDirection: "row" }}>
                    <Text style={styles.newsHeader}>
                      DOB:  <Text style={styles.newsHeaderValue}>{this.state.dataTest._source.dob}</Text>
                    </Text>
                  </Col>
                </Grid>
               :<View/>}
               {this.state.dataTest._source.gender ?
                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <Text style={styles.newsHeader}>
                      Gender:  <Text style={styles.newsHeaderValue}>{this.state.dataTest._source.gender}</Text>
                    </Text>
                  </Col>
                </Grid>
                :<View/>}
                {this.state.dataTest._source.email ?
                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <Text style={styles.newsHeader}>
                      Email:  <Text style={styles.newsHeaderValue}>{this.state.dataTest._source.email}</Text>
                    </Text>
                  </Col>
                </Grid>
                :<View/>}
                {this.state.dataTest._source.mobile_number ?
                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <Text style={styles.newsHeader}>
                      Mobile Number:  <Text style={styles.newsHeaderValue}>{this.state.dataTest._source.mobile_number}</Text>
                    </Text>
                  </Col>
                </Grid>
                :<View/>}
                {this.state.dataTest._source.address1 || this.state.dataTest._source.address2 || this.state.dataTest._source.city ?
                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <Text style={styles.newsHeader}>
                      Address:  <Text style={styles.newsHeaderValue}>{this.state.dataTest._source.address1} {this.state.dataTest._source.address1 ? "," :''} {this.state.dataTest._source.address2} {this.state.dataTest._source.address2 ? "," :''} {this.state.dataTest._source.city}</Text>
                    </Text>
                  </Col>
                </Grid>
                :<View/>}
                {this.state.dataTest._source.pincode ?
                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <Text style={styles.newsHeader}>
                      Pincode:  <Text style={styles.newsHeaderValue}>{this.state.dataTest._source.pincode}</Text>
                    </Text>
                  </Col>
                </Grid>
                :<View/>}
                {this.state.dataTest._source.tags.length > 0 ?
                <Grid style={{ paddingBottom: 20 }}>
                  <Col style={{ flexDirection: "row" }}>
                    <Text style={styles.newsHeader}>                    
                      Interested in: {this.state.dataTest._source.tags
                                      .map((tag,i) => <Text key={i} style={styles.newsHeaderValue}>{tag}</Text>)
                                      .reduce((prev, curr) => [prev,<Text style={styles.newsHeaderValue}> , </Text>, curr])}
                    </Text>
                  </Col>
                </Grid>
                :<View/>}
              </View>
            </View>
          </Content>}
        </Image>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    profile: state.login.userData,
    error:state.config.tokenError,
    token:state.config.token
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({getUser:getUser,tokenRenual:tokenRenual}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);


/*
{this.props.profile ?
          <Content
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: "#fff" }}
          >
            <View style={{ backgroundColor: "#fff" }}>
              <View style={styles.newsContent}>
              <Grid style={{ paddingBottom: 20 }}>
                {this.props.profile ? this.props.profile.hits.hits[0]._source.name ?
                  <Col style={{ flexDirection: "row" }}>
                    <Grid >
                      <Col style={{ flexDirection: "row" }}>
                        <Text style={styles.newsHeader}>
                          Name:  <Text style={styles.newsHeaderValue}>{this.props.profile ? this.props.profile.hits.hits[0]._source.name :''}</Text>
                        </Text>                      
                      </Col>
                    </Grid>
                  </Col>
                  :<View/>:<View/>}
                  {this.props.profile ?
                  <Col style={{ flexDirection: "row" }}>
                    <Grid>
                      <Col style={{ flexDirection: "row" ,alignSelf:'flex-end',marginBottom:-40,marginLeft:deviceWidth/4+10}}>
                        <Button transparent style={{marginTop:-70}} onPress={()=>{this.props.navigation.navigate('UpdateUser',{userProfileData:this.props.profile,Data:this.props.profile.hits.hits[0]})}}>
                          <Icon name="color-filter" style={styles.newsHeader} ></Icon>
                          </Button> 
                          </Col>
                      </Grid>
                      </Col>:<View/>}
                    </Grid>
                    {this.props.profile ? this.props.profile.hits.hits[0]._source.dob ?
                    <Grid style={{ paddingBottom: 20 }}>
                        <Col style={{ flexDirection: "row" }}>
                        <Text style={styles.newsHeader}>
                          DOB:  <Text style={styles.newsHeaderValue}>{this.props.profile ? this.props.profile.hits.hits[0]._source.dob :''}</Text>
                        </Text>
                      </Col>
                    </Grid>
                   :<View/>:<View/>}
                   {this.props.profile ? this.props.profile.hits.hits[0]._source.gender ?
                    <Grid style={{ paddingBottom: 20 }}>
                      <Col style={{ flexDirection: "row" }}>
                        <Text style={styles.newsHeader}>
                          Gender:  <Text style={styles.newsHeaderValue}>{this.props.profile ? this.props.profile.hits.hits[0]._source.gender :''}</Text>
                        </Text>
                      </Col>
                    </Grid>
                    :<View/>:<View/>}
                    {this.props.profile ? this.props.profile.hits.hits[0]._source.email ?
                    <Grid style={{ paddingBottom: 20 }}>
                      <Col style={{ flexDirection: "row" }}>
                        <Text style={styles.newsHeader}>
                          Email:  <Text style={styles.newsHeaderValue}>{this.props.profile ? this.props.profile.hits.hits[0]._source.email :''}</Text>
                        </Text>
                      </Col>
                    </Grid>
                    :<View/>:<View/>}
                    {this.props.profile ?this.props.profile.hits.hits[0]._source.mobile_number ?
                    <Grid style={{ paddingBottom: 20 }}>
                      <Col style={{ flexDirection: "row" }}>
                        <Text style={styles.newsHeader}>
                          Mobile Number:  <Text style={styles.newsHeaderValue}>{this.props.profile ? this.props.profile.hits.hits[0]._source.mobile_number :''}</Text>
                        </Text>
                      </Col>
                    </Grid>
                    :<View/>:<View/>}
                    {this.props.profile ?this.props.profile.hits.hits[0]._source.address1 ?
                    <Grid style={{ paddingBottom: 20 }}>
                      <Col style={{ flexDirection: "row" }}>
                        <Text style={styles.newsHeader}>
                          Address:  <Text style={styles.newsHeaderValue}>{this.props.profile ?this.props.profile.hits.hits[0]._source.address1 :''} {this.props.profile.hits.hits[0]._source.address2 ? "," :''} {this.props.profile ? this.props.profile.hits.hits[0]._source.address2 :''} {this.props.profile.hits.hits[0]._source.city ? "," :''} {this.props.profile.hits.hits[0]._source.city ? this.props.profile.hits.hits[0]._source.city :''}</Text>
                        </Text>
                      </Col>
                    </Grid>
                    :<View/>:<View/>}
                    {this.props.profile ? this.props.profile.hits.hits[0]._source.pincode ?
                    <Grid style={{ paddingBottom: 20 }}>
                      <Col style={{ flexDirection: "row" }}>
                        <Text style={styles.newsHeader}>
                          Pincode:  <Text style={styles.newsHeaderValue}>{this.props.profile ? this.props.profile.hits.hits[0]._source.pincode:''}</Text>
                        </Text>
                      </Col>
                    </Grid>
                    :<View/>:<View/>}
                    {this.props.profile ? this.props.profile.hits.hits[0]._source.tags.length > 0 ?
                    <Grid style={{ paddingBottom: 20 }}>
                      <Col style={{ flexDirection: "row" }}>
                        <Text style={styles.newsHeader}>                    
                          Interested in: {this.props.profile.hits.hits[0]._source.tags
                                          .map((tag,i) => <Text key={i} style={styles.newsHeaderValue}>{tag}</Text>)
                                          .reduce((prev, curr) => [prev,<Text style={styles.newsHeaderValue}> , </Text>, curr])}
                        </Text>
                      </Col>
                    </Grid>
                    :<View/>:<View/>}
                  </View>
                </View>
              </Content> : <View/>}


              */
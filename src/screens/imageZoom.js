import React, { Component } from "react";
import { Image, Platform, StatusBar,Alert ,AsyncStorage,Dimensions,NetInfo} from "react-native";
import {Container,Content,Button,Icon,Left,Right,Header,Body} from "native-base";
const bg = require("../assets/bg.png");
const headerLogo = require("../assets/logo.png");
import ImageZoom from 'react-native-image-pan-zoom';

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import Orientation from 'react-native-orientation';

class ImageZoomRender extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container>
          <Image source={bg} style={{flex: 1,width: null,height: deviceHeight}}>
          <Header hasTabs>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon active name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Image source={headerLogo} style={{ height: 30,width: 115, resizeMode: "contain"}}/>
          </Body>
          <Right />
        </Header>
          <Content>
                <ImageZoom cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').height}
                    imageWidth={deviceWidth}
                    imageHeight={deviceHeight}>
                <Image
                source={{uri:this.props.navigation.state.params.url ? this.props.navigation.state.params.url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrHY5zywHTlDyhezSmEXnF7aan7ezaIh62ElV56Jqre-kXaIoHZw"}}
                style={{flex: 1,width: null,height: deviceHeight,resizeMode:'contain',marginBottom:100}}
                />
                </ImageZoom>
            </Content>
        </Image>
      </Container>
    );
  }
}
export default ImageZoomRender;


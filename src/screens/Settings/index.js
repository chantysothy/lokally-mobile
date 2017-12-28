// @flow
var Color = require("color");
import React, { Component } from "react";
import { Image, Switch, TouchableOpacity, Platform } from "react-native";
import Orientation from 'react-native-orientation';

import {
  Container,
  Header,
  Content,
  Text,
  Button,
  Icon,
  Thumbnail,
  Item,
  Input,
  View,
  Left,
  Right,
  Body
} from "native-base";
import { Grid, Col } from "react-native-easy-grid";

import styles from "./styles";

const headerLogo = require("../../assets/logo.png");
const primary = require("../../theme/variables/commonColor").brandPrimary;
const light = Color(primary).alpha(0.3);

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: true
    }
  }
  componentWillMount(){
    Orientation.lockToPortrait();
  }
  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
        <Header hasTabs>
          <Left>
            <Button
              transparent
              onPress={() => navigation.navigate("DrawerOpen")}
            >
              <Icon active name="menu" />
            </Button>
          </Left>
          <Body>
            <Image source={headerLogo} style={styles.imageHeader} />
          </Body>
          <Right />
        </Header>
        <Content showsVerticalScrollIndicator={false}>
          <View style={styles.notificationSwitchContainer}>
            <Text style={styles.notificationHeader}>EMAIL NOTIFICATIONS</Text>
            <View>
                <Switch
                    onValueChange={value => this.setState({ email: value })}
                    onTintColor={light}
                    style={styles.switch}
                    thumbTintColor={primary}
                    tintColor={primary}
                    value={this.state.email}
                  />
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

export default Settings;

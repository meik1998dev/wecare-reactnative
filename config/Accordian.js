
import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutAnimation, Platform, UIManager} from "react-native";
import * as colors from '../assets/css/Colors';
import { Icon, Left, Body, Right } from 'native-base';
import { font_title, font_description } from '../config/Constants';

// import Icon from "react-native-vector-icons/MaterialIcons";

class Accordian extends Component{

    constructor(props) {
        super(props);
        this.state = { 
          data: props.data,
          expanded : false,
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
  
  render() {

    return (
       <View>
            <TouchableOpacity ref={this.accordian} style={styles.row} onPress={()=>this.toggleExpand()}>
                <Left>
                <Text style={[styles.title, styles.font]}>{this.props.title}</Text>
                </Left>
                <Icon name={this.state.expanded ? 'ios-arrow-up' : 'ios-arrow-down'}  style={{color:colors.theme_bg, width:'10%',paddingLeft:10}} />
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                this.state.expanded &&
                <View style={styles.child}>
                    <Text style={{ fontSize:14, color:'grey',fontFamily:font_description }}>{this.props.data}</Text>    
                </View>
            }
            
       </View>
    )
  }

  toggleExpand=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({expanded : !this.state.expanded})
  }

}

const styles = StyleSheet.create({
    title:{
        fontSize: 16,
        fontFamily:font_title
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: colors.theme_bg_three,
    },
    parentHr:{
        height:1,
        color: colors.theme_bg,
        width:'100%'
    },
    child:{
        backgroundColor: colors.theme_bg_four,
        paddingLeft:25,
    }
    
});
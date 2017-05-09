/**
* @Date:   2017-03-17 10:55:12
 * @Last modified time: 2017-04-19 14:31:49
*/

import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions, PixelRatio, Image, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";

let {
  height: deviceHeight
} = Dimensions.get("window");
let pixel = PixelRatio.get();

let styles = StyleSheet.create({
    container: {
        position: "absolute",
        top:0,
        bottom:0,
        left:0,
        right:0,
        backgroundColor:"transparent",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default class extends React.Component {
    constructor(props){
        super (props);

        this.state = {
            offset: new Animated.Value(-deviceHeight)
        };
    }

    componentDidMount() {
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: 0
        }).start();
    }

    closeModal(action) {
        Animated.timing(this.state.offset, {
            duration: 150,
            toValue: -deviceHeight
        }).start(Actions[action]);
    }

    render(){
        return (
            <Animated.View style={[styles.container, {backgroundColor:"rgba(52,52,52,0.5)"},
                                  {transform: [{translateY: this.state.offset}]}]}>
                <View style={{
                    width:760 / pixel,
                    height:1198 / pixel,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white"
                }}>
                    <Image
                        style={{width: 760 / pixel, height: 760 / pixel}}
                        source={require('./images/1.jpg')}
                    />
                    <Text style={{
                        fontSize: 36 / pixel,
                        color: '#e6decf',
                        textAlign: 'center',
                        position: 'absolute',
                        paddingTop: 16 / pixel,
                        right: 0,
                        top: 0,
                        backgroundColor: '#332f29',
                        width: 200 / pixel,
                        height: 80 / pixel
                    }}>￥ 234.0</Text>
                    <Image
                        style={{width: 760 / pixel, height: 308 / pixel}}
                        source={require('./images/detail.jpg')}
                    />
                    <View style={{height: 130 / pixel}} >
                        <TouchableOpacity style={{
                            height: 100 / pixel,
                            width: 700 / pixel,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: '#dfac4d'
                        }} onPress={()=>this.closeModal('preview')} >
                            <Text style={{fontSize: 36 / pixel, color: "white"}}>看看效果</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={{
                    height: 42 / pixel,
                    width: 88 / pixel,
                    justifyContent: "center",
                    alignItems: "center",
                    position: 'absolute',
                    left: 920 / pixel,
                    top: 361 / pixel
                }} onPress={()=>this.closeModal('pop')} >
                    <Image
                        style={{width: 38 / pixel, height: 38 / pixel}}
                        source={require('./images/close.png')}
                    />
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

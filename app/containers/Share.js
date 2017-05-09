/**
* @Date:   2017-03-17 10:55:12
 * @Last modified time: 2017-04-20 19:21:29
*/

import React from 'react';
import {View, StyleSheet, Animated, Dimensions, PixelRatio, Image, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import Canvas from '../components/Canvas';

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
                    height:1384 / pixel,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white"
                }}>
                    <View style={{width: 698 / pixel, height: 1036 / pixel,
                        marginHorizontal: 31 / pixel,
                        marginVertical: 20 / pixel
                    }} >
                        <Image
                            style={{width: 698 / pixel, height: 1036 / pixel}}
                            source={{uri: this.props.url}}
                        />
                        {/* <Canvas
                          context={{message: 'Hello!'}}
                          render={this.renderCanvas}
                          style={{width: 698 / pixel, height: 1036 / pixel, position: 'absolute'}}
                        /> */}
                    </View>
                    <Image
                        style={{width: 760 / pixel, height: 307 / pixel}}
                        source={require('./images/qrCode.jpg')}
                    />
                </View>
                <TouchableOpacity style={{
                    height: 88 / pixel,
                    width: 88 / pixel,
                    justifyContent: "center",
                    alignItems: "center",
                    position: 'absolute',
                    left: 920 / pixel,
                    top: 243 / pixel
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

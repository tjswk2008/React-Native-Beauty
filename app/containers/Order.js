/**
* @Date:   2017-03-17 10:55:12
 * @Last modified time: 2017-04-19 15:31:45
*/

import React from 'react';
import {View, Text, TouchableOpacity, PixelRatio, Image} from "react-native";
import {Actions} from "react-native-router-flux";
import styles from '../styles/Introduction';

const pixel = PixelRatio.get();

export default class extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        return (
            <View style={[styles.container, this.props.style]}>
                <Image
                    style={{width: '100%', height: 947 / pixel}}
                    source={require('./images/order.jpg')}
                />
                <View
                    style={{alignItems: "center"}}
                >
                    <TouchableOpacity style={{
                        height: 100 / pixel,
                        width: 370 / pixel,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: '#dfac4d'
                    }} onPress={()=>Actions.pay()} >
                        <Text style={{fontSize: 36 / pixel, color: "white"}}>确认支付</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

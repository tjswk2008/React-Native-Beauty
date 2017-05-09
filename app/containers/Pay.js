/**
* @Date:   2017-03-17 10:55:12
 * @Last modified time: 2017-04-19 16:01:01
*/

import React from 'react';
import {View, PixelRatio, Image} from "react-native";
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
                    style={{width: '100%', height: 960 / pixel}}
                    source={require('./images/pay.jpg')}
                />
                <View
                    style={{alignItems: "center", height: 960 / pixel, backgroundColor: '#393632'}}
                >
                </View>
            </View>
        );
    }
}

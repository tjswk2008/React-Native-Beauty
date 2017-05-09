/**
* @Date:   2017-03-17 10:55:12
 * @Last modified time: 2017-04-20 18:29:36
*/

import React from 'react';
import {Animated, Text, View, Dimensions, PixelRatio, Image, TouchableOpacity} from "react-native";
import Carousel from 'react-native-snap-carousel';
import styles from '../styles/Introduction';

let {
  height: deviceHeight
} = Dimensions.get("window");
let pixel = PixelRatio.get();

export default class extends React.Component {
    constructor(props){
        super (props);

        this.state = {
            offset: new Animated.Value(-deviceHeight),
            selectedIndex: 0
        };
    }

    setIndex(index) {
        this.props.onPress(index);
        this.setState({selectedIndex: index});
    }

    render(){
        let typeNodes = this.props.data.map((item, index)=> {
            return (
                <TouchableOpacity key={index} style={styles.hairType} onPress={()=>this.setIndex(index)}>
                    <Image
                        style={styles.hairType}
                        source={item.url}
                    />
                    {this.state.selectedIndex !== index && <View style={[styles.hairType, {position: 'absolute', backgroundColor: '#000', opacity: 0.6}]}></View>}
                    <Text style={{top: 47/pixel, color: '#fff', fontSize: 32/pixel, textAlign: 'center', position: 'absolute', width: 241/pixel}}>{item.name}</Text>
                </TouchableOpacity>
            );
        });
        return (
            <Carousel
                ref={(carousel) => { this._carousel = carousel; }}
                sliderWidth={240 / pixel}
                itemWidth={260 / pixel}
                showsHorizontalScrollIndicator={false}
                inactiveSlideScale={1}
                slideStyle={styles.slide}
                contentContainerCustomStyle={styles.slider}
            >
                {typeNodes}
            </Carousel>
        );
    }
}

/**
* @Date:   2017-03-17 10:55:12
 * @Last modified time: 2017-04-20 18:07:35
*/

import React from 'react';
import {View, Text, PixelRatio, TouchableOpacity} from "react-native";
import styles from '../styles/Introduction';
let pixel = PixelRatio.get();

export default class extends React.Component {
    constructor(props){
        super (props);

        this.state = {
            tabIndex: 0
        };
    }

    componentDidMount() {
    }

    setTabIndex(index) {
        this.props.onPress(index);
        this.setState({tabIndex: index});
    }

    render(){
        let width = 1080/(this.props.data.length * pixel);
        let activeTabStyle = [styles.tab, styles.tabActive, {width: width}];
        let inActiveTabStyle = [styles.tab, styles.tabInActive, {width: width}];
        let childNodes = this.props.data.map((item, index) => {
            return (
                <TouchableOpacity
                    key={index}
                    style={this.state.tabIndex === index ? activeTabStyle : inActiveTabStyle}
                    onPress={()=>this.setTabIndex(index)}>
                    <Text style={styles.text}>{item.title}</Text>
                    <Text style={[styles.text, {fontSize: 16 / pixel}]}>{item.subTitle}</Text>
                </TouchableOpacity>
            );
        });
        return (
            <View style={[styles.tabs, this.props.style]}>
                {childNodes}
            </View>
        );
    }
}

/**
 * @Date:   2017-03-16 17:54:57
 * @Last modified time: 2017-04-20 18:31:25
 */

import React from 'react';
import {View, TouchableOpacity, Image, PixelRatio} from "react-native";
import {Actions} from "react-native-router-flux";
import Category from '../components/Category';
import Tabs from '../components/Tabs';
import styles from '../styles/Introduction';
import * as Animatable from 'react-native-animatable';

let pixel = PixelRatio.get();

class Introduction extends React.Component {
    constructor(props) {
        super(props);
        let category = [
            {name: '直发类', url: require('./images/hairType/1.png'), children: [require('./images/hairs/zhi.png')] },
            {name: '卷发类', url: require('./images/hairType/2.png'), children: [require('./images/hairs/juan1.png'),require('./images/hairs/juan2.png'),require('./images/hairs/juan3.png'),require('./images/hairs/juan4.png')] },
            {name: '烫发类', url: require('./images/hairType/3.png'), children: [require('./images/hairs/tang.png')] },
            {name: '染发类', url: require('./images/hairType/4.png'), children: [require('./images/hairs/juan2.png')] }
        ];

        this.state = {
            tabs: [
                {title: '男士', subTitle: 'MAN', category: category},
                {title: '女士', subTitle: 'WOMAN', category: category}
            ],
            index: 1,
            tabIndex: 0,
            catIndex: 0
        };
    }

    seeHairDetail() {
        Actions.hairDetail();
    }

    updateCategory(index) {
        this.setState({tabIndex: index});
        this.refs.list.fadeInDownBig(500);
        this.refs.category.setIndex(0);
    }

    updateNodes(index) {
        this.refs.list.fadeInDownBig(500);
        this.setState({catIndex: index});
    }

    getHairNodes() {
        let state = this.state;
        let category = state.tabs[state.tabIndex].category;
        return category[state.catIndex].children.map((item, i)=> {
            return (
                <TouchableOpacity key={i} style={[styles.img, styles.imgContainer]} onPress={()=>this.seeHairDetail(i)}>
                    <Image
                        style={styles.img}
                        source={item}
                    />
                </TouchableOpacity>
            );
        });
    }

    render(){
        let state = this.state;
        return (
            <View style={{height: '100%'}}>
                <Tabs data={this.state.tabs} onPress={(index)=>{this.updateCategory(index)}}></Tabs>
                <View style={{backgroundColor: '#424242'}}>
                    <Animatable.View ref={'list'} style={[styles.list, {padding: 20/pixel}]}>
                        {this.getHairNodes()}
                    </Animatable.View>
                </View>
                <View style={[styles.bottom, {paddingLeft: 18/pixel}]}>
                    <Category ref="category" onPress={(index)=>{this.updateNodes(index)}} data={state.tabs[state.tabIndex].category}></Category>
                </View>
            </View>
        );
    }
}

export default Introduction;

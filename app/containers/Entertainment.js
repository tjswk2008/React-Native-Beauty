/**
* @Date:   2017-03-17 10:55:12
 * @Last modified time: 2017-04-20 19:35:30
*/

import React from 'react';
import {View, TouchableOpacity, PixelRatio, Image, ScrollView} from "react-native";
import Category from '../components/Category';
import {Actions} from "react-native-router-flux";
import Tabs from '../components/Tabs';
import styles from '../styles/Introduction';
import * as Animatable from 'react-native-animatable';

let pixel = PixelRatio.get();

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [
                {title: '电影', subTitle: 'FILM', category: [
                    {name: '喜剧片', url: require('./images/filmType/1.png'), children: this.generateArray() },
                    {name: '动作片', url: require('./images/filmType/2.png'), children: this.generateArray() },
                    {name: '爱情片', url: require('./images/filmType/3.png'), children: this.generateArray() },
                    {name: '恐怖片', url: require('./images/filmType/4.png'), children: this.generateArray() }
                ]},
                {title: '电视剧', subTitle: 'TELEPLAY', category: [
                    {name: '家庭', url: require('./images/filmType/1.png'), children: this.generateArray() },
                    {name: '爱情', url: require('./images/filmType/2.png'), children: this.generateArray() },
                    {name: '悬疑', url: require('./images/filmType/3.png'), children: this.generateArray() },
                    {name: '古装', url: require('./images/filmType/4.png'), children: this.generateArray() }
                ]},
                {title: '综艺', subTitle: 'VARIETY', category: [
                    {name: '情感', url: require('./images/filmType/1.png'), children: this.generateArray() },
                    {name: '生活', url: require('./images/filmType/2.png'), children: this.generateArray() },
                    {name: '访谈', url: require('./images/filmType/3.png'), children: this.generateArray() },
                    {name: '纪实', url: require('./images/filmType/4.png'), children: this.generateArray() }
                ]},
                {title: '音乐', subTitle: 'MUSIC', category: [
                    {name: 'R&B', url: require('./images/filmType/1.png'), children: this.generateArray() },
                    {name: '经典', url: require('./images/filmType/2.png'), children: this.generateArray() },
                    {name: '欧美', url: require('./images/filmType/3.png'), children: this.generateArray() },
                    {name: '流行', url: require('./images/filmType/4.png'), children: this.generateArray() }
                ]}
            ],
            film: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
            index: 1,
            tabIndex: 0,
            catIndex: 0
        };
    }

    generateArray() {
        let arr = [];
        arr.push(require('./images/films/1.jpg'));
        arr.push(require('./images/films/2.jpg'));
        arr.push(require('./images/films/3.jpg'));
        arr.push(require('./images/films/4.jpg'));
        arr.push(require('./images/films/5.jpg'));
        return arr.sort(function () {
            return Math.random() - 0.5;
        });
    }

    watchVideo(index) {
        Actions.video({index: index});
    }

    updateCategory(index) {
        this.refs.list.fadeInDownBig(500);
        this.setState({tabIndex: index});
        this.refs.category.setIndex(0);
    }

    updateNodes(index) {
        this.refs.list.fadeInDownBig(500);
        this.setState({catIndex: index});
    }

    getFilmNodes() {
        let state = this.state;
        let category = state.tabs[state.tabIndex].category;
        return category[state.catIndex].children.map((item, i)=> {
            return (
                <TouchableOpacity key={i} style={{
                    width: 240 / pixel,
                    height: 380 / pixel,
                    margin: 10 / pixel
                }} onPress={()=>this.watchVideo(i)}>
                    <Image
                        style={{width: 240 / pixel, height: 380 / pixel}}
                        source={item}
                    />
                </TouchableOpacity>
            );
        });
    }

    render(){
        let state = this.state;
        return (
            <View style={[styles.container, this.props.style]}>
                <Tabs data={this.state.tabs} onPress={(index)=>{this.updateCategory(index)}} ></Tabs>
                <View style={{backgroundColor: '#424242'}}>
                    <ScrollView
                        ref={(scrollView) => { this._scrollView = scrollView; }}
                        automaticallyAdjustContentInsets={false}
                        scrollEventThrottle={200}
                        style={{height: 1600/pixel, padding: 20/pixel}}>
                        <Animatable.View ref={'list'} style={{flexDirection:'row', flexWrap: 'wrap'}}>
                            {this.getFilmNodes()}
                        </Animatable.View>
                    </ScrollView>
                </View>
                <View style={[styles.bottom, {paddingLeft: 18/pixel}]}>
                    <Category ref="category" onPress={(index)=>{this.updateNodes(index)}} data={state.tabs[state.tabIndex].category}></Category>
                </View>
            </View>
        );
    }
}

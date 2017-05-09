/**
* @Date:   2017-03-17 10:55:12
 * @Last modified time: 2017-04-20 19:26:44
*/

import React from 'react';
import {View, Text, TouchableOpacity, PixelRatio, Image} from "react-native";
import {Actions} from "react-native-router-flux";
import Carousel from 'react-native-snap-carousel';
import ImgButton from '../components/ImgButton';
import Parabola from '../components/Parabola';
import Tabs from '../components/Tabs';
import styles from '../styles/Introduction';
import * as Animatable from 'react-native-animatable';

const pixel = PixelRatio.get();

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isTrigger: false,
            start: null,
            end: {
               x: 30/pixel,
               y: 1512/pixel
            },
            tabs: [
                {title: '全部商品', subTitle: 'ALL'},
                {title: '护发素', subTitle: 'HAIR CONDITIONER'},
                {title: '护肤类', subTitle: 'SKIN CARE'},
                {title: '焗染类', subTitle: 'HAIRDRESSING & DYE'}
            ],
            goods: [
                {id: 1, name: '多芬日常滋养修护700ml', price: 235, url: require('./images/goods/1.png'), thumb: require('./images/goodsThumb/1.png'), styles: {width: 501/pixel, height: 785/pixel, position: 'absolute', left: 30/pixel, top: 30/pixel}},
                {id: 2, name: '屈臣氏洗发露颈爽250ml', price: 125, url: require('./images/goods/2.png'), thumb: require('./images/goodsThumb/2.png'), styles: {width: 500/pixel, height: 384/pixel, position: 'absolute', left: 551/pixel, top: 30/pixel}},
                {id: 3, name: 'One leaf', price: 125, url: require('./images/goods/3.png'), thumb: require('./images/goodsThumb/3.png'), styles: {width: 240/pixel, height: 384/pixel, position: 'absolute', left: 551/pixel, top: 434/pixel}},
                {id: 4, name: 'DE PUCOMARY', price: 125, url: require('./images/goods/4.png'), thumb: require('./images/goodsThumb/4.png'), styles: {width: 240/pixel, height: 384/pixel, position: 'absolute', left: 811/pixel, top: 434/pixel}},
                {id: 5, name: '巴黎欧莱雅洗面奶', price: 125, url: require('./images/goods/5.png'), thumb: require('./images/goodsThumb/5.png'), styles: {width: 240/pixel, height: 384/pixel, position: 'absolute', left: 30/pixel, top: 835/pixel}},
                {id: 6, name: 'Perfect Whip', price: 125, url: require('./images/goods/6.png'), thumb: require('./images/goodsThumb/6.png'), styles: {width: 240/pixel, height: 384/pixel, position: 'absolute', left: 290/pixel, top: 835/pixel}},
                {id: 7, name: '沙宣修护水漾润发乳250ml', price: 125, url: require('./images/goods/7.png'), thumb: require('./images/goodsThumb/7.png'), styles: {width: 500/pixel, height: 384/pixel, position: 'absolute', left: 550/pixel, top: 835/pixel}}
            ],
            selectedGoods: [],
            total: 0,
            index: 1
        };
    }

    _renderParabola({index, translateX, translateY}) {
        let baseUrl = this.state.goods.find(element => element.id === this.state.index).thumb;
        return (
            <View
                key={`'parabola-ball-'${index}`}
                style={[
                    {position: 'absolute'},    //Don't forget to set this
                    {width: 160/pixel, height: 160/pixel},
                    {transform: [{translateX}, {translateY}]}
               ]}>
                   <Image
                     style={{width: 160/pixel, height: 160/pixel}}
                     source={baseUrl}
                   />
           </View>
        )
    }

    updateNodes() {
        this.refs.list.fadeInDownBig(500);
    }

    addGoods(index) {
        let selectedGoods = this.state.selectedGoods;
        let item = this.state.goods[index];
        let x = item.styles.left + item.styles.width/2;
        let y = item.styles.top + item.styles.height/2;
        let matchedItem = selectedGoods.find(element => element.id === item.id);
        if(!matchedItem) {
            this.setState({ isTrigger: true, start: {x, y}, index: index + 1 });
            selectedGoods.unshift({id: item.id, name: item.name, price: item.price, num: 1, thumb: item.thumb});
        } else {
            this.setState({ isTrigger: false});
            matchedItem.num++;
        }
        this.state.total += item.price;
        this.setState({selectedGoods: selectedGoods, total: this.state.total});
    }

    editGoods(index, delta) {
        let selectedGoods = this.state.selectedGoods;
        this.setState({ isTrigger: false});
        this.state.total += selectedGoods[index].price*delta;
        if(selectedGoods[index].num === 1 & delta === -1) {
            selectedGoods.splice(index, 1);
        } else {
            selectedGoods[index].num += delta;
        }
        this.setState({selectedGoods: selectedGoods, total: this.state.total});
    }

    render(){
        let goodsNode = this.state.goods.map((item, index) => {
            return (
                <ImgButton
                    key={index}
                    width={item.styles.width}
                    height={item.styles.height}
                    style={item.styles}
                    url={item.url}
                    onPress={()=>this.addGoods(index)}
                >
                </ImgButton>
            );
        });
        let selectedGoodsNodes = this.state.selectedGoods.map((item, index)=> {
            return (
                <View key={index} style={{flexDirection: 'row'}}>
                    <Image
                        style={{width: 160/pixel, height: 160/pixel}}
                        source={item.thumb}
                    />
                    <View style={{width: 180/pixel, height: 160/pixel, paddingLeft: 20/pixel, paddingRight: 10/pixel}}>
                        <Text style={{height: 66/pixel, fontSize: 24/pixel, color: '#332f29'}}>{item.name}</Text>
                        <Text style={{marginTop: 10/pixel, fontSize: 24/pixel, color: '#332f29', fontWeight: 'bold'}}>￥{item.price}</Text>
                        <View style={{flexDirection: 'row', marginTop: 15/pixel}}>
                            <TouchableOpacity style={{width: 48/pixel, height: 48/pixel}} onPress={()=>this.editGoods(index, -1)}>
                                <Image
                                    style={{width: 36/pixel, height: 36/pixel}}
                                    source={require('./images/minus.png')}
                                />
                            </TouchableOpacity>
                            <Text style={{width: 70/pixel, textAlign: 'center', fontSize: 24/pixel, color: '#332f29'}}>{item.num}</Text>
                            <TouchableOpacity style={{width: 48/pixel, height: 48/pixel}} onPress={()=>this.editGoods(index, 1)}>
                                <Image
                                    style={{width: 36/pixel, height: 36/pixel}}
                                    source={require('./images/expand.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        });
        return (
            <View style={[styles.container, this.props.style]}>
                <Tabs data={this.state.tabs} onPress={()=>{this.updateNodes()}}></Tabs>
                <View style={{ height: 1266 / pixel, backgroundColor: '#424242' }}>
                    <View style={{backgroundColor: '#424242'}}>
                        <Animatable.View ref={'list'} style={{height: 1266 / pixel}}>
                            {goodsNode}
                        </Animatable.View>
                    </View>
                </View>
                <View style={{height: 334 / pixel}}>
                    <View style={{height: 126 / pixel, flexDirection: 'row', paddingLeft: 482/pixel, paddingTop: 29.5/pixel}}>
                        <Text style={{fontSize: 48/pixel}}>购物车</Text>
                        <Text style={{marginLeft: 210/pixel, marginTop: 22/pixel, fontSize: 24/pixel, color: '#332f29'}}>总价</Text>
                        <Text style={{marginLeft: 17/pixel, marginTop: 18/pixel, fontSize: 28/pixel, color: '#dfac4d'}}>￥</Text>
                        <Text style={{fontSize: 48/pixel, color: '#dfac4d', fontWeight: 'bold'}}>{this.state.total}</Text>
                    </View>
                    <Carousel
                        ref={(carousel) => { this._carousel = carousel; }}
                        sliderWidth={340 / pixel}
                        itemWidth={400 / pixel}
                        showsHorizontalScrollIndicator={false}
                        inactiveSlideScale={1}
                        slideStyle={{paddingHorizontal: 30 / pixel, alignItems: 'center'}}
                        contentContainerCustomStyle={styles.slider}
                    >
                        {selectedGoodsNodes}
                    </Carousel>
                </View>
                <View style={[styles.bottom, {justifyContent: "center", alignItems: "center"}]} >
                    <TouchableOpacity style={{
                        height: 100 / pixel,
                        width: 370 / pixel,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: this.state.selectedGoods.length > 0 ? '#dfac4d' : '#f4d8a3'
                    }} onPress={()=>Actions.order()} >
                        <Text style={{fontSize: 36 / pixel, color: "white"}}>前往支付</Text>
                    </TouchableOpacity>
                </View>
                <Parabola
                    isTrigger={this.state.isTrigger}
                    rate={0.9}
                    start={this.state.start}
                    end={this.state.end}
                    renderParabola={this._renderParabola.bind(this)}
                />
            </View>
        );
    }
}

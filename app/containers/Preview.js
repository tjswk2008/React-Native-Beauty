/**
* @Date:   2017-03-17 10:55:12
 * @Last modified time: 2017-04-26T16:53:46+08:00
*/

import React from 'react';
import {View, Image, TouchableOpacity, PixelRatio, NativeModules} from "react-native";
import Category from '../components/Category';
import Tabs from '../components/Tabs';
import styles from '../styles/Introduction';
import Face from '../components/Face';
import Canvas from '../components/Canvas';
import Carousel from 'react-native-snap-carousel';
import {Actions} from "react-native-router-flux";
import * as Animatable from 'react-native-animatable';

let pixel = PixelRatio.get();
let {BGNativeExampleModule} = NativeModules;

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [{title: '男士', subTitle: 'MAN'}, {title: '女士', subTitle: 'WOMAN'}],
            hairs: [require('./images/hairCat/1.png'),require('./images/hairCat/2.png'),require('./images/hairCat/3.png'),require('./images/hairCat/4.png')],
            category: [
                {name: '直发类', url: require('./images/hairType/1.png')},
                {name: '卷发类', url: require('./images/hairType/2.png')},
                {name: '烫发类', url: require('./images/hairType/3.png')},
                {name: '染发类', url: require('./images/hairType/4.png')},
                {name: '直发类', url: require('./images/hairType/1.png')}
            ],
            showHairs: true,
            hairSelected: false
        };
    }

    componentDidMount() {
        // NativeModules.BGNativeExampleModule.gotoMainActivity();
    }

    takePicture() {
        // const options = {target: Camera.constants.CaptureTarget.memory};
        // this.camera.capture({metadata: options}).then(res=>{
        //     this.setState({hairSelected: false});
        //     Actions.share({url: res.path});
        // }).catch(err => {
        //     alert(err);
        // });
        BGNativeExampleModule.takePicture().then(res=>{
            Actions.share({url: res});
        });
        // Actions.share({url: require('./images/share.jpg')});
    }

    showHairs() {
        if(this.state.showHairs) {
            this.refs.hairs.fadeInRightBig();
        }
        this.setState({showHairs: true});
    }

    chooseHair() {
        let hairSrc = require('./images/hair.png');
        this.setState({hairSelected: true, showHairs: false});
    }

    renderCanvas(canvas) {
      // Canvas demo is from here: http://codepen.io/antoniskamamis/pen/ECrKd
      var ctx = canvas.getContext('2d');

      canvas.width = 200;
      canvas.height = 200;
      canvas.style.left = (window.innerWidth - 200)/2+'px';

      if(window.innerHeight>200)
      canvas.style.top = (window.innerHeight - 200)/2+'px';

      function draw(){
        ctx.clearRect(0, 0, 200, 200);
        ctx.globalCompositeOperation = 'lighter';
        let img = new Image();
        img.src = 'file:///storage/emulated/0/download/share.jpg';
        img.onload = () => {
            ctx.drawImage(img, 0, 0, 200, 200);
        }
      }

      draw();
    }

    render(){
        let typeNodes = this.state.hairs.map((item, index)=> {
            return (
                <TouchableOpacity key={index} onPress={()=>this.chooseHair(index)}>
                    <Image
                        style={{width: 240/pixel, height: 240/pixel}}
                        source={item}
                    />
                </TouchableOpacity>
            );
        });
        return (
            <View style={[styles.container, this.props.style]}>
                <Face ref={(cam) => {
                    this.camera = cam;
                  }} style={{width: '100%', height: 1920/pixel, position: 'absolute'}}></Face>
                {/* <Canvas
                  context={{message: 'Hello!'}}
                  render={this.renderCanvas}
                  style={{width: '100%', height: 1920/pixel, position: 'absolute'}}
                /> */}
                {!this.state.showHairs && this.state.hairSelected && <TouchableOpacity style={{width: 240/pixel, height: 240/pixel, position: 'absolute', left: 420/pixel, bottom: 280/pixel}}
                    onPress={()=>this.takePicture()}>
                    <Image
                        style={{width: 240/pixel, height: 240/pixel}}
                        source={require('./images/capture.png')}
                    />
                </TouchableOpacity>}
                <Tabs onPress={()=>{this.showHairs()}} data={this.state.tabs} style={{position: 'absolute', top: 0}}></Tabs>
                {this.state.showHairs && <Animatable.View ref={'hairs'} animation="fadeInRightBig" style={{position: 'absolute', bottom: 230/pixel}}>
                    <Carousel
                        ref={(carousel) => { this._carousel = carousel; }}
                        sliderWidth={240 / pixel}
                        itemWidth={280 / pixel}
                        showsHorizontalScrollIndicator={false}
                        inactiveSlideScale={1}
                        slideStyle={{paddingHorizontal: 20 / pixel, alignItems: 'center'}}
                        contentContainerCustomStyle={styles.slider}
                    >
                        {typeNodes}
                    </Carousel>
                </Animatable.View>}
                <View style={styles.bottom}>
                    <Category onPress={()=>{this.showHairs()}} data={this.state.category}></Category>
                </View>
            </View>
        );
    }
}

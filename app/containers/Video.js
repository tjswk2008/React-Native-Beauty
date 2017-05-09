/**
* @Date:   2017-03-17 10:55:12
 * @Last modified time: 2017-04-20 20:07:08
*/

import React from 'react';
import {View, Text, Animated, Image, Dimensions, StyleSheet, TouchableOpacity, PixelRatio} from "react-native";
import Video from 'react-native-video';
import {Actions} from "react-native-router-flux";

const videoSrc = require("./test.mp4");
const pixel = PixelRatio.get();
let {
    height: deviceHeight
} = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top:0,
        bottom:0,
        left:0,
        right:0,
        backgroundColor:"transparent",
        justifyContent: "center",
        alignItems: "center"
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5
    },
    fullScreen: {
        height: "100%",
        width: "100%"
    }
});


export default class extends React.Component {

    constructor(props){
        super (props);

        this.state = {
            offset: new Animated.Value(-deviceHeight),
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            paused: true
        };
    }

      video: Video;

      onLoad = (data) => {
        this.setState({ duration: data.duration });
      };

      onProgress = (data) => {
        this.setState({ currentTime: data.currentTime });
      };

      onEnd = () => {
        this.setState({ paused: true })
        this.video.seek(0)
      };

      onAudioBecomingNoisy = () => {
        this.setState({ paused: true })
      };

      onAudioFocusChanged = (event: { hasAudioFocus: boolean }) => {
        this.setState({ paused: !event.hasAudioFocus })
      };

      getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
          return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        }
        return 0;
      }

      renderRateControl(rate) {
        const isSelected = (this.state.rate === rate);

        return (
          <TouchableOpacity onPress={() => { this.setState({ rate }) }}>
            <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
              {rate}x
            </Text>
          </TouchableOpacity>
        );
      }

      renderResizeModeControl(resizeMode) {
        const isSelected = (this.state.resizeMode === resizeMode);

        return (
          <TouchableOpacity onPress={() => { this.setState({ resizeMode }) }}>
            <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
              {resizeMode}
            </Text>
          </TouchableOpacity>
        )
      }

      renderVolumeControl(volume) {
        const isSelected = (this.state.volume === volume);

        return (
          <TouchableOpacity onPress={() => { this.setState({ volume }) }}>
            <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
              {volume * 100}%
            </Text>
          </TouchableOpacity>
        )
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
                    width:1000 / pixel,
                    height:607.5 / pixel,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "black"
                }}>
                    <TouchableOpacity
                      style={styles.fullScreen}
                      onPress={() => this.setState({ paused: !this.state.paused })}
                    >
                      <Video
                        ref={ref => { this.video = ref }}
                        source={videoSrc}
                        style={styles.fullScreen}
                        rate={this.state.rate}
                        paused={this.state.paused}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        onLoad={this.onLoad}
                        onProgress={this.onProgress}
                        onEnd={this.onEnd}
                        onAudioBecomingNoisy={this.onAudioBecomingNoisy}
                        onAudioFocusChanged={this.onAudioFocusChanged}
                        repeat={true}
                      />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{
                    height: 70 / pixel,
                    width: 70 / pixel,
                    position: 'absolute',
                    right: 20 / pixel,
                    top: 636.25 / pixel
                }} onPress={()=>this.closeModal('pop')} >
                    <Image
                        style={{width: 70 / pixel, height: 70 / pixel}}
                        source={require('./images/collapse.png')}
                    />
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

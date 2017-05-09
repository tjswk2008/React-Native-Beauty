/**
* @Date:   2017-03-17 10:55:12
 * @Last modified time: 2017-04-20 20:05:06
*/

import React from 'react';
import { Image, TouchableOpacity, Animated, Easing } from 'react-native';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default class extends React.Component {
    constructor(props){
        super (props);
        this.state = {
          size: new Animated.Value(8)
        }
    }

    componentDidMount() {
        this._loopAnimationUp();
    }

    render(){
        const size = this.state.size.interpolate({
          inputRange: [1, 10],
          outputRange: [10, 50],
          extrapolate: 'clamp'
        });
        return (
            <TouchableOpacity style={this.props.style} onPress={()=>this.props.onPress()}>
                <AnimatedImage
                    style={{width: size, height: size}}

                    source={this.props.url}
                />
            </TouchableOpacity>
        );
    }

  // The animation functions. Initial and end values can be anything (not just 1, 10, but remember to use the same value and flip them:
  _loopAnimationUp() {
    this.state.size.setValue(8);
    Animated.timing(this.state.size, {
      toValue: 10,
      duration: 1000,
      easing: Easing.linear
    }).start((o) => {
      if (o.finished) {
        this._loopAnimationDown();
      }
    });
  }

  _loopAnimationDown() {
    this.state.size.setValue(10);
    Animated.timing(this.state.size, {
      toValue: 8,
      duration: 1000,
      easing: Easing.linear
    }).start((o) => {
      if (o.finished) {
        this._loopAnimationUp();
      }
    });
  }
}

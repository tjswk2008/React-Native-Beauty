import {PropTypes} from 'react';
var { requireNativeComponent } = require('react-native');


var iface = {
    name: 'RCTCustomRelativeLayout',
    propTypes: {
        text:PropTypes.string,
        textSize:PropTypes.number,
        textColor:PropTypes.number,
        isAlpha:PropTypes.bool,

        testID:PropTypes.string,
        accessibilityComponentType:PropTypes.string,
        accessibilityLabel:PropTypes.string,
        accessibilityLiveRegion:PropTypes.string,
        renderToHardwareTextureAndroid:PropTypes.bool,
        importantForAccessibility:PropTypes.string,
        onLayout:PropTypes.bool
    }
};

module.exports = requireNativeComponent('RCTCustomRelativeLayout', iface);

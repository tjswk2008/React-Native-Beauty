/**
* @Date:   2017-03-17 10:55:12
 * @Last modified time: 2017-04-18 11:45:46
*/

import React from 'react';
import {Image, TouchableOpacity} from "react-native";

export default class extends React.Component {
    constructor(props){
        super (props);
    }

    componentDidMount() {
    }

    render(){
        let {width, height, url, onPress, style} = this.props;
        return (
            <TouchableOpacity style={style} onPress={()=>onPress()}>
                <Image
                    style={{width: width, height: height}}
                    source={url}
                />
            </TouchableOpacity>
        );
    }
}

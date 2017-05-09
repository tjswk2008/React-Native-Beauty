/**
 * @Date:   2017-03-16 17:54:57
 * @Last modified time: 2017-04-26T16:53:57+08:00
 */

import React from 'react';
import {Alert, View, Image, Animated, StyleSheet, PixelRatio, TouchableOpacity, Linking, Platform } from "react-native";
import {Actions} from "react-native-router-flux";
import RNFetchBlob from 'react-native-fetch-blob';
import Toggle from "../components/Toggle";
import {
  isFirstTime,
  isRolledBack,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  markSuccess
} from 'react-native-update';
import _updateConfig from '../../update.json';
const {appKey} = _updateConfig[Platform.OS];

const pixel = PixelRatio.get();
const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 1063 / pixel
    },
    nav: {
        position: 'absolute',
        bottom: 0,
        width: 560 / pixel,
        height: 738 / pixel,
        flexDirection: 'row',
        flexWrap: 'wrap',
        left: 270 / pixel,
        bottom: 323 / pixel
    },
    button: {
        width: 240 / pixel,
        height: 319 / pixel,
        borderRadius: 12 / pixel,
        marginHorizontal: 20 / pixel,
        marginVertical: 25 / pixel
    },
    toggle: {
        position: 'absolute',
        bottom: 120 / pixel,
        width: '100%',
        alignItems: 'center'
    }
});
const {fs} = RNFetchBlob;

export default class extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            expanded: false,
            menus: [
                {route: 'introduction', url: require('./images/menu1.png')},
                {route: 'preview', url: require('./images/menu2.png')},
                {route: 'shop', url: require('./images/menu3.png')},
                {route: 'entertainment', url: require('./images/menu4.png')}
            ],
            fadeAnim: new Animated.Value(0)
        };
    }

    componentWillMount(){
      if (isFirstTime) {
        markSuccess();
      } else if (isRolledBack) {
        Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
      }
    }

    componentDidMount() {
        this.checkUpdate();
        this.resumableDownload('/storage/emulated/0/download/studio.jpg');
    }

    doUpdate(info) {
      downloadUpdate(info).then(hash => {
        switchVersion(hash);
      }).catch(() => {
        Alert.alert('提示', '更新失败.');
      });
    }

    checkUpdate() {
      checkUpdate(appKey).then(info => {
        if (info.expired) {
          info.downloadUrl && Linking.openURL(info.downloadUrl)
        } else if (info.upToDate) {
        //   Alert.alert('提示', '您的应用版本已是最新.');
        } else {
          this.doUpdate(info);
        }
      }).catch(() => {
        Alert.alert('提示', '更新失败.');
      });
    }

    takePicture() {
        const options = {};
        this.camera.capture({metadata: options});
    }

    expandMenu(value) {
        this.setState({expanded: value});
    }

    resumableDownload(dest) {
        fs.exists(dest)
        .then((ext) => {
            if(ext) {
                // specify encoding `uri` is the most performant way
                // to perform file-to-file data transfer,
                // the whole process is done in native
                return fs.stat(dest);
            }
            else
                return Promise.resolve({ size : 0 })
        })
        // after the previous downloaded data moved to desitation (if there is)
        // we can start a new session which overwrites the ${dest}.download
        // the new seesion will use range request which ask for the remain
        // part from server
        .then((stat) => {
            return RNFetchBlob
                .config({ path : dest, overwrite: false})
                .fetch('GET', 'http://pic.58pic.com/58pic/13/78/33/88E58PICixT_1024.jpg', {
                    Range : `bytes=${stat.size}-`
                })
        })
        .then(() => {
            /* done !! */
        })
    }

    render(){
        let menu = this.state.menus.map((item, index)=> {
            return (
                <TouchableOpacity key={index} style={styles.button} onPress={()=>Actions[item.route]()}>
                    <Image
                        style={{width: 240 / pixel, height: 319 / pixel}}
                        source={item.url}
                    />
                </TouchableOpacity>
            );
        });
        return (
            <View style={[styles.container, this.props.style]}>
                <Image
                    style={{width: '100%', height: '100%'}}
                    source={require('./images/homeBg.jpg')}
                />
                <View style={{
                    position: 'absolute', width: '100%', height: '100%', opacity:0.6, backgroundColor: '#000'
                }}></View>
                <View style={styles.bottom}>
                    <View style={styles.nav}>
                        {menu}
                    </View>
                    {/* <Toggle
                        style={styles.toggle}
                        url={require('./images/collapse.png')}
                        onPress={()=>this.expandMenu(false)}>
                    </Toggle> */}
                </View>
            </View>
        );
    }
}

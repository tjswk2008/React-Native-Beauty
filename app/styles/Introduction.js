/**
 * @Date:   2017-03-16 17:54:57
 * @Last modified time: 2017-04-20 17:48:00
 */

import {StyleSheet, PixelRatio} from "react-native";
let pixel = PixelRatio.get();

export default StyleSheet.create({
    container: {
        height: '100%'
    },
    tabs: {
        flexDirection:'row',
        width: '100%',
        height: 120 / pixel
    },
    tab: {
        height: 120 / pixel,
        alignItems: 'center',
        justifyContent: 'center'
    },
    list: {
        flexDirection:'row',
        flexWrap: 'wrap',
        height: 1600 / pixel
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 200 / pixel,
        backgroundColor: '#332f29'
    },
    imgContainer: {
        margin: 10 / pixel
    },
    img: {
        width: 500 / pixel,
        height: 500 / pixel
    },
    tabActive: {
        backgroundColor: '#dfac4d'
    },
    tabInActive: {
        backgroundColor: '#332f29'
    },
    hairType: {
        width: 241 / pixel,
        height: 140 / pixel
    },
    text: {
        textAlign: 'center',
        color: '#e6decf',
        fontSize: 36 / pixel,
        fontWeight: 'bold'
    },
    slider: {
        alignItems: 'center'
    },
    slide: {
        paddingHorizontal: 10 / pixel,
        alignItems: 'center'
    }
})

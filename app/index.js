/**
* @Date:   2017-03-16 11:44:04
 * @Last modified time: 2017-04-24T16:27:52+08:00
*/

import React, { Component } from 'react';
import { AppState} from 'react-native';
import { Scene, Reducer, Router, Modal} from 'react-native-router-flux';
import Video from './containers/Video';
import Camera from './containers/Camera';
import HairDetail from './containers/HairDetail';
import Introduction from './containers/Introduction';
import Preview from './containers/Preview';
import Share from './containers/Share';
import Shop from './containers/Shop';
import Order from './containers/Order';
import Pay from './containers/Pay';
import Entertainment from './containers/Entertainment';
import codePush from 'react-native-code-push';

const reducerCreate = params => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    return defaultReducer(state, action);
  };
};

// define this based on the styles/dimensions you use
const getSceneStyle = (props, computedProps) => {
  const style = {
    flex: 1,
    backgroundColor: '#fff',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null
  };
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64;
    style.marginBottom = computedProps.hideTabBar ? 0 : 50;
  }
  return style;
};

class App extends Component {
  componentDidMount() {
  }
  componentWillMount(){

  }

  render() {
    return (
      <Router createReducer={reducerCreate} getSceneStyle={getSceneStyle} showNavigationBar={false} >
          <Scene key="modal" component={Modal} >
            <Scene key="root" hideNavBar hideTabBar>
              <Scene key="entertainment" direction="fade" component={Entertainment} title="Entertainment"/>
              <Scene key="shop" direction="fade" component={Shop} title="Shop"/>
              <Scene key="order" direction="fade" component={Order} title="Order"/>
              <Scene key="pay" direction="fade" component={Pay} title="Pay"/>
              {/* <Scene key="preview" direction="fade" type='reset' component={Preview} title="Preview"/> */}
              <Scene key="preview" direction="fade" component={Preview} title="Preview"/>
              <Scene key="introduction" direction="fade" component={Introduction} title="Introduction"/>
              <Scene key="camera" direction="fade" initial component={Camera} title="Camera"/>
            </Scene>
            <Scene key="hairDetail" component={HairDetail} />
            <Scene key="video" component={Video} />
            <Scene key="share" component={Share} />
        </Scene>
      </Router>
    );
  }
}
export default App;

/**
 * @Date:   2017-04-24T14:07:16+08:00
 * @Last modified time: 2017-04-25T11:06:40+08:00
 */



package com.awesomeproject;

import android.view.View;
import com.facebook.react.ReactActivity;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "AwesomeProject";
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideNavigationBar();
        }
    }

    @Override
    protected void onStart() {
        hideNavigationBar();
        super.onStart();
    }

    public void hideNavigationBar() {
      int uiFlags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
         | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
         | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
         | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
         | View.SYSTEM_UI_FLAG_FULLSCREEN; // hide status bar

      if( android.os.Build.VERSION.SDK_INT >= 19 ){
          uiFlags |= 0x00001000;    //SYSTEM_UI_FLAG_IMMERSIVE_STICKY: hide navigation bars - compatibility: building API level is lower thatn 19, use magic number directly for higher API target level
      } else {
          uiFlags |= View.SYSTEM_UI_FLAG_LOW_PROFILE;
      }

      getWindow().getDecorView().setSystemUiVisibility(uiFlags);
    }
}

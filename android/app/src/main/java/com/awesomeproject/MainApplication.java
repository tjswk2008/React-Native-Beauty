/**
* @Date:   2017-03-16 11:02:56
 * @Last modified time: 2017-04-26T16:52:24+08:00
*/

package com.awesomeproject;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import cn.reactnative.modules.update.UpdateContext;
import cn.reactnative.modules.update.UpdatePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.rnfs.RNFSPackage;
import com.chnsys.reactfileselect.FileSelectReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.microsoft.codepush.react.CodePush;
import com.lwansbrough.RCTCamera.RCTCameraPackage;

import java.util.Arrays;
import java.util.List;
import devinxu.mynativemodeulaexample.BGNativeExamplePackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return UpdateContext.getBundleUrl(MainApplication.this);
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFetchBlobPackage(),
            new UpdatePackage(),
            new LinearGradientPackage(),
            new ReactVideoPackage(),
            new RCTCameraPackage(),
            new RNZipArchivePackage(),
            new RNFSPackage(),
            new FileSelectReactPackage(),
            new BGNativeExamplePackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}

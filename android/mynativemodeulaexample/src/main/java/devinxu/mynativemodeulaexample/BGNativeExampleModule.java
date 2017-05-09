package devinxu.mynativemodeulaexample;


import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

import devinxu.mynativemodeulaexample.facerecognize.RCTCameraSource;

/**
 * Created by devinxu on 4/20/17.
 */

public class BGNativeExampleModule extends ReactContextBaseJavaModule{
    private static final String TAG = "BGNativeExampleModule";

    private File imageFile;

    public BGNativeExampleModule(ReactApplicationContext reactContent) {
        super(reactContent);
    }

    @Override
    public String getName() {
        return "BGNativeExampleModule";
    }

    @ReactMethod
    public void takePicture(final Promise promise) {
        RCTCameraSource.getInstance().takePicture(new RCTCameraSource.MyPictureCallback() {
            @Override
            public void onPictureTaken() {
                promise.resolve(RCTCameraSource.getInstance().getImagePath());
            }
        });
    }

    @ReactMethod
    public void releaseCamera() {
        RCTCameraSource.getInstance().releaseCameraSource();
    }
}

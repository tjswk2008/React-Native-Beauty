package devinxu.mynativemodeulaexample;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import devinxu.mynativemodeulaexample.facerecognize.CustomRelativeLayout;

/**
 * Created by devinxu on 4/26/17.
 */

public class CustomRelativeLayoutManager extends SimpleViewManager<CustomRelativeLayout> {

    public static final String REACT_CLASS = "RCTCustomRelativeLayout";
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected CustomRelativeLayout createViewInstance(ThemedReactContext reactContext) {
        CustomRelativeLayout customRelativeLayout= new CustomRelativeLayout(reactContext);

        return customRelativeLayout;
    }
}

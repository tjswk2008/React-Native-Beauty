package devinxu.mynativemodeulaexample.facerecognize;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;

import java.io.File;
import java.io.IOException;

import devinxu.mynativemodeulaexample.ui.camera.CameraSourcePreview;
import devinxu.mynativemodeulaexample.ui.camera.GraphicOverlay;

/**
 * Created by devinxu on 4/26/17.
 */

public class CustomRelativeLayout extends RelativeLayout {

    private static final String TAG = "CustomRelativeLayout";

    private static final int RC_HANDLE_GMS = 9001;

    // permission request codes need to be < 256
    private static final int RC_HANDLE_CAMERA_PERM = 2;

    private CameraSourcePreview mPreview;
    private GraphicOverlay mGraphicOverlay;

    private boolean mIsFrontFacing = false;
    private Context mCurrentContext;

    // 保存图片
    private File imageFile;

    public CustomRelativeLayout(Context context) {
        super(context);

        mCurrentContext = context;
        LayoutInflater.from(mCurrentContext).inflate(R.layout.main, this);

        mPreview = (CameraSourcePreview) findViewById(R.id.preview);
        mGraphicOverlay = (GraphicOverlay) findViewById(R.id.faceOverlay);

        final Button button = (Button) findViewById(R.id.flipButton);
        button.setOnClickListener(mFlipButtonListener);

//        createCameraSource();

        RCTCameraSource.getInstance().createInstance(context, getResources(), mGraphicOverlay);

        startCameraSource();
    }

    /**
     * Toggles between front-facing and rear-facing modes.
     */
    private View.OnClickListener mFlipButtonListener = new View.OnClickListener() {
        public void onClick(View v) {
//            mIsFrontFacing = !mIsFrontFacing;

            if (RCTCameraSource.getInstance().acquireCameraSource() != null) {
                RCTCameraSource.getInstance().releaseCameraSource();
            }

            startCameraSource();
        }
    };

    /*
     * Starts or restarts the camera source, if it exists.  If the camera source doesn't exist yet
     * (e.g., because onResume was called before the camera source was created), this will be called
     * again when the camera source is created.
     */
    private void startCameraSource() {
        Log.e(TAG, "go startCameraSource");
        // check that the device has play services available.
        int code = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(getContext());
        if (code != ConnectionResult.SUCCESS) {
            Dialog dlg =
                    GoogleApiAvailability.getInstance().getErrorDialog((Activity) mCurrentContext, code, RC_HANDLE_GMS);
            dlg.show();
        }

        if (RCTCameraSource.getInstance().acquireCameraSource() != null) {
            try {
                mPreview.start(RCTCameraSource.getInstance().acquireCameraSource(), mGraphicOverlay);
            } catch (IOException e) {
                Log.e(TAG, "Unable to start camera source.", e);
                RCTCameraSource.getInstance().acquireCameraSource().release();
            }
        }
    }


}

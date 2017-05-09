package devinxu.mynativemodeulaexample.facerecognize;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.util.Log;
import android.util.SparseArray;

import com.google.android.gms.vision.CameraSource;
import com.google.android.gms.vision.Detector;
import com.google.android.gms.vision.Frame;
import com.google.android.gms.vision.MultiProcessor;
import com.google.android.gms.vision.Tracker;
import com.google.android.gms.vision.face.Face;
import com.google.android.gms.vision.face.FaceDetector;
import com.google.android.gms.vision.face.LargestFaceFocusingProcessor;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import devinxu.mynativemodeulaexample.ui.camera.GraphicOverlay;

import static android.R.attr.path;

/**
 * Created by devinxu on 5/5/17.
 */

public class RCTCameraSource {
    private static final String TAG = "RCTCameraSource";

    private static RCTCameraSource mInstance;

    private CameraSource mCameraSource = null;

    private GraphicOverlay mGraphicOverlay;

    private Resources mResource;

    private Context mCurrentContext;

    private Boolean mIsFrontFacing = false;

    private File imageFile;
    private String test;

    public static RCTCameraSource getInstance() {
        return mInstance;
    }

    public static void createInstance(Context context, Resources resources, GraphicOverlay graphicOverlay) {
        mInstance = new RCTCameraSource(context, resources, graphicOverlay);
    }

    private RCTCameraSource(Context context, Resources resources, GraphicOverlay graphicOverlay) {
        mCurrentContext = context;
        mResource = resources;
        mGraphicOverlay = graphicOverlay;

        acquireCameraSource();
    }

    /**
     * Creates the face detector and the camera.
     */
    public synchronized CameraSource acquireCameraSource() {
        FaceDetector detector = createFaceDetector(mCurrentContext);

        int facing = CameraSource.CAMERA_FACING_FRONT;
        if (!mIsFrontFacing) {
            facing = CameraSource.CAMERA_FACING_FRONT;
        }

        // The camera source is initialized to use either the front or rear facing camera.  We use a
        // relatively low resolution for the camera preview, since this is sufficient for this app
        // and the face detector will run faster at lower camera resolutions.
        //
        // However, note that there is a speed/accuracy trade-off with respect to choosing the
        // camera resolution.  The face detector will run faster with lower camera resolutions,
        // but may miss smaller faces, landmarks, or may not correctly detect eyes open/closed in
        // comparison to using higher camera resolutions.  If you have any of these issues, you may
        // want to increase the resolution.
        if (null == mCameraSource) {
            mCameraSource = new CameraSource.Builder(mCurrentContext, detector)
                    .setFacing(facing)
                    .setRequestedPreviewSize(320, 240)
                    .setRequestedFps(60.0f)
                    .setAutoFocusEnabled(true)
                    .build();
        }

        return mCameraSource;
    }

    public void releaseCameraSource() {
        if (mCameraSource != null) {
            mCameraSource.release();
        }
    }

    //==============================================================================================
    // Detector
    //==============================================================================================

    /**
     * Creates the face detector and associated processing pipeline to support either front facing
     * mode or rear facing mode.  Checks if the detector is ready to use, and displays a low storage
     * warning if it was not possible to download the face library.
     */
    @NonNull
    private FaceDetector createFaceDetector(Context context) {
        // For both front facing and rear facing modes, the detector is initialized to do landmark
        // detection (to find the eyes), classification (to determine if the eyes are open), and
        // tracking.
        //
        // Use of "fast mode" enables faster detection for frontward faces, at the expense of not
        // attempting to detect faces at more varied angles (e.g., faces in profile).  Therefore,
        // faces that are turned too far won't be detected under fast mode.
        //
        // For front facing mode only, the detector will use the "prominent face only" setting,
        // which is optimized for tracking a single relatively large face.  This setting allows the
        // detector to take some shortcuts to make tracking faster, at the expense of not being able
        // to track multiple faces.
        //
        // Setting the minimum face size not only controls how large faces must be in order to be
        // detected, it also affects performance.  Since it takes longer to scan for smaller faces,
        // we increase the minimum face size for the rear facing mode a little bit in order to make
        // tracking faster (at the expense of missing smaller faces).  But this optimization is less
        // important for the front facing case, because when "prominent face only" is enabled, the
        // detector stops scanning for faces after it has found the first (large) face.
        FaceDetector detector = new FaceDetector.Builder(context)
                .setLandmarkType(FaceDetector.ALL_LANDMARKS)
                .setClassificationType(FaceDetector.ALL_CLASSIFICATIONS)
                .setTrackingEnabled(true)
                .setMode(FaceDetector.FAST_MODE)
                .setProminentFaceOnly(mIsFrontFacing)
                .setMinFaceSize(mIsFrontFacing ? 0.35f : 0.15f)
                .build();

        Detector.Processor<Face> processor;
        if (mIsFrontFacing) {
            // For front facing mode, a single tracker instance is used with an associated focusing
            // processor.  This configuration allows the face detector to take some shortcuts to
            // speed up detection, in that it can quit after finding a single face and can assume
            // that the nextIrisPosition face position is usually relatively close to the last seen
            // face position.
            Tracker<Face> tracker = new GooglyFaceTracker(mGraphicOverlay, mResource);
            processor = new LargestFaceFocusingProcessor.Builder(detector, tracker).build();
        } else {
            // For rear facing mode, a factory is used to create per-face tracker instances.  A
            // tracker is created for each face and is maintained as long as the same face is
            // visible, enabling per-face state to be maintained over time.  This is used to store
            // the iris position and velocity for each face independently, simulating the motion of
            // the eyes of any number of faces over time.
            //
            // Both the front facing mode and the rear facing mode use the same tracker
            // implementation, avoiding the need for any additional code.  The only difference
            // between these cases is the choice of Processor: one that is specialized for tracking
            // a single face or one that can handle multiple faces.  Here, we use MultiProcessor,
            // which is a standard component of the mobile vision API for managing multiple items.
            MultiProcessor.Factory<Face> factory = new MultiProcessor.Factory<Face>() {
                @Override
                public Tracker<Face> create(Face face) {
                    return new GooglyFaceTracker(mGraphicOverlay, mResource);
                }
            };
            processor = new MultiProcessor.Builder<>(factory).build();
        }

        detector.setProcessor(processor);

        if (!detector.isOperational()) {
            // Note: The first time that an app using face API is installed on a device, GMS will
            // download a native library to the device in order to do detection.  Usually this
            // completes before the app is run for the first time.  But if that download has not yet
            // completed, then the above call will not detect any faces.
            //
            // isOperational() can be used to check if the required native library is currently
            // available.  The detector will automatically become operational once the library
            // download completes on device.
            Log.w(TAG, "Face detector dependencies are not yet available.");

            // Check for low storage.  If there is low storage, the native library will not be
            // downloaded, so detection will not become operational.
            IntentFilter lowStorageFilter = new IntentFilter(Intent.ACTION_DEVICE_STORAGE_LOW);
            //            boolean hasLowStorage = registerReceiver(null, lowStorageFilter) != null;
            //
            //            if (hasLowStorage) {
            //                Toast.makeText(mCurrentContext, R.string.low_storage_error, Toast.LENGTH_LONG).show();
            //                //Log.w(TAG, getString(R.string.low_storage_error));
            //            }
        }
        return detector;
    }


    public interface MyPictureCallback {
        void onPictureTaken();
    }

    public void takePicture(final RCTCameraSource.MyPictureCallback myPictureCallback) {
        this.acquireCameraSource().takePicture(null, new CameraSource.PictureCallback() {
            @Override
            public void onPictureTaken(byte[] bytes) {
                Bitmap bmp1 = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);

                saveImageToGallery(mCurrentContext, startPhotoDetector(bmp1));

                myPictureCallback.onPictureTaken();
            }
        });
    }

    private Bitmap startPhotoDetector(Bitmap bitmap) {
        FaceDetector detector = new FaceDetector.Builder(mCurrentContext)
                .setTrackingEnabled(false)
                .setLandmarkType(FaceDetector.ALL_LANDMARKS)
                .build();

        // This is a temporary workaround for a bug in the face detector with respect to operating
        // on very small images.  This will be fixed in a future release.  But in the near term, use
        // of the SafeFaceDetector class will patch the issue.
        Detector<Face> safeDetector = new SafeFaceDetector(detector);

        // Create a frame from the bitmap and run face detection on the frame.
        Frame frame = new Frame.Builder().setBitmap(bitmap).build();
        SparseArray<Face> faces = safeDetector.detect(frame);

        if (!safeDetector.isOperational()) {
            // Note: The first time that an app using face API is installed on a device, GMS will
            // download a native library to the device in order to do detection.  Usually this
            // completes before the app is run for the first time.  But if that download has not yet
            // completed, then the above call will not detect any faces.
            //
            // isOperational() can be used to check if the required native library is currently
            // available.  The detector will automatically become operational once the library
            // download completes on device.
            Log.w(TAG, "Face detector dependencies are not yet available.");

            // Check for low storage.  If there is low storage, the native library will not be
            // downloaded, so detection will not become operational.
            IntentFilter lowstorageFilter = new IntentFilter(Intent.ACTION_DEVICE_STORAGE_LOW);
            boolean hasLowStorage = mCurrentContext.registerReceiver(null, lowstorageFilter) != null;

            if (hasLowStorage) {
                Log.w(TAG, "low storage");
            }
        }

        Bitmap bmp = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), bitmap.getConfig());
        Canvas canvas = new Canvas(bmp);
        canvas.drawBitmap(bitmap, new Matrix(), null);

        Paint paint = new Paint();
        paint.setColor(Color.GREEN);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(5);

        for (int i = 0; i < faces.size(); ++i) {
            Face face = faces.valueAt(i);
            Bitmap tempBmp = BitmapFactory.decodeResource(mResource, R.drawable.hair);
            canvas.drawBitmap(tempBmp, 0, 0, null);
//            for (Landmark landmark : face.getLandmarks()) {
//                int cx = (int) (landmark.getPosition().x);
//                int cy = (int) (landmark.getPosition().y);
//                canvas.drawCircle(cx, cy, 10, paint);
//            }
        }

        // Although detector may be used multiple times for different images, it should be released
        // when it is no longer needed in order to free native resources.
        safeDetector.release();

        return bmp;
    }

    /**
     * 图片保存操作
     */
    /**
     * 判断是否有SD卡
     *
     * @return 有SD卡返回true，否则false
     */
    private boolean hasSDCard() {
        // 获取外部存储的状态
        String state = Environment.getExternalStorageState();
        if (Environment.MEDIA_MOUNTED.equals(state)) {
            // 有SD卡
            return true;
        }
        return false;
    }

    /**
     * 初始化存储图片的文件
     *
     * @return 初始化成功返回true，否则false
     */
    private boolean initImageFile() {
        Log.i(TAG, "initImageFile start");
        // 有SD卡时才初始化文件
        if (hasSDCard()) {
            // 构造存储图片的文件的路径，文件名为当前时间
            String filePath = Environment.getExternalStorageDirectory()
                    .getAbsolutePath()
                    + "/"
                    + System.currentTimeMillis()
                    + ".png";
            imageFile = new File(filePath);
            test = new String("good");
            Log.i(TAG, "the image file path is " + imageFile.toString());
            if (!imageFile.exists()) {// 如果文件不存在，就创建文件
                try {
                    imageFile.createNewFile();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            Log.i(TAG, "initImageFile return true");
            return true;
        }
        Log.i(TAG, "initImageFile return false");
        return false;
    }

    /**
     * 保存图片到系统图库
     * @param context
     * @param bmp
     */
    public void saveImageToGallery(Context context, Bitmap bmp) {
        // 首先保存图片

        Log.i(TAG, "saveImageToGallery");

        if (!initImageFile()) {
            Log.e(TAG, "init image file fail");
            return;
        }

        try {
            FileOutputStream fos = new FileOutputStream(imageFile);
            Log.i(TAG, "test " + imageFile);
            bmp.compress(Bitmap.CompressFormat.JPEG, 100, fos);
            fos.flush();
            fos.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 其次把文件插入到系统图库
        try {
            MediaStore.Images.Media.insertImage(context.getContentResolver(),
                    imageFile.getAbsolutePath(), imageFile.getName(), null);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        // 最后通知图库更新
        context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.parse("file://" + path)));
    }

    public String getImagePath() {
       return "file://" + imageFile.toString();
    }
}

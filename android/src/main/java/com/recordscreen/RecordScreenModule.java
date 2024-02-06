package com.recordscreen;

import static android.content.ContentValues.TAG;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.MediaCodecInfo;
import android.media.MediaCodecList;
import android.media.projection.MediaProjectionManager;
import android.os.Build;
import android.util.Log;
import android.util.SparseIntArray;
import android.view.Surface;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.os.CountDownTimer;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.hbisoft.hbrecorder.HBRecorder;
import com.hbisoft.hbrecorder.HBRecorderListener;
import android.Manifest;

import java.io.File;
import java.io.IOException;
import java.util.Objects;

public class RecordScreenModule extends ReactContextBaseJavaModule implements HBRecorderListener {
    private boolean isPaused = false;
    private HBRecorder hbRecorder;
    private Number screenWidth = 0;
    private Number screenHeight = 0;
    private boolean mic = true;
    private String currentVersion = "";
    private File outputUri;
    private Promise startPromise;
    private Promise stopPromise;

    private static final SparseIntArray ORIENTATIONS = new SparseIntArray();
    private static final int SCREEN_RECORD_REQUEST_CODE = 1000;
    private static final int RECORD_AUDIO_PERMISSION_REQUEST_CODE = 1001;

    static {
        ORIENTATIONS.append(Surface.ROTATION_0, 90);
        ORIENTATIONS.append(Surface.ROTATION_90, 0);
        ORIENTATIONS.append(Surface.ROTATION_180, 270);
        ORIENTATIONS.append(Surface.ROTATION_270, 180);
    }

    public RecordScreenModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(new BaseActivityEventListener() {
            @Override
            public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {

                if (requestCode == SCREEN_RECORD_REQUEST_CODE) {
                    if (resultCode == Activity.RESULT_OK) {
                          sendEvent("RecordingPermissionDenied", "timer start" );
                        new CountDownTimer(3000, 1000) { // 3000 milliseconds, 1000 millisecond interval (3-second countdown)
                            public void onTick(long millisUntilFinished) {
                                // You can send countdown updates to React Native if needed
                            }

                            public void onFinish() {
                                sendEvent("RecordingPermissionDenied", String.valueOf(false));
                                // Start the screen recording after the countdown
                                hbRecorder.startScreenRecording(intent, resultCode);

                            }
                        }.start();
                    } else {
                        if (startPromise != null) {
                            startPromise.reject("permission_denied", "Screen recording permission denied");
                            sendEvent("RecordingPermissionDenied", String.valueOf(true));
                            startPromise = null; // Reset the promise after handling the result
                        }
                    }
                } else {
                    if (startPromise != null) {
                        startPromise.reject("404", "cancel!");
                        startPromise = null; // Reset the promise after handling the result
                    }
                }
            }
        });

    }

    @NonNull
    @Override
    public String getName() {
        return "RecordScreen";
    }

    @ReactMethod
    public void addListener(String eventName) {
    }
   
    @ReactMethod
    public void removeListeners(Integer count) {
    }

    @ReactMethod
    public void setup(ReadableMap readableMap) {
        Log.d(TAG, "setup config: "+ readableMap);
        if (getCurrentActivity() != null) {
            getCurrentActivity().getApplication().onCreate();
        }
//        Objects.requireNonNull(getReactApplicationContext().getApplication()).onCreate();
        screenWidth = readableMap.hasKey("width") ? Math.ceil(readableMap.getDouble("width")) : 0;
        screenHeight = readableMap.hasKey("height") ? Math.ceil(readableMap.getDouble("height")) : 0;
        mic = readableMap.hasKey("mic") && readableMap.getBoolean("mic");
        hbRecorder = new HBRecorder(getReactApplicationContext(), this);
        outputUri = new File(getReactApplicationContext().getExternalFilesDir("ReactNativeRecordScreen"), "");
        hbRecorder.setOutputPath(outputUri.toString());

        if (readableMap.hasKey("fps") || readableMap.hasKey("bitrate")) {
            hbRecorder.enableCustomSettings();

            if (readableMap.hasKey("fps")) {
                int fps = readableMap.getInt("fps");
                hbRecorder.setVideoFrameRate(fps);
            }
            if (readableMap.hasKey("bitrate")) {
                int bitrate = readableMap.getInt("bitrate");
                hbRecorder.setVideoBitrate(bitrate);
            }
        }

        if (doesSupportEncoder("h264")) {
            hbRecorder.setVideoEncoder("H264");
        } else {
            hbRecorder.setVideoEncoder("DEFAULT");
        }
        hbRecorder.isAudioEnabled(mic);
    }

    @ReactMethod
    public void startRecording(Promise promise) {
        startPromise = promise;
        try {
            startRecordingScreen();
        } catch (IllegalStateException e) {
            promise.reject("404", "error!");
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void stopRecording(Promise promise) {
        stopPromise = promise;
        hbRecorder.stopScreenRecording();
    }

    @ReactMethod
public void pauseRecording() {
    if (hbRecorder != null && !isPaused) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            hbRecorder.pauseScreenRecording();
        }
        isPaused = true;
        sendEvent("RecordingPaused", null);
    }
}

@ReactMethod
public void resumeRecording() {
    if (hbRecorder != null && isPaused) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            hbRecorder.resumeScreenRecording();
        }
        isPaused = false;
        sendEvent("RecordingResumed", null);
    }
}

    @ReactMethod
    public void clean(Promise promise) {
        outputUri.delete();
        promise.resolve("cleaned");
    }

    private void startRecordingScreen() {
        // Check for microphone permission only if mic is enabled
        if (mic && Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(
                    getReactApplicationContext(),
                    Manifest.permission.RECORD_AUDIO
            ) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                        getCurrentActivity(),
                        new String[]{Manifest.permission.RECORD_AUDIO},
                        RECORD_AUDIO_PERMISSION_REQUEST_CODE
                );
                return;
            }
        }

        MediaProjectionManager mediaProjectionManager = (MediaProjectionManager) getReactApplicationContext()
                .getSystemService(Context.MEDIA_PROJECTION_SERVICE);
        Intent permissionIntent = mediaProjectionManager.createScreenCaptureIntent();
        getCurrentActivity().startActivityForResult(permissionIntent, SCREEN_RECORD_REQUEST_CODE);
    }
    
    @Override
    public void HBRecorderOnStart() {
        // Handle start recording event
        sendEvent("RecordingStarted", null);
    }

    @Override
    public void HBRecorderOnComplete() {
        // Handle recording completion event
        String uri = hbRecorder.getFilePath();
        sendEvent("RecordingCompleted", uri);
        if (stopPromise != null) {
            stopPromise.resolve(uri);
        }
    }

    @Override
    public void HBRecorderOnError(int errorCode, String reason) {
        // Handle recording error event
        sendEvent("RecordingError", reason);
        if (stopPromise != null) {
            stopPromise.reject(String.valueOf(errorCode), reason);
        }
    }

    @Override
    public void HBRecorderOnPause() {
        // Handle recording pause event
        sendEvent("RecordingPaused", null);
    }

    @Override
    public void HBRecorderOnResume() {
        // Handle recording resume event
        sendEvent("RecordingResumed", null);
    }

    private void sendEvent(String eventName, String data) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, data);
    }

    private boolean doesSupportEncoder(String encoder) {
        MediaCodecList mediaCodecList = new MediaCodecList(MediaCodecList.ALL_CODECS);
        MediaCodecInfo[] codecInfos = mediaCodecList.getCodecInfos();
        for (MediaCodecInfo codecInfo : codecInfos) {
            if (codecInfo.isEncoder() && codecInfo.getName().contains(encoder)) {
                return true;
            }
        }
        return false;
    }
}


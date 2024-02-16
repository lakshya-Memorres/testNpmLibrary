package com.recordscreen;

import static com.facebook.react.views.textinput.ReactTextInputManager.TAG;

import android.app.Activity;
import android.content.Intent;
import android.content.ActivityNotFoundException;
import android.net.Uri;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;

import com.recordscreen.social.EmailShare;
import com.recordscreen.social.GenericShare;
import com.recordscreen.social.ShareIntent;
import com.recordscreen.social.TargetChosenReceiver;
import com.recordscreen.social.SlackShare;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import android.util.Log;

public class RNShareImpl implements ActivityEventListener {

    public static final String NAME = "RNShare";

    static ReactApplicationContext RCTContext = null;

    public static final int SHARE_REQUEST_CODE = 16845;

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == SHARE_REQUEST_CODE) {
            if (resultCode == Activity.RESULT_CANCELED) {
                WritableMap reply = Arguments.createMap();
                reply.putBoolean("success", false);
                reply.putString("message", "CANCELED");
                TargetChosenReceiver.callbackResolve(reply);
            } else if (resultCode == Activity.RESULT_OK) {
                WritableMap reply = Arguments.createMap();
                reply.putBoolean("success", true);
                TargetChosenReceiver.callbackResolve(reply);
            }
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onNewIntent(Intent intent) { }

    private enum SHARES {
        generic,
        email,
        slack;

        public static ShareIntent getShareClass(String social, ReactApplicationContext reactContext) {
            SHARES share = valueOf(social);
            switch (share) {
                case slack:
                    return new SlackShare(reactContext);
                case email:
                    return new EmailShare(reactContext);
                default:
                    return null;
            }
        }
    };

    public RNShareImpl(ReactApplicationContext reactContext) {
        RCTContext = reactContext;
        RCTContext.addActivityEventListener(this);
    }

    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();
        for (SHARES val : SHARES.values()) {
            constants.put(val.toString().toUpperCase(Locale.ROOT), val.toString());
        }
        return constants;
    }

    public void open(ReadableMap options, Promise promise) {
        TargetChosenReceiver.registerCallbacks(promise);
        try {
            GenericShare share = new GenericShare(RCTContext);
            share.open(options);
        } catch (ActivityNotFoundException ex) {
            Log.e(NAME,ex.getMessage());
            ex.printStackTrace(System.out);
            TargetChosenReceiver.callbackReject("not_available");
        } catch (Exception e) {
            Log.e(NAME,e.getMessage());
            e.printStackTrace(System.out);
            TargetChosenReceiver.callbackReject(e.getMessage());
        }
    }

    public void shareSingle(ReadableMap options, Promise promise) {
      Log.d(TAG, "shareSingle log ===>>" + options);
        TargetChosenReceiver.registerCallbacks(promise);
        if (ShareIntent.hasValidKey("social", options)) {
            try {
                ShareIntent shareClass = SHARES.getShareClass(options.getString("social"), RCTContext);
                if (shareClass != null && shareClass instanceof ShareIntent) {
                    shareClass.open(options);
                } else {
                    throw new ActivityNotFoundException("Invalid share activity");
                }
            } catch (ActivityNotFoundException ex) {
                Log.e(NAME,ex.getMessage());
                ex.printStackTrace(System.out);
                TargetChosenReceiver.callbackReject(ex.getMessage());
            } catch (Exception e) {
                Log.e(NAME,e.getMessage());
                e.printStackTrace(System.out);
                TargetChosenReceiver.callbackReject(e.getMessage());
            }
        } else {
            TargetChosenReceiver.callbackReject("key 'social' missing in options");
        }
    }

    public void isPackageInstalled(String packagename, Promise promise) {
        try {
            boolean res = ShareIntent.isPackageInstalled(packagename, RCTContext);
            promise.resolve(res);
        } catch (Exception e) {
            Log.e(NAME,e.getMessage());
            promise.reject(e.getMessage());
        }
    }

    public void isBase64File(String url, Promise promise) {
        try {
            Uri uri = Uri.parse(url);
            String scheme = uri.getScheme();
            if ((scheme != null) && scheme.equals("data")) {
                promise.resolve(true);
            } else {
                promise.resolve(false);
            }
        } catch (Exception e) {
            Log.e(NAME,e.getMessage());
            e.printStackTrace(System.out);
            promise.reject(e.getMessage());
        }
    }
}

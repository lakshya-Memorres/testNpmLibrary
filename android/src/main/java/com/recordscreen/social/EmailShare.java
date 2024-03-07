package com.recordscreen.social;

import static com.facebook.react.views.textinput.ReactTextInputManager.TAG;

import android.content.ActivityNotFoundException;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

/**
 * Created by disenodosbbcl on 23-07-16.
 */
public class EmailShare extends SingleShareIntent {

    private static final String PACKAGE = "com.google.android.gm";

    public EmailShare(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public void open(ReadableMap options) throws ActivityNotFoundException {
      Log.d(TAG, "emailshare "+options);
        super.open(options);
        //  extra params here
        this.openIntentChooser();
    }
    @Override
    protected String getPackage() {
        return PACKAGE;
    }

    @Override
    protected String getDefaultWebLink() {
        return null;
    }

    @Override
    protected String getPlayStoreLink() {
        return null;
    }
}


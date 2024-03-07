package com.recordscreen.social;

import static com.facebook.react.views.textinput.ReactTextInputManager.TAG;

import android.content.ActivityNotFoundException;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

public class SlackShare extends SingleShareIntent {

    private static final String PACKAGE = "com.Slack";
    private static final String PLAY_STORE_LINK = "market://details?id=com.Slack";

    public SlackShare(ReactApplicationContext reactContext) {

      super(reactContext);
    }

    @Override
    public void open(ReadableMap options) throws ActivityNotFoundException {
      Log.d(TAG, "slackshare "+options);
        super.open(options);
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
        return PLAY_STORE_LINK;
    }
}

package com.lokally;

import android.app.Application;

import com.facebook.react.ReactApplication;
import cl.json.RNSharePackage;
import com.github.yamill.orientation.OrientationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.magus.fblogin.FacebookLoginPackage;
import io.underscope.react.fbak.RNAccountKitPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSharePackage(),
            new OrientationPackage(),
            new RNDeviceInfo(),
            new GoogleAnalyticsBridgePackage(),
            new VectorIconsPackage(),
            new RNSendIntentPackage(),
            new ReactNativeOneSignalPackage(),
            new MapsPackage(),
            new FacebookLoginPackage(),
            new RNAccountKitPackage(),
            new CookieManagerPackage(),
            new CodePush("BZNRnbH9Q1EjhnudjQCEAFnH97YAe15e28c4-b512-44d6-8ac2-595b90d5901c", MainApplication.this, BuildConfig.DEBUG)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
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

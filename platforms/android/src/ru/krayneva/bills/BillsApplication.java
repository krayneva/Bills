package ru.krayneva.bills;

import com.appblade.framework.AppBlade;

import android.app.Application;

public class BillsApplication extends Application{

 @Override
  public void onCreate() {
    super.onCreate();
    String uuid = "593a33fc-2d22-418c-967a-a2ff60e40da6";
    String token = "a676f0fc1be603eb9db15316490a605c";
    String secret = "28bfa152cbb25ce82f447784994addc7";
    String issuance = "1419938400";
    AppBlade.register(this, token, secret, uuid, issuance, "https://appblade.com");
    AppBlade.registerExceptionHandler();
  } 
}
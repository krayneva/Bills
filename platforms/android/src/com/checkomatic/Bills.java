/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.checkomatic; 

import java.io.File;  
import java.net.URI;
import java.util.concurrent.ExecutorService;

import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.WindowManager;
import android.widget.Toast; 


import org.apache.cordova.*;

import com.appblade.framework.AppBlade;
import com.facebook.AppEventsLogger;


public class Bills extends CordovaActivity
{
	

    @Override
    public void onCreate(Bundle savedInstanceState) 
    {
        super.onCreate(savedInstanceState);  
        // Set by <content src="index.html" /> in config.xml
        //AppBlade.register(context, token, secret, uuid, issuance);
      //  AppBlade.register(this, "593a33fc-2d22-418c-967a-a2ff60e40da6","a676f0fc1be603eb9db15316490a605c", "28bfa152cbb25ce82f447784994addc7", "1419938400");
      //  AppBlade.doFeedback(this);
       // AppBlade.authorize(this);  
       // getActivity().getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
        loadUrl(launchUrl);  
    }

@Override
protected void onResume() {
	// TODO Auto-generated method stub
	super.onResume();
	//AppBlade.authorize(this);
    AppEventsLogger.activateApp(this);
}
    @Override
    protected void onStop() {
    	super.onStop();
    AppEventsLogger.deactivateApp(this);
    }
    

}   

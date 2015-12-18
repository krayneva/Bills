
package com.performanceactive.plugins.camera;

//import android.annotation.SuppressLint;
//import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Point;
import android.hardware.Camera;
import android.hardware.Camera.AutoFocusCallback;
import android.hardware.Camera.PictureCallback;
import android.hardware.Camera.Size;
import android.location.Location;
import android.location.LocationManager;
import android.media.ExifInterface;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnLongClickListener;
import android.view.ViewGroup.LayoutParams;
import android.view.Window;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.ImageView.ScaleType;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Toast;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;

import com.appblade.framework.AppBlade;
import com.facebook.AppEventsLogger;
import com.checkomatic.R;

public class CustomCameraActivity extends Activity implements OnLongClickListener{
 
    private static final String TAG = CustomCameraActivity.class.getSimpleName();
    private static final float ASPECT_RATIO = 126.0f / 86;
    // берем чуть больше от рамки
    public static final int BORDER_CORRECTION = 5;
 
    public static String FILENAME = "Filename";
    public static String QUALITY = "Quality"; 
    public static String TARGET_WIDTH = "TargetWidth";
    public static String TARGET_HEIGHT = "TargetHeight";
    public static String COLOR_MODE = "ColorMode";
    public static String TEMPFILEPATH = "TempFilePath"; 

    public static String ERROR_MESSAGE = "ErrorMessage";
    public static int RESULT_ERROR = 2;
    public static int MAX_IMAGE_WIDTH = 4*1024;


    public static final int MAX_IMAGE_WEIGHT = 1024*1024*6 +100;
    

    public static String IMAGE_URI = "ImageUri";
    public static String LATITUDE = "Latitude";
    public static String LONGITUDE = "Longitude";
    public static String ALTITUDE = "Altitude";
    public static String SCENE_MODE_SETTING_DEFAULT = "";
    public static String FOCUS_MODE_SETTING_DEFAULT = "";
    public static String ANTIBANDING_SETTING_DEFAULT = "";
    public static String WHITE_BALANCE_SETTING_DEFAULT = "";
    public static String PICTURE_FORMAT_SETTING_DEFAULT = "";
    public static String COLOR_EFFECTS_SETTING_DEFAULT = "";
    public static String EXPOSURE_COMPENSATION_SETTING_DEFAULT = "";
    public static String COLOR_MODE_SETTING_DEFAULT = Bitmap.Config.ARGB_8888.toString();
    public static String PICTURE_SIZE_SETTING_DEFAULT = "";


    public static boolean sceneModeEnabled = false;
    public static boolean focusModeEnabled = false;
    public static boolean antibandingEnabled = false;
    public static boolean whiteBalanceEnabled = false;
    public static boolean pictureFormatEnabled = false;
    public static boolean colorEffectsnabled = false;
    public static boolean exposureCompemsationEnabled = false;




    private static Camera camera;
    private RelativeLayout layout;
    private FrameLayout cameraPreviewView;
    private RelativeLayout imagePreviewLayout;
    private ImageView imagePreview;
    private ImageButton acceptPreview, recapturePreview;
    private ImageView borderTopLeft;
    private ImageView borderTopRight;
    private ImageView borderBottomLeft;
    private ImageView borderBottomRight;
    private TextView billText;
    private ImageButton captureButton, sendButton, recaptureButton, flashButton, exitButton, settingsButton; 
    
    private RelativeLayout controlsLayout;
    private FrameLayout topView, leftView, rightView, bottomView;
    private LinearLayout panelLayout;
    private int currentMarginTop, currentMarginBottom, currentScale;
    private int scaledMarginTop, scaledMarginBottom;
    private ImageView previousImage;
    private static boolean flashEnabled = false;
    private Resources resources;
    
    private CustomCameraPreview customCameraPreview;
    private static final int MARGIN_BIG = 100;
    private static final int MARGIN_MEDIUM = 50;
    private static final int MARGIN_SMALL = 50;
    private static int PANEL_HEIGHT = 100;
    
    private static final int SHADOW_COLOR = 0x33000000;
    private static final int PANEL_COLOR = 0x99000000;
    
    
    private static final int REQUEST_CODE_SETTINGS_ACTIVITY = 1; 
    
    private ArrayList<String> bitmaps= new ArrayList<String>();
    private Bitmap previousBitmap;
    double latitude=-1, longitude=-1, altitude=-1 ;  
    private ProgressBar progress;
    private static Context context;

    private  Bitmap b;
    @Override
    protected void onResume() {
        super.onResume();

        try {
        camera = getCamera(getApplicationContext());
            Camera.Parameters cameraSettings = camera.getParameters();

            
         /*   if (camera.getParameters().getSupportedSceneModes().size()>0) {
                SCENE_MODE_SETTING_DEFAULT = camera.getParameters().getSupportedSceneModes().get(0);
                sceneModeEnabled = true;
            }
            if (camera.getParameters().getSupportedFocusModes().size()>0) {
                FOCUS_MODE_SETTING_DEFAULT = camera.getParameters().getSupportedFocusModes().get(0);
                focusModeEnabled = true;
            }

            if (camera.getParameters().getSupportedAntibanding().size()>0){
                ANTIBANDING_SETTING_DEFAULT = camera.getParameters().getSupportedAntibanding().get(0);
                antibandingEnabled = true;
            }
            if ( camera.getParameters().getSupportedWhiteBalance().size()>0) {
                WHITE_BALANCE_SETTING_DEFAULT = camera.getParameters().getSupportedWhiteBalance().get(0);
                whiteBalanceEnabled = true;
            }

            if ( camera.getParameters().getSupportedPictureFormats().size()>0) {
                PICTURE_FORMAT_SETTING_DEFAULT = camera.getParameters().getSupportedPictureFormats().get(0).toString();
                pictureFormatEnabled = true;
            }
            if (camera.getParameters().getSupportedColorEffects().size()>0) {
                COLOR_EFFECTS_SETTING_DEFAULT = camera.getParameters().getSupportedColorEffects().get(0);
                colorEffectsnabled = true;
            }
            */


            if  ((camera.getParameters().getSupportedSceneModes()!=null)&&
                    (camera.getParameters().getSupportedSceneModes().size()>0)) {
                SCENE_MODE_SETTING_DEFAULT = camera.getParameters().getSupportedSceneModes().get(0);
                sceneModeEnabled = true;
            }
            if ((camera.getParameters().getSupportedFocusModes()!=null)&&
                (camera.getParameters().getSupportedFocusModes().size()>0)) {
                FOCUS_MODE_SETTING_DEFAULT = camera.getParameters().getSupportedFocusModes().get(0);
                focusModeEnabled = true;
            }

            if ((camera.getParameters().getSupportedAntibanding()!=null)&&
                (camera.getParameters().getSupportedAntibanding().size()>0)){
                ANTIBANDING_SETTING_DEFAULT = camera.getParameters().getSupportedAntibanding().get(0);
                antibandingEnabled = true;
            }
            if (( camera.getParameters().getSupportedWhiteBalance()!=null) &&
                ( camera.getParameters().getSupportedWhiteBalance().size()>0)) {
                WHITE_BALANCE_SETTING_DEFAULT = camera.getParameters().getSupportedWhiteBalance().get(0);
                whiteBalanceEnabled = true;
            }

            if (( camera.getParameters().getSupportedPictureFormats()!=null)
                &&( camera.getParameters().getSupportedPictureFormats().size()>0)) {
                PICTURE_FORMAT_SETTING_DEFAULT = camera.getParameters().getSupportedPictureFormats().get(0).toString();
                pictureFormatEnabled = true;
            }
            if ((camera.getParameters().getSupportedColorEffects()!=null)&&
                (camera.getParameters().getSupportedColorEffects().size()>0)) {
                COLOR_EFFECTS_SETTING_DEFAULT = camera.getParameters().getSupportedColorEffects().get(0);
                colorEffectsnabled = true;
            }

            EXPOSURE_COMPENSATION_SETTING_DEFAULT = ""+camera.getParameters().getExposureCompensation();

            Size perfectSize = camera.getParameters().getSupportedPictureSizes().get(0);

            
            for (int i=0; i<camera.getParameters().getSupportedPictureSizes().size();i++){
            	Size s = camera.getParameters().getSupportedPictureSizes().get(i);

            	if ((s.width*s.height)<MAX_IMAGE_WEIGHT){

            		if ((s.width>perfectSize.width)||(s.height>perfectSize.height)){
            			perfectSize = s;
            		}
            		else if ((perfectSize.width*perfectSize.height)>MAX_IMAGE_WEIGHT){	
            			perfectSize = s;
            		}
            	}
            }
            
            
            PICTURE_SIZE_SETTING_DEFAULT =  perfectSize.width+"x"+perfectSize.height;
            exposureCompemsationEnabled = true;


            configureCamera(getApplicationContext());
            showCameraSettings();
            displayCameraPreview();
        } catch (Exception e) {
           // finishWithError("Camera is not accessible");
            finishWithError(e.getMessage());
        }

        if (imagePreviewLayout==null) {
            imagePreviewLayout = (RelativeLayout)getLayoutInflater().inflate(R.layout.check_preview, null);
            RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
            imagePreviewLayout.setLayoutParams(layoutParams);
            layout.addView(imagePreviewLayout);
            imagePreviewLayout.setVisibility(View.VISIBLE);

            acceptPreview = (ImageButton) imagePreviewLayout.findViewById(R.id.buttonAccept);
            recapturePreview = (ImageButton) imagePreviewLayout.findViewById(R.id.buttonRecapture);
            imagePreview  = (ImageView) findViewById(R.id.previewImage);

        }
    }

    private static  void configureCamera(Context context) {
        Camera.Parameters cameraSettings = camera.getParameters();
        cameraSettings.setJpegQuality(100);

        
      //  android.hardware.Camera.Parameters.
        //(android.hardware.Camera.Parameters.FOCUS_MODE_MACRO)
       /*if  (cameraSettings.getSupportedFocusModes().contains(android.hardware.Camera.Parameters.FOCUS_MODE_MACRO)){
        	 cameraSettings.setFocusMode(android.hardware.Camera.Parameters.FOCUS_MODE_MACRO);
        }
*/


        if (flashEnabled){
        	  cameraSettings.setFlashMode(android.hardware.Camera.Parameters.FLASH_MODE_ON);
        }
        else{
        	  cameraSettings.setFlashMode(android.hardware.Camera.Parameters.FLASH_MODE_OFF);
        }
     /*   List <Size> sizes = cameraSettings.getSupportedPictureSizes();
        Size maxSize = sizes.get(0);
        for (Size s:sizes){
        	if ((maxSize.width<s.width)||(maxSize.height<s.height))
        	//if (maxSize.width<s.width)
        		maxSize = s;
        } 
        Log.w("CustomCameraActivivty: ", " maxSize: "+maxSize.width+" "+maxSize.height);
        cameraSettings.setPictureSize(maxSize.width, maxSize.height);

*/

        // настраиваем в соответствии в выбором пользователя в cameraSettingsActivity

/*        List<String> supportedFocusModes = cameraSettings.getSupportedFocusModes();
        if (supportedFocusModes.contains(FOCUS_MODE_CONTINUOUS_PICTURE)) {
            cameraSettings.setFocusMode(FOCUS_MODE_CONTINUOUS_PICTURE);
        } else if (supportedFocusModes.contains(FOCUS_MODE_AUTO)) {
            cameraSettings.setFocusMode(FOCUS_MODE_AUTO);
        }*/

        SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(context);
        String sceneMode = sp.getString(CameraSettingsActivity.SCENE_MODE_SETTING, SCENE_MODE_SETTING_DEFAULT);
        String focusMode = sp.getString(CameraSettingsActivity.FOCUS_MODE_SETTING, FOCUS_MODE_SETTING_DEFAULT);
        String antiBanding = sp.getString(CameraSettingsActivity.ANTIBANDING_SETTING, ANTIBANDING_SETTING_DEFAULT);
        String whiteBalance = sp.getString(CameraSettingsActivity.WHITE_BALANCE_SETTING, WHITE_BALANCE_SETTING_DEFAULT);
        String pictureFormat = sp.getString(CameraSettingsActivity.PICTURE_FORMAT_SETTING, PICTURE_FORMAT_SETTING_DEFAULT);
        String colorEffect = sp.getString(CameraSettingsActivity.COLOR_EFFECTS_SETTING, COLOR_EFFECTS_SETTING_DEFAULT);
        String exposureCompensation = sp.getString(CameraSettingsActivity.EXPOSURE_COMPENSATION_SETTING, EXPOSURE_COMPENSATION_SETTING_DEFAULT);
        String pictureSize= sp.getString(CameraSettingsActivity.PICTURE_SIZE_SETTING, PICTURE_SIZE_SETTING_DEFAULT);


    try {
        if (sceneModeEnabled) cameraSettings.setSceneMode(sceneMode);
    }
    catch(Exception e){
    //	Toast.makeText(context, "scene mode is not set", Toast.LENGTH_LONG).show();

    }
    try{
        if (focusModeEnabled) cameraSettings.setFocusMode(focusMode);
    }
    catch(Exception e){
    //	Toast.makeText(context, "focus mode is not set", Toast.LENGTH_LONG).show();

    }
    try{
        if (antibandingEnabled) cameraSettings.setAntibanding(antiBanding);
    }
    catch(Exception e){
    //	Toast.makeText(context, "antibanding is not set", Toast.LENGTH_LONG).show();

    }
    try{
        if (whiteBalanceEnabled) cameraSettings.setWhiteBalance(whiteBalance);
    }   
    catch(Exception e){
   // 	Toast.makeText(context, " white balance is not set", Toast.LENGTH_LONG).show();

    }
    try{
        if (pictureFormatEnabled) cameraSettings.setPictureFormat(Integer.parseInt(pictureFormat));
    }
    catch(Exception e){
    //	Toast.makeText(context, "picture format is not set", Toast.LENGTH_LONG).show();

    }
    try{
        if (colorEffectsnabled) cameraSettings.setColorEffect(colorEffect);
    }
    catch(Exception e){
   // 	Toast.makeText(context, "coloreffects is not set", Toast.LENGTH_LONG).show();

    }
    try{
        cameraSettings.setExposureCompensation(Integer.parseInt(exposureCompensation));
    }
    catch(Exception e){
    //	Toast.makeText(context, "exposure compensation is not set", Toast.LENGTH_LONG).show();

    }
    try{
        int pos = pictureSize.indexOf("x");
        int width = Integer.parseInt(pictureSize.substring(0,pos));
        int height = Integer.parseInt(pictureSize.substring(pos+1));
     	//Toast.makeText(context, "width "+width+" height "+height, Toast.LENGTH_LONG).show();
        cameraSettings.setPictureSize(width, height);
    }
    catch(Exception e){
   // 	Toast.makeText(context, "picture size is not set", Toast.LENGTH_LONG).show();

    }
  //      Toast.makeText(this, "ExposureCompensation: "+cameraSettings.getExposureCompensation()+" step is "+cameraSettings.getExposureCompensationStep(), Toast.LENGTH_LONG).show();
        camera.setParameters(cameraSettings);

        //Toast.makeText(this, "Density is: "+getResources().getDisplayMetrics().density, Toast.LENGTH_LONG).show();
    }

    private void displayCameraPreview() {
        cameraPreviewView.removeAllViews();
        customCameraPreview = new CustomCameraPreview(this, camera);
        cameraPreviewView.addView(customCameraPreview);
        if (imagePreviewLayout!=null)
            imagePreviewLayout.setVisibility(View.GONE);
    }

    private void displayImagePreviewView(){


    }


    @Override
    protected void onPause() {
        super.onPause();
     //   releaseCamera();
    }

    public static void releaseCamera() {
        try {
            if (camera != null) {
                camera.stopPreview();
                camera.setPreviewCallback(null);
                camera.release();
            }
        }
        finally{
            camera = null;
        }
    }



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        resources = getResources();
        context = getBaseContext();
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        layout = new RelativeLayout(this);
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
        layout.setLayoutParams(layoutParams);
        layout.setOnLongClickListener(this);
        createCameraPreview();
        createTopLeftBorder();
        createTopRightBorder();
        createBottomLeftBorder();
        createBottomRightBorder();
     //   layoutBottomBorderImagesRespectingAspectRatio();
     //   createCaptureButton();
        createShadowLayer();
        setContentView(layout);
        layout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                takePictureWithAutoFocus();
            }
        });
        
        LocationManager lm = (LocationManager)getSystemService(Context.LOCATION_SERVICE); 
        Location location = null;
        boolean isGPSActive  = lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
      

        
 		if (!isGPSActive ) {
 				
 			location = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
 			//Toast.makeText(this, ""+location.getLongitude(), Toast.LENGTH_LONG).show();
 			
 		}
 		else{

 			location = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
 
         	
 		}
 		if (location==null){
 			location = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
 		}
 		
 		if (location!=null){
 		//	Toast.makeText(this, ""+location.getLongitude(), Toast.LENGTH_LONG).show();
 		//	Toast.makeText(this, ""+location.getAltitude(), Toast.LENGTH_LONG).show();

	 		latitude = location.getLatitude();
	 	 	longitude = location.getLongitude();
	 	 	altitude = location.getAltitude();
 		}
        camera = Camera.open();
    }
    
    
    


    private void createCameraPreview() {
        cameraPreviewView = new FrameLayout(this);
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
        cameraPreviewView.setLayoutParams(layoutParams);
        layout.addView(cameraPreviewView);
  
    }

    

	private void createShadowLayer(){
      
    	int margin = 0;
         int marginInDP =0;
        controlsLayout = new RelativeLayout(this);
        layout.addView(controlsLayout, new RelativeLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
        
        if (isXLargeScreen()) {
            margin= dpToPixels(MARGIN_BIG);

            Log.w("isXLargScreen","!!!");
        } else if (isLargeScreen()) {
            margin = dpToPixels(MARGIN_MEDIUM);

            Log.w("isLargScreen","!!!");
        } else {
            margin = dpToPixels(MARGIN_SMALL);

            Log.w("isSmallScreen","!!!");
        }

        currentMarginTop = margin;
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(LayoutParams.MATCH_PARENT,margin);
        params.addRule(RelativeLayout.ALIGN_PARENT_TOP,RelativeLayout.TRUE);
        topView = new FrameLayout(this);
        topView.setBackgroundColor(SHADOW_COLOR);
        topView.setLayoutParams(params);
        controlsLayout.addView(topView);
    
 		params = new RelativeLayout.LayoutParams(LayoutParams.MATCH_PARENT,dpToPixels(PANEL_HEIGHT));
        params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM,RelativeLayout.TRUE);
        
       
        panelLayout = createPanelLayout();
        panelLayout.setGravity(Gravity.CENTER);
        panelLayout.setBackgroundColor(PANEL_COLOR);
        panelLayout.setLayoutParams(params);
        int panelViewId = 12345;
        panelLayout.setId(panelViewId);
        controlsLayout.addView(panelLayout); 
        
        
        params = new RelativeLayout.LayoutParams(LayoutParams.MATCH_PARENT,margin);
        params.addRule(RelativeLayout.ABOVE,panelViewId);
    //    params.addRule(RelativeLayout.BELOW,  borderTopRight.getId());
        bottomView = new FrameLayout(this);
        bottomView.setBackgroundColor(SHADOW_COLOR);
        bottomView.setLayoutParams(params);
        controlsLayout.addView(bottomView); 
        
        
       params = new RelativeLayout.LayoutParams(margin,LayoutParams.MATCH_PARENT);
        params.addRule(RelativeLayout.ALIGN_PARENT_LEFT,RelativeLayout.TRUE);
        params.topMargin = margin;
        params.bottomMargin = margin+dpToPixels(PANEL_HEIGHT);
        leftView = new FrameLayout(this);
        leftView.setBackgroundColor(SHADOW_COLOR);
        leftView.setLayoutParams(params);
        controlsLayout.addView(leftView);
        
        currentMarginBottom = margin+dpToPixels(PANEL_HEIGHT);
        params = new RelativeLayout.LayoutParams(margin,LayoutParams.MATCH_PARENT);
        params.addRule(RelativeLayout.ALIGN_PARENT_RIGHT,RelativeLayout.TRUE);
        params.topMargin = margin;
        params.bottomMargin = margin+dpToPixels(PANEL_HEIGHT);
        rightView = new FrameLayout(this);
        rightView.setBackgroundColor(SHADOW_COLOR);
        rightView.setLayoutParams(params);
        controlsLayout.addView(rightView);
        
        billText = new TextView(this);
        params = new RelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT,LayoutParams.WRAP_CONTENT);
        params.addRule(RelativeLayout.CENTER_IN_PARENT, RelativeLayout.TRUE);
        billText.setLayoutParams(params);
        billText.setTextSize(15);
        controlsLayout.addView(billText);
        
        
        int bSize = dpToPixels(100);
        
        flashButton = new ImageButton(this);
        params = new RelativeLayout.LayoutParams(bSize/2,bSize/2);
        Log.w("margin",""+ margin);
        //params.rightMargin =bSize/4;
        params.rightMargin = 10;
        //params.topMargin = bSize/4;
        params.topMargin = 10;
        params.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, RelativeLayout.TRUE);
        params.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        if (flashEnabled)
        	//setBitmap(flashButton, "flash_yellow.png");
        	setBitmap(flashButton, "flashOn256.png");
        else
        	//setBitmap(flashButton, "flash_dark_blue.png");
        	setBitmap(flashButton, "flashOff256.png");
    	flashButton.setBackgroundColor(Color.TRANSPARENT);
        flashButton.setScaleType(ScaleType.CENTER_INSIDE);
    	
        
        flashButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (flashEnabled) {
                    flashEnabled = false;
                    setBitmap(flashButton, "flashOff256.png");
                    configureCamera(getApplicationContext());
                    showCameraSettings();
                }
                flashEnabled = true;
                setBitmap(flashButton, "flashOn256.png");
                configureCamera(getApplicationContext());
                showCameraSettings();
            }
        });
        
       controlsLayout.addView(flashButton,params);   
       
       
       
       exitButton = new ImageButton(this);
       params = new RelativeLayout.LayoutParams(bSize/2,bSize/2);
      // params.leftMargin = bSize/4;
        params.leftMargin = 10;
      // params.topMargin = bSize/4;
        params.topMargin = 10;
       params.addRule(RelativeLayout.ALIGN_PARENT_LEFT, RelativeLayout.TRUE);
       params.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
       setBitmap(exitButton, "quit256.png");

       exitButton.setBackgroundColor(Color.TRANSPARENT);
       exitButton.setScaleType(ScaleType.CENTER_INSIDE);
   	
       
       exitButton.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View v) {
               finishWithError("Capture cancelled");
           }
       });
       
      controlsLayout.addView(exitButton,params);



        settingsButton = new ImageButton(this);
        params = new RelativeLayout.LayoutParams(bSize/2,bSize/2);
        // params.leftMargin = bSize/4;
        params.rightMargin = 10;
        // params.topMargin = bSize/4;
        params.topMargin = 10*2+bSize;
        params.addRule(RelativeLayout.ALIGN_PARENT_RIGHT,RelativeLayout.TRUE);
        params.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        setBitmap(settingsButton, "settings256.png");

        settingsButton.setBackgroundColor(Color.TRANSPARENT);
        settingsButton.setScaleType(ScaleType.CENTER_INSIDE);


        settingsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(CustomCameraActivity.this, CameraSettingsActivity.class);
                startActivityForResult(intent, REQUEST_CODE_SETTINGS_ACTIVITY);
            }
        });

        controlsLayout.addView(settingsButton, params);


        previousImage = new ImageView(this);
       params = new RelativeLayout.LayoutParams(LayoutParams.MATCH_PARENT,margin);
       params.addRule(RelativeLayout.ALIGN_PARENT_TOP,RelativeLayout.TRUE);
       params.addRule(RelativeLayout.CENTER_HORIZONTAL,RelativeLayout.TRUE);
       params.addRule(RelativeLayout.ABOVE, borderTopLeft.getId());
       params.leftMargin = margin;
       params.rightMargin = margin;

       // previousImage.setScaleType(ScaleType.MATRIX);
       controlsLayout.addView(previousImage,params);   
       updateDynamicLayout();

        progress = new ProgressBar(this);
        progress.setVisibility(View.INVISIBLE);
        params = new RelativeLayout.LayoutParams(margin,margin);
        params.addRule(RelativeLayout.CENTER_IN_PARENT,RelativeLayout.TRUE);
        progress.setLayoutParams(params);
        layout.addView(progress);
        
    }
    
	
	private void updateDynamicLayout(){
		if (bitmaps.size()==0){
			billText.setText("Фото чека");
			recaptureButton.setVisibility(View.GONE);
			sendButton.setVisibility(View.GONE);
			previousImage.setVisibility(View.GONE);
		}
		else{
          if (bitmaps.size()==5) {
              disableCaptureButton();
              billText.setText("Достигнуто макимальное количество снимков");
          }
          else {
              billText.setText("Продолжение чека");
          }
              previousImage.setVisibility(View.VISIBLE);
            previousImage.setAlpha(0.6f);
              recaptureButton.setVisibility(View.VISIBLE);
              sendButton.setVisibility(View.VISIBLE);
              if (previousBitmap != null) {
                  previousBitmap.recycle();
                  System.gc();
              }
              FileInputStream fileInputStream = null;
              try {
                  fileInputStream = new FileInputStream(Environment.getExternalStorageDirectory() + "/" + bitmaps.get(bitmaps.size() - 1));
                  BitmapFactory.Options options = new BitmapFactory.Options();
                  options.inJustDecodeBounds = false;
                 b = BitmapFactory.decodeStream(fileInputStream, null, options);
                  fileInputStream.close();
                //  previousBitmap = Bitmap.createBitmap(b, 0, b.getHeight() - currentMarginTop * 2, b.getWidth(), currentMarginTop * 2);
                  previousBitmap = Bitmap.createBitmap(b, 0, b.getHeight() - currentMarginTop, b.getWidth(), currentMarginTop);
                  previousImage.setScaleType(ScaleType.FIT_END);
                  previousImage.setImageBitmap(previousBitmap);
                  imagePreview.setImageBitmap(b);
                  imagePreviewLayout.setVisibility(View.VISIBLE);
                  //;!!!!!!!!!!!!!!!!!!!!!!!
                  //b.recycle();
                  System.gc();
              } catch (Exception e) {
                  e.printStackTrace();
              }
		}
	}
    

    private LinearLayout createPanelLayout(){
    	panelLayout = new LinearLayout(this);

        int buttonSize = dpToPixels(MARGIN_BIG);
        if (isXLargeScreen()) {
        	buttonSize = dpToPixels(MARGIN_BIG);
        } else if (isLargeScreen()) {
        	//buttonSize = dpToPixels(MARGIN_MEDIUM);
        	buttonSize = dpToPixels(100);
        } else {
        	//buttonSize = dpToPixels(MARGIN_SMALL);
        	buttonSize = dpToPixels(100);
        }
    	
    	LinearLayout.LayoutParams buttonParams = new LinearLayout.LayoutParams(buttonSize, buttonSize);
    	buttonParams.setMargins(20, 0, 20, 0);


        //
       /* settingsButton = new ImageButton(this);
        setBitmap(settingsButton, "settings256.png");
        settingsButton.setBackgroundColor(Color.TRANSPARENT);
        settingsButton.setScaleType(ScaleType.CENTER_INSIDE);

        settingsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(CustomCameraActivity.this, CameraSettingsActivity.class);

                startActivityForResult(intent, REQUEST_CODE_SETTINGS_ACTIVITY);
            }
        });
        panelLayout.addView(settingsButton, buttonParams);
    	*/
    	recaptureButton = new ImageButton(this);
        setBitmap(recaptureButton, "esc256.png");
      	recaptureButton.setBackgroundColor(Color.TRANSPARENT);
      	recaptureButton.setScaleType(ScaleType.CENTER_INSIDE);
        recaptureButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                recaptureLast();
            }
        });
              
              panelLayout.addView(recaptureButton, buttonParams);
    	
    	
    	
        captureButton = new ImageButton(this);
    	setBitmap(captureButton, "camera393.png");
        captureButton.setBackgroundColor(Color.TRANSPARENT);
        captureButton.setScaleType(ScaleType.CENTER_INSIDE);
        captureButton.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                setCaptureButtonImageForEvent(event);
                return false;
            }
        });
        captureButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                takePictureWithAutoFocus();
            }
        });

        panelLayout.addView(captureButton, buttonParams);
        sendButton = new ImageButton(this);
        setBitmap(sendButton, "send256.png");
        sendButton.setBackgroundColor(Color.TRANSPARENT);
        sendButton.setScaleType(ScaleType.CENTER_INSIDE);
    	
    /*	sendButton.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                setCaptureButtonImageForEvent(event);
                return false;
            }
        });*/
        sendButton.setOnClickListener(new View.OnClickListener() {
        @Override
         public void onClick(View v) {
        		sendPicture();
        }
        });
        panelLayout.addView(sendButton, buttonParams);
        
        
        
        

    	return panelLayout;
    }
    
    
    private void recaptureLast(){
    	if (bitmaps.size()==0) return;
    	bitmaps.remove(bitmaps.size()-1);
    	updateDynamicLayout();
    }
    
    private void createTopLeftBorder() {
        borderTopLeft = new ImageView(this);
     //   setBitmap(borderTopLeft, "border_top_left.png");
        borderTopLeft.setImageDrawable(resources.getDrawable(R.drawable.angle_left_top));
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(dpToPixels(50), dpToPixels(50));
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
        if (isXLargeScreen()) {
            layoutParams.topMargin = dpToPixels(MARGIN_BIG);
            layoutParams.leftMargin = dpToPixels(MARGIN_BIG);
        } else if (isLargeScreen()) {
            layoutParams.topMargin = dpToPixels(MARGIN_MEDIUM);
            layoutParams.leftMargin = dpToPixels(MARGIN_MEDIUM);
        } else {
            layoutParams.topMargin = dpToPixels(MARGIN_SMALL);
            layoutParams.leftMargin = dpToPixels(MARGIN_SMALL);
        }
        borderTopLeft.setLayoutParams(layoutParams);
        layout.addView(borderTopLeft);
    }

    private void createTopRightBorder() {
        borderTopRight = new ImageView(this);
      //  setBitmap(borderTopRight, "border_top_right.png");
        borderTopRight.setImageDrawable(resources.getDrawable(R.drawable.angle_right_top));
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(dpToPixels(50), dpToPixels(50));
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
        if (isXLargeScreen()) {
            layoutParams.topMargin = dpToPixels(MARGIN_BIG);
            layoutParams.rightMargin = dpToPixels(MARGIN_BIG);
        } else if (isLargeScreen()) {
            layoutParams.topMargin = dpToPixels(MARGIN_MEDIUM);
            layoutParams.rightMargin = dpToPixels(MARGIN_MEDIUM);
        } else {
            layoutParams.topMargin = dpToPixels(MARGIN_SMALL);
            layoutParams.rightMargin = dpToPixels(MARGIN_SMALL);
        }
        borderTopRight.setLayoutParams(layoutParams);
        layout.addView(borderTopRight);
    }

    private void createBottomLeftBorder() {
        borderBottomLeft = new ImageView(this);
     //   setBitmap(borderBottomLeft, "border_bottom_left.png");
        borderBottomLeft.setImageDrawable(resources.getDrawable(R.drawable.angle_left_bottom));
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(dpToPixels(50), dpToPixels(50));
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
        if (isXLargeScreen()) {
            layoutParams.leftMargin = dpToPixels(MARGIN_BIG);
        } else if (isLargeScreen()) {
            layoutParams.leftMargin = dpToPixels(MARGIN_MEDIUM);
        } else {
            layoutParams.leftMargin = dpToPixels(MARGIN_SMALL);
        }
        layoutParams.bottomMargin =layoutParams.leftMargin+dpToPixels(PANEL_HEIGHT);
        borderBottomLeft.setLayoutParams(layoutParams);
        layout.addView(borderBottomLeft);
    }

    private void createBottomRightBorder() {
        borderBottomRight = new ImageView(this);
      //  setBitmap(borderBottomRight, "border_bottom_right.png");
        borderBottomRight.setImageDrawable(resources.getDrawable(R.drawable.angle_right_bottom));
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(dpToPixels(50), dpToPixels(50));
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
        if (isXLargeScreen()) {
            layoutParams.rightMargin = dpToPixels(MARGIN_BIG);
        } else if (isLargeScreen()) {
            layoutParams.rightMargin = dpToPixels(MARGIN_MEDIUM);
        } else {
            layoutParams.rightMargin = dpToPixels(MARGIN_SMALL);
        }
        layoutParams.bottomMargin =layoutParams.rightMargin+dpToPixels(PANEL_HEIGHT);
        borderBottomRight.setLayoutParams(layoutParams);
        layout.addView(borderBottomRight);
    }

    private void layoutBottomBorderImagesRespectingAspectRatio() {
        RelativeLayout.LayoutParams borderTopLeftLayoutParams = (RelativeLayout.LayoutParams)borderTopLeft.getLayoutParams();
        RelativeLayout.LayoutParams borderTopRightLayoutParams = (RelativeLayout.LayoutParams)borderTopRight.getLayoutParams();
        RelativeLayout.LayoutParams borderBottomLeftLayoutParams = (RelativeLayout.LayoutParams)borderBottomLeft.getLayoutParams();
        RelativeLayout.LayoutParams borderBottomRightLayoutParams = (RelativeLayout.LayoutParams)borderBottomRight.getLayoutParams();
        float height = (screenWidthInPixels() - borderTopRightLayoutParams.rightMargin - borderTopLeftLayoutParams.leftMargin) * ASPECT_RATIO;
        borderBottomLeftLayoutParams.bottomMargin = (int) (screenHeightInPixels() - height - borderTopLeftLayoutParams.topMargin);
        borderBottomLeft.setLayoutParams(borderBottomLeftLayoutParams);
        borderBottomRightLayoutParams.bottomMargin = (int) (screenHeightInPixels() - height - borderTopRightLayoutParams.topMargin);
        borderBottomRight.setLayoutParams(borderBottomRightLayoutParams);
    }


	//@SuppressLint("NewApi")
	private int screenWidthInPixels() {
       /* Point size = new Point();
        getWindowManager().getDefaultDisplay().getSize(size);
        return size.x;
        */
		int version = android.os.Build.VERSION.SDK_INT;
		Log.i("", " name == "+ version);
		Display display = getWindowManager().getDefaultDisplay();
		int width;
		if (version >= 13) {
		    Point size = new Point();
		    display.getSize(size);
		    width = size.x;
		    return width;
		  //  Log.i("width", "if =>" +width);
		}
		else {
		    width = display.getWidth();
		    return width;
		    //Log.i("width", "else =>" +width);
		}
    }


	//@SuppressLint("NewApi")
	private int screenHeightInPixels() {
      /*  Point size = new Point();
        getWindowManager().getDefaultDisplay().getSize(size);
        return size.y;*/
		int version = android.os.Build.VERSION.SDK_INT;
	//	Log.i("", " name == "+ version);
		Display display = getWindowManager().getDefaultDisplay();
		int height;
		if (version >= 13) {
		    Point size = new Point();
		    display.getSize(size);
		    height = size.y;
		    return height;
		  //  Log.i("width", "if =>" +width);
		}
		else {
		    height = display.getHeight();
		    return height;
		    //Log.i("width", "else =>" +width);
		}
    }

 /*   private void createCaptureButton() {
        captureButton = new ImageButton(getApplicationContext());
        setBitmap(captureButton, "capture_button.png");
        captureButton.setBackgroundColor(Color.TRANSPARENT);
        captureButton.setScaleType(ScaleType.FIT_CENTER);
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(dpToPixels(75), dpToPixels(75));
        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        layoutParams.addRule(RelativeLayout.CENTER_HORIZONTAL);
        layoutParams.bottomMargin = dpToPixels(10);
        captureButton.setLayoutParams(layoutParams);
        captureButton.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                setCaptureButtonImageForEvent(event);
                return false;
            }
        });
        captureButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                takePictureWithAutoFocus();
            }
        });
        layout.addView(captureButton);
    }*/

    private void setCaptureButtonImageForEvent(MotionEvent event) {
     /*   if (event.getAction() == MotionEvent.ACTION_DOWN) {
            setBitmap(captureButton, "capture_button_pressed.png");
        } else if (event.getAction() == MotionEvent.ACTION_UP) {
            setBitmap(captureButton, "capture_button.png");
        }*/
    }

    private void takePictureWithAutoFocus() {
        disableButtons();
        if (getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA_AUTOFOCUS)) {
            camera.autoFocus(new AutoFocusCallback() {
                @Override
                public void onAutoFocus(boolean success, Camera camera) {
                    takePicture();
                }
            });
        } else {
            takePicture();
        }
    }

    private void takePicture() {
    //	Toast.makeText(getApplicationContext(),"width: "+camera.getParameters().getPictureSize().width+
    //			" height "+camera.getParameters().getPictureSize().height, Toast.LENGTH_LONG).show();
        disableButtons();
        try {
            camera.takePicture(null, null, new PictureCallback() {
                @Override
                public void onPictureTaken(byte[] jpegData, Camera camera) {
                    new OutputCapturedImageTask().execute(jpegData);
                }
            });
        } catch (Exception e) {
            finishWithError("Failed to take image");
        }
    }

   // @TargetApi(Build.VERSION_CODES.HONEYCOMB)
	private class OutputCapturedImageTask extends AsyncTask<byte[], Void, Void> {

     //   @SuppressLint("NewApi")
		@Override
        protected Void doInBackground(byte[]... jpegData) {
            try {
                String filename = getIntent().getStringExtra(FILENAME);
                Bitmap capturedImage = getScaledBitmap(jpegData[0]);
                Log.w("currentMarginTop",""+currentMarginTop);
                Log.w("currentMarginBottom",""+currentMarginBottom);
                Log.w("screenWidthInPixels()", ""+screenWidthInPixels());
                Log.w("screenHeightInPixels()", ""+screenHeightInPixels());
                Log.w("cameraImageWidth", ""+camera.getParameters().getPictureSize().width);
                Log.w("cameraImageHeight", ""+camera.getParameters().getPictureSize().height);
           
             

                capturedImage = correctCaptureImageOrientation(capturedImage);

                Log.w("capturedImageWidth", ""+capturedImage.getWidth());
                Log.w("capturedImageHeight", ""+capturedImage.getHeight());
                
                float scaleHor = ((float)capturedImage.getWidth())/(float)screenWidthInPixels();
                float scaleVer =  ((float)capturedImage.getHeight())/(float)screenHeightInPixels();
                scaleHor = scaleVer;

                int impWidth = (int) (((float)(screenWidthInPixels()-(currentMarginTop*2)))*scaleHor);
                int leftMarginCorrected = (capturedImage.getWidth()-impWidth)/2;
 
               

                scaledMarginBottom = (int)(currentMarginBottom*scaleVer);
                scaledMarginTop = (int)(currentMarginTop*scaleVer);

                int impHeight = (int) ((screenHeightInPixels()-currentMarginBottom-currentMarginTop)*scaleVer);
                int topMarginCorrected =  (int) ((capturedImage.getHeight()-impHeight)*((float)((float)scaledMarginTop/(float)(scaledMarginBottom+scaledMarginTop))));
                
                Log.w("left mergin corrected", ""+leftMarginCorrected);
                Log.w("scale hor", ""+scaleHor);
                Log.w("scale ver", ""+scaleVer);
                Log.w("imp width", ""+impWidth);
                Log.w("scaled margin top", ""+scaledMarginTop);
                Log.w("scaled margin bottom", ""+scaledMarginBottom);
                Log.w("imp height", ""+impHeight);
                Log.w("top margin corrected", ""+topMarginCorrected);


                
                Bitmap croppedBitmap = Bitmap.createBitmap(capturedImage,
                                                leftMarginCorrected-BORDER_CORRECTION ,
                                                topMarginCorrected-BORDER_CORRECTION,
                                                impWidth+BORDER_CORRECTION,
                                                impHeight+BORDER_CORRECTION);
                capturedImage.recycle();
                jpegData = null;
                System.gc();
                
                bitmaps.add(bitmaps.size()+filename); 
                File file = new File(Environment.getExternalStorageDirectory(), bitmaps.get(bitmaps.size()-1));
                FileOutputStream output = new FileOutputStream(file);
                
                int targetWidth = getIntent().getIntExtra(TARGET_WIDTH, -1);
                int targetHeight =-1;
                if (targetWidth>0|targetHeight>0){

	                // set missing width/height based on aspect ratio
	               float aspectRatio = ((float)croppedBitmap.getHeight()) / croppedBitmap.getWidth();
	                if (targetWidth > 0 && targetHeight <= 0) {
	                    targetHeight = Math.round(targetWidth * aspectRatio);
	                } else if (targetWidth <= 0 && targetHeight > 0) {
	                    targetWidth = Math.round(targetHeight / aspectRatio);
	                }

	            
	                Bitmap scaledBitmap = Bitmap.createScaledBitmap(croppedBitmap, targetWidth, targetHeight, true);
	                
	                croppedBitmap.recycle();
	                croppedBitmap = null;
              	  	scaledBitmap.compress(CompressFormat.JPEG, 100, output);

              	  	scaledBitmap.recycle(); 
              	  	scaledBitmap = null;
                    System.gc(); 
                }  
                else{

                	  croppedBitmap.compress(CompressFormat.JPEG, 100, output );
                	  croppedBitmap.recycle(); 
                	  croppedBitmap = null;
                      System.gc();  

                }
              
                output.close();
              
            } catch (Exception e) {
            	e.printStackTrace();
                finishWithError("Failed to save image");
            }
            return null;
        }
        

        
        @Override
        protected void onPostExecute(Void result) {
        	super.onPostExecute(result);
        	progress.setVisibility(View.INVISIBLE);
        	   try {

        		   //releaseCamera();
                   //camera = Camera.open();
                   configureCamera(getApplicationContext());
                   showCameraSettings();
                   displayCameraPreview();
                   enableButtons();
                   updateDynamicLayout();
               } catch (Exception e) {
                   finishWithError("Camera is not accessible");
               }
        } 

        
        @Override 
        protected void onPreExecute() {
        	super.onPreExecute();
        	progress.setVisibility(View.VISIBLE);
        	captureButton.setEnabled(false);
        	sendButton.setEnabled(false);
        	recaptureButton.setEnabled(false);
			flashButton.setEnabled(false);
			exitButton.setEnabled(false);
            settingsButton.setEnabled(false);
			if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB){
				captureButton.setAlpha(0.5f);
				sendButton.setAlpha(0.5f);
				recaptureButton.setAlpha(0.5f);
				flashButton.setAlpha(0.5f);
				exitButton.setAlpha(0.5f);
                settingsButton.setAlpha(0.5f);
			}
			
        } 
    }

    private Bitmap getScaledBitmap(byte[] jpegData) {
        // get dimensions of image without scaling
        BitmapFactory.Options options = new BitmapFactory.Options();
        // decode image as close to requested scale as possible
        options.inJustDecodeBounds = false;  
        Bitmap bitmap = BitmapFactory.decodeByteArray(jpegData, 0, jpegData.length, options);
        System.gc();

        return bitmap;
    }

    private int calculateInSampleSize(BitmapFactory.Options options, int requestedWidth, int requestedHeight) {
        int originalHeight = options.outHeight;
        int originalWidth = options.outWidth;
        int inSampleSize = 1;
        if (originalHeight > requestedHeight || originalWidth > requestedWidth) {
            int halfHeight = originalHeight / 2;
            int halfWidth = originalWidth / 2;
            while ((halfHeight / inSampleSize) > requestedHeight && (halfWidth / inSampleSize) > requestedWidth) {
                inSampleSize *= 2;
            }
        }
        return inSampleSize;
    }

    private Bitmap correctCaptureImageOrientation(Bitmap bitmap) {
        Matrix matrix = new Matrix();
        matrix.postRotate(90);
        Bitmap b =  Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), matrix, true);
        bitmap.recycle();
        System.gc();
        return b;
    }

    private void finishWithError(String message) {
        Intent data = new Intent().putExtra(ERROR_MESSAGE, message);
        setResult(RESULT_ERROR, data);

        if (bitmaps!=null)
    		bitmaps.clear();
    	if (previousBitmap!=null)previousBitmap.recycle();	
    	System.gc();
        finish();
    }

    private int dpToPixels(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }

    private boolean isXLargeScreen() {
        int screenLayout = getResources().getConfiguration().screenLayout;
        return (screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_XLARGE;
    }

    private boolean isLargeScreen() {
        int screenLayout = getResources().getConfiguration().screenLayout;
        return (screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE;
    }

    private void setBitmap(ImageView imageView, String imageName) {
        try {
            InputStream imageStream = getAssets().open("www/img/cameraoverlay/" + imageName);
            Bitmap bitmap = BitmapFactory.decodeStream(imageStream);
            imageView.setImageBitmap(bitmap);
            imageStream.close();
            
        } catch (Exception e) {
            Log.e(TAG, "Could load image", e);
        }
    }

     
    private void sendPicture(){
    	CombineImagesTask task = new CombineImagesTask();
    	task.execute();
    }
    
    
    
   // @SuppressLint("NewApi")
	public Bitmap combineImages() { // can add a 3rd parameter 'String loc' if you want to save the new image - left some code to do that at the bottom 
        Bitmap resultBitmap = null; 
        Bitmap b = null;
        FileInputStream fileInputStream = null;
 
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds =true;
        try {     	 
        	fileInputStream = new FileInputStream(Environment.getExternalStorageDirectory()+"/"+bitmaps.get(0));
        	b = BitmapFactory.decodeStream(fileInputStream, null,options);
        	fileInputStream.close();
        	} catch (Exception e) {
        		e.printStackTrace();	
        	}

          

        int colorModeSetting = getIntent().getExtras().getInt(TARGET_HEIGHT, 565);
        Bitmap.Config config =  Bitmap.Config.RGB_565;
        SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(context);
      String colorMode =   sp.getString(CameraSettingsActivity.COLOR_MODE_SETTING,COLOR_MODE_SETTING_DEFAULT);
      
      for (int i=0; i<Bitmap.Config.values().length; i++){
    	  if (Bitmap.Config.values()[i].equals(colorMode)){
    		  config = Bitmap.Config.values()[i];
    		  break;
    	  }
    		  
      }

       resultBitmap = Bitmap.createBitmap(options.outWidth, bitmaps.size()*options.outHeight, config);
       // resultBitmap = Bitmap.createBitmap(metrics,options.outWidth, bitmaps.size()*options.outHeight, config);
       Canvas comboImage = new Canvas(resultBitmap);
       
        options = new BitmapFactory.Options();
        options.inJustDecodeBounds = false;
        try {
	        for (int i=0; i<bitmaps.size(); i++){ 
	        	String s = bitmaps.get(i);
				fileInputStream = new FileInputStream(Environment.getExternalStorageDirectory()+"/"+s);
	        	b = BitmapFactory.decodeStream(fileInputStream, null,options);
	        	fileInputStream.close();
	        	Paint paint = new Paint();
	            comboImage.drawBitmap(b, 0f, i*b.getHeight(), null); 
	            
	            b.recycle();
	            System.gc();
	        }
	     } catch (FileNotFoundException e) {
			e.printStackTrace();
	     } catch (IOException e) {
			e.printStackTrace();
		}
        

        return resultBitmap; 
      }

	@Override
	public boolean onLongClick(View v) {
		AppBlade.doFeedbackWithScreenshot(this, this);
		return false;
	}
	
//	@SuppressLint("NewApi")
	private class CombineImagesTask extends AsyncTask<Void,Void,File>{
		
		@Override
		protected void onPreExecute() {
			super.onPreExecute();
		    disableButtons();
			
				
		}

		@Override
		protected File doInBackground(Void... params) {
			Bitmap capturedImage = combineImages();
	    	
	    	 String filename = getIntent().getStringExtra(FILENAME).concat(""+System.currentTimeMillis()).concat(".jpg");
	         int quality = getIntent().getIntExtra(QUALITY, 100);
	         File capturedImageFile = new File(Environment.getExternalStorageDirectory(), filename);
	    	try {
				capturedImage.compress(CompressFormat.JPEG,100, new FileOutputStream(capturedImageFile));
						
			} catch (FileNotFoundException e) {
				e.printStackTrace();
				finishWithError("Failed to save image");
			} 
	    	capturedImage.recycle();
	    	Bundle bundle = new Bundle();
	    	bundle.putInt("imageCount", bitmaps.size());
            AppEventsLogger logger = AppEventsLogger.newLogger(context);
            logger.logEvent("Capture event", bundle);
	    	
	    	bitmaps.clear();
	    	System.gc();
	    	
	    	//add geo tag
	    	
	    	try {
				ExifInterface exif = new ExifInterface(capturedImageFile.getAbsolutePath());
				exif.setAttribute(ExifInterface.TAG_GPS_LATITUDE, ""+latitude);
				exif.setAttribute("UserComment", "USER COMMENT!");
				Log.w("Latitide", ""+latitude);
				exif.setAttribute(ExifInterface.TAG_GPS_LONGITUDE, ""+longitude);
				Log.w("Longitude", ""+longitude);
				exif.setAttribute(ExifInterface.TAG_GPS_ALTITUDE, ""+altitude);
				Log.w("Altitude", ""+altitude);
				exif.saveAttributes();

			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return capturedImageFile; 
		}
		
		@Override
		protected void onPostExecute(File result) {
			super.onPostExecute(result);
	        Intent data = new Intent();
	        data.putExtra(IMAGE_URI, Uri.fromFile(result).toString());
	        data.putExtra(LATITUDE, latitude);
	        data.putExtra(LONGITUDE, longitude);
            data.putExtra(ALTITUDE, altitude);
	        setResult(RESULT_OK, data);
	        finish();
		}
	}

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch(resultCode){
            case REQUEST_CODE_SETTINGS_ACTIVITY:
                getCamera(this);
                configureCamera(this);
                showCameraSettings();
                break;
            default:
                break;
        }
    }

    @Override
    protected void onDestroy() {
       // Toast.makeText(this,"Destroying camera!", Toast.LENGTH_LONG).show();
 //       releaseCamera();
        super.onDestroy();
    }

    public static Camera getCamera(Context context){
        try {
            camera = Camera.open();
            configureCamera(context);
         
        }
        catch(Exception e ){
            releaseCamera();
            camera = Camera.open();
            configureCamera(context);
            e.printStackTrace();
        }
        return camera;
    }



    private void disableButtons(){
       /* captureButton.setOnClickListener(null);
        sendButton.setOnClickListener(null);
        recaptureButton.setOnClickListener(null);
        flashButton.setOnClickListener(null);
        exitButton.setOnClickListener(null);
        settingsButton.setOnClickListener(null);
        */
        captureButton.setEnabled(false);
        sendButton.setEnabled(false);
        recaptureButton.setEnabled(false);
        flashButton.setEnabled(false);
        exitButton.setEnabled(false);
        settingsButton.setEnabled(false);
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB){
            captureButton.setAlpha(0.5f);
            sendButton.setAlpha(0.5f);
            recaptureButton.setAlpha(0.5f);
            flashButton.setAlpha(0.5f);
            exitButton.setAlpha(0.5f);
            settingsButton.setAlpha(0.5f);
        }
    }

    private void enableButtons(){
        captureButton.setEnabled(true);
        sendButton.setEnabled(true);
        recaptureButton.setEnabled(true);
        flashButton.setEnabled(true);
        exitButton.setEnabled(true);
        settingsButton.setEnabled(true);

        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB){
            captureButton.setAlpha(1f);
            sendButton.setAlpha(1f);
            recaptureButton.setAlpha(1f);
            flashButton.setAlpha(1f);
            exitButton.setAlpha(1f);
            settingsButton.setAlpha(1f);
        }
    }

    private void disableCaptureButton(){
        captureButton.setEnabled(false);
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
            captureButton.setAlpha(0.5f);
        }
    }

    
    
    private void showCameraSettings(){
    	SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(context);
        String pictureSize= sp.getString(CameraSettingsActivity.PICTURE_SIZE_SETTING, PICTURE_SIZE_SETTING_DEFAULT);
        String colorMode =   sp.getString(CameraSettingsActivity.COLOR_MODE_SETTING,COLOR_MODE_SETTING_DEFAULT);
	    int pos = pictureSize.indexOf("x");
	    int width = Integer.parseInt(pictureSize.substring(0,pos));
	    int height = Integer.parseInt(pictureSize.substring(pos+1));
	//    Toast.makeText(this, "width: "+width + ", height: "+height+", color mode: "+colorMode, Toast.LENGTH_LONG).show();
    }
}


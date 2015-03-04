
package com.performanceactive.plugins.camera;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.graphics.Bitmap.Config;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.DrawFilter;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Picture;
import android.graphics.Point;
import android.graphics.Rect;
import android.hardware.Camera;
import android.hardware.Camera.AutoFocusCallback;
import android.hardware.Camera.PictureCallback;
import android.hardware.Camera.Size;
import android.location.Location;
import android.location.LocationManager;
import android.media.ExifInterface;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.util.DisplayMetrics;
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
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ImageView.ScaleType;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import com.appblade.framework.AppBlade;

import ru.krayneva.bills.R;

import static android.hardware.Camera.Parameters.FLASH_MODE_OFF;
import static android.hardware.Camera.Parameters.FOCUS_MODE_AUTO;
import static android.hardware.Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE;

public class CustomCameraActivity extends Activity implements OnLongClickListener{
 
    private static final String TAG = CustomCameraActivity.class.getSimpleName();
    private static final float ASPECT_RATIO = 126.0f / 86;
 
    public static String FILENAME = "Filename";
    public static String QUALITY = "Quality"; 
    public static String TARGET_WIDTH = "TargetWidth";
    public static String TARGET_HEIGHT = "TargetHeight";
    public static String COLOR_MODE = "ColorMode";
    public static String TEMPFILEPATH = "TempFilePath"; 
    public static String IMAGE_URI = "ImageUri";
    public static String ERROR_MESSAGE = "ErrorMessage";
    public static int RESULT_ERROR = 2;
    public static int MAX_IMAGE_WIDTH = 4*1024;

    private Camera camera;
    private RelativeLayout layout;
    private FrameLayout cameraPreviewView;
    private ImageView borderTopLeft;
    private ImageView borderTopRight;
    private ImageView borderBottomLeft;
    private ImageView borderBottomRight;
    private TextView billText;
    private ImageButton captureButton, sendButton, recaptureButton, flashButton, exitButton; 
    
    private RelativeLayout controlsLayout;
    private FrameLayout topView, leftView, rightView, bottomView;
    private LinearLayout panelLayout;
    private int currentMarginTop, currentMarginBottom, currentScale;
    private int scaledMarginTop, scaledMarginBottom;
    private ImageView previousImage;
    private boolean flashEnabled = false;
    private Resources resources;
    
    private CustomCameraPreview customCameraPreview;
    private static final int MARGIN_BIG = 100;
    private static final int MARGIN_MEDIUM = 50;
    private static final int MARGIN_SMALL = 50;
    private static final int PANEL_HEIGHT = 100;
    
    private static final int SHADOW_COLOR = 0x33000000;
    private static final int PANEL_COLOR = 0x99000000;
    
    
    private ArrayList<String> bitmaps= new ArrayList<String>();
    private Bitmap previousBitmap;
    double latitude, longitude;  
    
    
    @Override
    protected void onResume() {
        super.onResume();
       
        try {
            camera = Camera.open();
            configureCamera();
            displayCameraPreview();
        } catch (Exception e) {
            finishWithError("Camera is not accessible");
        }
    }

    private void configureCamera() { 
        Camera.Parameters cameraSettings = camera.getParameters();
    //    cameraSettings.setJpegQuality(100);

        cameraSettings.setJpegQuality( getIntent().getIntExtra(QUALITY, 100) );
        List<String> supportedFocusModes = cameraSettings.getSupportedFocusModes();
        if (supportedFocusModes.contains(FOCUS_MODE_CONTINUOUS_PICTURE)) {
            cameraSettings.setFocusMode(FOCUS_MODE_CONTINUOUS_PICTURE);
        } else if (supportedFocusModes.contains(FOCUS_MODE_AUTO)) {
            cameraSettings.setFocusMode(FOCUS_MODE_AUTO);
            
          
        }
        if (flashEnabled){
        	  cameraSettings.setFlashMode(android.hardware.Camera.Parameters.FLASH_MODE_ON);
        }
        else{
        	  cameraSettings.setFlashMode(FLASH_MODE_OFF);
        }
        List <Size> sizes = cameraSettings.getSupportedPictureSizes();
        Size maxSize = sizes.get(0);
        for (Size s:sizes){
        	if ((maxSize.width<s.width)||(maxSize.height<s.height))
        		maxSize = s;
        }
        cameraSettings.setPictureSize(maxSize.width, maxSize.height);
        camera.setParameters(cameraSettings);
    }

    private void displayCameraPreview() {
        cameraPreviewView.removeAllViews();
        customCameraPreview = new CustomCameraPreview(this, camera);
        cameraPreviewView.addView(customCameraPreview);
    }

    @Override
    protected void onPause() {
        super.onPause();
        releaseCamera();
    }

    private void releaseCamera() {
        if (camera != null) {
            camera.stopPreview();
            camera.release();
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        resources = getResources();
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
        
        LocationManager lm = (LocationManager)getSystemService(Context.LOCATION_SERVICE); 
        Location location = null;
        boolean isGPSActive  = lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
      
 		if (!isGPSActive ) {
 			location = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
 			//Toast.makeText(this, ""+location.getLongitude(), Toast.LENGTH_LONG).show();
 			
 		}
 		else{
 			location = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
 			Toast.makeText(this, ""+location.getLongitude(), Toast.LENGTH_LONG).show();
         	
 		}
 		if (location!=null){
	 		latitude = location.getLatitude();
	 	 	longitude = location.getLongitude();
 		}
    }

    private void createCameraPreview() {
        cameraPreviewView = new FrameLayout(this);
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);
        cameraPreviewView.setLayoutParams(layoutParams);
        layout.addView(cameraPreviewView);
  
    }

    

	private void createShadowLayer(){
        // затемнение областей
    	int margin = 0;
          
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
        params.addRule(RelativeLayout.CENTER_IN_PARENT,RelativeLayout.TRUE);
        billText.setLayoutParams(params);
        billText.setTextSize(15);
        controlsLayout.addView(billText);
        
        
        flashButton = new ImageButton(this);
        params = new RelativeLayout.LayoutParams(margin,margin);
        Log.w("margin",""+ margin);
        params.rightMargin = margin/4;
        params.topMargin = margin/4;
        params.addRule(RelativeLayout.ALIGN_PARENT_RIGHT,RelativeLayout.TRUE);
        params.addRule(RelativeLayout.ALIGN_PARENT_TOP,RelativeLayout.TRUE);
        if (flashEnabled)
        	setBitmap(flashButton, "flash_yellow.png");
        else
        	setBitmap(flashButton, "flash_dark_blue.png");
    	flashButton.setBackgroundColor(Color.TRANSPARENT);
        flashButton.setScaleType(ScaleType.CENTER_INSIDE);
    	
        
        flashButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
              if (flashEnabled){
            	  flashEnabled = false;
            	  setBitmap(flashButton, "flash_dark_blue.png");
            	  configureCamera();
              }
              else{
            	  flashEnabled = true;
            	  setBitmap(flashButton, "flash_yellow.png");
            	  configureCamera();
              }
            }
        });
        
       controlsLayout.addView(flashButton,params);   
       
       
       
       exitButton = new ImageButton(this);
       params = new RelativeLayout.LayoutParams(margin,margin);
       params.leftMargin = margin/4;
       params.topMargin = margin/4;
       params.addRule(RelativeLayout.ALIGN_PARENT_LEFT,RelativeLayout.TRUE);
       params.addRule(RelativeLayout.ALIGN_PARENT_TOP,RelativeLayout.TRUE);
       setBitmap(exitButton, "back_button.png");

       exitButton.setBackgroundColor(Color.TRANSPARENT);
       exitButton.setScaleType(ScaleType.FIT_CENTER);
   	
       
       exitButton.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View v) {
            finishWithError("Capture cancelled");
           }
       });
       
      controlsLayout.addView(exitButton,params);   
       
       
       
       
       previousImage = new ImageView(this); 
       params = new RelativeLayout.LayoutParams(LayoutParams.MATCH_PARENT,margin);
       params.addRule(RelativeLayout.ALIGN_PARENT_TOP,RelativeLayout.TRUE);
       params.addRule(RelativeLayout.CENTER_HORIZONTAL,RelativeLayout.TRUE);
       params.addRule(RelativeLayout.ABOVE, borderTopLeft.getId());
       params.leftMargin = margin;
       params.rightMargin = margin;
     //  previousImage.setImageDrawable(resources.getDrawable(R.drawable.icon));
       controlsLayout.addView(previousImage,params);   
        updateDynamicLayout();
    }
    
	/**
	 * обновление частей интерфейса, которые изменяются в зависимости от колва фоток
	 */
	private void updateDynamicLayout(){
		if (bitmaps.size()==0){
			billText.setText("Фото чека");
			recaptureButton.setVisibility(View.GONE);
			sendButton.setVisibility(View.GONE);
			previousImage.setVisibility(View.GONE);
		}
		else{
			previousImage.setVisibility(View.VISIBLE);
			billText.setText("Продолжение чека");
			recaptureButton.setVisibility(View.VISIBLE);
			sendButton.setVisibility(View.VISIBLE);
			if (previousBitmap!=null){
				previousBitmap.recycle();
				System.gc();
			}
			FileInputStream fileInputStream = null;
			try{
				fileInputStream = new FileInputStream(Environment.getExternalStorageDirectory()+"/"+bitmaps.get(bitmaps.size()-1));
				BitmapFactory.Options options = new BitmapFactory.Options();
			    options.inJustDecodeBounds = false;
	        	Bitmap b = BitmapFactory.decodeStream(fileInputStream, null,options);
	        	fileInputStream.close();
	        	previousBitmap = Bitmap.createBitmap(b, 0, b.getHeight()-currentMarginTop*2,b.getWidth(), currentMarginTop*2);
				previousImage.setScaleType(ScaleType.FIT_END);
				previousImage.setImageBitmap(previousBitmap);
				b.recycle();
				System.gc();
			}
			catch (Exception e){
				e.printStackTrace();
			}
			
		}
		
		
	}
    
    /**
     * создание нижней панели с кнопками
     */
    private LinearLayout createPanelLayout(){
    	panelLayout = new LinearLayout(this);
    	captureButton = new ImageButton(this);
    	setBitmap(captureButton, "camera_brown.png");
        captureButton.setBackgroundColor(Color.TRANSPARENT);
        captureButton.setScaleType(ScaleType.FIT_CENTER);
    	
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
        
        panelLayout.addView(captureButton);
        
        sendButton = new ImageButton(this);
    	setBitmap(sendButton, "send.png");
    	sendButton.setBackgroundColor(Color.TRANSPARENT);
    	sendButton.setScaleType(ScaleType.FIT_CENTER);
    	
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
        
        panelLayout.addView(sendButton);
        
        recaptureButton = new ImageButton(this);
    	setBitmap(recaptureButton, "cancel_red.png");
    	recaptureButton.setBackgroundColor(Color.TRANSPARENT);
    	recaptureButton.setScaleType(ScaleType.FIT_CENTER);
        recaptureButton.setOnClickListener(new View.OnClickListener() {
            @Override
             public void onClick(View v) {
            		recaptureLast();
                }
            });
            
            panelLayout.addView(recaptureButton);
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


	@SuppressLint("NewApi")
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


	@SuppressLint("NewApi")
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

    private class OutputCapturedImageTask extends AsyncTask<byte[], Void, Void> {

        @SuppressLint("NewApi")
		@Override
        protected Void doInBackground(byte[]... jpegData) {
            try {
                String filename = getIntent().getStringExtra(FILENAME);
                int quality = getIntent().getIntExtra(QUALITY, 100);
              //  File capturedImageFile = new File(Environment.getExternalStorageDirectory(), filename);
                Bitmap capturedImage = getScaledBitmap(jpegData[0]);
           //     float scale=((float)camera.getParameters().getPictureSize().width)/ (float)capturedImage.getWidth();
                float scale=((float)camera.getParameters().getPictureSize().height)/ (float)screenWidthInPixels();
             // float scale= getResources().getDisplayMetrics().density;
                Log.w("currentMarginTop",""+currentMarginTop);
                Log.w("currentMarginBottom",""+currentMarginBottom);

                Log.w("screenWidthInPixels()", ""+screenWidthInPixels());
                Log.w("screenHeightInPixels()", ""+screenHeightInPixels());
                Log.w("cameraImageWidth", ""+camera.getParameters().getPictureSize().width);
                Log.w("cameraImageHeight", ""+camera.getParameters().getPictureSize().height);
           
             
             

                jpegData = null;
                capturedImage = correctCaptureImageOrientation(capturedImage);
                Log.w("capturedImageWidth", ""+capturedImage.getWidth());
                Log.w("capturedImageHeight", ""+capturedImage.getHeight());
               
                
                float scaleHor = ((float)capturedImage.getWidth())/(float)screenWidthInPixels();
                int impWidth = (int) (((float)(screenWidthInPixels()-(currentMarginTop*2)))*scaleHor);
                int leftMarginCorrected = (capturedImage.getWidth()-impWidth)/2;
 
                float scaleVer =  ((float)capturedImage.getHeight())/(float)screenHeightInPixels();

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

                
                // обрезаем битмапу
                Bitmap croppedBitmap = Bitmap.createBitmap(capturedImage, leftMarginCorrected , topMarginCorrected, impWidth,impHeight);
                capturedImage.recycle();
                System.gc();
                // складываем ее в список
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
                	//croppedBitmap = Bitmap.createScaledBitmap(croppedBitmap, 100, 100,false);
           
                	//int scaledHeight = croppedBitmap.getScaledHeight(canvas);
              	  //	canvas.drawBitmap(croppedBitmap,new Matrix(), null);
              	 // 	canvas.save();
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
        	   try {
        		   updateDynamicLayout();
        		   releaseCamera();
                   camera = Camera.open();
                   configureCamera();
                   displayCameraPreview();
               	captureButton.setEnabled(true);
            	sendButton.setEnabled(true);
            	recaptureButton.setEnabled(true);
               } catch (Exception e) {
                   finishWithError("Camera is not accessible");
               }
        } 

        
        @Override 
        protected void onPreExecute() {
        	super.onPreExecute();
        	captureButton.setEnabled(false);
        	sendButton.setEnabled(false);
        	recaptureButton.setEnabled(false);
        } 
    }

    private Bitmap getScaledBitmap(byte[] jpegData) {
        int targetWidth = getIntent().getIntExtra(TARGET_WIDTH, -1);
        int targetHeight =-1;
       /* if (targetWidth <= 0 && targetHeight <= 0) {
            return BitmapFactory.decodeByteArray(jpegData, 0, jpegData.length);
        }
        */
        if (targetWidth <= 0 && targetHeight <= 0) {
            targetWidth = MAX_IMAGE_WIDTH;
        }
        // get dimensions of image without scaling
        BitmapFactory.Options options = new BitmapFactory.Options();
      //  options.inJustDecodeBounds = true;
      //  Bitmap b = BitmapFactory.decodeByteArray(jpegData, 0, jpegData.length, options);

        // decode image as close to requested scale as possible
        options.inJustDecodeBounds = false;  
      //  options.inSampleSize = calculateInSampleSize(options, targetWidth, targetHeight);
        Bitmap bitmap = BitmapFactory.decodeByteArray(jpegData, 0, jpegData.length, options);
        
        // set missing width/height based on aspect ratio
      /*  float aspectRatio = ((float)options.outHeight) / options.outWidth;
        if (targetWidth > 0 && targetHeight <= 0) {
            targetHeight = Math.round(targetWidth * aspectRatio);
        } else if (targetWidth <= 0 && targetHeight > 0) {
            targetWidth = Math.round(targetHeight / aspectRatio);
        }

        // make sure we also
        Matrix matrix = new Matrix();
        matrix.postRotate(90);

        Bitmap bm = Bitmap.createScaledBitmap(bitmap, targetWidth, targetHeight, true);
        bitmap.recycle();
        b = null;
        System.gc();
        return bm;*/
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
    	bitmaps.clear();
    	System.gc();
    	
    	//add geo tag
    	
    	try {
			ExifInterface exif = new ExifInterface(capturedImageFile.getAbsolutePath());
			exif.setAttribute(ExifInterface.TAG_GPS_LATITUDE, ""+latitude);
			
			Log.w("Latitide", ""+latitude);
			exif.setAttribute(ExifInterface.TAG_GPS_LONGITUDE, ""+longitude);
			Log.w("Longitude", ""+longitude);
			exif.saveAttributes();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
    	
    	
        Intent data = new Intent();
        data.putExtra(IMAGE_URI, Uri.fromFile(capturedImageFile).toString());
        setResult(RESULT_OK, data);
        finish();
    	this.finish();
    }
    
    
    
    @SuppressLint("NewApi")
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

          

       // int colorModeSetting = getIntent().getExtras().getInt(COLOR_MODE, 565);
        int colorModeSetting = getIntent().getExtras().getInt(TARGET_HEIGHT, 565);
        Bitmap.Config config =  Bitmap.Config.RGB_565;

        
     /*   if (colorModeSetting==4444){
           	config = Bitmap.Config.ARGB_4444;	
        }
        else if (colorModeSetting==8888){
        	config = Bitmap.Config.ARGB_8888;
        }
        else if (colorModeSetting==8){
        	config = Bitmap.Config.ALPHA_8;
        }
	
       */ 
        

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
}

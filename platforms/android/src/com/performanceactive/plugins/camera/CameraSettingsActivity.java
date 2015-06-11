package com.performanceactive.plugins.camera;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.hardware.Camera;
import android.os.Bundle;
import android.preference.EditTextPreference;
import android.preference.PreferenceManager;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.SeekBar;
import android.widget.Spinner;
import android.widget.TextView;

import com.checkomatic.R;

import java.util.ArrayList;


public class CameraSettingsActivity extends Activity{

private Camera camera;

	public static String SCENE_MODE_SETTING = "SceneMode";
	public static String FOCUS_MODE_SETTING = "FocusMode";
	public static String ANTIBANDING_SETTING = "Antibanding";
	public static String WHITE_BALANCE_SETTING = "WhiteBalance";
	public static String PICTURE_FORMAT_SETTING = "PictureFormat";
	public static String COLOR_EFFECTS_SETTING = "ColorEffects";
	public static String EXPOSURE_COMPENSATION_SETTING = "ExposureCompensation";


	private Spinner sceneModeSpinner, focusModeSpinner, whiteBalanceSpinner,
			antiBandingSpinner, pictureFormatSpinner,colorEffectsSpinner;
	SeekBar exposureCompensationSeekBar;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);


	}


	@Override
	protected void onResume() {
		super.onResume();

		setContentView(R.layout.activity_camera_settings);
	//	camera = Camera.open();
		camera = CustomCameraActivity.getCamera();
		Camera.Parameters cameraSettings = camera.getParameters();



		// scene mode
		sceneModeSpinner = (Spinner) findViewById(R.id.sceneModeSpinner);
		ArrayList<String> sceneModes = (ArrayList<String>)cameraSettings.getSupportedSceneModes();
		if (CustomCameraActivity.sceneModeEnabled) {
			ArrayAdapter<String> sceneModesAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, sceneModes);
			sceneModesAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
			sceneModeSpinner.setAdapter(sceneModesAdapter);
		}
		else{
			sceneModeSpinner.setEnabled(false);
		}



		// focus Mode
		focusModeSpinner = (Spinner) findViewById(R.id.focusModeSpinner);
		ArrayList<String> focusModes = (ArrayList<String>)cameraSettings.getSupportedFocusModes();
		if (CustomCameraActivity.focusModeEnabled) {
			ArrayAdapter<String> focusModesAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, focusModes);
			focusModesAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
			focusModeSpinner.setAdapter(focusModesAdapter);
		}
		else{
			focusModeSpinner.setEnabled(false);
		}


		// anti banding
		//cameraSettings.getSupportedAntibanding();
		antiBandingSpinner = (Spinner) findViewById(R.id.antiBandingSpinner);
		ArrayList<String> antiBanding = (ArrayList<String>)cameraSettings.getSupportedAntibanding();
		if (CustomCameraActivity.antibandingEnabled) {
			ArrayAdapter<String> antiBandingAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, antiBanding);
			antiBandingAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
			antiBandingSpinner.setAdapter(antiBandingAdapter);
		}
		else{
			antiBandingSpinner.setEnabled(false);
		}

		// white balance
		//cameraSettings.getSupportedWhiteBalance();
		whiteBalanceSpinner = (Spinner) findViewById(R.id.whiteBalanceSpinner);
		ArrayList<String> whiteBalance = (ArrayList<String>)cameraSettings.getSupportedWhiteBalance();
		if (CustomCameraActivity.whiteBalanceEnabled) {
			ArrayAdapter<String> whiteBalanceAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, whiteBalance);
			whiteBalanceAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
			whiteBalanceSpinner.setAdapter(whiteBalanceAdapter);
		}
		else{
			whiteBalanceSpinner.setEnabled(false);
		}



		// picture format
		//cameraSettings.getSupportedPictureFormats();
		pictureFormatSpinner = (Spinner) findViewById(R.id.pictureFormatSpinner);
		ArrayList<Integer> pictureFormat = (ArrayList<Integer>)cameraSettings.getSupportedPictureFormats();
		if (CustomCameraActivity.pictureFormatEnabled) {
			ArrayAdapter<Integer> pictureFormatAdapter = new ArrayAdapter<Integer>(this, android.R.layout.simple_spinner_item, pictureFormat);
			pictureFormatAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
			pictureFormatSpinner.setAdapter(pictureFormatAdapter);
		}
		else{
			pictureFormatSpinner.setEnabled(false);
		}

		//color effects
		//cameraSettings.getSupportedColorEffects();
		colorEffectsSpinner = (Spinner) findViewById(R.id.colorEffectsSpinner);
		ArrayList<String> colorEffects = (ArrayList<String>)cameraSettings.getSupportedColorEffects();
		if (CustomCameraActivity.colorEffectsnabled) {
			ArrayAdapter<String> colorEffectsAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, colorEffects);
			colorEffectsAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
			colorEffectsSpinner.setAdapter(colorEffectsAdapter);
		}
		else{
			colorEffectsSpinner.setEnabled(false);
		}



		SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(getBaseContext());
		String sceneModeValue = sp.getString(CameraSettingsActivity.SCENE_MODE_SETTING, CustomCameraActivity.SCENE_MODE_SETTING_DEFAULT);
		String focusModeValue = sp.getString(CameraSettingsActivity.FOCUS_MODE_SETTING, CustomCameraActivity.FOCUS_MODE_SETTING_DEFAULT);
		String antiBandingValue = sp.getString(CameraSettingsActivity.ANTIBANDING_SETTING, CustomCameraActivity.ANTIBANDING_SETTING_DEFAULT);
		String whiteBalanceValue = sp.getString(CameraSettingsActivity.WHITE_BALANCE_SETTING, CustomCameraActivity.WHITE_BALANCE_SETTING_DEFAULT);
		String pictureFormatValue = sp.getString(CameraSettingsActivity.PICTURE_FORMAT_SETTING, CustomCameraActivity.PICTURE_FORMAT_SETTING_DEFAULT);
		String colorEffectValue = sp.getString(CameraSettingsActivity.COLOR_EFFECTS_SETTING, CustomCameraActivity.COLOR_EFFECTS_SETTING_DEFAULT);
		String exposureCompensationValue = sp.getString(CameraSettingsActivity.EXPOSURE_COMPENSATION_SETTING, CustomCameraActivity.EXPOSURE_COMPENSATION_SETTING_DEFAULT);




		if (CustomCameraActivity.sceneModeEnabled)sceneModeSpinner.setSelection(sceneModes.indexOf(sceneModeValue));
		if (CustomCameraActivity.focusModeEnabled)focusModeSpinner.setSelection(focusModes.indexOf(focusModeValue));
		if (CustomCameraActivity.antibandingEnabled)antiBandingSpinner.setSelection(antiBanding.indexOf(antiBandingValue));
		if (CustomCameraActivity.whiteBalanceEnabled)whiteBalanceSpinner.setSelection(whiteBalance.indexOf(whiteBalanceValue));
		if (CustomCameraActivity.pictureFormatEnabled)pictureFormatSpinner.setSelection(pictureFormat.indexOf(Integer.parseInt(pictureFormatValue)));
		if (CustomCameraActivity.colorEffectsnabled)colorEffectsSpinner.setSelection(colorEffects.indexOf(colorEffectValue));


		exposureCompensationSeekBar = (SeekBar)findViewById(R.id.seekBarExposureCompensation);
		exposureCompensationSeekBar.setMax((int) (cameraSettings.getMaxExposureCompensation() - cameraSettings.getMinExposureCompensation()));

		exposureCompensationSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
			@Override
			public void onProgressChanged(SeekBar seekBar, int i, boolean b) {
				camera = CustomCameraActivity.getCamera();
				Camera.Parameters cameraSettings = camera.getParameters();
				cameraSettings.setExposureCompensation((int) (i + cameraSettings.getMinExposureCompensation()));
				TextView exposureCompensationTextView = (TextView) findViewById(R.id.textViewExposureCompensation);
				//exposureCompensationTextView.setText("Exposure Compensation " + cameraSettings.getExposureCompensation());
				exposureCompensationTextView.setText("Exposure Compensation " + cameraSettings.getExposureCompensation());
				SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(getBaseContext());
				SharedPreferences.Editor editor = sp.edit();
				editor.putString(CameraSettingsActivity.EXPOSURE_COMPENSATION_SETTING, "" + cameraSettings.getExposureCompensation());
				editor.commit();
			}

			@Override
			public void onStartTrackingTouch(SeekBar seekBar) {

			}

			@Override
			public void onStopTrackingTouch(SeekBar seekBar) {

			}
		});
		TextView exposureCompensationTextView = (TextView) findViewById(R.id.textViewExposureCompensation);
		exposureCompensationTextView.setText("Exposure Compensation " + exposureCompensationValue+" min: "+cameraSettings.getMinExposureCompensation());
		float exposureCompFloat = Float.parseFloat(exposureCompensationValue);

		exposureCompensationSeekBar.setProgress((int)(exposureCompFloat- cameraSettings.getMinExposureCompensation()));


	}

	@Override
	public void onBackPressed() {
		setResult(RESULT_OK,saveCameraSettings());
		super.onBackPressed();
	}


	private Intent saveCameraSettings(){
		Intent intent = new Intent();
		/*intent.putExtra(SCENE_MODE_SETTING,sceneModeSpinner.getSelectedItem().toString());
		intent.putExtra(FOCUS_MODE_SETTING,focusModeSpinner.getSelectedItem().toString());
		intent.putExtra(ANTIBANDING_SETTING,antiBandingSpinner.getSelectedItem().toString());
		intent.putExtra(WHITE_BALANCE_SETTING,whiteBalanceSpinner.getSelectedItem().toString());
		intent.putExtra(PICTURE_FORMAT_SETTING,pictureFormatSpinner.getSelectedItem().toString());
		intent.putExtra(COLOR_EFFECTS_SETTING,colorEffectsSpinner.getSelectedItem().toString());
		*/
		SharedPreferences sp = PreferenceManager.getDefaultSharedPreferences(getBaseContext());
		SharedPreferences.Editor editor = sp.edit();
		if (CustomCameraActivity.sceneModeEnabled)editor.putString(SCENE_MODE_SETTING, sceneModeSpinner.getSelectedItem().toString());
		if (CustomCameraActivity.focusModeEnabled)editor.putString(FOCUS_MODE_SETTING, focusModeSpinner.getSelectedItem().toString());
		if (CustomCameraActivity.antibandingEnabled)editor.putString(ANTIBANDING_SETTING, antiBandingSpinner.getSelectedItem().toString());
		if (CustomCameraActivity.whiteBalanceEnabled)editor.putString(WHITE_BALANCE_SETTING, whiteBalanceSpinner.getSelectedItem().toString());
		if (CustomCameraActivity.pictureFormatEnabled)editor.putString(PICTURE_FORMAT_SETTING, pictureFormatSpinner.getSelectedItem().toString());
		if (CustomCameraActivity.colorEffectsnabled)editor.putString(COLOR_EFFECTS_SETTING, colorEffectsSpinner.getSelectedItem().toString());

		editor.commit();


		return intent;
	}
}
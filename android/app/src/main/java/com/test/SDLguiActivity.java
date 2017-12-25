package com.test;

//import com.hht.demo.R;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.hardware.Camera;
import android.net.Uri;
import android.os.Bundle;

import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.TextView;
import android.widget.Toast;

//import com.hht.emdk.datawedge;
//import com.hht.demo.CodeSetting;

//import static android.hardware.Camera.Parameters.FLASH_MODE_OFF;
//import static android.hardware.Camera.Parameters.FLASH_MODE_ON;
import static android.provider.MediaStore.Files.FileColumns.MEDIA_TYPE_IMAGE;
import static android.provider.MediaStore.Files.FileColumns.MEDIA_TYPE_VIDEO;
import static com.hht.emdk.datawedge.EXTRA_PARAMETER;

//import com.hht.emdk.datawedge;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class SDLguiActivity extends Activity {
	static SDLguiActivity app = null;

	//UI
	private TextView tvStat = null;
	private TextView tvData = null;
	private CheckBox chBeep = null;
	private CheckBox chVibrate = null;
	private CheckBox chFlashLED = null;
	private CheckBox chPreview = null;

	private Button buttonCodeParam;
	private Button buttonDfl;
	private Button buttonProp;
	private Button buttonCamera;

	//Mode State
	private boolean beepMode = true;
	private boolean vibrateMode = false;
	private boolean flashLEDMode = true;
	private boolean previewMode = false;

	//Counter
	private int decodes = 0;
	// contentpovider info
	static final String PROVIDER_NAME = "com.oem.startup.ScannerParaProvider";
	static final String URL = "content://" + PROVIDER_NAME + "/settings";
	// URI for data sharing with other application
	// content://<package name>.provider.<custom content provider>/<table name>
	static final Uri CONTENT_URI = Uri.parse(URL);
	static String PROPERTY_DEVICE_BEEP = "Device_Beep";
	static String PROPERTY_DEVICE_VIBRATE = "Device_Vibrate";
	static String PROPERTY_SCANNER_SDC_FlashMode = "Scanner_SDC_FlashMode";
	static String PROPERTY_SCANNER_SDC_PreviewMode = "Scanner_SDC_PreviewMode";

	//Listen to decoded result
	private IntentFilter intentFilter = new IntentFilter("DATA_SCAN");
	private BarcodeDataBroadcastReceiver intentBarcodeDataReceiver = new BarcodeDataBroadcastReceiver();
	private static TriggerThread mTriggerThread;

	// ------------------------------------------------------
	public SDLguiActivity() {
		app = this;
	}

	private static final int CAMERA_CAPTURE_IMAGE_REQUEST_CODE = 100;
	private Uri fileUri; // file url to store image/video
	private static final String IMAGE_DIRECTORY_NAME = "Hello Camera";

	/**
	 * returning image / video
	 */
	private static File getOutputMediaFile(int type) {

		// External sdcard location
		File mediaStorageDir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES),
				IMAGE_DIRECTORY_NAME);

		// Create the storage directory if it does not exist
		if (!mediaStorageDir.exists()) {
			if (!mediaStorageDir.mkdirs()) {

				return null;
			}
		}

		// Create a media file name
		String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
		File mediaFile;
		if (type == MEDIA_TYPE_IMAGE) {
			mediaFile = new File(mediaStorageDir.getPath() + File.separator + "IMG_" + timeStamp + ".jpg");
		} else if (type == MEDIA_TYPE_VIDEO) {
			mediaFile = new File(mediaStorageDir.getPath() + File.separator + "VID_" + timeStamp + ".mp4");
		} else {
			return null;
		}

		return mediaFile;
	}

	/**
	 * Creating file uri to store image/video
	 */
	public Uri getOutputMediaFileUri(int type) {
		return Uri.fromFile(getOutputMediaFile(type));
	}

	public static Camera checkForCamera() {
		Camera camera = null;
		try {
			camera = Camera.open(1); // this line will throw exception if camera is not in use.
		} catch (Exception e) {

		}
		return camera; // if instance of camera, if it is not available it will return null.
	}

	/*
	* Capturing Camera Image will lauch camera app requrest image capture
	*/
	private void captureImage() {

		Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
		Camera checkCamera = checkForCamera();
		if (checkCamera != null) {
			Toast toast = Toast.makeText(this, "Camera is availabe!!!", Toast.LENGTH_LONG);
			toast.show();
			//relase it now
			checkCamera.release();
		}

		//fileUri = getOutputMediaFileUri(MEDIA_TYPE_IMAGE);

		//intent.putExtra(MediaStore.EXTRA_OUTPUT, fileUri);
		DisableScanner();
		// start the image capture Intent
		startActivityForResult(intent, CAMERA_CAPTURE_IMAGE_REQUEST_CODE);
	}

	OnClickListener mCaptureListener = new OnClickListener() {
		public void onClick(View v) {
			DisableScanner();
			captureImage();
		}
	};

	// ------------------------------------------------------
	// Called with the activity is first created.
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.main); // Inflate our UI from its XML layout description.

		// Hook up button presses to the appropriate event handler.
		((Button) findViewById(R.id.buttonDec)).setOnClickListener(mDecodeListener);
		((Button) findViewById(R.id.buttonCodeParam)).setOnClickListener(mCodeSettingListener);
		((Button) findViewById(R.id.buttonDfl)).setOnClickListener(mDefaultListener);
		((Button) findViewById(R.id.buttonProp)).setOnClickListener(mPropListener);
		((CheckBox) findViewById(R.id.checkBeep)).setOnClickListener(mCheckBeepListener);
		((CheckBox) findViewById(R.id.checkVibrate)).setOnClickListener(mCheckVibrateListener);
		((Button) findViewById(R.id.button_camera)).setOnClickListener(mCaptureListener);

		String strcfg = new android.ptdriver.PTDriver().GetConfig("barcode");
		chFlashLED = (CheckBox) findViewById(R.id.checkFlashLED);
		chPreview = (CheckBox) findViewById(R.id.checkPreview);
		if (!strcfg.equals("70")) {
			chFlashLED.setVisibility(View.GONE);
			chPreview.setVisibility(View.GONE);
		} else {
			chFlashLED.setOnClickListener(mCheckLEDListener);
			chPreview.setOnClickListener(mCheckPreviewListener);

		}

		// init beepMode and vibrateMode by reading setting db
		getDeviceSetting();

		if (strcfg.equals("70")) {
			chFlashLED.setChecked(flashLEDMode);
			chPreview.setChecked(previewMode);
			SetFlashMode(flashLEDMode);
			setPreviewMode(previewMode);
		}
		// ui items
		tvStat = (TextView) findViewById(R.id.textStatus);
		tvData = (TextView) findViewById(R.id.textDecode);
		chBeep = (CheckBox) findViewById(R.id.checkBeep);
		chBeep.setChecked(beepMode);
		setBeepMode(beepMode);

		chVibrate = (CheckBox) findViewById(R.id.checkVibrate);
		chVibrate.setChecked(vibrateMode);
		setVibrateMode(vibrateMode);

		buttonCodeParam = (Button) findViewById(R.id.buttonCodeParam);
		buttonDfl = (Button) findViewById(R.id.buttonDfl);
		buttonProp = (Button) findViewById(R.id.buttonProp);

		buttonCamera = (Button) findViewById(R.id.button_camera);

		registerReceiver(intentBarcodeDataReceiver, intentFilter);
	}

	//-----------------------------------------------------
	@Override
	protected void onPause() {

		DisableScanner();
		super.onPause();
	}

	@Override
	protected void onDestroy() {
		unregisterReceiver(intentBarcodeDataReceiver);
		super.onDestroy();

	}

	// ------------------------------------------------------
	// Called when the activity is about to start interacting with the user.
	@Override
	protected void onResume() {
		super.onResume();
		EnableScanner();

	}

	private void setBeepMode(boolean beepMode) {
		Intent BeepSoundIntent = new Intent();
		BeepSoundIntent.setAction(com.hht.emdk.datawedge.SOFTSCANTRIGGER);
		if (beepMode)
			BeepSoundIntent.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.ENABLE_BEEP);
		else
			BeepSoundIntent.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.DISABLE_BEEP);
		app.sendBroadcast(BeepSoundIntent);
	}

	// Beep Setting
	OnClickListener mCheckBeepListener = new OnClickListener() {
		public void onClick(View v) {
			beepMode = ((CheckBox) v).isChecked();
			setBeepMode(beepMode);
		}
	};

	private void setVibrateMode(boolean vibrateMode) {
		Intent VibrateIntent = new Intent();
		VibrateIntent.setAction(com.hht.emdk.datawedge.SOFTSCANTRIGGER);
		if (vibrateMode)
			VibrateIntent.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.ENABLE_VIBRATE);
		else
			VibrateIntent.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.DISABLE_VIBRATE);
		app.sendBroadcast(VibrateIntent);
	}

	// Vibrate Setting
	OnClickListener mCheckVibrateListener = new OnClickListener() {
		public void onClick(View v) {
			vibrateMode = ((CheckBox) v).isChecked();
			setVibrateMode(vibrateMode);
		}
	};

	private void SetFlashMode(boolean flashLEDMode) {
		Intent i = new Intent();
		i.setAction(com.hht.emdk.datawedge.SCANNERINPUTPLUGIN);
		if (flashLEDMode)
			i.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.ENABLE_SDC_FLASH);
		else
			i.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.DISABLE_SDC_FLASH);
		app.sendBroadcast(i);
	}

	// Flash mode setting
	OnClickListener mCheckLEDListener = new OnClickListener() {
		public void onClick(View v) {
			flashLEDMode = ((CheckBox) v).isChecked();
			SetFlashMode(flashLEDMode);
		}
	};

	private void setPreviewMode(boolean previewMode) {
		Intent i = new Intent();
		i.setAction(com.hht.emdk.datawedge.SCANNERINPUTPLUGIN);
		if (previewMode)
			i.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.ENABLE_SDC_PREVIEW);
		else
			i.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.DISABLE_SDC_PREVIEW);
		app.sendBroadcast(i);
	}

	// Preview Setting
	OnClickListener mCheckPreviewListener = new OnClickListener() {
		public void onClick(View v) {
			previewMode = ((CheckBox) v).isChecked();
			setPreviewMode(previewMode);
		}
	};

	// Decode
	OnClickListener mDecodeListener = new OnClickListener() {
		public void onClick(View v) {
			StopScanner();
			StartScanner();
		}
	};

	// Decoder Setting
	OnClickListener mCodeSettingListener = new OnClickListener() {
		public void onClick(View v) {
			Intent myIntent = new Intent(SDLguiActivity.this, CodeSetting.class);
			SDLguiActivity.this.startActivity(myIntent);

		}
	};

	// Default Setting
	OnClickListener mDefaultListener = new OnClickListener() {
		public void onClick(View v) {
			Intent i = new Intent();
			i.setAction(com.hht.emdk.datawedge.SCANNERINPUTPLUGIN);
			i.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.SET_DEFAULT_SETTING);
			app.sendBroadcast(i);
		}
		/*
		public void onClick(View v) {
		    // Send a message using content of the edit text widget
		   
		    if(mTriggerThread!=null)
		    {	
		    	if(mTriggerThread.isAlive())
		    	{	
		    		mTriggerThread.interrupt();
		    	}
		    }
		}
		*/
	};

	// ------------------------------------------------------
	// callback for properties button press
	OnClickListener mPropListener = new OnClickListener() {

		public void onClick(View v) {
			doGetProp();
		}

		/*
		public void onClick(View v)
		{
		if(mTriggerThread!=null)
		{	
			if(mTriggerThread.isAlive())
			{	
				mTriggerThread.interrupt();
			}
		}
			 mTriggerThread= new TriggerThread();
			 mTriggerThread.start();
			 mTriggerThread.setPriority(mTriggerThread.MAX_PRIORITY);
		
		}
		*/
	};

	// ----------------------------------------
	// get properties
	private void doGetProp() {
		String s = "Version 2.8\r\nCopyright 2017\t\t";
		AlertDialog.Builder dlg = new AlertDialog.Builder(this);
		if (dlg != null) {
			dlg.setTitle("HHT ScanDemo");
			dlg.setMessage(s);
			dlg.setPositiveButton("ok", null);
			dlg.show();
		}
	}

	// ----------------------------------------
	// display status string
	private void dspStat(String s) {
		tvStat.setText(s);
	}

	// ----------------------------------------
	// display status resource id
	private void dspStat(int id) {
		tvStat.setText("  ");
		tvStat.setText(id);
	}

	// ----------------------------------------
	// display error msg
	private void dspErr(String s) {
		tvStat.setText("ERROR " + s);
	}

	// ----------------------------------------
	// display status string
	private void dspData(String s) {
		tvData.setText("  ");
		tvData.setText(s);
	}

	// ----------------------------------------
	// start a decode session
	/*
	private void doDecode()
	{		
		StopScanner();
		StartScanner();
		dspData("");
		dspStat(R.string.decoding);	
	}
	*/
	// ----------------------------------------
	// 
	public void onDecodeComplete(int symbology, int length, String Barcode) {
		if (length > 0) {
			++decodes;
			dspStat("[" + decodes + "] type: " + symbology + " len: " + length);
			dspData(Barcode);
		} else // no-decode
		{
			dspData("");
		}
	}

	public static void StartScanner() {
		Intent scannerIntent = new Intent();
		scannerIntent.setAction(com.hht.emdk.datawedge.SOFTSCANTRIGGER);
		scannerIntent.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.START_SCANNING);
		app.sendBroadcast(scannerIntent);
	}

	public static void StopScanner() {
		Intent scannerIntent = new Intent();
		scannerIntent.setAction(com.hht.emdk.datawedge.SOFTSCANTRIGGER);
		scannerIntent.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.STOP_SCANNING);
		app.sendBroadcast(scannerIntent);
	}

	public static void DisableScanner() {
		Intent TriggerButtonIntent = new Intent();
		TriggerButtonIntent.setAction(com.hht.emdk.datawedge.SOFTSCANTRIGGER);
		TriggerButtonIntent.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.DISABLE_TRIGGERBUTTON);
		app.sendBroadcast(TriggerButtonIntent);

		Intent i = new Intent();
		i.setAction(com.hht.emdk.datawedge.SCANNERINPUTPLUGIN);
		i.putExtra(EXTRA_PARAMETER, "DISABLE_PLUGIN");
		app.sendBroadcast(i);

	}

	public static void EnableScanner() {
		Intent i = new Intent();
		i.setAction(com.hht.emdk.datawedge.SCANNERINPUTPLUGIN);
		i.putExtra(EXTRA_PARAMETER, "ENABLE_PLUGIN");
		app.sendBroadcast(i);

		Intent TriggerButtonIntent = new Intent();
		TriggerButtonIntent.setAction(com.hht.emdk.datawedge.SOFTSCANTRIGGER);
		TriggerButtonIntent.putExtra(EXTRA_PARAMETER, com.hht.emdk.datawedge.ENABLE_TRIGGERBUTTON);
		app.sendBroadcast(TriggerButtonIntent);

		/*
		Intent MultipleIntents = new Intent();
		MultipleIntents.setAction(com.hht.emdk.datawedge.SCANNERINPUTPLUGIN);
		String[] MultipleStr = new String[] {	com.hht.emdk.datawedge.DISABLE_CODE39,
												com.hht.emdk.datawedge.DISABLE_CODABAR,
												com.hht.emdk.datawedge.DISABLE_CODE128,
												com.hht.emdk.datawedge.DISABLE_EAN128	};
		MultipleIntents.putExtra(com.hht.emdk.datawedge.EXTRA_PARAMETERS, MultipleStr);
		app.sendBroadcast(MultipleIntents);
		*/
	}

	private class BarcodeDataBroadcastReceiver extends BroadcastReceiver {
		@Override
		public void onReceive(Context arg0, Intent arg1) {
			String Barcode = arg1.getStringExtra(com.hht.emdk.datawedge.DATA_STRING);
			int type = arg1.getIntExtra(com.hht.emdk.datawedge.DATA_TYPE, 0);
			int length = arg1.getIntExtra(com.hht.emdk.datawedge.DATA_LENGTH, 0);
			onDecodeComplete(type, length, Barcode);
		}
	}

	/// cpk:: for testing 

	public static class TriggerThread extends Thread {

		private boolean runnable = false;

		@Override
		public void run() {

			super.run();

			while (!isInterrupted()) {

				// soft trigger
				StopScanner();
				StartScanner();

				try {
					Thread.sleep(2000);
				} catch (InterruptedException ex) {
					Thread.currentThread().interrupt();
				}

			}
		}

		public void setRun(boolean run) {
			runnable = run;
		}

	}

	private void getDeviceSetting() {
		ContentResolver cr = getContentResolver();
		Cursor c = cr.query(CONTENT_URI, null, null, null, null);
		int numCol = c.getColumnCount();
		int numRow = c.getCount();
		String name;
		String enable;
		c.moveToFirst();
		while (numRow > 0) {
			name = c.getString(c.getColumnIndex("scanner_name"));
			enable = c.getString(c.getColumnIndex("scanner_para"));
			{
				if (name.equals(PROPERTY_DEVICE_BEEP))
					beepMode = enable.equals("enabled") ? true : false;

				else if (name.equals(PROPERTY_DEVICE_VIBRATE))
					vibrateMode = enable.equals("enabled") ? true : false;

				else if (name.equals(PROPERTY_SCANNER_SDC_PreviewMode))
					previewMode = enable.equals("enabled") ? true : false;
				else if (name.equals(PROPERTY_SCANNER_SDC_FlashMode))
					flashLEDMode = enable.equals("enabled") ? true : false;
			}
			c.moveToNext();
			numRow--;
		}

	}

}//end-class

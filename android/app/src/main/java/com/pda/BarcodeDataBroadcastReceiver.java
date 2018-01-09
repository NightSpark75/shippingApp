package com.pda;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

public class BarcodeDataBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context arg0, Intent arg1) {
        String Barcode = arg1.getStringExtra(datawedge.DATA_STRING);
        int type = arg1.getIntExtra(datawedge.DATA_TYPE, 0);
        int length = arg1.getIntExtra(datawedge.DATA_LENGTH, 0);
        
        Intent i = new Intent("ScanerGetBarcode");
        i.putExtra("barcode", Barcode);
        arg0.sendBroadcast(i);
    }
}
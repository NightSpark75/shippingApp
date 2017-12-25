package com.test;

import java.util.ArrayList;
import java.util.Arrays;
import android.app.Activity;
import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

public class CodeSetting extends Activity {

    private ListView mainListView;
    public Symbology[] decoders;
    private ArrayAdapter<Symbology> listAdapter;

    boolean bCODE39Enabled = false;
    boolean bC39_Cnv32_Enabled = false;
    boolean bC39_C32Prefix_Enabled = false;
    boolean bC39_ChkVerify_Enabled = false;
    boolean bC39_TxChkDgt_Enabled = false;
    boolean bC39_FullASCII_Enabled = false;

    boolean bCODABAREnabled = false;
    boolean bCB_CLSI_Enabled = false;
    boolean bCB_NOTIS_Enabled = false;

    boolean bCODE128Enabled = false;

    boolean bD25Enabled = false;
    boolean bI25Enabled = false;
    boolean bI25_CnvEAN13_Enabled = false;
    boolean bI25_ChkVerify_Enabled = false;
    boolean bI25_TxChkDgt_Enabled = false;

    boolean bNEC25Enabled = false;
    boolean bS25IATAEnabled = false;
    boolean bS25INDUSTRIALEnabled = false;

    boolean bCODE93Enabled = false;

    boolean bUPCAEnabled = false;
    boolean bUPCA_TxChkDgt_Enabled = false;
    boolean bUPCA_Preamble_Sys_Country_Enabled = false;

    boolean bUPCEEnabled = false;
    boolean bUPCE_TxChkDgt_Enabled = false;
    boolean bUPCE_Preamble_Enabled = false;
    boolean bUPCE_CnvUPCA_Enabled = false;

    boolean bUPCE1Enabled = false;
    boolean bUPCE1_TxChkDgt_Enabled = false;
    boolean bUPCE1_Preamble_Enabled = false;
    boolean bUPCE1_CnvUPCA_Enabled = false;

    boolean bEAN8Enabled = false;
    boolean bEAN8ZeroExtendEnabled = false;

    boolean bEAN13Enabled = false;
    boolean bEAN13SuppEnabled = false;
    boolean bCODE11Enabled = false;
    boolean bC11_ChkVerify_Enabled = false;
    boolean bC11_TxChkDgt_Enabled = false;

    boolean bMSIEnabled = false;
    boolean bMSI_TxChkDgt_Enabled = false;

    boolean bEAN128Enabled = false;

    boolean bTRIOPTICEnabled = false;
    boolean bISBT_128Enabled = false;
    boolean bISBT_CONCATEnabled = false;
    boolean bISBT_TABLEEnabled = false;

    boolean bRSS_14Enabled = false;
    boolean bRSS_LIMEnabled = false;
    boolean bRSS_EXPEnabled = false;
    boolean bRSS_TO_UPC_Enabled = false;

    boolean bCHINAEnabled = false;

    boolean bBOOKLANDISBNEnabled = false;
    boolean bBOOKLANDEnabled = false;

    boolean bUCC_ExtCodeEnabled = false;
    boolean bISSNEANEnabled = false;

    boolean bCOMPOSITE_CCC_Enabled = false;
    boolean bCOMPOSITE_CCAB_Enabled = false;
    boolean bCOMPOSITE_TLC39_REDUNEnabled = false;
    boolean bCOMPOSITE_RSS_Enabled = false;
    ////
    boolean bKOREANEnabled = false;
    boolean bMATRIXEnabled = false;
    boolean bMATRIX_REDUNEnabled = false;
    boolean bMATRIX_ChkVerifyEnabled = false;
    boolean bMATRIX_TxChkDgtEnabled = false;

    boolean bUS_POSTNETEnabled = false;
    boolean bUS_PLANETEnabled = false;
    boolean bUS_TxChkDgtEnabled = false;
    boolean bUK_POSTALEnabled = false;
    boolean bUK_TxChkDgtEnabled = false;

    boolean bJAPANEnabled = false;
    boolean bAUSTRALIAEnabled = false;
    boolean bKIXCODEEnabled = false;
    boolean bONECODEEnabled = false;
    boolean bUPUFICSEnabled = false;

    boolean bPDF417Enabled = false;
    boolean bMICROPDF417Enabled = false;
    boolean bCODE128EMLEnabled = false;
    boolean bDATAMATRIXEnabled = false;
    boolean bMAXICODEEnabled = false;
    boolean bQRCODEEnabled = false;
    boolean bMICROQREnabled = false;
    boolean bAZTECEnabled = false;
    boolean bHANXINEnabled = false;

    static String PROPERTY_PREF_SETTING = "com.hht.property";

    static String PROPERTY_SCANNER_CODE128 = "Scanner_CODE128";
    static String PROPERTY_SCANNER_CODE39 = "Scanner_CODE39";
    static String PROPERTY_SCANNER_CODE39_C32_PREFIX = "Scanner_CODE39_C32_PREFIX";
    static String PROPERTY_SCANNER_CODE39_CODE32 = "Scanner_CODE39_CODE32";
    static String PROPERTY_SCANNER_CODE39_FULL_ASCII = "Scanner_CODE39_FULL_ASCII";
    static String PROPERTY_SCANNER_CODE39_REPORT_CHECK_DIGIT = "Scanner_CODE39_REPORT_CHECK_DIGIT";
    static String PROPERTY_SCANNER_CODE39_VERIFY_CHECK_DIGIT = "Scanner_CODE39_VERIFY_CHECK_DIGIT";

    static String PROPERTY_SCANNER_CODABAR = "Scanner_CODABAR";
    static String PROPERTY_SCANNER_CODABAR_CLSI = "Scanner_CODABAR_CLSI";
    static String PROPERTY_SCANNER_CODABAR_NOTIS = "Scanner_CODABAR_NOTIS";

    static String PROPERTY_SCANNER_D25 = "Scanner_D25";
    static String PROPERTY_SCANNER_I25 = "Scanner_I25";
    static String PROPERTY_SCANNER_I25_EAN13 = "Scanner_I25_EAN13";
    static String PROPERTY_SCANNER_I25_REPORT_CHECK_DIGIT = "Scanner_I25_REPORT_CHECK_DIGIT";
    static String PROPERTY_SCANNER_I255_VERIFY_CHECK_DIGIT = "Scanner_I25_VERIFY_CHECK_DIGIT";

    static String PROPERTY_SCANNER_CODE93 = "Scanner_CODE93";

    static String PROPERTY_SCANNER_UPCA = "Scanner_UPCA";
    static String PROPERTY_SCANNER_UPCA_REPORT_CHECK_DIGIT = "Scanner_UPCA_REPORT_CHECK_DIGIT";
    static String PROPERTY_SCANNER_UPCA_PREAMBLE = "Scanner_UPCA_PREAMBLE";
    static String PROPERTY_SCANNER_UPCA_PREAMBLE_COUNTRY_SYS = "Scanner_UPCA_PREAMBLE_COUNTRY_SYS";

    static String PROPERTY_SCANNER_UPCE = "Scanner_UPCE";
    static String PROPERTY_SCANNER_UPCE_REPORT_CHECK_DIGIT = "Scanner_UPCE_REPORT_CHECK_DIGIT";
    //static String PROPERTY_SCANNER_UPCE_PREAMBLE = "Scanner_UPCE_PREAMBLE";
    static String PROPERTY_SCANNER_UPCE_TO_UPCA = "Scanner_UPCE_TO_UPCA";

    static String PROPERTY_SCANNER_UPCE1 = "Scanner_UPCE1";
    static String PROPERTY_SCANNER_UPCE1_REPORT_CHECK_DIGIT = "Scanner_UPCE1_REPORT_CHECK_DIGIT";
    //static String PROPERTY_SCANNER_UPCE1_PREAMBLE = "Scanner_UPCE1_PREAMBLE";
    static String PROPERTY_SCANNER_UPCE1_TO_UPCA = "Scanner_UPCE1_TO_UPCA";

    static String PROPERTY_SCANNER_EAN8 = "Scanner_EAN8";
    static String PROPERTY_SCANNER_EAN8_ZERO_EXTEND = "Scanner_EAN8_ZERO_EXTEND";

    static String PROPERTY_SCANNER_EAN13 = "Scanner_EAN13";
    static String PROPERTY_SCANNER_EAN13_SUPP = "Scanner_EAN13_SUPP";
    static String PROPERTY_SCANNER_EAN128 = "Scanner_EAN128";
    //	static String PROPERTY_SCANNER_BOOKLANDISBN = "Scanner_BOOKLANDISBN";
    static String PROPERTY_SCANNER_BOOKLAND = "Scanner_BOOKLAND";
    static String PROPERTY_SCANNER_ISSNEAN = "Scanner_ISSNEAN";
    static String PROPERTY_SCANNER_TRIOPTIC = "Scanner_TRIOPTIC";

    static String PROPERTY_SCANNER_UCC_EXT_CODE = "Scanner_UCC_EXT_CODE";

    static String PROPERTY_SCANNER_ISBT_128 = "Scanner_ISBT_128";
    static String PROPERTY_SCANNER_ISBT_128_CONCAT = "Scanner_ISBT_128_CONCAT";
    static String PROPERTY_SCANNER_ISBT_128_CHECK_TABLE = "Scanner_ISBT_128_CHECK_TABLE";

    static String PROPERTY_SCANNER_CODE11 = "Scanner_CODE11";
    static String PROPERTY_SCANNER_CODE11_REPORT_CHECK_DIGIT = "Scanner_CODE11_REPORT_CHECK_DIGIT";
    static String PROPERTY_SCANNER_CODE11_VERIFY_CHECK_DIGIT = "Scanner_CODE11_VERIFY_CHECK_DIGIT";

    static String PROPERTY_SCANNER_MSI = "Scanner_MSI";
    static String PROPERTY_SCANNER_MSI_REPORT_CHECK_DIGIT = "Scanner_MSI_REPORT_CHECK_DIGIT";

    static String PROPERTY_SCANNER_RSS_14 = "Scanner_RSS_14";
    static String PROPERTY_SCANNER_RSS_14_LIMITED = "Scanner_RSS_14_LIMITED";
    static String PROPERTY_SCANNER_RSS_14_EXPANDED = "Scanner_RSS_14_EXPANDED";
    static String PROPERTY_SCANNER_RSS_14_TO_UPC = "Scanner_RSS_14_TO_UPC";

    static String PROPERTY_SCANNER_COMPOSITE_CCC = "Scanner_RSS_COMPOSITE_CCC";
    static String PROPERTY_SCANNER_COMPOSITE_CCAB = "Scanner_RSS_COMPOSITE_CCAB";
    static String PROPERTY_SCANNER_COMPOSITE_TLC39 = "Scanner_RSS_COMPOSITE_TLC39";
    static String PROPERTY_SCANNER_COMPOSITE_RSS = "Scanner_RSS_COMPOSITE_RSS";

    static String PROPERTY_SCANNER_CHINA = "Scanner_CHINA";
    static String PROPERTY_SCANNER_KOREAN = "Scanner_KOREAN";
    static String PROPERTY_SCANNER_MATRIX = "Scanner_MATRIX";

    static String PROPERTY_SCANNER_MATRIX_DEDUN = "Scanner_MATRIX_REDUN";
    static String PROPERTY_SCANNER_MATRIX_REPORT_CHECK_DIGIT = "Scanner_MATRIX_REPORT_CHECK_DIGIT";
    static String PROPERTY_SCANNER_MATRIX_VERIFY_CHECK_DIGIT = "Scanner_MATRIX_VERIFY_CHECK_DIGIT";

    static String PROPERTY_SCANNER_US_POSTNET = "Scanner_US_POSTNET";
    static String PROPERTY_SCANNER_US_PLANET = "Scanner_US_PLANET";
    static String PROPERTY_SCANNER_US_POSTAL_REPORT_CHECK_DIGIT = "Scanner_US_POSTAL_REPORT_CHECK_DIGIT";
    static String PROPERTY_SCANNER_UK_POSTAL = "Scanner_UK_POSTAL";
    static String PROPERTY_SCANNER_UK_POSTAL_REPORT_CHECK_DIGIT = "Scanner_UK_POSTAL_REPORT_CHECK_DIGIT";

    static String PROPERTY_SCANNER_JAPAN = "Scanner_JAPAN";
    static String PROPERTY_SCANNER_AUSTRALIA = "Scanner_RSS_AUSTRALIA";
    static String PROPERTY_SCANNER_KIXCODE = "Scanner_KIXCODE";
    static String PROPERTY_SCANNER_ONECODE = "Scanner_ONECODE";
    static String PROPERTY_SCANNER_UPUFICS = "Scanner_UPUFICS";

    static String PROPERTY_SCANNER_PDF417 = "Scanner_PDF417";
    static String PROPERTY_SCANNER_MICROPDF417 = "Scanner_MICROPDF417";
    static String PROPERTY_SCANNER_CODE128EML = "Scanner_CODE128EML";
    static String PROPERTY_SCANNER_DATAMATRIX = "Scanner_DATAMATRIX";
    static String PROPERTY_SCANNER_MAXICODE = "Scanner_MAXICODE";
    static String PROPERTY_SCANNER_QRCODE = "Scanner_QRCODE";
    static String PROPERTY_SCANNER_MICROQR = "Scanner_MICROQR";
    static String PROPERTY_SCANNER_AZTEC = "Scanner_AZTEC";
    static String PROPERTY_SCANNER_HANXIN = "Scanner_HANXIN";
    // for N431x
    static String PROPERTY_SCANNER_NEC25 = "Scanner_NEC25";
    static String PROPERTY_SCANNER_S25IATA = "Scanner_S25IATA";
    static String PROPERTY_SCANNER_S25INDUSTRIAL = "Scanner_S25INDUSTRIAL";

    static final String PROVIDER_NAME = "com.oem.startup.ScannerParaProvider";
    static final String URL = "content://" + PROVIDER_NAME + "/settings";
    // URI for data sharing with other application
    // content://<package name>.provider.<custom content provider>/<table name>
    static final Uri CONTENT_URI = Uri.parse(URL);

    //------------------------------------------------------
    // Called with the activity is first created.
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        CodeSettingScreen_SE4500();
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDLguiActivity.EnableScanner();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDLguiActivity.DisableScanner();
    }

    private void setupEnable() {
        ContentResolver cr = getContentResolver();
        Cursor c = cr.query(CONTENT_URI, null, null, null, null);
        int numRow = c.getCount();
        String name;
        String enable;
        c.moveToFirst();

        while (numRow > 0) {
            name = c.getString(c.getColumnIndex("scanner_name"));
            enable = c.getString(c.getColumnIndex("scanner_para"));

            {

                if (name.equals(PROPERTY_SCANNER_CODE128))
                    bCODE128Enabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_CODE39))
                    bCODE39Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_CODE39_C32_PREFIX))
                    bC39_C32Prefix_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_CODE39_CODE32))
                    bC39_Cnv32_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_CODE39_FULL_ASCII))
                    bC39_FullASCII_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_CODE39_REPORT_CHECK_DIGIT))
                    bC39_TxChkDgt_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_CODE39_VERIFY_CHECK_DIGIT))
                    bC39_ChkVerify_Enabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_CODABAR))
                    bCODABAREnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_CODABAR_CLSI))
                    bCB_CLSI_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_CODABAR_NOTIS))
                    bCB_NOTIS_Enabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_D25))
                    bD25Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_I25))
                    bI25Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_I25_EAN13))
                    bI25_CnvEAN13_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_I25_REPORT_CHECK_DIGIT))
                    bI25_TxChkDgt_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_I255_VERIFY_CHECK_DIGIT))
                    bI25_ChkVerify_Enabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_CODE93))
                    bCODE93Enabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_UPCA))
                    bUPCAEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_UPCA_REPORT_CHECK_DIGIT))
                    bUPCA_TxChkDgt_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_UPCA_PREAMBLE_COUNTRY_SYS))
                    bUPCA_Preamble_Sys_Country_Enabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_UPCE))
                    bUPCEEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_UPCE_REPORT_CHECK_DIGIT))
                    bUPCE_TxChkDgt_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_UPCE_TO_UPCA))
                    bUPCE_CnvUPCA_Enabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_UPCE1))
                    bUPCE1Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_UPCE1_REPORT_CHECK_DIGIT))
                    bUPCE1_TxChkDgt_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_UPCE1_TO_UPCA))
                    bUPCE1_CnvUPCA_Enabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_EAN8))
                    bEAN8Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_EAN8_ZERO_EXTEND))
                    bEAN8ZeroExtendEnabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_EAN13))
                    bEAN13Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_EAN13_SUPP))
                    bEAN13SuppEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_EAN128))
                    bEAN128Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_BOOKLAND))
                    bBOOKLANDEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_ISSNEAN))
                    bISSNEANEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_TRIOPTIC))
                    bTRIOPTICEnabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_UCC_EXT_CODE))
                    bUCC_ExtCodeEnabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_ISBT_128))
                    bISBT_128Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_ISBT_128_CONCAT))
                    bISBT_CONCATEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_ISBT_128_CHECK_TABLE))
                    bISBT_TABLEEnabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_CODE11))
                    bCODE11Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_CODE11_REPORT_CHECK_DIGIT))
                    bC11_TxChkDgt_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_CODE11_VERIFY_CHECK_DIGIT))
                    bC11_ChkVerify_Enabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_MSI))
                    bMSIEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_MSI_REPORT_CHECK_DIGIT))
                    bMSI_TxChkDgt_Enabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_RSS_14))
                    bRSS_14Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_RSS_14_LIMITED))
                    bRSS_LIMEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_RSS_14_EXPANDED))
                    bRSS_EXPEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_RSS_14_TO_UPC))
                    bRSS_TO_UPC_Enabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_COMPOSITE_CCC))
                    bCOMPOSITE_CCC_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_COMPOSITE_CCAB))
                    bCOMPOSITE_CCAB_Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_COMPOSITE_TLC39))
                    bCOMPOSITE_TLC39_REDUNEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_COMPOSITE_RSS))
                    bCOMPOSITE_RSS_Enabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_CHINA))
                    bCHINAEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_KOREAN))
                    bKOREANEnabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_MATRIX))
                    bMATRIXEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_MATRIX_DEDUN))
                    bMATRIX_REDUNEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_MATRIX_REPORT_CHECK_DIGIT))
                    bMATRIX_ChkVerifyEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_MATRIX_VERIFY_CHECK_DIGIT))
                    bMATRIX_TxChkDgtEnabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_US_POSTNET))
                    bUS_POSTNETEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_US_PLANET))
                    bUS_PLANETEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_US_POSTAL_REPORT_CHECK_DIGIT))
                    bUS_TxChkDgtEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_UK_POSTAL))
                    bUK_POSTALEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_UK_POSTAL_REPORT_CHECK_DIGIT))
                    bUK_TxChkDgtEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_JAPAN))
                    bJAPANEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_AUSTRALIA))
                    bAUSTRALIAEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_KIXCODE))
                    bKIXCODEEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_ONECODE))
                    bONECODEEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_UPUFICS))
                    bUPUFICSEnabled = enable.equals("enabled") ? true : false;

                else if (name.equals(PROPERTY_SCANNER_PDF417))
                    bPDF417Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_MICROPDF417))
                    bMICROPDF417Enabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_CODE128EML))
                    bCODE128EMLEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_DATAMATRIX))
                    bDATAMATRIXEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_MAXICODE))
                    bMAXICODEEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_QRCODE))
                    bQRCODEEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_MICROQR))
                    bMICROQREnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_AZTEC))
                    bAZTECEnabled = enable.equals("enabled") ? true : false;
                else if (name.equals(PROPERTY_SCANNER_HANXIN))
                    bHANXINEnabled = enable.equals("enabled") ? true : false;
            }

            c.moveToNext();
            numRow--;
        }

    }

    public void CodeSettingScreen_SE4500() {

        setContentView(R.layout.codemenu);

        //Find the ListView resource.
        mainListView = (ListView) this.findViewById(R.id.mainListView);

        // When item is tapped, toggle checked properties of CheckBox and Decoders.
        mainListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            public void onItemClick(AdapterView<?> parent, View item, int position, long id) {
                Symbology decoder = listAdapter.getItem(position);
                decoder.toggleChecked();
                SymbologyViewHolder viewHolder = (SymbologyViewHolder) item.getTag();
                viewHolder.getCheckBox().setChecked(decoder.isChecked());
            }
        });

        setupEnable();

        if (decoders == null) {
            decoders = new Symbology[] {
                    new Symbology(this, "CODE39", bCODE39Enabled, PROPERTY_SCANNER_CODE39,
                            com.hht.emdk.datawedge.ENABLE_CODE39, com.hht.emdk.datawedge.DISABLE_CODE39),
                    new Symbology(this, "CODE39 - CODE32 Prefix", bC39_C32Prefix_Enabled,
                            PROPERTY_SCANNER_CODE39_C32_PREFIX, com.hht.emdk.datawedge.ENABLE_CODE32_PREFIX,
                            com.hht.emdk.datawedge.DISABLE_CODE32_PREFIX),
                    new Symbology(this, "CODE39 - Cnvt to CODE32", bC39_Cnv32_Enabled, PROPERTY_SCANNER_CODE39_CODE32,
                            com.hht.emdk.datawedge.ENABLE_CNVT_CODE39_TO_32,
                            com.hht.emdk.datawedge.DISABLE_CNVT_CODE39_TO_32),
                    new Symbology(this, "CODE39 - Full ASCII", bC39_FullASCII_Enabled,
                            PROPERTY_SCANNER_CODE39_FULL_ASCII, com.hht.emdk.datawedge.ENABLE_CODE39_FULL_ASCII,
                            com.hht.emdk.datawedge.DISABLE_CODE39_FULL_ASCII),
                    new Symbology(this, "CODE39 - Report Check Digit", bC39_TxChkDgt_Enabled,
                            PROPERTY_SCANNER_CODE39_REPORT_CHECK_DIGIT,
                            com.hht.emdk.datawedge.ENABLE_CODE39_REPORT_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_CODE39_REPORT_CHK_DGT),
                    new Symbology(this, "CODE39 - Verify Check Digit", bC39_ChkVerify_Enabled,
                            PROPERTY_SCANNER_CODE39_VERIFY_CHECK_DIGIT,
                            com.hht.emdk.datawedge.ENABLE_CODE39_VER_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_CODE39_VER_CHK_DGT),

                    new Symbology(this, "CODABAR", bCODABAREnabled, PROPERTY_SCANNER_CODABAR,
                            com.hht.emdk.datawedge.ENABLE_CODABAR, com.hht.emdk.datawedge.DISABLE_CODABAR),
                    new Symbology(this, "CODABAR - CLSI", bCB_CLSI_Enabled, PROPERTY_SCANNER_CODABAR_CLSI,
                            com.hht.emdk.datawedge.ENABLE_CODABAR_CLSI, com.hht.emdk.datawedge.DISABLE_CODABAR_CLSI),
                    new Symbology(this, "CODABAR - NOTIS", bCB_NOTIS_Enabled, PROPERTY_SCANNER_CODABAR_NOTIS,
                            com.hht.emdk.datawedge.ENABLE_CODABAR_NOTIS, com.hht.emdk.datawedge.DISABLE_CODABAR_NOTIS),

                    new Symbology(this, "CODE128", bCODE128Enabled, PROPERTY_SCANNER_CODE128,
                            com.hht.emdk.datawedge.ENABLE_CODE128, com.hht.emdk.datawedge.DISABLE_CODE128),

                    new Symbology(this, "D25", bD25Enabled, PROPERTY_SCANNER_D25, com.hht.emdk.datawedge.ENABLE_D25,
                            com.hht.emdk.datawedge.DISABLE_D25),
                    new Symbology(this, "I25", bI25Enabled, PROPERTY_SCANNER_I25, com.hht.emdk.datawedge.ENABLE_I25,
                            com.hht.emdk.datawedge.DISABLE_I25),
                    new Symbology(this, "I25 - Cnvt to EAN13", bI25_CnvEAN13_Enabled, PROPERTY_SCANNER_I25_EAN13,
                            com.hht.emdk.datawedge.ENABLE_CNVT_I25_TO_EAN13,
                            com.hht.emdk.datawedge.DISABLE_CNVT_I25_TO_EAN13),
                    new Symbology(this, "I25 - Report Check Digit", bI25_TxChkDgt_Enabled,
                            PROPERTY_SCANNER_I25_REPORT_CHECK_DIGIT, com.hht.emdk.datawedge.ENABLE_I25_REPORT_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_I25_REPORT_CHK_DGT),
                    new Symbology(this, "I25 - Verify Check Digit", bI25_ChkVerify_Enabled,
                            PROPERTY_SCANNER_I255_VERIFY_CHECK_DIGIT, com.hht.emdk.datawedge.ENABLE_I25_VER_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_I25_VER_CHK_DGT),

                    new Symbology(this, "CODE93", bCODE93Enabled, PROPERTY_SCANNER_CODE93,
                            com.hht.emdk.datawedge.ENABLE_CODE93, com.hht.emdk.datawedge.DISABLE_CODE93),

                    new Symbology(this, "UPCA", bUPCAEnabled, PROPERTY_SCANNER_UPCA, com.hht.emdk.datawedge.ENABLE_UPCA,
                            com.hht.emdk.datawedge.DISABLE_UPCA),
                    new Symbology(this, "UPCA - Report Check Digit", bUPCA_TxChkDgt_Enabled,
                            PROPERTY_SCANNER_UPCA_REPORT_CHECK_DIGIT, com.hht.emdk.datawedge.ENABLE_UPCA_REPORT_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_UPCA_REPORT_CHK_DGT),
                    //this one has 3 state. In our sample, we only toggle between Sys and Sys+Country state
                    new Symbology(this, "UPCA - Preamble Sys & Country", bUPCA_Preamble_Sys_Country_Enabled,
                            PROPERTY_SCANNER_UPCA_PREAMBLE_COUNTRY_SYS,
                            com.hht.emdk.datawedge.ENABLE_UPCA_PREAMBLE_COUNTSYS,
                            com.hht.emdk.datawedge.ENABLE_UPCA_PREAMBLE),

                    new Symbology(this, "UPCE", bUPCEEnabled, PROPERTY_SCANNER_UPCE, com.hht.emdk.datawedge.ENABLE_UPCE,
                            com.hht.emdk.datawedge.DISABLE_UPCE),
                    new Symbology(this, "UPCE - Report Check Digit", bUPCE_TxChkDgt_Enabled,
                            PROPERTY_SCANNER_UPCE_REPORT_CHECK_DIGIT, com.hht.emdk.datawedge.ENABLE_UPCE_REPORT_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_UPCE_REPORT_CHK_DGT),
                    new Symbology(this, "UPCE - Cnvt to UPCA", bUPCE_CnvUPCA_Enabled, PROPERTY_SCANNER_UPCE_TO_UPCA,
                            com.hht.emdk.datawedge.ENABLE_CNVT_UPCE_TO_UPCA,
                            com.hht.emdk.datawedge.DISABLE_CNVT_UPCE_TO_UPCA),

                    new Symbology(this, "UPCE1", bUPCE1Enabled, PROPERTY_SCANNER_UPCE1,
                            com.hht.emdk.datawedge.ENABLE_UPCE1, com.hht.emdk.datawedge.DISABLE_UPCE1),
                    new Symbology(this, "UPCE1 - Report Check Digit", bUPCE1_TxChkDgt_Enabled,
                            PROPERTY_SCANNER_UPCE1_REPORT_CHECK_DIGIT,
                            com.hht.emdk.datawedge.ENABLE_UPCE1_REPORT_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_UPCE1_REPORT_CHK_DGT),
                    new Symbology(this, "UPCE1 - Cnvt to UPCA", bUPCE1_CnvUPCA_Enabled, PROPERTY_SCANNER_UPCE1_TO_UPCA,
                            com.hht.emdk.datawedge.ENABLE_CNVT_UPCE1_TO_UPCA,
                            com.hht.emdk.datawedge.DISABLE_CNVT_UPCE1_TO_UPCA),

                    new Symbology(this, "EAN8", bEAN8Enabled, PROPERTY_SCANNER_EAN8, com.hht.emdk.datawedge.ENABLE_EAN8,
                            com.hht.emdk.datawedge.DISABLE_EAN8),
                    new Symbology(this, "EAN8 - Zero Extend", bEAN8ZeroExtendEnabled, PROPERTY_SCANNER_EAN8_ZERO_EXTEND,
                            com.hht.emdk.datawedge.ENABLE_EAN8_ZEROEXTEND,
                            com.hht.emdk.datawedge.DISABLE_EAN8_ZEROEXTEND),

                    new Symbology(this, "EAN13", bEAN13Enabled, PROPERTY_SCANNER_EAN13,
                            com.hht.emdk.datawedge.ENABLE_EAN13, com.hht.emdk.datawedge.DISABLE_EAN13),
                    new Symbology(this, "EAN13 Supplementals", bEAN13SuppEnabled, PROPERTY_SCANNER_EAN13_SUPP,
                            com.hht.emdk.datawedge.ENABLE_EAN13_SUPP, com.hht.emdk.datawedge.DISABLE_EAN13_SUPP),
                    new Symbology(this, "EAN128", bEAN128Enabled, PROPERTY_SCANNER_EAN128,
                            com.hht.emdk.datawedge.ENABLE_EAN128, com.hht.emdk.datawedge.DISABLE_EAN128),
                    new Symbology(this, "Bookland EAN", bBOOKLANDEnabled, PROPERTY_SCANNER_BOOKLAND,
                            com.hht.emdk.datawedge.ENABLE_BOOKLAND_EAN, com.hht.emdk.datawedge.DISABLE_BOOKLAND_EAN),

                    new Symbology(this, "UCC Ext Code", bUCC_ExtCodeEnabled, PROPERTY_SCANNER_UCC_EXT_CODE,
                            com.hht.emdk.datawedge.ENABLE_UCC_EXT_CODE, com.hht.emdk.datawedge.DISABLE_UCC_EXT_CODE),

                    new Symbology(this, "ISSN EAN", bISSNEANEnabled, PROPERTY_SCANNER_ISSNEAN,
                            com.hht.emdk.datawedge.ENABLE_ISSN_EAN, com.hht.emdk.datawedge.DISABLE_ISSN_EAN),
                    new Symbology(this, "TRIOPTIC", bTRIOPTICEnabled, PROPERTY_SCANNER_TRIOPTIC,
                            com.hht.emdk.datawedge.ENABLE_TRIOPTIC, com.hht.emdk.datawedge.DISABLE_TRIOPTIC),

                    new Symbology(this, "ISBT", bISBT_128Enabled, PROPERTY_SCANNER_ISBT_128,
                            com.hht.emdk.datawedge.ENABLE_ISBT_128, com.hht.emdk.datawedge.DISABLE_ISBT_128),
                    new Symbology(this, "ISBT CONCATENATION", bISBT_CONCATEnabled, PROPERTY_SCANNER_ISBT_128_CONCAT,
                            com.hht.emdk.datawedge.ENABLE_ISBT_CONCAT, com.hht.emdk.datawedge.DISABLE_ISBT_128),
                    new Symbology(this, "CHECK ISBT TABLE", bISBT_TABLEEnabled, PROPERTY_SCANNER_ISBT_128_CHECK_TABLE,
                            com.hht.emdk.datawedge.ENABLE_ISBT_TABLE, com.hht.emdk.datawedge.DISABLE_ISBT_TABLE),

                    new Symbology(this, "CODE11", bCODE11Enabled, PROPERTY_SCANNER_CODE11,
                            com.hht.emdk.datawedge.ENABLE_CODE11, com.hht.emdk.datawedge.DISABLE_CODE11),
                    new Symbology(this, "CODE11 - Report Check Digit", bC11_TxChkDgt_Enabled,
                            PROPERTY_SCANNER_CODE11_REPORT_CHECK_DIGIT,
                            com.hht.emdk.datawedge.ENABLE_CODE11_REPORT_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_CODE11_REPORT_CHK_DGT),
                    new Symbology(this, "CODE11 - Verify Check Digit", bC11_ChkVerify_Enabled,
                            PROPERTY_SCANNER_CODE11_VERIFY_CHECK_DIGIT,
                            com.hht.emdk.datawedge.ENABLE_CODE11_VER_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_CODE11_VER_CHK_DGT),

                    new Symbology(this, "MSI", bMSIEnabled, PROPERTY_SCANNER_MSI, com.hht.emdk.datawedge.ENABLE_MSI,
                            com.hht.emdk.datawedge.DISABLE_MSI),
                    new Symbology(this, "MSI - Report Check Digit", bMSI_TxChkDgt_Enabled,
                            PROPERTY_SCANNER_MSI_REPORT_CHECK_DIGIT, com.hht.emdk.datawedge.ENABLE_MSI_REPORT_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_MSI_REPORT_CHK_DGT),

                    new Symbology(this, "RSS 14", bRSS_14Enabled, PROPERTY_SCANNER_RSS_14,
                            com.hht.emdk.datawedge.ENABLE_RSS_14, com.hht.emdk.datawedge.DISABLE_RSS_14),
                    new Symbology(this, "RSS LIM", bRSS_LIMEnabled, PROPERTY_SCANNER_RSS_14_LIMITED,
                            com.hht.emdk.datawedge.ENABLE_RSS_LIM, com.hht.emdk.datawedge.DISABLE_RSS_LIM),
                    new Symbology(this, "RSS EXP", bRSS_EXPEnabled, PROPERTY_SCANNER_RSS_14_EXPANDED,
                            com.hht.emdk.datawedge.ENABLE_RSS_EXP, com.hht.emdk.datawedge.DISABLE_RSS_EXP),
                    new Symbology(this, "RSS To UPC/EAN", bRSS_TO_UPC_Enabled, PROPERTY_SCANNER_RSS_14_TO_UPC,
                            com.hht.emdk.datawedge.ENABLE_RSS_TO_UPC, com.hht.emdk.datawedge.DISABLE_RSS_TO_UPC),

                    new Symbology(this, "COMPOSITE CC-C", bCOMPOSITE_CCC_Enabled, PROPERTY_SCANNER_COMPOSITE_CCC,
                            com.hht.emdk.datawedge.ENABLE_COMPOSITE_CCC, com.hht.emdk.datawedge.DISABLE_COMPOSITE_CCC),
                    new Symbology(this, "COMPOSITE CC-A/B", bCOMPOSITE_CCAB_Enabled, PROPERTY_SCANNER_COMPOSITE_CCAB,
                            com.hht.emdk.datawedge.ENABLE_COMPOSITE_CCAB,
                            com.hht.emdk.datawedge.DISABLE_COMPOSITE_CCAB),
                    new Symbology(this, "COMPOSITE TLC-39", bCOMPOSITE_TLC39_REDUNEnabled,
                            PROPERTY_SCANNER_COMPOSITE_TLC39, com.hht.emdk.datawedge.ENABLE_COMPOSITE_TLC39,
                            com.hht.emdk.datawedge.DISABLE_COMPOSITE_TLC39),
                    new Symbology(this, "RSS Emu for UCC COMPOSITE", bCOMPOSITE_RSS_Enabled,
                            PROPERTY_SCANNER_COMPOSITE_RSS, com.hht.emdk.datawedge.ENABLE_COMPOSITE_RSS,
                            com.hht.emdk.datawedge.DISABLE_COMPOSITE_RSS),

                    new Symbology(this, "CHINESE 2 of 5", bCHINAEnabled, PROPERTY_SCANNER_CHINA,
                            com.hht.emdk.datawedge.ENABLE_CHINA, com.hht.emdk.datawedge.DISABLE_CHINA),
                    new Symbology(this, "KOREAN 3 of 5", bKOREANEnabled, PROPERTY_SCANNER_KOREAN,
                            com.hht.emdk.datawedge.ENABLE_KOREAN35, com.hht.emdk.datawedge.DISABLE_KOREAN35),
                    new Symbology(this, "MATRIX 2 of 5", bMATRIXEnabled, PROPERTY_SCANNER_MATRIX,
                            com.hht.emdk.datawedge.ENABLE_MATRIX25, com.hht.emdk.datawedge.DISABLE_MATRIX25),
                    new Symbology(this, "MATRIX REDUN", bMATRIX_REDUNEnabled, PROPERTY_SCANNER_MATRIX_DEDUN,
                            com.hht.emdk.datawedge.ENABLE_MATRIX25_REDUN,
                            com.hht.emdk.datawedge.DISABLE_MATRIX25_REDUN),
                    new Symbology(this, "MATRIX  - Verify Check Digit", bMATRIX_ChkVerifyEnabled,
                            PROPERTY_SCANNER_MATRIX_VERIFY_CHECK_DIGIT,
                            com.hht.emdk.datawedge.ENABLE_MATRIX25_VER_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_MATRIX25_VER_CHK_DGT),
                    new Symbology(this, "MATRIX  - Report Check Digit", bMATRIX_TxChkDgtEnabled,
                            PROPERTY_SCANNER_MATRIX_REPORT_CHECK_DIGIT, com.hht.emdk.datawedge.ENABLE_MATRIX25_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_MATRIX25_CHK_DGT),

                    new Symbology(this, "US POSTNET", bUS_POSTNETEnabled, PROPERTY_SCANNER_US_POSTNET,
                            com.hht.emdk.datawedge.ENABLE_US_POSTNET, com.hht.emdk.datawedge.DISABLE_US_POSTNET),
                    new Symbology(this, "US PLANET", bUS_PLANETEnabled, PROPERTY_SCANNER_US_PLANET,
                            com.hht.emdk.datawedge.ENABLE_US_PLANET, com.hht.emdk.datawedge.DISABLE_US_PLANET),
                    new Symbology(this, "US POSTAL - Report Check Digit", bUS_TxChkDgtEnabled,
                            PROPERTY_SCANNER_US_POSTAL_REPORT_CHECK_DIGIT,
                            com.hht.emdk.datawedge.ENABLE_US_POSTAL_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_US_POSTAL_CHK_DGT),

                    new Symbology(this, "UK POSTAL", bUK_POSTALEnabled, PROPERTY_SCANNER_UK_POSTAL,
                            com.hht.emdk.datawedge.ENABLE_UK_POSTAL, com.hht.emdk.datawedge.DISABLE_UK_POSTAL),
                    new Symbology(this, "UK POSTAL  - Report Check Digit", bUK_TxChkDgtEnabled,
                            PROPERTY_SCANNER_UK_POSTAL_REPORT_CHECK_DIGIT,
                            com.hht.emdk.datawedge.ENABLE_UK_POSTAL_CHK_DGT,
                            com.hht.emdk.datawedge.DISABLE_UK_POSTAL_CHK_DGT),

                    new Symbology(this, "JAPAN POSTAL", bJAPANEnabled, PROPERTY_SCANNER_JAPAN,
                            com.hht.emdk.datawedge.ENABLE_JAPAN_POSTAL, com.hht.emdk.datawedge.DISABLE_JAPAN_POSTAL),
                    new Symbology(this, "AUSTRALIA POSTAL", bAUSTRALIAEnabled, PROPERTY_SCANNER_AUSTRALIA,
                            com.hht.emdk.datawedge.ENABLE_AUSTRALIA_POST,
                            com.hht.emdk.datawedge.DISABLE_AUSTRALIA_POST),
                    new Symbology(this, "NETHERLAND KIX CODE ", bKIXCODEEnabled, PROPERTY_SCANNER_KIXCODE,
                            com.hht.emdk.datawedge.ENABLE_KIX_CODE, com.hht.emdk.datawedge.DISABLE_KIX_CODE),
                    new Symbology(this, "ONE CODE", bONECODEEnabled, PROPERTY_SCANNER_ONECODE,
                            com.hht.emdk.datawedge.ENABLE_ONE_CODE, com.hht.emdk.datawedge.DISABLE_ONE_CODE),
                    new Symbology(this, "UPU FICS POSTAL", bUPUFICSEnabled, PROPERTY_SCANNER_UPUFICS,
                            com.hht.emdk.datawedge.ENABLE_UPU_FICS_POSTAL,
                            com.hht.emdk.datawedge.DISABLE_UPU_FICS_POSTAL),

                    //// 2D	    				    				    				    				 
                    new Symbology(this, "PDF417", bPDF417Enabled, PROPERTY_SCANNER_PDF417,
                            com.hht.emdk.datawedge.ENABLE_PDF417, com.hht.emdk.datawedge.DISABLE_PDF417),
                    new Symbology(this, "MicroPDF417", bMICROPDF417Enabled, PROPERTY_SCANNER_MICROPDF417,
                            com.hht.emdk.datawedge.ENABLE_MICROPDF417, com.hht.emdk.datawedge.DISABLE_MICROPDF417),
                    new Symbology(this, "CODE128 EML", bCODE128EMLEnabled, PROPERTY_SCANNER_CODE128EML,
                            com.hht.emdk.datawedge.ENABLE_CODE128EML, com.hht.emdk.datawedge.DISABLE_CODE128EML),
                    new Symbology(this, "DATA MATRIX", bDATAMATRIXEnabled, PROPERTY_SCANNER_DATAMATRIX,
                            com.hht.emdk.datawedge.ENABLE_DATAMATRIX, com.hht.emdk.datawedge.DISABLE_DATAMATRIX),
                    new Symbology(this, "MAXICODE", bMAXICODEEnabled, PROPERTY_SCANNER_MAXICODE,
                            com.hht.emdk.datawedge.ENABLE_MAXICODE, com.hht.emdk.datawedge.DISABLE_MAXICODE),
                    new Symbology(this, "QR CODE", bQRCODEEnabled, PROPERTY_SCANNER_QRCODE,
                            com.hht.emdk.datawedge.ENABLE_QRCODE, com.hht.emdk.datawedge.DISABLE_QRCODE),
                    new Symbology(this, "Micro QR", bMICROQREnabled, PROPERTY_SCANNER_MICROQR,
                            com.hht.emdk.datawedge.ENABLE_MICROQR, com.hht.emdk.datawedge.DISABLE_MICROQR),
                    new Symbology(this, "AZTEC", bAZTECEnabled, PROPERTY_SCANNER_AZTEC,
                            com.hht.emdk.datawedge.ENABLE_AZTEC, com.hht.emdk.datawedge.DISABLE_AZTEC),
                    new Symbology(this, "HAN XIN", bHANXINEnabled, PROPERTY_SCANNER_HANXIN,
                            com.hht.emdk.datawedge.ENABLE_HAN_XIN, com.hht.emdk.datawedge.DISABLE_HAN_XIN),

            };
        }

        ArrayList<Symbology> decoderList = new ArrayList<Symbology>();
        decoderList.addAll(Arrays.asList(decoders));

        // Set our custom array adapter as the ListView's adapter.
        listAdapter = new SymbologyArrayAdapter(this, decoderList);
        mainListView.setAdapter(listAdapter);
    }

}

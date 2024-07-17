/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.92906253410455, "KoPercent": 0.0709374658954491};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5427059364933272, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-534"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/all_data-556"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523"], "isController": false}, {"data": [0.9885714285714285, 500, 1500, "go_laptops/catalog/fetchImage-535"], "isController": false}, {"data": [0.9892857142857143, 500, 1500, "checkout/app/order/views/orderPayment-page.html-650"], "isController": false}, {"data": [0.9885714285714285, 500, 1500, "go_laptops/catalog/fetchImage-536"], "isController": false}, {"data": [0.4831081081081081, 500, 1500, "checkout/accountservice/ws/GetAccountByIdRequest-645"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets "], "isController": true}, {"data": [0.9886363636363636, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521"], "isController": false}, {"data": [0.9993103448275862, 500, 1500, "go_home/services.properties-352"], "isController": false}, {"data": [0.9978386167146974, 500, 1500, "go_home/app/views/home-page.html-358"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-641"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart"], "isController": true}, {"data": [0.9972413793103448, 500, 1500, "go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353"], "isController": false}, {"data": [0.9914285714285714, 500, 1500, "go_headphones/catalog/fetchImage-527"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-581"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now/order/api/v1/carts/142175287-654"], "isController": false}, {"data": [0.0, 500, 1500, "checkout/order/api/v1/carts/142175287-647"], "isController": false}, {"data": [0.9857142857142858, 500, 1500, "checkout/order/api/v1/shippingcost/-648"], "isController": false}, {"data": [0.92, 500, 1500, "go_home/-349"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-537"], "isController": false}, {"data": [0.9942857142857143, 500, 1500, "go_laptops/catalog/fetchImage-538"], "isController": false}, {"data": [0.9942857142857143, 500, 1500, "go_headphones/catalog/fetchImage-528"], "isController": false}, {"data": [0.9714285714285714, 500, 1500, "go_laptops/catalog/fetchImage-539"], "isController": false}, {"data": [0.0, 500, 1500, "sign_in"], "isController": true}, {"data": [0.9857142857142858, 500, 1500, "go_headphones/catalog/fetchImage-529"], "isController": false}, {"data": [0.9943181818181818, 500, 1500, "go_tablets/catalog/fetchImage-517"], "isController": false}, {"data": [0.0, 500, 1500, "go_home"], "isController": true}, {"data": [0.0, 500, 1500, "go_home/catalog/api/v1/deals/search-356"], "isController": false}, {"data": [0.9971590909090909, 500, 1500, "go_tablets/catalog/fetchImage-515"], "isController": false}, {"data": [0.9971590909090909, 500, 1500, "go_tablets/catalog/fetchImage-514"], "isController": false}, {"data": [0.9943181818181818, 500, 1500, "go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets/catalog/api/v1/categories/3/products-513"], "isController": false}, {"data": [0.9971428571428571, 500, 1500, "go_mice/catalog/fetchImage-547"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now"], "isController": true}, {"data": [0.9971428571428571, 500, 1500, "go_mice/catalog/fetchImage-549"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-546"], "isController": false}, {"data": [0.0055147058823529415, 500, 1500, "sign_out/accountservice/ws/AccountLogoutRequest-361"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522"], "isController": false}, {"data": [1.0, 500, 1500, "go_mini/app/views/product-page.html-643"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-579"], "isController": false}, {"data": [0.9964285714285714, 500, 1500, "checkout/accountservice/ws/GetCountriesRequest-651"], "isController": false}, {"data": [0.9955882352941177, 500, 1500, "go_speakers/app/views/category-page.html-639"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-637"], "isController": false}, {"data": [0.0, 500, 1500, "go_home/catalog/api/v1/categories-355"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini"], "isController": true}, {"data": [0.0, 500, 1500, "go_headphones/catalog/api/v1/categories/2/products-526"], "isController": false}, {"data": [0.5033783783783784, 500, 1500, "checkout/accountservice/ws/GetAccountByIdNewRequest-646"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice/catalog/api/v1/categories/5/products-545"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-638"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/products/24-580"], "isController": false}, {"data": [0.9885714285714285, 500, 1500, "go_mice/catalog/fetchImage-551"], "isController": false}, {"data": [0.9971428571428571, 500, 1500, "go_mice/catalog/fetchImage-550"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/products/3-557"], "isController": false}, {"data": [0.9914285714285714, 500, 1500, "go_mice/catalog/fetchImage-553"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-552"], "isController": false}, {"data": [0.5035714285714286, 500, 1500, "checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now/order/api/v1/orders/users/142175287-653"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518"], "isController": false}, {"data": [0.9857142857142858, 500, 1500, "go_mice/catalog/fetchImage-555"], "isController": false}, {"data": [0.9942857142857143, 500, 1500, "go_mice/catalog/fetchImage-554"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers"], "isController": true}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-642"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops"], "isController": true}, {"data": [0.9803921568627451, 500, 1500, "go_mini/app/views/product-page.html-582"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/1/products-558"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "pay_now/accountservice/ws/UpdateSafePayMethodRequest-652"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops/catalog/api/v1/categories/1/products-533"], "isController": false}, {"data": [0.0, 500, 1500, "checkout"], "isController": true}, {"data": [0.127, 500, 1500, "sign_in/accountservice/ws/AccountLoginRequest-359"], "isController": false}, {"data": [0.9971590909090909, 500, 1500, "go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519"], "isController": false}, {"data": [0.0055147058823529415, 500, 1500, "sign_out"], "isController": true}, {"data": [0.98, 500, 1500, "go_laptops/catalog/fetchImage-544"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-577"], "isController": false}, {"data": [0.9828571428571429, 500, 1500, "go_laptops/catalog/fetchImage-541"], "isController": false}, {"data": [0.9771428571428571, 500, 1500, "go_laptops/catalog/fetchImage-542"], "isController": false}, {"data": [1.0, 500, 1500, "go_home/app/tempFiles/popularProducts.json-357"], "isController": false}, {"data": [0.0, 500, 1500, "sign_in/order/api/v1/carts/142175287-360"], "isController": false}, {"data": [0.9971590909090909, 500, 1500, "go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524"], "isController": false}, {"data": [0.9914285714285714, 500, 1500, "go_laptops/catalog/fetchImage-543"], "isController": false}, {"data": [0.9971590909090909, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525"], "isController": false}, {"data": [1.0, 500, 1500, "go_headphones/catalog/fetchImage-530"], "isController": false}, {"data": [0.9971428571428571, 500, 1500, "go_special_offer/app/views/product-page.html-559"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/products/24-640"], "isController": false}, {"data": [0.8586206896551725, 500, 1500, "go_home/accountservice/ws/GetAccountConfigurationRequest-354"], "isController": false}, {"data": [0.9057142857142857, 500, 1500, "go_headphones/catalog/fetchImage-531"], "isController": false}, {"data": [1.0, 500, 1500, "go_speakers/app/views/category-page.html-578"], "isController": false}, {"data": [0.0, 500, 1500, "go_headphones "], "isController": true}, {"data": [0.0, 500, 1500, "go_special_offer"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-576"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18326, 13, 0.0709374658954491, 6739.954490887284, 117, 82730, 255.0, 22589.3, 29398.649999999998, 47518.22999999998, 15.126615034003105, 157.33919823745342, 11.631385442108463], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["go_laptops/catalog/fetchImage-534", 175, 0, 0.0, 139.44000000000005, 122, 483, 125.0, 144.8, 244.2, 391.0400000000011, 0.17750116897198423, 4.717261953816225, 0.09499085995766343], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/all_data-556", 175, 0, 0.0, 35430.80000000002, 23065, 51141, 34526.0, 44957.0, 47381.0, 49500.16000000002, 0.17304442495359937, 2.529935565363329, 0.08584625769182469], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523", 176, 0, 0.0, 225.03409090909085, 180, 376, 224.5, 249.3, 264.15, 373.68999999999994, 0.157856169709733, 0.12847886184804727, 0.22984721585665224], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-535", 175, 0, 0.0, 167.21714285714296, 124, 1203, 128.0, 245.0, 359.59999999999997, 1200.72, 0.1775002687861213, 6.753801033546029, 0.09499037821757272], "isController": false}, {"data": ["checkout/app/order/views/orderPayment-page.html-650", 140, 0, 0.0, 135.4285714285715, 118, 752, 121.0, 128.9, 135.95, 741.3400000000001, 0.1411135268402968, 0.1890700769774289, 0.06518232245650428], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-536", 175, 0, 0.0, 163.73142857142855, 122, 1258, 126.0, 244.8, 323.3999999999995, 1146.2800000000013, 0.1775009889340812, 5.048240053922265, 0.0949907636092544], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdRequest-645", 148, 0, 0.0, 1066.3445945945941, 627, 2360, 1032.5, 1346.7, 1490.85, 2001.3199999999933, 0.14565481187401647, 0.2707875112193571, 0.16585303773935858], "isController": false}, {"data": ["go_tablets ", 178, 0, 0.0, 21708.80337078654, 11846, 31395, 21424.0, 27645.899999999998, 28386.749999999996, 31372.09, 0.15452891253316292, 17.90296788158875, 3.6347629663213787], "isController": true}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521", 176, 0, 0.0, 233.13068181818184, 183, 1285, 219.0, 242.60000000000002, 262.75, 747.5399999999929, 0.15785149761608364, 0.12776998968359743, 0.4006406663126966], "isController": false}, {"data": ["go_home/services.properties-352", 725, 0, 0.0, 125.2427586206896, 117, 781, 120.0, 126.0, 132.69999999999993, 278.74, 0.6056849168582581, 0.8150720853815231, 0.2649871511254879], "isController": false}, {"data": ["go_home/app/views/home-page.html-358", 694, 0, 0.0, 126.00144092219026, 118, 707, 121.0, 126.5, 131.0, 205.39999999999964, 0.5965238304393905, 1.5740306541476887, 0.2673871466520315], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-641", 162, 0, 0.0, 38368.8827160494, 24182, 54298, 37826.5, 48038.900000000016, 49773.549999999996, 53321.50000000001, 0.14443587537502062, 2.1115910625844214, 0.07165373504932664], "isController": false}, {"data": ["go_mice", 175, 0, 0.0, 21454.788571428566, 13482, 30206, 20975.0, 26883.8, 27610.8, 29593.440000000006, 0.17318005084566293, 30.12502258298788, 0.9203572624043922], "isController": true}, {"data": ["add_to_cart", 211, 1, 0.47393364928909953, 47344.88151658767, 24871, 75773, 45881.0, 62130.4, 64901.39999999999, 74717.56, 0.19625807471758835, 0.1606623186821875, 0.14281084901382643], "isController": true}, {"data": ["go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353", 725, 0, 0.0, 139.12965517241352, 121, 959, 124.0, 161.0, 242.69999999999993, 306.18000000000006, 0.6056869408882963, 4.124991586956177, 0.30166048813772567], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-527", 175, 0, 0.0, 142.96, 121, 1066, 124.0, 141.4, 242.2, 684.4800000000046, 0.17863613860122798, 3.0133125392361517, 0.09559824604831342], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/4/products-581", 51, 0, 0.0, 19185.37254901961, 11694, 28411, 19194.0, 23984.000000000004, 26417.8, 28411.0, 0.05048125462744834, 0.11883838704720295, 0.024402559609948173], "isController": false}, {"data": ["pay_now/order/api/v1/carts/142175287-654", 132, 0, 0.0, 15902.356060606056, 2282, 45674, 14557.5, 29168.200000000004, 35038.44999999999, 44984.95999999998, 0.13648235345207296, 0.08182600141341952, 0.0891707327034466], "isController": false}, {"data": ["checkout/order/api/v1/carts/142175287-647", 148, 0, 0.0, 26027.641891891893, 2538, 53611, 25273.0, 38728.49999999999, 46885.54999999998, 53022.50999999999, 0.14404187336188867, 0.10076715223620142, 0.0751345952082719], "isController": false}, {"data": ["checkout/order/api/v1/shippingcost/-648", 140, 0, 0.0, 246.7357142857142, 138, 905, 167.0, 399.9, 416.9, 893.9300000000001, 0.14106518319833058, 0.09282986455727196, 0.11827492993342731], "isController": false}, {"data": ["go_home/-349", 725, 0, 0.0, 475.0579310344834, 354, 2001, 363.0, 905.4, 1367.0, 1686.6200000000001, 0.6052384430762808, 1.9907355473233852, 0.32626134822080766], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-537", 175, 0, 0.0, 147.70285714285708, 123, 481, 127.0, 230.00000000000009, 284.3999999999997, 481.0, 0.1774900073125883, 5.835863516776863, 0.09498488672587733], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-538", 175, 0, 0.0, 192.19428571428566, 125, 1149, 131.0, 255.4, 361.4, 678.5600000000056, 0.17749918857513794, 8.743111803252292, 0.09498980013591367], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-528", 175, 0, 0.0, 206.41714285714298, 125, 1336, 137.0, 357.0, 459.7999999999998, 787.2800000000066, 0.1785953020250666, 8.574819894610911, 0.09557639209935205], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-539", 175, 0, 0.0, 371.59999999999997, 238, 1477, 362.0, 490.4, 505.59999999999997, 835.5600000000077, 0.1774698478728464, 5.401187862735693, 0.09497409827570297], "isController": false}, {"data": ["sign_in", 500, 0, 0.0, 24782.736000000008, 2790, 61938, 25036.0, 42496.50000000001, 47259.299999999996, 54470.01, 0.42398356300522944, 0.9240920497994134, 0.7005235296038044], "isController": true}, {"data": ["go_headphones/catalog/fetchImage-529", 175, 0, 0.0, 312.40571428571445, 239, 643, 246.0, 484.4, 491.4, 608.8000000000004, 0.17863668564638918, 6.572722524210374, 0.09559853880295047], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-517", 176, 0, 0.0, 262.08522727272725, 237, 612, 242.5, 326.70000000000044, 396.8000000000005, 570.4199999999994, 0.157805782326649, 4.405054758494389, 0.08445075069824574], "isController": false}, {"data": ["go_home", 725, 0, 0.0, 36394.49655172413, 10645, 52882, 36011.0, 44032.0, 46828.99999999999, 49007.68, 0.5993038156227345, 14.302120781211121, 2.6349800101179013], "isController": true}, {"data": ["go_home/catalog/api/v1/deals/search-356", 712, 0, 0.0, 17955.42556179774, 6989, 29225, 17574.0, 22605.100000000002, 23948.65, 25830.66, 0.5954939840052992, 0.4553231252707741, 0.29309469525260823], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-515", 176, 0, 0.0, 179.21590909090912, 124, 992, 129.0, 247.0, 420.0500000000004, 609.309999999995, 0.15787217018619945, 7.070097675276231, 0.0844862785762083], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-514", 176, 0, 0.0, 197.43750000000006, 122, 1098, 143.5, 254.60000000000002, 354.3, 622.1399999999937, 0.1578560281270741, 5.683288240286473, 0.0844776400523795], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520", 176, 0, 0.0, 225.94318181818184, 183, 579, 224.5, 245.50000000000006, 267.0, 569.7599999999999, 0.15785588654466917, 0.12771310600740307, 0.3130911187228741], "isController": false}, {"data": ["go_tablets/catalog/api/v1/categories/3/products-513", 178, 0, 0.0, 19033.269662921342, 9431, 28806, 18692.5, 24988.399999999998, 25764.1, 28445.760000000002, 0.15452891253316292, 0.31119850220898215, 0.07696264198429015], "isController": false}, {"data": ["go_mice/catalog/fetchImage-547", 175, 0, 0.0, 175.7485714285715, 121, 940, 127.0, 244.0, 263.59999999999997, 585.0800000000042, 0.17733676657313419, 4.91793151323743, 0.09490287898640384], "isController": false}, {"data": ["pay_now", 140, 11, 7.857142857142857, 52142.87142857143, 14084, 96872, 52884.0, 73820.40000000001, 82902.65, 93367.73000000003, 0.13908233475528464, 0.3318369072733107, 0.4866397369530836], "isController": true}, {"data": ["go_mice/catalog/fetchImage-549", 175, 0, 0.0, 134.7257142857143, 120, 855, 123.0, 133.4, 209.7999999999996, 429.4000000000051, 0.17733586805400736, 2.2211317473764427, 0.09490239813827739], "isController": false}, {"data": ["go_mice/catalog/fetchImage-546", 175, 0, 0.0, 126.37142857142855, 120, 239, 123.0, 129.4, 138.39999999999998, 237.48000000000002, 0.17733586805400736, 2.034374911332066, 0.09490239813827739], "isController": false}, {"data": ["sign_out/accountservice/ws/AccountLogoutRequest-361", 272, 0, 0.0, 2654.2058823529396, 1364, 4294, 2541.0, 3517.6000000000004, 3762.75, 4168.279999999997, 0.2382840047481592, 0.2673714076715185, 0.2703964975755479], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522", 176, 0, 0.0, 224.73295454545462, 182, 377, 225.5, 244.3, 259.15, 364.67999999999984, 0.15785716079545659, 0.12602103340158863, 0.367819517244101], "isController": false}, {"data": ["go_mini/app/views/product-page.html-643", 160, 0, 0.0, 173.83125000000004, 118, 435, 122.0, 360.9, 364.9, 410.59999999999945, 0.15250484441169826, 0.4196861831564119, 0.06880589659980918], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-579", 52, 0, 0.0, 34154.80769230768, 17769, 47941, 33901.0, 45235.200000000004, 46803.35, 47941.0, 0.047870631459658405, 0.6996755599598071, 0.023748321075689912], "isController": false}, {"data": ["checkout/accountservice/ws/GetCountriesRequest-651", 140, 0, 0.0, 136.03571428571422, 121, 612, 125.0, 140.8, 148.89999999999998, 540.2500000000006, 0.14111025549019687, 0.6890936639479425, 0.14579555694201982], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-639", 340, 0, 0.0, 226.44705882352946, 118, 729, 124.0, 365.90000000000003, 376.95, 525.7599999999984, 0.29820140698440323, 0.33605900748046996, 0.13483130022829948], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-637", 358, 0, 0.0, 20015.326815642453, 8736, 34155, 19777.0, 26664.500000000004, 28275.500000000004, 33165.89, 0.3043692287810863, 0.7165361695111303, 0.15159014324058007], "isController": false}, {"data": ["go_home/catalog/api/v1/categories-355", 725, 0, 0.0, 17344.817931034486, 8973, 27672, 16787.0, 22865.6, 23919.899999999998, 25722.7, 0.6008101406807304, 4.029755976817844, 0.2839766680561264], "isController": false}, {"data": ["go_mini", 215, 0, 0.0, 75567.87906976747, 21360, 97482, 76946.0, 86691.8, 89341.2, 93239.32, 0.1870051430763303, 3.835144556062837, 0.3560105314881869], "isController": true}, {"data": ["go_headphones/catalog/api/v1/categories/2/products-526", 176, 0, 0.0, 20047.329545454548, 9942, 35078, 19241.5, 27683.200000000008, 32743.0, 35034.11, 0.15481006300593644, 0.686837370599458, 0.07710266809865975], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdNewRequest-646", 148, 0, 0.0, 870.0000000000006, 200, 1500, 852.5, 1078.4999999999995, 1199.3999999999999, 1466.6799999999994, 0.14574761633712605, 0.2611391601072033, 0.1655317166016383], "isController": false}, {"data": ["go_mice/catalog/api/v1/categories/5/products-545", 175, 0, 0.0, 20076.731428571435, 12269, 28622, 19650.0, 25445.2, 26104.199999999997, 28083.160000000007, 0.17338921420008124, 0.5843690629675317, 0.0863559562910561], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-638", 348, 0, 0.0, 17522.87643678162, 7451, 26613, 17499.5, 23072.2, 24224.15, 25777.68, 0.30039050765995795, 0.2886480738537685, 0.14520830204265545], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-580", 53, 0, 0.0, 17707.37735849056, 10601, 24121, 17696.0, 23166.0, 23398.1, 24121.0, 0.048280837790960374, 0.044576507591934, 0.02357462782761737], "isController": false}, {"data": ["go_mice/catalog/fetchImage-551", 175, 0, 0.0, 153.06285714285707, 121, 1152, 124.0, 154.20000000000007, 244.39999999999998, 1060.800000000001, 0.177358154015794, 3.0877431089389527, 0.09491432461001476], "isController": false}, {"data": ["go_mice/catalog/fetchImage-550", 175, 0, 0.0, 188.77714285714285, 120, 577, 124.0, 362.0, 370.59999999999997, 432.6000000000017, 0.177292929456663, 1.9911183207421583, 0.09487941927954233], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/products/3-557", 175, 0, 0.0, 17160.748571428572, 10980, 25064, 16821.0, 22086.0, 23478.6, 24671.080000000005, 0.17500875043752187, 0.1848988933821691, 0.08528258444172208], "isController": false}, {"data": ["go_mice/catalog/fetchImage-553", 175, 0, 0.0, 139.6342857142857, 120, 725, 124.0, 131.8, 240.39999999999998, 623.1600000000012, 0.1773583337640607, 2.971006449319096, 0.09491442080342312], "isController": false}, {"data": ["go_mice/catalog/fetchImage-552", 175, 0, 0.0, 147.88571428571427, 122, 383, 125.0, 241.0, 287.39999999999975, 374.6400000000001, 0.17733784480810524, 4.402465436220697, 0.09490345601058757], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649", 140, 0, 0.0, 871.9642857142856, 446, 1363, 844.0, 1121.4, 1185.4499999999998, 1341.6800000000003, 0.14096504670977514, 0.13394432660997188, 0.16615704236201032], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 140, 11, 7.857142857142857, 36708.62142857144, 13669, 82730, 35584.0, 56210.00000000001, 66840.4, 79209.74000000003, 0.13919752626110474, 0.09356703137661382, 0.22472982319428494], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518", 176, 0, 0.0, 478.93749999999994, 413, 1461, 459.0, 494.1000000000001, 596.2500000000001, 1237.699999999997, 0.1578038014577126, 0.12545482770918195, 0.3401103416183318], "isController": false}, {"data": ["go_mice/catalog/fetchImage-555", 175, 0, 0.0, 167.89142857142855, 122, 1125, 126.0, 242.0, 331.9999999999996, 1109.0400000000002, 0.17735869326168718, 5.359752987797215, 0.09491461319082478], "isController": false}, {"data": ["go_mice/catalog/fetchImage-554", 175, 0, 0.0, 143.96000000000004, 121, 737, 124.0, 200.40000000000003, 243.2, 726.3600000000001, 0.177338204222676, 3.265829493116744, 0.09490364835354144], "isController": false}, {"data": ["go_speakers", 414, 0, 0.0, 37406.681159420266, 13766, 57858, 38179.5, 47438.0, 50714.5, 54306.25000000001, 0.3519800578641612, 1.5335512476375253, 0.4915919395397733], "isController": true}, {"data": ["go_mini/catalog/api/v1/categories/4/products-642", 162, 0, 0.0, 20194.475308641973, 9344, 28733, 19798.0, 26409.700000000004, 27294.3, 28638.5, 0.14732656843682873, 0.3470417782794258, 0.07121743298459983], "isController": false}, {"data": ["go_laptops", 175, 0, 0.0, 22450.45714285715, 12990, 34622, 21692.0, 29909.600000000002, 32038.8, 33504.80000000001, 0.1731987331749802, 69.36473855496585, 1.0133140727063539], "isController": true}, {"data": ["go_mini/app/views/product-page.html-582", 51, 0, 0.0, 222.4117647058823, 119, 641, 123.0, 362.40000000000003, 469.39999999999964, 641.0, 0.05150968836638538, 0.1417522478676504, 0.02323972268092778], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/1/products-558", 175, 0, 0.0, 18268.245714285717, 9847, 26453, 18778.0, 23253.4, 24045.2, 25873.88000000001, 0.17694444247839508, 0.7109177438370251, 0.08553466701836482], "isController": false}, {"data": ["pay_now/accountservice/ws/UpdateSafePayMethodRequest-652", 140, 0, 0.0, 440.57857142857154, 235, 1160, 395.0, 654.1, 735.6999999999997, 1119.0000000000005, 0.14106887889539038, 0.16200879060642487, 0.17893882730700517], "isController": false}, {"data": ["go_laptops/catalog/api/v1/categories/1/products-533", 175, 0, 0.0, 20517.948571428566, 11485, 32842, 19562.0, 28031.0, 30198.199999999997, 31648.040000000015, 0.17350060774784315, 0.6969854408823943, 0.08641143549941406], "isController": false}, {"data": ["checkout", 148, 0, 0.0, 29279.040540540547, 5879, 56123, 28525.5, 41809.59999999999, 49868.09999999998, 55866.729999999996, 0.1436658875057272, 1.689301791977134, 0.8790122324101507], "isController": true}, {"data": ["sign_in/accountservice/ws/AccountLoginRequest-359", 500, 0, 0.0, 1759.6299999999994, 712, 2990, 1710.5, 2327.4, 2571.3999999999996, 2835.8100000000004, 0.4323598894542235, 0.6503081185729702, 0.48887743375381776], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519", 176, 0, 0.0, 226.93181818181824, 183, 589, 229.5, 247.3, 256.15, 364.159999999997, 0.15785078974723243, 0.12589245114473213, 1.0056821799911566], "isController": false}, {"data": ["sign_out", 272, 0, 0.0, 2654.209558823528, 1364, 4294, 2541.0, 3517.6000000000004, 3762.75, 4168.279999999997, 0.2382840047481592, 0.2673714076715185, 0.2703964975755479], "isController": true}, {"data": ["go_laptops/catalog/fetchImage-544", 175, 0, 0.0, 203.6857142857144, 126, 1028, 132.0, 356.0, 476.79999999999995, 960.3600000000008, 0.17747650718120656, 10.81374064001578, 0.09497766204619257], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-577", 54, 0, 0.0, 17520.296296296296, 10607, 25969, 17148.5, 23188.5, 24102.0, 25969.0, 0.04817338135208408, 0.046291608643018296, 0.02328693727468908], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-541", 175, 0, 0.0, 202.68571428571425, 125, 2192, 130.0, 335.80000000000007, 369.4, 1452.5200000000088, 0.1774990085412523, 9.029672707359413, 0.09498970378965454], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-542", 175, 0, 0.0, 185.69714285714295, 124, 1456, 128.0, 246.0, 492.99999999999955, 1386.8400000000008, 0.1774770471470311, 8.934131168721851, 0.09515126844113289], "isController": false}, {"data": ["go_home/app/tempFiles/popularProducts.json-357", 694, 0, 0.0, 126.09365994236302, 118, 478, 121.0, 126.0, 135.0, 249.79999999999563, 0.5965197285577374, 0.5621499395099772, 0.28719162712789503], "isController": false}, {"data": ["sign_in/order/api/v1/carts/142175287-360", 500, 0, 0.0, 23023.10199999999, 1505, 60301, 23253.0, 40590.600000000006, 46322.15, 53180.77, 0.424830131671851, 0.28695449952461505, 0.22155887062308136], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524", 176, 0, 0.0, 225.5397727272728, 178, 517, 229.0, 244.0, 248.15, 365.309999999998, 0.15786155003897206, 0.1264414746802631, 0.36197160106592424], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-543", 175, 0, 0.0, 158.55428571428578, 122, 1128, 126.0, 241.0, 292.1999999999982, 798.160000000004, 0.1774990085412523, 5.093417252751488, 0.09498970378965454], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525", 176, 0, 0.0, 226.94318181818178, 183, 519, 227.5, 248.0, 257.3, 404.2699999999985, 0.1578608420799601, 0.12781083814465077, 0.4029767980439607], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-530", 175, 0, 0.0, 133.00571428571433, 121, 364, 124.0, 134.0, 212.39999999999964, 360.96000000000004, 0.17863613860122798, 2.9613754775326777, 0.09559824604831342], "isController": false}, {"data": ["go_special_offer/app/views/product-page.html-559", 175, 0, 0.0, 145.2971428571428, 119, 602, 121.0, 135.4, 359.0, 479.64000000000146, 0.1800654203395725, 0.49553159620792514, 0.08124045331726806], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-640", 162, 0, 0.0, 18689.376543209877, 10762, 26802, 18741.5, 23286.40000000001, 24117.95, 26691.120000000003, 0.14543391375230272, 0.13430772138497973, 0.07101265319936656], "isController": false}, {"data": ["go_home/accountservice/ws/GetAccountConfigurationRequest-354", 725, 0, 0.0, 435.4344827586213, 127, 1198, 370.0, 712.5999999999999, 802.3999999999999, 959.8800000000001, 0.6055918260974159, 0.9284952802470147, 0.6517208909759301], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-531", 175, 0, 0.0, 342.6057142857142, 129, 1629, 247.0, 652.6000000000004, 799.1999999999994, 1490.6800000000017, 0.17849292811018827, 16.40098206809046, 0.09552160605896794], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-578", 53, 0, 0.0, 142.52830188679243, 118, 365, 121.0, 216.80000000000004, 354.6, 365.0, 0.049233444557567826, 0.055483784198665315, 0.022260825029447175], "isController": false}, {"data": ["go_headphones ", 176, 0, 0.0, 21178.261363636382, 10919, 36077, 20420.5, 29059.9, 34063.0, 36066.99, 0.15481006300593644, 33.03353778459543, 0.4889869077745438], "isController": true}, {"data": ["go_special_offer", 175, 0, 0.0, 71005.09142857145, 51967, 95200, 69206.0, 86172.2, 89947.0, 94942.36, 0.1671866969067595, 3.752733054672916, 0.3206588600828864], "isController": true}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 211, 1, 0.47393364928909953, 47344.88151658767, 24871, 75773, 45881.0, 62130.4, 64901.39999999999, 74717.56, 0.19625807471758835, 0.1606623186821875, 0.14281084901382643], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-576", 56, 0, 0.0, 21290.64285714285, 10609, 34206, 21574.5, 26633.9, 32060.549999999996, 34206.0, 0.04914233462946241, 0.1156563954251119, 0.024475186192408037], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 13, 100.0, 0.0709374658954491], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18326, 13, "500", 13, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now", 10, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 140, 11, "500", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 211, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

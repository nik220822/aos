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

    var data = {"OkPercent": 97.66673147968112, "KoPercent": 2.33326852031888};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4421254370077082, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7316602316602316, 500, 1500, "go_laptops/catalog/fetchImage-534"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/all_data-556"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523"], "isController": false}, {"data": [0.728515625, 500, 1500, "go_laptops/catalog/fetchImage-535"], "isController": false}, {"data": [0.55, 500, 1500, "checkout/app/order/views/orderPayment-page.html-650"], "isController": false}, {"data": [0.754863813229572, 500, 1500, "go_laptops/catalog/fetchImage-536"], "isController": false}, {"data": [0.425, 500, 1500, "checkout/accountservice/ws/GetAccountByIdRequest-645"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets "], "isController": true}, {"data": [0.9981203007518797, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "go_home/services.properties-352"], "isController": false}, {"data": [0.7921092564491654, 500, 1500, "go_home/app/views/home-page.html-358"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-641"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart"], "isController": true}, {"data": [0.7151335311572701, 500, 1500, "go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353"], "isController": false}, {"data": [0.7913533834586466, 500, 1500, "go_headphones/catalog/fetchImage-527"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-581"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now/order/api/v1/carts/142175287-654"], "isController": false}, {"data": [0.0, 500, 1500, "checkout/order/api/v1/carts/142175287-647"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "checkout/order/api/v1/shippingcost/-648"], "isController": false}, {"data": [0.40976331360946744, 500, 1500, "go_home/-349"], "isController": false}, {"data": [0.6718146718146718, 500, 1500, "go_laptops/catalog/fetchImage-537"], "isController": false}, {"data": [0.7784313725490196, 500, 1500, "go_laptops/catalog/fetchImage-538"], "isController": false}, {"data": [0.7650375939849624, 500, 1500, "go_headphones/catalog/fetchImage-528"], "isController": false}, {"data": [0.6447876447876448, 500, 1500, "go_laptops/catalog/fetchImage-539"], "isController": false}, {"data": [0.0, 500, 1500, "sign_in"], "isController": true}, {"data": [0.6917293233082706, 500, 1500, "go_headphones/catalog/fetchImage-529"], "isController": false}, {"data": [0.768796992481203, 500, 1500, "go_tablets/catalog/fetchImage-517"], "isController": false}, {"data": [0.0014792899408284023, 500, 1500, "go_home"], "isController": true}, {"data": [0.0, 500, 1500, "go_home/catalog/api/v1/deals/search-356"], "isController": false}, {"data": [0.8533834586466166, 500, 1500, "go_tablets/catalog/fetchImage-515"], "isController": false}, {"data": [0.8270676691729323, 500, 1500, "go_tablets/catalog/fetchImage-514"], "isController": false}, {"data": [0.9943609022556391, 500, 1500, "go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets/catalog/api/v1/categories/3/products-513"], "isController": false}, {"data": [0.6708860759493671, 500, 1500, "go_mice/catalog/fetchImage-547"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now"], "isController": true}, {"data": [0.654320987654321, 500, 1500, "go_mice/catalog/fetchImage-549"], "isController": false}, {"data": [0.65625, 500, 1500, "go_mice/catalog/fetchImage-546"], "isController": false}, {"data": [0.08169934640522876, 500, 1500, "sign_out/accountservice/ws/AccountLogoutRequest-361"], "isController": false}, {"data": [0.9962406015037594, 500, 1500, "go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522"], "isController": false}, {"data": [0.8958333333333334, 500, 1500, "go_mini/app/views/product-page.html-643"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-579"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/accountservice/ws/GetCountriesRequest-651"], "isController": false}, {"data": [0.6308290155440415, 500, 1500, "go_speakers/app/views/category-page.html-639"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-637"], "isController": false}, {"data": [0.0, 500, 1500, "go_home/catalog/api/v1/categories-355"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini"], "isController": true}, {"data": [0.0, 500, 1500, "go_headphones/catalog/api/v1/categories/2/products-526"], "isController": false}, {"data": [0.5125, 500, 1500, "checkout/accountservice/ws/GetAccountByIdNewRequest-646"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice/catalog/api/v1/categories/5/products-545"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-638"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/products/24-580"], "isController": false}, {"data": [0.7553191489361702, 500, 1500, "go_mice/catalog/fetchImage-551"], "isController": false}, {"data": [0.5653061224489796, 500, 1500, "go_mice/catalog/fetchImage-550"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/products/3-557"], "isController": false}, {"data": [0.703862660944206, 500, 1500, "go_mice/catalog/fetchImage-553"], "isController": false}, {"data": [0.6875, 500, 1500, "go_mice/catalog/fetchImage-552"], "isController": false}, {"data": [0.19166666666666668, 500, 1500, "checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now/order/api/v1/orders/users/142175287-653"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518"], "isController": false}, {"data": [0.728448275862069, 500, 1500, "go_mice/catalog/fetchImage-555"], "isController": false}, {"data": [0.709051724137931, 500, 1500, "go_mice/catalog/fetchImage-554"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers"], "isController": true}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-642"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops"], "isController": true}, {"data": [0.8387096774193549, 500, 1500, "go_mini/app/views/product-page.html-582"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/1/products-558"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "pay_now/accountservice/ws/UpdateSafePayMethodRequest-652"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops/catalog/api/v1/categories/1/products-533"], "isController": false}, {"data": [0.0, 500, 1500, "checkout"], "isController": true}, {"data": [0.0, 500, 1500, "sign_in/accountservice/ws/AccountLoginRequest-359"], "isController": false}, {"data": [0.9962406015037594, 500, 1500, "go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519"], "isController": false}, {"data": [0.08169934640522876, 500, 1500, "sign_out"], "isController": true}, {"data": [0.6936758893280632, 500, 1500, "go_laptops/catalog/fetchImage-544"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-577"], "isController": false}, {"data": [0.7292490118577075, 500, 1500, "go_laptops/catalog/fetchImage-541"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "go_laptops/catalog/fetchImage-542"], "isController": false}, {"data": [0.791350531107739, 500, 1500, "go_home/app/tempFiles/popularProducts.json-357"], "isController": false}, {"data": [0.0, 500, 1500, "sign_in/order/api/v1/carts/142175287-360"], "isController": false}, {"data": [0.9981203007518797, 500, 1500, "go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524"], "isController": false}, {"data": [0.7224409448818898, 500, 1500, "go_laptops/catalog/fetchImage-543"], "isController": false}, {"data": [0.9962406015037594, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525"], "isController": false}, {"data": [0.7951127819548872, 500, 1500, "go_headphones/catalog/fetchImage-530"], "isController": false}, {"data": [0.6397849462365591, 500, 1500, "go_special_offer/app/views/product-page.html-559"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/products/24-640"], "isController": false}, {"data": [0.3854166666666667, 500, 1500, "go_home/accountservice/ws/GetAccountConfigurationRequest-354"], "isController": false}, {"data": [0.6484962406015038, 500, 1500, "go_headphones/catalog/fetchImage-531"], "isController": false}, {"data": [0.4852941176470588, 500, 1500, "go_speakers/app/views/category-page.html-578"], "isController": false}, {"data": [0.0, 500, 1500, "go_headphones "], "isController": true}, {"data": [0.0, 500, 1500, "go_special_offer"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-576"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 20572, 480, 2.33326852031888, 19556.95314019054, 117, 261158, 818.5, 61033.60000000014, 120374.00000000012, 180128.0, 16.682019877001323, 214.7130423980221, 13.72332575040505], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["go_laptops/catalog/fetchImage-534", 259, 0, 0.0, 2867.555984555983, 122, 54820, 239.0, 9298.0, 14660.0, 49823.79999999988, 0.26888725318693685, 7.146598105824264, 0.14389669408832167], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/all_data-556", 221, 7, 3.167420814479638, 72495.45701357466, 13052, 180387, 49701.0, 161256.80000000002, 170759.09999999998, 180376.26, 0.23815502059879284, 3.392501977777766, 0.11814721725018239], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523", 266, 0, 0.0, 227.29699248120306, 183, 371, 231.0, 247.3, 253.64999999999998, 298.9799999999999, 0.2728986038056018, 0.2212882824290233, 0.39735529128335184], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-535", 256, 0, 0.0, 2346.5507812499995, 123, 52887, 250.5, 5860.700000000017, 12440.05, 49180.67000000001, 0.26651758339345594, 10.141317150263342, 0.14262855048790415], "isController": false}, {"data": ["checkout/app/order/views/orderPayment-page.html-650", 120, 0, 0.0, 6718.375, 118, 32243, 296.0, 29030.700000000004, 29391.55, 32164.459999999995, 0.24347240341754098, 0.32621497801647087, 0.11246332696923522], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-536", 257, 0, 0.0, 2263.929961089493, 122, 54000, 245.0, 4918.200000000002, 11029.399999999996, 39811.47999999998, 0.26705321840692886, 7.595553761995314, 0.14291519891308302], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdRequest-645", 120, 0, 0.0, 1196.766666666666, 523, 5124, 1007.0, 1661.8000000000002, 1976.3999999999999, 4945.709999999994, 0.26851404328446377, 0.4990978557475431, 0.30574938913055155], "isController": false}, {"data": ["go_tablets ", 266, 0, 0.0, 32252.048872180458, 20310, 83919, 31901.5, 40235.9, 46890.999999999985, 57248.8699999999, 0.2657674534782066, 31.13890970400899, 6.320801330086175], "isController": true}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521", 266, 0, 0.0, 227.27443609022566, 181, 646, 230.5, 249.0, 256.0, 320.7099999999986, 0.27291568341780725, 0.21848063523433814, 0.6926834582059385], "isController": false}, {"data": ["go_home/services.properties-352", 675, 0, 0.0, 4933.334814814817, 118, 54596, 232.0, 15767.799999999996, 42183.39999999993, 49181.2, 0.562615805086547, 0.7571138470793572, 0.24614441472536433], "isController": false}, {"data": ["go_home/app/views/home-page.html-358", 659, 0, 0.0, 2243.399089529589, 118, 53778, 123.0, 4874.0, 11391.0, 48564.59999999998, 0.5901020455676979, 1.5570917922648277, 0.26450863175348954], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-641", 120, 4, 3.3333333333333335, 151133.80833333332, 41663, 181375, 156153.5, 175286.8, 179128.75, 181171.3, 0.2582900338790428, 3.6732361514838763, 0.12813607149468137], "isController": false}, {"data": ["go_mice", 252, 0, 0.0, 62836.182539682515, 17705, 190597, 39395.0, 168852.9, 180657.0, 189261.88999999998, 0.26118807406962113, 42.50415653094561, 1.310972872457303], "isController": true}, {"data": ["add_to_cart", 151, 137, 90.72847682119205, 177668.21192052978, 109091, 180371, 180125.0, 180129.0, 180134.4, 180366.84, 0.1874733067808226, 0.4968932565323894, 0.13638930407363356], "isController": true}, {"data": ["go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353", 674, 0, 0.0, 3868.9228486646866, 121, 53023, 252.0, 10555.5, 28815.75, 47822.0, 0.5618665975309548, 3.8264942439413856, 0.2798359030671747], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-527", 266, 0, 0.0, 988.4210526315792, 121, 36417, 129.0, 3066.6, 4383.199999999995, 10013.389999999996, 0.2733995590661247, 4.611973452106256, 0.1463114827814808], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/4/products-581", 33, 0, 0.0, 55160.909090909096, 20166, 74875, 57043.0, 66127.8, 69290.39999999998, 74875.0, 0.03561291993568091, 0.08389776663824827, 0.01721522985172075], "isController": false}, {"data": ["pay_now/order/api/v1/carts/142175287-654", 45, 2, 4.444444444444445, 76397.15555555555, 28634, 180366, 66866.0, 163006.0, 175223.49999999994, 180366.0, 0.08832673827020916, 0.061738626583011436, 0.057697984997212806], "isController": false}, {"data": ["checkout/order/api/v1/carts/142175287-647", 120, 4, 3.3333333333333335, 84917.92499999997, 21287, 180132, 80267.5, 122192.6, 138638.59999999992, 180130.53, 0.21508806960249932, 0.17044259187397276, 0.11213005972278733], "isController": false}, {"data": ["checkout/order/api/v1/shippingcost/-648", 120, 0, 0.0, 34214.774999999994, 375, 94585, 34627.5, 65848.90000000001, 69860.85, 93122.13999999994, 0.2437656924164493, 0.16042750281346235, 0.20435611196767667], "isController": false}, {"data": ["go_home/-349", 676, 0, 0.0, 4857.282544378694, 352, 54914, 892.0, 11393.900000000005, 32302.849999999995, 49582.17000000002, 0.5630363316683783, 1.85193570157367, 0.3035117725399851], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-537", 259, 0, 0.0, 3298.4401544401544, 123, 50977, 285.0, 9470.0, 28115.0, 49657.4, 0.2691275383974338, 8.849430903063169, 0.1440252842205017], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-538", 255, 0, 0.0, 1930.7999999999993, 125, 40967, 259.0, 2525.2000000000007, 11796.799999999996, 38835.6, 0.26533975975825985, 13.070127266183643, 0.14199823080813126], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-528", 266, 0, 0.0, 1085.3496240601503, 124, 49729, 249.0, 2443.900000000001, 4162.799999999999, 11043.819999999976, 0.27284709792236167, 13.100323917779168, 0.14601582974751387], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-539", 259, 0, 0.0, 3395.7490347490357, 238, 50638, 472.0, 8486.0, 12535.0, 49797.6, 0.26910852346699055, 8.19056248941489, 0.14401510826163166], "isController": false}, {"data": ["sign_in", 386, 209, 54.145077720207254, 165971.29274611402, 4037, 261158, 184007.0, 186634.9, 195010.65, 218689.98999999993, 0.3386428318261095, 1.1349235002223987, 0.5586102270354539], "isController": true}, {"data": ["go_headphones/catalog/fetchImage-529", 266, 0, 0.0, 1095.451127819548, 238, 11551, 488.5, 2839.9, 4348.949999999991, 8325.23999999999, 0.27339646804653084, 10.059525400176371, 0.14630982860302627], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-517", 266, 0, 0.0, 863.2969924812031, 238, 9612, 402.0, 2195.2, 3505.749999999996, 8000.079999999972, 0.2721957189548503, 7.598607951696516, 0.1456672402219316], "isController": false}, {"data": ["go_home", 676, 0, 0.0, 111066.09467455628, 1270, 242355, 119890.5, 146053.6, 171936.55, 227824.46000000002, 0.5584949057994243, 13.32346678148102, 2.4580378807844707], "isController": true}, {"data": ["go_home/catalog/api/v1/deals/search-356", 663, 0, 0.0, 46364.8310708899, 8345, 97866, 52228.0, 68898.4, 72417.6, 79017.44, 0.5584902735928445, 0.4270404888074506, 0.2748819315339782], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-515", 266, 0, 0.0, 643.8872180451126, 124, 8297, 244.5, 1916.5000000000036, 3801.45, 5748.0299999999925, 0.27289216450678333, 12.221276777223045, 0.14603994741183327], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-514", 266, 0, 0.0, 589.451127819549, 123, 4039, 242.0, 2076.5, 2860.9499999999985, 3894.119999999999, 0.2730061570072778, 9.82959979292329, 0.146100951210926], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520", 266, 0, 0.0, 229.3007518796993, 180, 725, 227.0, 247.0, 256.65, 602.2599999999981, 0.2729140033611514, 0.21985195601621477, 0.5412972078383774], "isController": false}, {"data": ["go_tablets/catalog/api/v1/categories/3/products-513", 266, 0, 0.0, 28091.41729323307, 16619, 76658, 28238.5, 34021.10000000001, 39508.49999999997, 54463.14999999989, 0.26658836051164925, 0.5368586752212132, 0.13277349986420028], "isController": false}, {"data": ["go_mice/catalog/fetchImage-547", 237, 0, 0.0, 4264.987341772154, 122, 54404, 298.0, 13313.200000000015, 33504.899999999994, 41117.22000000001, 0.25399996356118665, 7.044656879339835, 0.1359296679995413], "isController": false}, {"data": ["pay_now", 120, 58, 48.333333333333336, 192369.37499999997, 135869, 327620, 180708.5, 229844.5, 243914.69999999992, 312223.8499999994, 0.1822400952508231, 0.5474855517774484, 0.5699155582925318], "isController": true}, {"data": ["go_mice/catalog/fetchImage-549", 243, 0, 0.0, 5148.806584362137, 120, 56359, 138.0, 27744.399999999994, 37586.19999999999, 51410.520000000004, 0.2604228066076661, 3.2618272595027533, 0.1393668925986338], "isController": false}, {"data": ["go_mice/catalog/fetchImage-546", 240, 0, 0.0, 5825.808333333334, 120, 57009, 219.5, 29133.600000000006, 39172.999999999985, 53651.37000000001, 0.2572463069077065, 2.951136206359236, 0.1376669689310773], "isController": false}, {"data": ["sign_out/accountservice/ws/AccountLogoutRequest-361", 153, 0, 0.0, 5642.169934640523, 707, 22394, 4099.0, 13567.8, 16131.499999999996, 22093.220000000005, 0.15646411551755873, 0.17556373899382324, 0.17755009983535475], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522", 266, 0, 0.0, 227.7819548872182, 184, 549, 229.0, 247.3, 257.5999999999999, 419.81999999999755, 0.2729061633702475, 0.22230735043511093, 0.63589268144669], "isController": false}, {"data": ["go_mini/app/views/product-page.html-643", 120, 0, 0.0, 907.9166666666667, 118, 52731, 133.0, 872.9000000000012, 3415.749999999979, 43175.999999999636, 0.2679133568204043, 0.7372849995311516, 0.12087497153420583], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-579", 33, 2, 6.0606060606060606, 135668.54545454547, 36894, 180361, 141892.0, 176462.80000000002, 180197.9, 180361.0, 0.03495103677484542, 0.48588374457729366, 0.01733899090002097], "isController": false}, {"data": ["checkout/accountservice/ws/GetCountriesRequest-651", 120, 0, 0.0, 139.00833333333333, 122, 371, 124.0, 135.0, 290.0, 369.73999999999995, 0.24372855950328118, 1.190342674738144, 0.2518211093305386], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-639", 386, 0, 0.0, 2466.70207253886, 117, 46270, 367.0, 7334.100000000001, 10512.249999999984, 34337.0, 0.3938626806947085, 0.44386477882977887, 0.17808439566567383], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-637", 393, 0, 0.0, 46374.68193384225, 10003, 103121, 39041.0, 75151.40000000001, 87237.69999999997, 90927.52, 0.34882761081489855, 0.8212893476768347, 0.17373250148007643], "isController": false}, {"data": ["go_home/catalog/api/v1/categories-355", 672, 0, 0.0, 45601.93154761904, 10519, 86849, 46124.5, 72952.6, 76836.25, 82943.04, 0.5559549643386328, 3.7291014036621877, 0.2627755886131819], "isController": false}, {"data": ["go_mini", 154, 6, 3.896103896103896, 262382.92207792215, 11687, 326190, 269734.0, 291589.5, 301021.0, 323738.64999999997, 0.15424092432379377, 3.0882907069592704, 0.293643241055028], "isController": true}, {"data": ["go_headphones/catalog/api/v1/categories/2/products-526", 266, 0, 0.0, 29737.71804511279, 13519, 65802, 24967.0, 56723.4, 60401.1, 64819.86999999999, 0.2673761852253549, 1.1866005973369935, 0.1331658735009092], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdNewRequest-646", 120, 0, 0.0, 897.7583333333338, 316, 4805, 741.5, 1229.7, 1311.2999999999997, 4707.349999999997, 0.2701589209852696, 0.4839511881927044, 0.3068308838924497], "isController": false}, {"data": ["go_mice/catalog/api/v1/categories/5/products-545", 252, 0, 0.0, 32559.007936507947, 14452, 85497, 30067.0, 47581.500000000015, 59580.19999999999, 73896.43, 0.26118807406962113, 0.8802819895146462, 0.13008390407764334], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-638", 388, 0, 0.0, 35502.0824742268, 8655, 101355, 26114.0, 79580.1, 88108.24999999999, 100124.84000000001, 0.36769618439395046, 0.3533237975955702, 0.17774376101074751], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-580", 34, 0, 0.0, 51944.441176470595, 11687, 78209, 52869.0, 73153.5, 76241.75, 78209.0, 0.034186384166475625, 0.031568596362367626, 0.016692570393786927], "isController": false}, {"data": ["go_mice/catalog/fetchImage-551", 235, 0, 0.0, 2717.382978723403, 121, 55453, 140.0, 7221.000000000005, 14655.199999999993, 38986.71999999999, 0.2519194115162547, 4.3859008326606554, 0.13481624756924568], "isController": false}, {"data": ["go_mice/catalog/fetchImage-550", 245, 0, 0.0, 4719.032653061221, 120, 56368, 526.0, 9663.600000000017, 36528.799999999996, 52341.93999999999, 0.2625349734089577, 2.948449416207945, 0.14049723186338753], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/products/3-557", 231, 0, 0.0, 31458.89177489173, 10445, 87304, 26386.0, 55675.4, 66629.39999999998, 81104.48000000004, 0.24534482099386956, 0.2592226352901441, 0.11955768132416104], "isController": false}, {"data": ["go_mice/catalog/fetchImage-553", 233, 0, 0.0, 2888.6523605150205, 121, 50670, 166.0, 8362.599999999999, 13736.699999999992, 40310.979999999996, 0.2498038021639656, 4.184714148195837, 0.13368406600180974], "isController": false}, {"data": ["go_mice/catalog/fetchImage-552", 232, 0, 0.0, 2379.271551724139, 122, 36408, 239.5, 8088.600000000002, 11335.8, 33118.93, 0.24914330142795624, 6.185168501615136, 0.1333305949048047], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649", 120, 0, 0.0, 1895.2833333333335, 981, 7300, 1589.5, 2996.2000000000003, 3925.199999999996, 6670.629999999976, 0.2429415361193329, 0.23084190883213954, 0.286357845796909], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 120, 56, 46.666666666666664, 162361.76666666678, 36624, 180284, 174978.5, 180127.0, 180130.95, 180268.25, 0.18373374530522002, 0.2928062186025824, 0.29654578644933005], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518", 266, 0, 0.0, 470.7218045112782, 413, 983, 460.0, 487.3, 581.9499999999999, 916.2799999999997, 0.2727989686968311, 0.22031513280489642, 0.5879563710096741], "isController": false}, {"data": ["go_mice/catalog/fetchImage-555", 232, 0, 0.0, 1705.900862068966, 122, 37354, 245.0, 6218.90000000002, 10119.399999999992, 25832.219999999776, 0.24960622466281643, 7.543483646892187, 0.13357833116721035], "isController": false}, {"data": ["go_mice/catalog/fetchImage-554", 232, 0, 0.0, 2388.456896551723, 121, 42821, 211.0, 8538.600000000008, 11384.0, 36403.68, 0.24883732903159375, 4.582610993381142, 0.13316685186456384], "isController": false}, {"data": ["go_speakers", 428, 0, 0.0, 87626.64719626177, 10003, 184784, 67997.5, 155390.80000000002, 166013.49999999997, 178688.17, 0.3798933458307593, 1.6752962660500499, 0.5392567806635175], "isController": true}, {"data": ["go_mini/catalog/api/v1/categories/4/products-642", 120, 0, 0.0, 57769.20833333333, 26716, 106592, 58357.5, 65712.2, 67759.54999999999, 98627.5399999997, 0.25289672119400974, 0.5956409298590943, 0.12224987987405743], "isController": false}, {"data": ["go_laptops", 266, 0, 0.0, 48707.37969924811, 12301, 168035, 33340.5, 138664.9, 148771.35, 165577.63999999996, 0.26813272771625507, 103.09443697986282, 1.5136971738835698], "isController": true}, {"data": ["go_mini/app/views/product-page.html-582", 31, 0, 0.0, 2985.322580645161, 118, 46645, 229.0, 6340.0, 34868.199999999975, 46645.0, 0.04632452270798216, 0.12748291503036496, 0.02090032176864039], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/1/products-558", 210, 0, 0.0, 50982.28095238098, 13609, 126554, 31508.5, 108009.6, 114731.65, 125763.07999999993, 0.24064354960694886, 0.9667706888994568, 0.11632671587445283], "isController": false}, {"data": ["pay_now/accountservice/ws/UpdateSafePayMethodRequest-652", 120, 0, 0.0, 1358.4916666666668, 331, 5353, 931.0, 3356.3, 3705.95, 5040.729999999989, 0.2435475130754571, 0.27969909704759527, 0.30889586149351456], "isController": false}, {"data": ["go_laptops/catalog/api/v1/categories/1/products-533", 266, 0, 0.0, 27004.101503759386, 12301, 80581, 25504.0, 32826.200000000004, 39858.1, 69437.14999999998, 0.26813272771625507, 1.077156570549652, 0.13354266712430674], "isController": false}, {"data": ["checkout", 120, 4, 3.3333333333333335, 129979.89166666672, 70410, 239268, 137137.0, 159325.4, 191422.89999999997, 234953.96999999983, 0.20298969996430766, 2.4916126664726987, 1.280437486150182], "isController": true}, {"data": ["sign_in/accountservice/ws/AccountLoginRequest-359", 386, 0, 0.0, 9245.753886010363, 1916, 98570, 5395.5, 16900.600000000002, 30207.249999999993, 81479.14999999998, 0.34760745212742966, 0.5229668917972746, 0.3930476567790657], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519", 266, 0, 0.0, 227.9736842105264, 183, 785, 227.0, 247.3, 260.65, 468.0599999999955, 0.2729011236139496, 0.21829665294722955, 1.7386786430248113], "isController": false}, {"data": ["sign_out", 153, 0, 0.0, 5642.169934640523, 707, 22394, 4099.0, 13567.8, 16131.499999999996, 22093.220000000005, 0.15646411551755873, 0.17556373899382324, 0.17755009983535475], "isController": true}, {"data": ["go_laptops/catalog/fetchImage-544", 253, 0, 0.0, 1691.2015810276675, 126, 33060, 363.0, 3626.3999999999996, 10861.699999999993, 14813.900000000003, 0.26378291812720384, 16.073125098397284, 0.14116507727901142], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-577", 35, 0, 0.0, 65418.82857142855, 16347, 105503, 62772.0, 96084.6, 103145.4, 105503.0, 0.034839425089761296, 0.03347851004719249, 0.016841323651788906], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-541", 253, 0, 0.0, 1483.6877470355737, 125, 15745, 358.0, 3876.1999999999994, 9910.899999999992, 15010.74, 0.26419058479055846, 13.439746607095866, 0.1413832426418223], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-542", 253, 0, 0.0, 1251.1343873517783, 125, 13321, 359.0, 3016.3999999999987, 6590.199999999996, 12976.760000000002, 0.2637488193852255, 13.277045851637642, 0.14140439633055546], "isController": false}, {"data": ["go_home/app/tempFiles/popularProducts.json-357", 659, 0, 0.0, 2633.8543247344455, 118, 54040, 359.0, 5790.0, 11240.0, 50209.399999999994, 0.5900370586249719, 0.5560407827862285, 0.28407057607628045], "isController": false}, {"data": ["sign_in/order/api/v1/carts/142175287-360", 384, 209, 54.427083333333336, 157541.7890625, 28737, 180388, 180120.0, 180360.0, 180364.0, 180377.05, 0.34151183018324244, 0.6340275656298581, 0.1781104535081447], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524", 266, 0, 0.0, 224.44360902255647, 184, 553, 224.0, 246.3, 254.64999999999998, 301.789999999999, 0.2728991637589911, 0.21894330891774963, 0.625749254400499], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-543", 254, 0, 0.0, 1975.9527559055127, 122, 50860, 242.0, 6187.5, 12536.75, 29714.8, 0.2644337629861443, 7.588061314993186, 0.14151338097305377], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525", 266, 0, 0.0, 229.20300751879688, 183, 652, 230.0, 251.0, 265.0, 457.50999999999766, 0.2729120433211959, 0.21983134022897935, 0.6966719543375061], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-530", 266, 0, 0.0, 977.5300751879697, 120, 49700, 129.0, 2761.4000000000005, 4018.7499999999886, 12843.359999999955, 0.2732139408954022, 4.5293738608596374, 0.1462121480573051], "isController": false}, {"data": ["go_special_offer/app/views/product-page.html-559", 186, 0, 0.0, 3083.1075268817226, 118, 48389, 359.0, 9278.2, 10625.350000000006, 35781.829999999936, 0.22925207128013864, 0.6308909539721003, 0.1034320868470938], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-640", 120, 0, 0.0, 58946.91666666669, 14677, 113916, 58580.0, 74498.0, 86878.05, 111162.2699999999, 0.3346318909769299, 0.3090497622022125, 0.16339447801607906], "isController": false}, {"data": ["go_home/accountservice/ws/GetAccountConfigurationRequest-354", 672, 0, 0.0, 1876.4895833333353, 165, 6967, 1245.0, 4312.1, 5514.550000000001, 6800.59, 0.5613552050241291, 0.8606715545780104, 0.6041146835318264], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-531", 266, 0, 0.0, 1620.0902255639094, 131, 51791, 491.5, 3069.7000000000035, 6920.449999999977, 30259.389999999898, 0.27143134113613404, 24.941111683856466, 0.14525817865488425], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-578", 34, 0, 0.0, 3637.794117647059, 119, 11413, 1194.0, 9253.0, 10492.75, 11413.0, 0.034588558918558186, 0.038979684562515764, 0.015639162870402772], "isController": false}, {"data": ["go_headphones ", 266, 0, 0.0, 35504.560150375924, 19400, 125942, 29460.0, 59825.600000000006, 66800.0, 101910.93999999978, 0.26470532624931464, 56.80059842933214, 0.8401292092873754], "isController": true}, {"data": ["go_special_offer", 231, 7, 3.0303030303030303, 149646.0995670996, 10445, 302691, 112894.0, 271666.60000000003, 281715.2, 296121.24000000005, 0.2445018829820339, 5.025224634451162, 0.43146193305464353], "isController": true}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 151, 137, 90.72847682119205, 177668.21192052978, 109091, 180371, 180125.0, 180129.0, 180134.4, 180366.84, 0.1874733067808226, 0.4968932565323894, 0.13638930407363356], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-576", 35, 0, 0.0, 61104.399999999994, 19503, 93632, 63827.0, 85672.4, 91787.2, 93632.0, 0.03495152223865499, 0.08225115202713837, 0.01740749642745512], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 416, 86.66666666666667, 2.0221660509430293], "isController": false}, {"data": ["500", 10, 2.0833333333333335, 0.048609760839976666], "isController": false}, {"data": ["504", 54, 11.25, 0.26249270853587403], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 20572, 480, "504/Gateway Time-out", 416, "504", 54, "500", 10, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/all_data-556", 221, 7, "504/Gateway Time-out", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-641", 120, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now/order/api/v1/carts/142175287-654", 45, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["checkout/order/api/v1/carts/142175287-647", 120, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["sign_in", 78, 4, "504", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now", 113, 55, "504", 50, "500", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-579", 33, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 120, 56, "504/Gateway Time-out", 51, "500", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["sign_in/order/api/v1/carts/142175287-360", 384, 209, "504/Gateway Time-out", 209, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 151, 137, "504/Gateway Time-out", 137, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

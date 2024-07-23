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

    var data = {"OkPercent": 99.94777386081734, "KoPercent": 0.05222613918266092};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6469834490122798, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9888888888888889, 500, 1500, "go_laptops/catalog/fetchImage-534"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/all_data-556"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-535"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/app/order/views/orderPayment-page.html-650"], "isController": false}, {"data": [0.9888888888888889, 500, 1500, "go_laptops/catalog/fetchImage-536"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/accountservice/ws/GetAccountByIdRequest-645"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets "], "isController": true}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521"], "isController": false}, {"data": [1.0, 500, 1500, "go_home/services.properties-352"], "isController": false}, {"data": [1.0, 500, 1500, "go_home/app/views/home-page.html-358"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-641"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart"], "isController": true}, {"data": [1.0, 500, 1500, "go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353"], "isController": false}, {"data": [1.0, 500, 1500, "go_headphones/catalog/fetchImage-527"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-581"], "isController": false}, {"data": [1.0, 500, 1500, "pay_now/order/api/v1/carts/142175287-654"], "isController": false}, {"data": [0.0, 500, 1500, "checkout/order/api/v1/carts/142175287-647"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/order/api/v1/shippingcost/-648"], "isController": false}, {"data": [0.9924050632911392, 500, 1500, "go_home/-349"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-537"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-538"], "isController": false}, {"data": [0.9888888888888889, 500, 1500, "go_headphones/catalog/fetchImage-528"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-539"], "isController": false}, {"data": [0.3237822349570201, 500, 1500, "sign_in"], "isController": true}, {"data": [1.0, 500, 1500, "go_headphones/catalog/fetchImage-529"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/catalog/fetchImage-517"], "isController": false}, {"data": [0.0, 500, 1500, "go_home"], "isController": true}, {"data": [0.18354430379746836, 500, 1500, "go_home/catalog/api/v1/deals/search-356"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/catalog/fetchImage-515"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/catalog/fetchImage-514"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets/catalog/api/v1/categories/3/products-513"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-547"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now"], "isController": true}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-549"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-546"], "isController": false}, {"data": [1.0, 500, 1500, "sign_out/accountservice/ws/AccountLogoutRequest-361"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522"], "isController": false}, {"data": [1.0, 500, 1500, "go_mini/app/views/product-page.html-643"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-579"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/accountservice/ws/GetCountriesRequest-651"], "isController": false}, {"data": [1.0, 500, 1500, "go_speakers/app/views/category-page.html-639"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-637"], "isController": false}, {"data": [0.2518987341772152, 500, 1500, "go_home/catalog/api/v1/categories-355"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini"], "isController": true}, {"data": [0.0, 500, 1500, "go_headphones/catalog/api/v1/categories/2/products-526"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/accountservice/ws/GetAccountByIdNewRequest-646"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice/catalog/api/v1/categories/5/products-545"], "isController": false}, {"data": [0.14646464646464646, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-638"], "isController": false}, {"data": [0.25, 500, 1500, "go_mini/catalog/api/v1/products/24-580"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-551"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-550"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "go_special_offer/catalog/api/v1/products/3-557"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-553"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-552"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now/order/api/v1/orders/users/142175287-653"], "isController": false}, {"data": [0.8, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-555"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-554"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers"], "isController": true}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-642"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops"], "isController": true}, {"data": [1.0, 500, 1500, "go_mini/app/views/product-page.html-582"], "isController": false}, {"data": [1.0, 500, 1500, "pay_now/accountservice/ws/UpdateSafePayMethodRequest-652"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/1/products-558"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops/catalog/api/v1/categories/1/products-533"], "isController": false}, {"data": [0.0, 500, 1500, "checkout"], "isController": true}, {"data": [1.0, 500, 1500, "sign_in/accountservice/ws/AccountLoginRequest-359"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519"], "isController": false}, {"data": [1.0, 500, 1500, "sign_out"], "isController": true}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-544"], "isController": false}, {"data": [0.15151515151515152, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-577"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-541"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-542"], "isController": false}, {"data": [1.0, 500, 1500, "go_home/app/tempFiles/popularProducts.json-357"], "isController": false}, {"data": [0.6361031518624641, 500, 1500, "sign_in/order/api/v1/carts/142175287-360"], "isController": false}, {"data": [0.9888888888888889, 500, 1500, "go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-543"], "isController": false}, {"data": [0.9888888888888889, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525"], "isController": false}, {"data": [1.0, 500, 1500, "go_headphones/catalog/fetchImage-530"], "isController": false}, {"data": [1.0, 500, 1500, "go_special_offer/app/views/product-page.html-559"], "isController": false}, {"data": [0.25, 500, 1500, "go_mini/catalog/api/v1/products/24-640"], "isController": false}, {"data": [1.0, 500, 1500, "go_home/accountservice/ws/GetAccountConfigurationRequest-354"], "isController": false}, {"data": [0.9, 500, 1500, "go_headphones/catalog/fetchImage-531"], "isController": false}, {"data": [1.0, 500, 1500, "go_speakers/app/views/category-page.html-578"], "isController": false}, {"data": [0.0, 500, 1500, "go_headphones "], "isController": true}, {"data": [0.0, 500, 1500, "go_special_offer"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-576"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7659, 4, 0.05222613918266092, 628.6412064238151, 117, 5734, 237.0, 1638.0, 1742.0, 3056.3999999999996, 6.375232235251812, 47.13182554570082, 4.566169891844131], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["go_laptops/catalog/fetchImage-534", 45, 0, 0.0, 147.57777777777775, 123, 589, 133.0, 151.2, 250.49999999999994, 589.0, 0.03835202213167357, 1.0191400693617627, 0.020524324343903437], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/all_data-556", 45, 0, 0.0, 2710.600000000001, 2578, 3120, 2680.0, 2857.8, 2914.2999999999997, 3120.0, 0.03828115894932681, 0.5786785349247521, 0.018991043697517595], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523", 45, 0, 0.0, 221.08888888888896, 181, 261, 225.0, 247.0, 251.1, 261.0, 0.03833000430147826, 0.03086862976622956, 0.05581058243506258], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-535", 45, 0, 0.0, 144.77777777777774, 125, 360, 135.0, 152.2, 254.7, 360.0, 0.038351826015662886, 1.459212906273677, 0.02052421939119459], "isController": false}, {"data": ["checkout/app/order/views/orderPayment-page.html-650", 54, 0, 0.0, 124.14814814814817, 118, 150, 122.0, 130.5, 136.25, 150.0, 0.04603027257593077, 0.06167337302165724, 0.02126203020353052], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-536", 45, 0, 0.0, 158.62222222222215, 124, 1018, 132.0, 151.6, 261.29999999999995, 1018.0, 0.03835218556321463, 1.0906860532170666, 0.02052441180531408], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdRequest-645", 54, 0, 0.0, 190.66666666666666, 171, 254, 185.5, 211.5, 233.75, 254.0, 0.0460183476856606, 0.08553540536625066, 0.05239979824363307], "isController": false}, {"data": ["go_tablets ", 45, 0, 0.0, 4389.155555555555, 4088, 5372, 4370.0, 4621.2, 4820.4, 5372.0, 0.038188701405938254, 4.474340912075607, 0.9082496426174027], "isController": true}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521", 45, 0, 0.0, 229.04444444444442, 185, 335, 231.0, 247.0, 268.2999999999999, 335.0, 0.038330591986180544, 0.0303824842077961, 0.09728633649617503], "isController": false}, {"data": ["go_home/services.properties-352", 395, 0, 0.0, 123.16708860759496, 118, 169, 121.0, 130.0, 135.0, 148.08000000000004, 0.3304076226293253, 0.4446305702961038, 0.14455333490032982], "isController": false}, {"data": ["go_home/app/views/home-page.html-358", 395, 0, 0.0, 125.13670886075943, 118, 176, 123.0, 134.0, 141.0, 155.24000000000012, 0.33043664483832863, 0.8719138812042617, 0.148115644512493], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-641", 54, 0, 0.0, 2673.6666666666665, 2538, 2938, 2671.0, 2804.5, 2856.5, 2938.0, 0.045921413154954155, 0.6936437097337238, 0.022781326057340536], "isController": false}, {"data": ["go_mice", 45, 0, 0.0, 2855.022222222223, 2691, 3423, 2811.0, 3002.0, 3039.7, 3423.0, 0.03826647754523098, 6.656276886186567, 0.2033654011729951], "isController": true}, {"data": ["add_to_cart", 120, 0, 0.0, 3096.8333333333335, 2882, 3398, 3073.5, 3249.6, 3311.9, 3396.11, 0.10161895938798288, 0.08305084012416143, 0.07389537544818195], "isController": true}, {"data": ["go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353", 395, 0, 0.0, 131.21518987341761, 121, 494, 126.0, 146.0, 152.0, 164.0, 0.3304073462518423, 2.2501313722088945, 0.16455834627777305], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-527", 45, 0, 0.0, 133.15555555555557, 122, 241, 127.0, 149.0, 154.0, 241.0, 0.03833398785068145, 0.6466356428460686, 0.020514673185716245], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/4/products-581", 66, 0, 0.0, 1638.4848484848485, 1538, 2000, 1629.5, 1704.5, 1728.65, 2000.0, 0.055959946244536485, 0.13178872046735035, 0.02705095057719293], "isController": false}, {"data": ["pay_now/order/api/v1/carts/142175287-654", 54, 0, 0.0, 281.925925925926, 256, 342, 278.0, 301.5, 322.75, 342.0, 0.04602929167739263, 0.027595432732878383, 0.030068541557631234], "isController": false}, {"data": ["checkout/order/api/v1/carts/142175287-647", 54, 0, 0.0, 1674.0555555555554, 1567, 2165, 1661.0, 1753.5, 1798.0, 2165.0, 0.045963118852964835, 0.033946177134625125, 0.023965723429699836], "isController": false}, {"data": ["checkout/order/api/v1/shippingcost/-648", 54, 0, 0.0, 165.3703703703703, 141, 217, 158.0, 187.0, 200.0, 217.0, 0.04602858545633081, 0.030296158786686487, 0.03858689792053079], "isController": false}, {"data": ["go_home/-349", 395, 0, 0.0, 378.53417721518997, 354, 910, 368.0, 393.0, 404.4, 910.0, 0.3301902564616979, 1.0860449620385695, 0.17799318512388404], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-537", 45, 0, 0.0, 147.6, 125, 411, 132.0, 197.9999999999999, 259.3999999999999, 411.0, 0.0383516299016579, 1.2608173235697184, 0.020524114439559107], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-538", 45, 0, 0.0, 158.35555555555555, 125, 359, 137.0, 247.99999999999997, 329.7999999999996, 359.0, 0.038352087504122855, 1.8891174633354044, 0.020524359328378244], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-528", 45, 0, 0.0, 175.8222222222222, 125, 511, 142.0, 252.8, 258.79999999999995, 511.0, 0.03833343271630704, 1.8404889296240767, 0.020514376102086188], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-539", 45, 0, 0.0, 257.7111111111111, 238, 379, 251.0, 270.4, 347.19999999999953, 379.0, 0.03834757732788968, 1.1669472364498834, 0.02052194567937846], "isController": false}, {"data": ["sign_in", 349, 0, 0.0, 1053.3696275071627, 492, 2379, 567.0, 1965.0, 2021.0, 2231.5, 0.2916307002729964, 0.6300649878438463, 0.4818349953080046], "isController": true}, {"data": ["go_headphones/catalog/fetchImage-529", 45, 0, 0.0, 262.7777777777777, 239, 493, 252.0, 286.2, 350.5999999999996, 493.0, 0.0383300695988886, 1.4101622623642158, 0.020512576308780228], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-517", 45, 0, 0.0, 260.8222222222222, 240, 491, 251.0, 282.0, 304.09999999999997, 491.0, 0.038321191192938676, 1.069646902157483, 0.02050782497434609], "isController": false}, {"data": ["go_home", 395, 0, 0.0, 4063.544303797468, 3859, 4782, 4036.0, 4223.0, 4283.0, 4642.52, 0.3291669409724508, 7.98696140840534, 1.4632499172915978], "isController": true}, {"data": ["go_home/catalog/api/v1/deals/search-356", 395, 0, 0.0, 1529.3367088607597, 1429, 1808, 1520.0, 1610.4, 1649.0, 1711.3600000000006, 0.3300407245187672, 0.2523651243146433, 0.16244191909908073], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-515", 45, 0, 0.0, 177.77777777777774, 124, 285, 141.0, 262.8, 273.79999999999995, 285.0, 0.038325074989396725, 1.716328766811933, 0.020509903412294344], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-514", 45, 0, 0.0, 200.22222222222217, 124, 269, 239.0, 256.4, 264.2, 269.0, 0.03832135436182171, 1.3796169913691794, 0.02050791229519365], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520", 45, 0, 0.0, 223.4666666666667, 182, 273, 226.0, 251.79999999999998, 266.09999999999997, 273.0, 0.038329906355779896, 0.030721320126693118, 0.07602347637557516], "isController": false}, {"data": ["go_tablets/catalog/api/v1/categories/3/products-513", 45, 0, 0.0, 1651.222222222222, 1545, 1787, 1636.0, 1745.0, 1775.6999999999998, 1787.0, 0.03827614452051474, 0.07702326503805926, 0.01906331416549074], "isController": false}, {"data": ["go_mice/catalog/fetchImage-547", 45, 0, 0.0, 166.53333333333327, 123, 257, 135.0, 247.2, 252.1, 257.0, 0.038359770318744116, 1.0637260874781775, 0.020528470834640405], "isController": false}, {"data": ["pay_now", 54, 4, 7.407407407407407, 2177.370370370371, 2074, 2437, 2174.5, 2276.0, 2335.5, 2437.0, 0.04595384871993002, 0.11126622160222348, 0.16247647391651035], "isController": true}, {"data": ["go_mice/catalog/fetchImage-549", 45, 0, 0.0, 128.79999999999998, 121, 147, 126.0, 143.4, 145.39999999999998, 147.0, 0.038362648079821586, 0.48045886628997386, 0.02053001088646702], "isController": false}, {"data": ["go_mice/catalog/fetchImage-546", 45, 0, 0.0, 128.26666666666668, 120, 153, 125.0, 145.0, 146.7, 153.0, 0.03836287701117383, 0.4400808092691531, 0.020530133400510995], "isController": false}, {"data": ["sign_out/accountservice/ws/AccountLogoutRequest-361", 227, 0, 0.0, 299.49779735682824, 277, 415, 296.0, 318.20000000000005, 326.6, 376.03999999999996, 0.19066209301622392, 0.21393627429261844, 0.21635678914536347], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522", 45, 0, 0.0, 220.1555555555555, 186, 259, 219.0, 245.2, 250.39999999999998, 259.0, 0.03833055933655764, 0.03136983623481471, 0.08931319782912747], "isController": false}, {"data": ["go_mini/app/views/product-page.html-643", 54, 0, 0.0, 123.85185185185185, 118, 147, 123.0, 131.0, 137.25, 147.0, 0.046021289107442666, 0.12664843037575532, 0.020763511296521986], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-579", 66, 0, 0.0, 2675.5757575757575, 2478, 2986, 2651.0, 2787.2, 2885.6, 2986.0, 0.055912870803993195, 0.8448689258819833, 0.0277380257504185], "isController": false}, {"data": ["checkout/accountservice/ws/GetCountriesRequest-651", 54, 0, 0.0, 130.7037037037037, 122, 151, 128.0, 145.5, 149.25, 151.0, 0.04603027257593077, 0.22477716872907857, 0.04755862147005347], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-639", 99, 0, 0.0, 123.71717171717172, 118, 144, 122.0, 132.0, 135.0, 144.0, 0.08431516497667281, 0.09501923865535197, 0.03812297010175734], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-637", 99, 0, 0.0, 1642.838383838384, 1530, 1947, 1626.0, 1734.0, 1755.0, 1947.0, 0.08420837745767253, 0.19826630553818936, 0.04193971924161425], "isController": false}, {"data": ["go_home/catalog/api/v1/categories-355", 395, 0, 0.0, 1514.3113924050638, 1397, 2263, 1500.0, 1589.4, 1629.8, 1688.1200000000001, 0.3300387941802881, 2.2905465844535855, 0.1559948988117768], "isController": false}, {"data": ["go_mini", 120, 0, 0.0, 5950.016666666666, 5621, 6491, 5924.5, 6167.7, 6279.15, 6485.33, 0.10136316563923835, 2.1426117576415153, 0.1945103715635775], "isController": true}, {"data": ["go_headphones/catalog/api/v1/categories/2/products-526", 45, 0, 0.0, 1653.911111111111, 1565, 1850, 1642.0, 1760.8, 1792.5, 1850.0, 0.03828223364072549, 0.18149168318474154, 0.019066346832783205], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdNewRequest-646", 54, 0, 0.0, 186.37037037037032, 173, 219, 184.0, 199.5, 206.75, 219.0, 0.04601787709306775, 0.08243371668071348, 0.0522644443937869], "isController": false}, {"data": ["go_mice/catalog/api/v1/categories/5/products-545", 45, 0, 0.0, 1640.1777777777777, 1543, 1835, 1638.0, 1724.8, 1797.9999999999998, 1835.0, 0.03830628342223229, 0.12918311930406848, 0.019078324751307097], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-638", 99, 0, 0.0, 1540.39393939394, 1438, 1892, 1525.0, 1603.0, 1683.0, 1892.0, 0.08421339163054989, 0.08091549898561141, 0.040708621930783395], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-580", 66, 0, 0.0, 1504.6363636363635, 1434, 1659, 1499.0, 1570.6, 1595.15, 1659.0, 0.05596844058356427, 0.051692797550702316, 0.02732834012869349], "isController": false}, {"data": ["go_mice/catalog/fetchImage-551", 45, 0, 0.0, 128.0666666666667, 122, 147, 126.0, 135.8, 139.39999999999998, 147.0, 0.038360064615397725, 0.6678230849803298, 0.020528628329333942], "isController": false}, {"data": ["go_mice/catalog/fetchImage-550", 45, 0, 0.0, 129.62222222222223, 120, 158, 125.0, 149.4, 152.39999999999998, 158.0, 0.03836173238173504, 0.4307969266284981, 0.020529520844912892], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/products/3-557", 45, 0, 0.0, 1527.3333333333335, 1437, 1751, 1517.0, 1600.0, 1638.2999999999997, 1751.0, 0.03831675353216606, 0.04049951130173932, 0.018671933606006705], "isController": false}, {"data": ["go_mice/catalog/fetchImage-553", 45, 0, 0.0, 128.44444444444449, 121, 162, 126.0, 137.0, 150.5999999999999, 162.0, 0.03836055511985542, 0.6425884144197327, 0.02052889082586013], "isController": false}, {"data": ["go_mice/catalog/fetchImage-552", 45, 0, 0.0, 132.71111111111114, 123, 251, 127.0, 146.2, 160.49999999999997, 251.0, 0.03836124184717052, 0.9522454020322081, 0.020529258332274848], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649", 54, 0, 0.0, 197.37037037037038, 183, 226, 196.0, 208.0, 219.5, 226.0, 0.04602725154233911, 0.04373487866278901, 0.05425282481601884], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 54, 4, 7.407407407407407, 1758.0740740740737, 1664, 2028, 1755.5, 1836.5, 1895.75, 2028.0, 0.04596937928568692, 0.030951351999880822, 0.0741981163195553], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518", 45, 0, 0.0, 503.5111111111111, 416, 648, 482.0, 588.2, 633.0999999999999, 648.0, 0.03831864593826611, 0.03085698773505296, 0.0825871597517122], "isController": false}, {"data": ["go_mice/catalog/fetchImage-555", 45, 0, 0.0, 143.88888888888886, 123, 397, 131.0, 156.2, 238.7, 397.0, 0.0383606859231627, 1.159194495657144, 0.020528960826067536], "isController": false}, {"data": ["go_mice/catalog/fetchImage-554", 45, 0, 0.0, 128.51111111111112, 122, 150, 127.0, 136.4, 140.39999999999998, 150.0, 0.0383613726551611, 0.7064328358964413, 0.020529328334988554], "isController": false}, {"data": ["go_speakers", 166, 0, 0.0, 3290.644578313253, 1556, 3804, 3280.5, 3464.1000000000004, 3517.25, 3770.5000000000005, 0.13871224896007595, 0.6144380427847904, 0.19807525525978464], "isController": true}, {"data": ["go_mini/catalog/api/v1/categories/4/products-642", 54, 0, 0.0, 1634.8148148148146, 1528, 1833, 1628.0, 1733.5, 1754.75, 1833.0, 0.04596116281741928, 0.10817945786042275, 0.02221755429162358], "isController": false}, {"data": ["go_laptops", 45, 0, 0.0, 3293.3555555555554, 2971, 4979, 3173.0, 3895.7999999999997, 4487.799999999999, 4979.0, 0.03825183991349984, 15.318786052359119, 0.2237956766814234], "isController": true}, {"data": ["go_mini/app/views/product-page.html-582", 66, 0, 0.0, 124.84848484848484, 119, 145, 123.0, 131.3, 136.65, 145.0, 0.05603487066982047, 0.1542053374487833, 0.025281357665485407], "isController": false}, {"data": ["pay_now/accountservice/ws/UpdateSafePayMethodRequest-652", 54, 0, 0.0, 137.3703703703704, 131, 159, 136.0, 147.0, 152.0, 159.0, 0.04602995868385005, 0.052862530675984044, 0.058380698285128325], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/1/products-558", 45, 0, 0.0, 1653.7777777777778, 1547, 2009, 1645.0, 1725.6, 1735.5, 2009.0, 0.038320277472871374, 0.15382747322264165, 0.018523962254952467], "isController": false}, {"data": ["go_laptops/catalog/api/v1/categories/1/products-533", 45, 0, 0.0, 1660.4888888888886, 1559, 1828, 1653.0, 1742.0, 1793.3, 1828.0, 0.03830041483604869, 0.15386410358517416, 0.019075401920297688], "isController": false}, {"data": ["checkout", 54, 0, 0.0, 2668.685185185185, 2547, 3197, 2654.5, 2764.5, 2794.5, 3197.0, 0.045925709212016885, 0.5612170501640569, 0.28969840363510496], "isController": true}, {"data": ["sign_in/accountservice/ws/AccountLoginRequest-359", 349, 0, 0.0, 269.03151862464205, 237, 381, 264.0, 294.0, 308.0, 351.0, 0.2920257719019329, 0.4396819238452849, 0.33019432212785543], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519", 45, 0, 0.0, 226.2, 189, 300, 224.0, 249.8, 257.59999999999997, 300.0, 0.03833026549245447, 0.030902112913296087, 0.24420571491481735], "isController": false}, {"data": ["sign_out", 227, 0, 0.0, 299.49779735682824, 277, 415, 296.0, 318.20000000000005, 326.6, 376.03999999999996, 0.19066193287524075, 0.21393609460317542, 0.21635660742288063], "isController": true}, {"data": ["go_laptops/catalog/fetchImage-544", 45, 0, 0.0, 170.7333333333333, 126, 469, 141.0, 256.4, 340.2999999999996, 469.0, 0.038351858701525375, 2.3367484553788906, 0.020524236883238192], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-577", 66, 0, 0.0, 1534.4696969696965, 1447, 1833, 1529.0, 1607.2, 1663.8999999999999, 1833.0, 0.055968677892626634, 0.053782401412445904, 0.027055171442236507], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-541", 45, 0, 0.0, 156.86666666666665, 126, 368, 136.0, 246.79999999999998, 266.2999999999999, 368.0, 0.0383519894455325, 1.95097768809094, 0.020524306851710753], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-542", 45, 0, 0.0, 151.22222222222223, 125, 376, 135.0, 167.2, 330.69999999999953, 376.0, 0.03835195675944715, 1.9306007160203793, 0.020561742442320785], "isController": false}, {"data": ["go_home/app/tempFiles/popularProducts.json-357", 395, 0, 0.0, 123.76455696202527, 117, 180, 122.0, 131.0, 135.0, 153.44000000000023, 0.33043470986577655, 0.31139599123093203, 0.15908624215217565], "isController": false}, {"data": ["sign_in/order/api/v1/carts/142175287-360", 349, 0, 0.0, 784.335243553008, 246, 2116, 286.0, 1699.0, 1734.5, 1919.5, 0.29169529292392354, 0.19102019383946228, 0.15212106723283972], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524", 45, 0, 0.0, 238.1333333333333, 191, 722, 232.0, 256.6, 294.79999999999995, 722.0, 0.038328600460965305, 0.031398177304698745, 0.08788628308822903], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-543", 45, 0, 0.0, 139.4, 123, 244, 132.0, 158.0, 220.1999999999997, 244.0, 0.03835202213167357, 1.1004242173098018, 0.020524324343903437], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525", 45, 0, 0.0, 237.51111111111112, 183, 705, 228.0, 256.0, 270.79999999999995, 705.0, 0.038328926926326695, 0.03088439793347461, 0.09784356932169724], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-530", 45, 0, 0.0, 131.04444444444442, 122, 245, 126.0, 138.8, 152.7, 245.0, 0.03833408581724012, 0.6354814774489091, 0.020514725613132404], "isController": false}, {"data": ["go_special_offer/app/views/product-page.html-559", 44, 0, 0.0, 125.06818181818181, 119, 166, 123.0, 131.0, 138.5, 166.0, 0.038367732039759433, 0.10558620008597859, 0.017310441603875838], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-640", 54, 0, 0.0, 1525.5925925925924, 1431, 1832, 1501.5, 1640.0, 1705.75, 1832.0, 0.04596730532846193, 0.042450926177358884, 0.022444973304913053], "isController": false}, {"data": ["go_home/accountservice/ws/GetAccountConfigurationRequest-354", 395, 0, 0.0, 138.07594936708858, 127, 182, 134.0, 154.0, 160.0, 174.08000000000004, 0.3304034770156285, 0.5065756434712273, 0.3555709293664283], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-531", 45, 0, 0.0, 365.46666666666664, 131, 1060, 270.0, 801.6, 819.3, 1060.0, 0.038329416634796463, 3.521859519174504, 0.020512226870965298], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-578", 66, 0, 0.0, 123.95454545454547, 118, 151, 122.0, 133.20000000000002, 137.65, 151.0, 0.056036488244224, 0.06315049554085399, 0.025336810602612996], "isController": false}, {"data": ["go_headphones ", 45, 0, 0.0, 2722.1777777777775, 2375, 4093, 2628.0, 3137.6, 3309.5999999999995, 4093.0, 0.03825323813660827, 8.219603113622318, 0.12140920307028989], "isController": true}, {"data": ["go_special_offer", 45, 0, 0.0, 6014.000000000001, 5734, 6435, 5988.0, 6278.8, 6383.2, 6435.0, 0.03817962921640977, 0.8734949006863001, 0.07284454517031934], "isController": true}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 120, 0, 0.0, 3096.8333333333335, 2882, 3398, 3073.5, 3249.6, 3311.9, 3396.11, 0.10161895938798288, 0.08305084012416143, 0.07389537544818195], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-576", 67, 0, 0.0, 1632.8805970149256, 1546, 1751, 1627.0, 1700.0, 1728.6, 1751.0, 0.05601805286264791, 0.13187365546222002, 0.0278996161718266], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 4, 100.0, 0.05222613918266092], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7659, 4, "500", 4, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 54, 4, "500", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

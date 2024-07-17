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

    var data = {"OkPercent": 99.01945525291829, "KoPercent": 0.980544747081712};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5164901192807548, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.913953488372093, 500, 1500, "go_laptops/catalog/fetchImage-534"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/all_data-556"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523"], "isController": false}, {"data": [0.913953488372093, 500, 1500, "go_laptops/catalog/fetchImage-535"], "isController": false}, {"data": [0.99375, 500, 1500, "checkout/app/order/views/orderPayment-page.html-650"], "isController": false}, {"data": [0.8837209302325582, 500, 1500, "go_laptops/catalog/fetchImage-536"], "isController": false}, {"data": [0.08928571428571429, 500, 1500, "checkout/accountservice/ws/GetAccountByIdRequest-645"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets "], "isController": true}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521"], "isController": false}, {"data": [0.906721536351166, 500, 1500, "go_home/services.properties-352"], "isController": false}, {"data": [0.8921428571428571, 500, 1500, "go_home/app/views/home-page.html-358"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-641"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart"], "isController": true}, {"data": [0.9163237311385459, 500, 1500, "go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353"], "isController": false}, {"data": [0.9527027027027027, 500, 1500, "go_headphones/catalog/fetchImage-527"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-581"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now/order/api/v1/carts/142175287-654"], "isController": false}, {"data": [0.0, 500, 1500, "checkout/order/api/v1/carts/142175287-647"], "isController": false}, {"data": [0.9125, 500, 1500, "checkout/order/api/v1/shippingcost/-648"], "isController": false}, {"data": [0.6337448559670782, 500, 1500, "go_home/-349"], "isController": false}, {"data": [0.8953488372093024, 500, 1500, "go_laptops/catalog/fetchImage-537"], "isController": false}, {"data": [0.9107981220657277, 500, 1500, "go_laptops/catalog/fetchImage-538"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "go_headphones/catalog/fetchImage-528"], "isController": false}, {"data": [0.8906976744186047, 500, 1500, "go_laptops/catalog/fetchImage-539"], "isController": false}, {"data": [0.0, 500, 1500, "sign_in"], "isController": true}, {"data": [0.9346846846846847, 500, 1500, "go_headphones/catalog/fetchImage-529"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "go_tablets/catalog/fetchImage-517"], "isController": false}, {"data": [0.0, 500, 1500, "go_home"], "isController": true}, {"data": [0.0, 500, 1500, "go_home/catalog/api/v1/deals/search-356"], "isController": false}, {"data": [0.9541484716157205, 500, 1500, "go_tablets/catalog/fetchImage-515"], "isController": false}, {"data": [0.9458874458874459, 500, 1500, "go_tablets/catalog/fetchImage-514"], "isController": false}, {"data": [0.9978070175438597, 500, 1500, "go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets/catalog/api/v1/categories/3/products-513"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "go_mice/catalog/fetchImage-547"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now"], "isController": true}, {"data": [0.8809523809523809, 500, 1500, "go_mice/catalog/fetchImage-549"], "isController": false}, {"data": [0.888095238095238, 500, 1500, "go_mice/catalog/fetchImage-546"], "isController": false}, {"data": [0.0, 500, 1500, "sign_out/accountservice/ws/AccountLogoutRequest-361"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-579"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "go_mini/app/views/product-page.html-643"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/accountservice/ws/GetCountriesRequest-651"], "isController": false}, {"data": [0.9240331491712708, 500, 1500, "go_speakers/app/views/category-page.html-639"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-637"], "isController": false}, {"data": [0.0, 500, 1500, "go_home/catalog/api/v1/categories-355"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini"], "isController": true}, {"data": [0.0, 500, 1500, "go_headphones/catalog/api/v1/categories/2/products-526"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "checkout/accountservice/ws/GetAccountByIdNewRequest-646"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice/catalog/api/v1/categories/5/products-545"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-638"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/products/24-580"], "isController": false}, {"data": [0.888095238095238, 500, 1500, "go_mice/catalog/fetchImage-551"], "isController": false}, {"data": [0.8981042654028436, 500, 1500, "go_mice/catalog/fetchImage-550"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/products/3-557"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "go_mice/catalog/fetchImage-553"], "isController": false}, {"data": [0.9119047619047619, 500, 1500, "go_mice/catalog/fetchImage-552"], "isController": false}, {"data": [0.43125, 500, 1500, "checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now/order/api/v1/orders/users/142175287-653"], "isController": false}, {"data": [0.9692982456140351, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518"], "isController": false}, {"data": [0.8952380952380953, 500, 1500, "go_mice/catalog/fetchImage-555"], "isController": false}, {"data": [0.9, 500, 1500, "go_mice/catalog/fetchImage-554"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers"], "isController": true}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-642"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "go_mini/app/views/product-page.html-582"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/1/products-558"], "isController": false}, {"data": [0.55625, 500, 1500, "pay_now/accountservice/ws/UpdateSafePayMethodRequest-652"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops/catalog/api/v1/categories/1/products-533"], "isController": false}, {"data": [0.0, 500, 1500, "checkout"], "isController": true}, {"data": [0.007009345794392523, 500, 1500, "sign_in/accountservice/ws/AccountLoginRequest-359"], "isController": false}, {"data": [0.9978070175438597, 500, 1500, "go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519"], "isController": false}, {"data": [0.0, 500, 1500, "sign_out"], "isController": true}, {"data": [0.8726415094339622, 500, 1500, "go_laptops/catalog/fetchImage-544"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-577"], "isController": false}, {"data": [0.8849765258215962, 500, 1500, "go_laptops/catalog/fetchImage-541"], "isController": false}, {"data": [0.8915094339622641, 500, 1500, "go_laptops/catalog/fetchImage-542"], "isController": false}, {"data": [0.9045584045584045, 500, 1500, "go_home/app/tempFiles/popularProducts.json-357"], "isController": false}, {"data": [0.0, 500, 1500, "sign_in/order/api/v1/carts/142175287-360"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524"], "isController": false}, {"data": [0.9272300469483568, 500, 1500, "go_laptops/catalog/fetchImage-543"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525"], "isController": false}, {"data": [0.9660633484162896, 500, 1500, "go_headphones/catalog/fetchImage-530"], "isController": false}, {"data": [0.8857142857142857, 500, 1500, "go_special_offer/app/views/product-page.html-559"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/products/24-640"], "isController": false}, {"data": [0.5521262002743484, 500, 1500, "go_home/accountservice/ws/GetAccountConfigurationRequest-354"], "isController": false}, {"data": [0.8981900452488688, 500, 1500, "go_headphones/catalog/fetchImage-531"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "go_speakers/app/views/category-page.html-578"], "isController": false}, {"data": [0.0, 500, 1500, "go_headphones "], "isController": true}, {"data": [0.0, 500, 1500, "go_special_offer"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-576"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19275, 189, 0.980544747081712, 13256.980025940298, 118, 196188, 358.0, 36867.20000000002, 61905.40000000001, 176521.24000000145, 15.636966031074364, 185.80023257451796, 12.31665543245642], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["go_laptops/catalog/fetchImage-534", 215, 0, 0.0, 349.046511627907, 123, 7019, 127.0, 806.8000000000004, 1631.3999999999999, 5283.080000000003, 0.21066328560258518, 5.598820800010974, 0.11273777393575847], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/all_data-556", 210, 0, 0.0, 69978.90000000005, 33247, 117611, 68353.0, 111003.3, 114525.95, 117080.19, 0.24528870480555612, 3.586100560411688, 0.12168619339963137], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523", 227, 0, 0.0, 224.79295154185016, 185, 381, 228.0, 245.20000000000002, 254.0, 285.72, 0.21697821041724816, 0.17417493467952222, 0.31593214036339545], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-535", 215, 0, 0.0, 371.1581395348837, 124, 5203, 127.0, 500.20000000000005, 2324.2, 4738.680000000006, 0.20965955189415217, 7.977533569602583, 0.11220061956835486], "isController": false}, {"data": ["checkout/app/order/views/orderPayment-page.html-650", 80, 0, 0.0, 133.19999999999996, 118, 948, 120.0, 128.8, 141.95, 948.0, 0.20108586366378445, 0.2694236376432737, 0.09288438819625981], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-536", 215, 0, 0.0, 439.53953488372076, 123, 7385, 126.0, 1262.6000000000004, 2374.7999999999993, 4775.360000000001, 0.21066328560258518, 5.9916261114325495, 0.11273777393575847], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdRequest-645", 84, 0, 0.0, 2126.011904761904, 1047, 3678, 2071.0, 3168.5, 3345.5, 3678.0, 0.10751600900574572, 0.19987508063700676, 0.12242545556708935], "isController": false}, {"data": ["go_tablets ", 241, 0, 0.0, 28171.86721991701, 17725, 51090, 27149.0, 36627.0, 40054.79999999999, 49837.61999999997, 0.2193201983892251, 24.545480964474226, 4.933904621877418], "isController": true}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521", 227, 0, 0.0, 224.45814977973572, 185, 437, 227.0, 245.0, 252.6, 282.84, 0.21697302556936304, 0.1749613845364185, 0.5506961850144283], "isController": false}, {"data": ["go_home/services.properties-352", 729, 0, 0.0, 390.1961591220849, 118, 8563, 122.0, 532.0, 2454.5, 4475.800000000001, 0.6109098953994881, 0.8221033553325143, 0.26727307923727606], "isController": false}, {"data": ["go_home/app/views/home-page.html-358", 700, 0, 0.0, 467.7728571428571, 118, 6738, 121.0, 1322.2999999999988, 3145.699999999997, 5672.6100000000015, 0.6163187107316935, 1.6262628480439805, 0.276260047095554], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-641", 116, 0, 0.0, 78986.7327586207, 23395, 126770, 78754.0, 114436.2, 119616.2, 126738.89, 0.1091126974257869, 1.5949868947184749, 0.054130127238573966], "isController": false}, {"data": ["go_mice", 212, 0, 0.0, 39022.03773584905, 20671, 60824, 38489.5, 54436.5, 57564.899999999994, 59896.93, 0.2061318388126806, 35.53651257562218, 1.0866321618659986], "isController": true}, {"data": ["add_to_cart", 147, 29, 19.727891156462587, 128681.88435374148, 23533, 180160, 139040.0, 180124.2, 180126.6, 180147.52, 0.1506295701216513, 0.1816935166650613, 0.1095768881339763], "isController": true}, {"data": ["go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353", 729, 0, 0.0, 404.03292181069975, 121, 7274, 128.0, 475.0, 2625.0, 4621.0, 0.610898120796933, 4.160507733119645, 0.30425590000628494], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-527", 222, 0, 0.0, 256.14414414414415, 121, 5141, 124.0, 150.10000000000005, 954.1999999999992, 4116.200000000002, 0.21146502397079878, 3.5671495068435606, 0.11316682923437278], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/4/products-581", 43, 0, 0.0, 29921.837209302324, 19284, 48989, 29851.0, 38133.200000000004, 39691.6, 48989.0, 0.04282424928095098, 0.1008196346568682, 0.0207011751895222], "isController": false}, {"data": ["pay_now/order/api/v1/carts/142175287-654", 80, 32, 40.0, 109075.58750000001, 5163, 180422, 125347.0, 180374.0, 180387.7, 180422.0, 0.12672123071659272, 0.18964716997831482, 0.08278955405214895], "isController": false}, {"data": ["checkout/order/api/v1/carts/142175287-647", 84, 13, 15.476190476190476, 128673.11904761907, 42336, 180150, 130084.0, 180123.0, 180127.5, 180150.0, 0.09783983618815999, 0.1011532597700065, 0.051031045511830464], "isController": false}, {"data": ["checkout/order/api/v1/shippingcost/-648", 80, 0, 0.0, 513.2875000000001, 140, 4733, 393.5, 536.2, 807.6500000000005, 4733.0, 0.2001511140911388, 0.13171565625797477, 0.16780491536735237], "isController": false}, {"data": ["go_home/-349", 729, 0, 0.0, 1185.5829903978056, 355, 7178, 370.0, 2806.0, 3276.0, 5087.8, 0.6095465525501872, 2.0048881502457, 0.3285836884840853], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-537", 215, 0, 0.0, 374.1534883720931, 123, 4789, 127.0, 1258.4000000000005, 2226.2, 3311.8000000000006, 0.21175881950860134, 6.962824469605715, 0.11332405575264994], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-538", 213, 0, 0.0, 339.42723004694824, 125, 4054, 132.0, 686.7999999999995, 1817.0999999999985, 2508.6599999999994, 0.2087936432628271, 10.284696113656771, 0.1117372231523723], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-528", 221, 0, 0.0, 269.96380090497735, 124, 7103, 132.0, 259.8, 756.6999999999979, 2944.2400000000016, 0.21150814880603172, 10.155183785986294, 0.11318990775947792], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-539", 215, 0, 0.0, 530.5255813953487, 238, 4996, 249.0, 1111.0000000000002, 2334.5999999999985, 4502.920000000004, 0.21173504559689588, 6.444143994910973, 0.1133113329952138], "isController": false}, {"data": ["sign_in", 428, 63, 14.719626168224298, 106842.30607476635, 7688, 196740, 103772.0, 182510.3, 184422.09999999998, 193842.98999999996, 0.3678556080790718, 0.922892270090245, 0.6050591561022776], "isController": true}, {"data": ["go_headphones/catalog/fetchImage-529", 222, 0, 0.0, 502.26126126126127, 239, 5359, 479.0, 498.70000000000005, 635.55, 3866.6600000000108, 0.21245604935105206, 7.817038317214108, 0.11369718266052393], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-517", 231, 0, 0.0, 433.80519480519496, 238, 7120, 243.0, 488.8, 568.3999999999984, 5900.760000000022, 0.21687737884440972, 6.0541276661952015, 0.11606328477220365], "isController": false}, {"data": ["go_home", 729, 0, 0.0, 60445.460905349726, 18792, 102301, 55954.0, 91176.0, 95225.0, 100581.20000000001, 0.5980856337205439, 14.284739396901605, 2.6345216448134328], "isController": true}, {"data": ["go_home/catalog/api/v1/deals/search-356", 722, 0, 0.0, 28263.076177285293, 6557, 54194, 26541.5, 44445.7, 48232.05, 52369.0, 0.6094627105052125, 0.46602058756805803, 0.2999699278267843], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-515", 229, 0, 0.0, 291.3973799126637, 125, 5744, 130.0, 247.0, 732.0, 5074.699999999983, 0.21402429222446942, 9.584817479452733, 0.11453643763575122], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-514", 231, 0, 0.0, 368.64069264069263, 123, 5671, 131.0, 251.60000000000002, 1745.1999999999966, 5514.320000000001, 0.2157801620499676, 7.768812873119863, 0.11547610234705295], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520", 228, 0, 0.0, 227.1403508771929, 183, 562, 228.0, 244.0, 250.54999999999998, 421.3800000000014, 0.21384776852667328, 0.1723370911451079, 0.42414532995866544], "isController": false}, {"data": ["go_tablets/catalog/api/v1/categories/3/products-513", 241, 0, 0.0, 25204.560165975086, 15032, 40599, 24709.0, 33704.8, 36374.09999999999, 38766.84, 0.2193201983892251, 0.441617585998999, 0.1092317394321336], "isController": false}, {"data": ["go_mice/catalog/fetchImage-547", 210, 0, 0.0, 589.8714285714289, 123, 7048, 239.0, 1599.8000000000013, 3673.699999999997, 6290.439999999991, 0.26477741675587146, 7.342980589136056, 0.14169728943575932], "isController": false}, {"data": ["pay_now", 80, 57, 71.25, 248239.1, 102692, 363175, 240254.5, 361155.5, 361386.4, 363175.0, 0.10544157614068014, 0.46540382599701596, 0.3728425459066262], "isController": true}, {"data": ["go_mice/catalog/fetchImage-549", 210, 0, 0.0, 501.92380952380955, 120, 6071, 124.0, 1594.500000000001, 3390.1, 4920.16, 0.2660952798498716, 3.3328211065192077, 0.14240255210715783], "isController": false}, {"data": ["go_mice/catalog/fetchImage-546", 210, 0, 0.0, 456.7523809523811, 120, 5598, 123.0, 1171.4000000000008, 3355.5499999999965, 4709.379999999999, 0.2661043838796499, 3.052755827686007, 0.14240742418559388], "isController": false}, {"data": ["sign_out/accountservice/ws/AccountLogoutRequest-361", 200, 0, 0.0, 5622.689999999997, 1964, 12443, 4610.0, 10786.300000000001, 11629.5, 12206.68, 0.18440879002938557, 0.2069196286560195, 0.20926075587318946], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522", 227, 0, 0.0, 226.1718061674009, 182, 402, 227.0, 246.0, 261.0, 323.23999999999995, 0.21698090663607902, 0.1757462452505556, 0.5055824640953952], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-579", 44, 0, 0.0, 65466.18181818181, 23238, 114649, 54767.0, 102969.0, 108780.0, 114649.0, 0.041145144171650064, 0.6013669290643687, 0.02041184886640452], "isController": false}, {"data": ["go_mini/app/views/product-page.html-643", 105, 0, 0.0, 521.4761904761905, 118, 6874, 121.0, 1363.2, 3098.2999999999965, 6812.619999999997, 0.11463182441461349, 0.3154614074222469, 0.05171865515581194], "isController": false}, {"data": ["checkout/accountservice/ws/GetCountriesRequest-651", 80, 0, 0.0, 126.81249999999997, 122, 218, 124.0, 130.9, 147.30000000000004, 218.0, 0.20108384190788348, 0.9819037895506781, 0.20776045384623118], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-639", 362, 0, 0.0, 422.4447513812153, 118, 5988, 122.0, 381.7, 2549.1499999999924, 4849.910000000001, 0.3348633443042705, 0.3773752923116486, 0.15140793790320045], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-637", 403, 0, 0.0, 30267.52109181144, 15322, 60131, 27061.0, 50168.000000000015, 54729.6, 59242.2, 0.3513780033882256, 0.8273397535384114, 0.1750027165312452], "isController": false}, {"data": ["go_home/catalog/api/v1/categories-355", 729, 0, 0.0, 28401.62962962963, 8277, 59006, 26175.0, 45965.0, 49484.5, 55939.7, 0.5997897033632652, 4.022843636716674, 0.2834943519802933], "isController": false}, {"data": ["go_mini", 165, 0, 0.0, 130951.92727272722, 16642, 198725, 138373.0, 169647.4, 181444.09999999998, 197625.44, 0.15121702208776636, 2.9860824277686695, 0.2755880108271388], "isController": true}, {"data": ["go_headphones/catalog/api/v1/categories/2/products-526", 227, 0, 0.0, 29043.09251101321, 15446, 47452, 28063.0, 40922.6, 42591.6, 47293.0, 0.21000454238900057, 0.9322249151540017, 0.10459210607264677], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdNewRequest-646", 84, 0, 0.0, 1828.5476190476188, 809, 3224, 1789.0, 2821.5, 3015.5, 3224.0, 0.10767615626886735, 0.19291727635085507, 0.12229235326239526], "isController": false}, {"data": ["go_mice/catalog/api/v1/categories/5/products-545", 212, 0, 0.0, 34685.31132075472, 19438, 59349, 29380.0, 52927.700000000004, 56088.35, 58413.33, 0.20613203923898385, 0.6947593937141395, 0.10266341798035328], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-638", 383, 0, 0.0, 23777.020887728464, 12256, 47415, 21969.0, 35143.200000000004, 40802.2, 46172.19999999999, 0.3424302354274924, 0.32905405435610596, 0.16553024075840697], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-580", 44, 0, 0.0, 26950.272727272717, 14353, 47677, 25477.0, 39180.0, 46057.75, 47677.0, 0.041237577179874564, 0.03808362008288753, 0.020135535732360627], "isController": false}, {"data": ["go_mice/catalog/fetchImage-551", 210, 0, 0.0, 464.38095238095224, 121, 5692, 124.0, 1416.2000000000005, 3213.2499999999977, 4793.6099999999915, 0.262972693416416, 4.578267277227692, 0.14073148046112888], "isController": false}, {"data": ["go_mice/catalog/fetchImage-550", 211, 0, 0.0, 563.2985781990521, 120, 6106, 359.0, 1083.2000000000014, 3133.7999999999993, 5920.879999999997, 0.2154932497505487, 2.4201390777220833, 0.11532255943681707], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/products/3-557", 210, 0, 0.0, 25823.819047619036, 14932, 48489, 23907.5, 38491.50000000001, 40494.99999999999, 46944.2, 0.25511350728834997, 0.26952533246756716, 0.12431800794617834], "isController": false}, {"data": ["go_mice/catalog/fetchImage-553", 210, 0, 0.0, 405.07619047619033, 121, 7100, 124.5, 951.3000000000004, 2120.3999999999933, 6909.009999999998, 0.2628532089995932, 4.403226405795287, 0.14066753762868855], "isController": false}, {"data": ["go_mice/catalog/fetchImage-552", 210, 0, 0.0, 439.5666666666666, 122, 6542, 125.0, 779.1000000000003, 3125.2999999999993, 6056.669999999998, 0.2620571234613503, 6.505493752667367, 0.14024150747736325], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649", 80, 0, 0.0, 1399.8375, 883, 3349, 1191.5, 2827.9000000000005, 3206.100000000001, 3349.0, 0.1996929720554647, 0.18974732598629607, 0.23538029030365812], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 80, 48, 60.0, 138291.32499999995, 58903, 180361, 180121.0, 180128.0, 180131.95, 180361.0, 0.139005692283099, 0.2458798930003684, 0.2243944184436228], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518", 228, 0, 0.0, 458.736842105263, 410, 630, 458.0, 481.1, 507.8499999999999, 609.5500000000001, 0.213789216959486, 0.17191813291219357, 0.4607742205367047], "isController": false}, {"data": ["go_mice/catalog/fetchImage-555", 210, 0, 0.0, 500.62380952380965, 123, 6822, 127.0, 1243.0000000000002, 3081.2999999999997, 6505.719999999991, 0.2622567568580142, 7.925594567679103, 0.14034834253729667], "isController": false}, {"data": ["go_mice/catalog/fetchImage-554", 210, 0, 0.0, 453.842857142857, 121, 6930, 125.0, 1171.8, 3180.2499999999977, 5111.259999999998, 0.26205745048050105, 4.825990733149394, 0.14024168248370564], "isController": false}, {"data": ["go_speakers", 449, 0, 0.0, 54293.1269487751, 21530, 106709, 50192.0, 87248.0, 93626.0, 102323.0, 0.3914856663059883, 1.6803206874671401, 0.5358226754666657], "isController": true}, {"data": ["go_mini/catalog/api/v1/categories/4/products-642", 111, 0, 0.0, 32734.60360360361, 16627, 60230, 32390.0, 40563.0, 44131.799999999974, 59047.279999999955, 0.11183135428777533, 0.26332179201433453, 0.054059101926219516], "isController": false}, {"data": ["go_laptops", 221, 0, 0.0, 35612.40271493213, 19248, 59372, 35552.0, 45168.6, 48721.299999999974, 58716.740000000005, 0.20764002548053162, 80.36847182490449, 1.17860561090796], "isController": true}, {"data": ["go_mini/app/views/product-page.html-582", 42, 0, 0.0, 526.6904761904763, 119, 4968, 130.0, 1152.4, 3433.1500000000005, 4968.0, 0.04586900467536212, 0.1262293507570024, 0.020694804843766894], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/1/products-558", 210, 0, 0.0, 26925.852380952387, 13046, 39573, 27232.0, 35567.7, 36928.049999999996, 38892.88, 0.26903968207196427, 1.080978021699972, 0.1300533619390843], "isController": false}, {"data": ["pay_now/accountservice/ws/UpdateSafePayMethodRequest-652", 80, 0, 0.0, 872.1875000000002, 317, 2836, 615.0, 2311.2000000000003, 2508.15, 2836.0, 0.20088893353087411, 0.23070838460186324, 0.2548091712075936], "isController": false}, {"data": ["go_laptops/catalog/api/v1/categories/1/products-533", 221, 0, 0.0, 31726.07692307694, 19248, 57435, 30748.0, 41519.600000000006, 45963.79999999999, 55879.58, 0.20764002548053162, 0.8340962508996168, 0.10341446581549914], "isController": false}, {"data": ["checkout", 84, 13, 15.476190476190476, 134697.36904761902, 50672, 188748, 135988.5, 186193.5, 186843.25, 188748.0, 0.09727401162656044, 1.18117877248014, 0.5973560232444357], "isController": true}, {"data": ["sign_in/accountservice/ws/AccountLoginRequest-359", 428, 0, 0.0, 4455.7757009345805, 785, 17877, 3193.0, 9281.700000000004, 11195.099999999993, 16609.659999999996, 0.3759649474176127, 0.5652762071395567, 0.42510000568778744], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519", 228, 0, 0.0, 227.03070175438583, 180, 602, 226.5, 249.1, 260.19999999999993, 288.33000000000015, 0.21385358533039442, 0.17208072709046568, 1.3624812409135674], "isController": false}, {"data": ["sign_out", 200, 0, 0.0, 5622.689999999997, 1964, 12443, 4610.0, 10786.300000000001, 11629.5, 12206.68, 0.18440879002938557, 0.2069196286560195, 0.20926075587318946], "isController": true}, {"data": ["go_laptops/catalog/fetchImage-544", 212, 0, 0.0, 486.6367924528303, 126, 4089, 133.0, 1552.4000000000021, 2814.649999999998, 4028.9500000000007, 0.21450650855243522, 13.070416290921923, 0.11479449871751414], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-577", 45, 0, 0.0, 28053.13333333333, 9413, 43511, 26690.0, 39998.2, 42265.799999999996, 43511.0, 0.0414258596786458, 0.0398076620349487, 0.02002519584075163], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-541", 213, 0, 0.0, 432.62441314554, 125, 5183, 132.0, 1242.3999999999999, 2291.3999999999933, 4456.3999999999905, 0.20776677058256635, 10.569294287364853, 0.1111876858195765], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-542", 212, 0, 0.0, 385.78773584905656, 125, 3958, 130.0, 1107.4, 1994.0999999999995, 3362.220000000001, 0.21380213822308236, 10.762666760310154, 0.11462634168405489], "isController": false}, {"data": ["go_home/app/tempFiles/popularProducts.json-357", 702, 0, 0.0, 513.0954415954415, 118, 8923, 126.0, 843.300000000004, 3078.9500000000007, 5549.230000000001, 0.6195688436303557, 0.5838710293977473, 0.29828851553688024], "isController": false}, {"data": ["sign_in/order/api/v1/carts/142175287-360", 422, 63, 14.928909952606634, 103842.23459715644, 5237, 180404, 101660.5, 180123.0, 180126.85, 180365.62, 0.36390698123636966, 0.371040645423956, 0.18975833062415223], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524", 227, 0, 0.0, 224.8370044052865, 181, 288, 227.0, 247.0, 256.2, 283.91999999999996, 0.21697675863486252, 0.17366130955510206, 0.49752092702603246], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-543", 213, 0, 0.0, 308.0938967136151, 123, 3809, 126.0, 369.5999999999991, 2055.899999999999, 3485.839999999991, 0.20879650868711105, 5.99141979910443, 0.11173875660208679], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525", 227, 0, 0.0, 222.56387665198233, 185, 321, 225.0, 245.0, 250.6, 288.43999999999994, 0.2169862992747687, 0.17640125086149297, 0.5539083850627396], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-530", 221, 0, 0.0, 213.19457013574652, 121, 6345, 124.0, 136.20000000000005, 185.69999999999993, 2479.4, 0.2115506663845991, 3.5070432805980283, 0.11321266130738313], "isController": false}, {"data": ["go_special_offer/app/views/product-page.html-559", 210, 0, 0.0, 471.28571428571433, 118, 5982, 121.0, 1512.000000000001, 2857.6499999999996, 4450.759999999998, 0.27539972302656424, 0.7578871284070879, 0.12425260941237568], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-640", 121, 0, 0.0, 27943.975206611565, 13954, 46570, 27580.0, 39247.2, 41566.0, 46504.66, 0.11247778331387437, 0.10385930388801302, 0.05492079263372772], "isController": false}, {"data": ["go_home/accountservice/ws/GetAccountConfigurationRequest-354", 729, 0, 0.0, 1129.0205761316872, 128, 5406, 760.0, 2511.0, 3196.5, 5226.800000000002, 0.6107123469449304, 0.9363460788120513, 0.6572314514973762], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-531", 221, 0, 0.0, 380.9638009049774, 130, 4449, 246.0, 690.2, 1219.6999999999994, 2604.920000000001, 0.21141386128763479, 19.425785027916675, 0.11313944920471079], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-578", 45, 0, 0.0, 403.84444444444443, 118, 6605, 356.0, 367.4, 711.8999999999979, 6605.0, 0.04192329155599694, 0.04724558442931687, 0.01895555077190096], "isController": false}, {"data": ["go_headphones ", 227, 0, 0.0, 30626.074889867865, 16355, 49634, 29447.0, 42630.60000000001, 44501.0, 48712.4, 0.21000434810764804, 43.94543988596625, 0.6526552222391829], "isController": true}, {"data": ["go_special_offer", 210, 0, 0.0, 123199.85714285706, 65986, 186658, 121793.5, 172289.7, 175850.75, 186161.41999999998, 0.2256623189059891, 5.065278492487057, 0.43281327571422124], "isController": true}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 147, 29, 19.727891156462587, 128681.88435374148, 23533, 180160, 139040.0, 180124.2, 180126.6, 180147.52, 0.15062972447056724, 0.18169370284495487, 0.1095770004165373], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-576", 46, 0, 0.0, 35645.93478260869, 15647, 58937, 33060.5, 54489.700000000004, 56916.549999999996, 58937.0, 0.041428527684163316, 0.0975765662235015, 0.020633348748948527], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 177, 93.65079365079364, 0.9182879377431906], "isController": false}, {"data": ["500", 8, 4.232804232804233, 0.041504539559014265], "isController": false}, {"data": ["504", 4, 2.1164021164021163, 0.020752269779507133], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19275, 189, "504/Gateway Time-out", 177, "500", 8, "504", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now/order/api/v1/carts/142175287-654", 80, 32, "504/Gateway Time-out", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["checkout/order/api/v1/carts/142175287-647", 84, 13, "504/Gateway Time-out", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["sign_in", 46, 4, "504", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 80, 48, "504/Gateway Time-out", 41, "500", 7, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["sign_in/order/api/v1/carts/142175287-360", 422, 63, "504/Gateway Time-out", 63, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 147, 29, "504/Gateway Time-out", 28, "500", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

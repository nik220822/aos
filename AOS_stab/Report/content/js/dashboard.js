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

    var data = {"OkPercent": 99.90538526343076, "KoPercent": 0.09461473656924373};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5441708395337975, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9889655172413793, 500, 1500, "go_laptops/catalog/fetchImage-534"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/all_data-556"], "isController": false}, {"data": [0.9993131868131868, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523"], "isController": false}, {"data": [0.9937931034482759, 500, 1500, "go_laptops/catalog/fetchImage-535"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/app/order/views/orderPayment-page.html-650"], "isController": false}, {"data": [0.9937931034482759, 500, 1500, "go_laptops/catalog/fetchImage-536"], "isController": false}, {"data": [0.49437412095639943, 500, 1500, "checkout/accountservice/ws/GetAccountByIdRequest-645"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets "], "isController": true}, {"data": [0.9986263736263736, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521"], "isController": false}, {"data": [0.9965997959877593, 500, 1500, "go_home/services.properties-352"], "isController": false}, {"data": [0.9991438356164384, 500, 1500, "go_home/app/views/home-page.html-358"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-641"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart"], "isController": true}, {"data": [0.9991493705341953, 500, 1500, "go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353"], "isController": false}, {"data": [0.9972489683631361, 500, 1500, "go_headphones/catalog/fetchImage-527"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-581"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now/order/api/v1/carts/142175287-654"], "isController": false}, {"data": [0.0, 500, 1500, "checkout/order/api/v1/carts/142175287-647"], "isController": false}, {"data": [0.9859154929577465, 500, 1500, "checkout/order/api/v1/shippingcost/-648"], "isController": false}, {"data": [0.9845290717443047, 500, 1500, "go_home/-349"], "isController": false}, {"data": [0.9924137931034482, 500, 1500, "go_laptops/catalog/fetchImage-537"], "isController": false}, {"data": [0.9917241379310345, 500, 1500, "go_laptops/catalog/fetchImage-538"], "isController": false}, {"data": [0.9938101788170564, 500, 1500, "go_headphones/catalog/fetchImage-528"], "isController": false}, {"data": [0.8124137931034483, 500, 1500, "go_laptops/catalog/fetchImage-539"], "isController": false}, {"data": [0.0, 500, 1500, "sign_in"], "isController": true}, {"data": [0.9903713892709766, 500, 1500, "go_headphones/catalog/fetchImage-529"], "isController": false}, {"data": [0.9223901098901099, 500, 1500, "go_tablets/catalog/fetchImage-517"], "isController": false}, {"data": [3.4002040122407346E-4, 500, 1500, "go_home"], "isController": true}, {"data": [0.0, 500, 1500, "go_home/catalog/api/v1/deals/search-356"], "isController": false}, {"data": [0.9979395604395604, 500, 1500, "go_tablets/catalog/fetchImage-515"], "isController": false}, {"data": [0.9972527472527473, 500, 1500, "go_tablets/catalog/fetchImage-514"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets/catalog/api/v1/categories/3/products-513"], "isController": false}, {"data": [0.9979108635097493, 500, 1500, "go_mice/catalog/fetchImage-547"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now"], "isController": true}, {"data": [0.9993036211699164, 500, 1500, "go_mice/catalog/fetchImage-549"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-546"], "isController": false}, {"data": [0.004897959183673469, 500, 1500, "sign_out/accountservice/ws/AccountLogoutRequest-361"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522"], "isController": false}, {"data": [0.9986033519553073, 500, 1500, "go_mini/app/views/product-page.html-643"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-579"], "isController": false}, {"data": [0.9992957746478873, 500, 1500, "checkout/accountservice/ws/GetCountriesRequest-651"], "isController": false}, {"data": [0.9955141476880607, 500, 1500, "go_speakers/app/views/category-page.html-639"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-637"], "isController": false}, {"data": [0.0, 500, 1500, "go_home/catalog/api/v1/categories-355"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini"], "isController": true}, {"data": [0.0, 500, 1500, "go_headphones/catalog/api/v1/categories/2/products-526"], "isController": false}, {"data": [0.49929676511954996, 500, 1500, "checkout/accountservice/ws/GetAccountByIdNewRequest-646"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice/catalog/api/v1/categories/5/products-545"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-638"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/products/24-580"], "isController": false}, {"data": [0.9965181058495822, 500, 1500, "go_mice/catalog/fetchImage-551"], "isController": false}, {"data": [0.995125348189415, 500, 1500, "go_mice/catalog/fetchImage-550"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/products/3-557"], "isController": false}, {"data": [0.9993036211699164, 500, 1500, "go_mice/catalog/fetchImage-553"], "isController": false}, {"data": [0.9986072423398329, 500, 1500, "go_mice/catalog/fetchImage-552"], "isController": false}, {"data": [0.49859154929577465, 500, 1500, "checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now/order/api/v1/orders/users/142175287-653"], "isController": false}, {"data": [0.9986263736263736, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518"], "isController": false}, {"data": [0.995125348189415, 500, 1500, "go_mice/catalog/fetchImage-555"], "isController": false}, {"data": [0.9986072423398329, 500, 1500, "go_mice/catalog/fetchImage-554"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers"], "isController": true}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-642"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops"], "isController": true}, {"data": [0.9956331877729258, 500, 1500, "go_mini/app/views/product-page.html-582"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/1/products-558"], "isController": false}, {"data": [0.9176056338028169, 500, 1500, "pay_now/accountservice/ws/UpdateSafePayMethodRequest-652"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops/catalog/api/v1/categories/1/products-533"], "isController": false}, {"data": [0.0, 500, 1500, "checkout"], "isController": true}, {"data": [0.23090992226794696, 500, 1500, "sign_in/accountservice/ws/AccountLoginRequest-359"], "isController": false}, {"data": [0.9993131868131868, 500, 1500, "go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519"], "isController": false}, {"data": [0.004897959183673469, 500, 1500, "sign_out"], "isController": true}, {"data": [0.9868965517241379, 500, 1500, "go_laptops/catalog/fetchImage-544"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-577"], "isController": false}, {"data": [0.9889655172413793, 500, 1500, "go_laptops/catalog/fetchImage-541"], "isController": false}, {"data": [0.9910344827586207, 500, 1500, "go_laptops/catalog/fetchImage-542"], "isController": false}, {"data": [0.9998287671232877, 500, 1500, "go_home/app/tempFiles/popularProducts.json-357"], "isController": false}, {"data": [6.858710562414266E-4, 500, 1500, "sign_in/order/api/v1/carts/142175287-360"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524"], "isController": false}, {"data": [0.9951724137931034, 500, 1500, "go_laptops/catalog/fetchImage-543"], "isController": false}, {"data": [0.9993131868131868, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525"], "isController": false}, {"data": [0.9979367262723521, 500, 1500, "go_headphones/catalog/fetchImage-530"], "isController": false}, {"data": [0.9964639321074965, 500, 1500, "go_special_offer/app/views/product-page.html-559"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/products/24-640"], "isController": false}, {"data": [0.9489622320517183, 500, 1500, "go_home/accountservice/ws/GetAccountConfigurationRequest-354"], "isController": false}, {"data": [0.951856946354883, 500, 1500, "go_headphones/catalog/fetchImage-531"], "isController": false}, {"data": [0.9978540772532188, 500, 1500, "go_speakers/app/views/category-page.html-578"], "isController": false}, {"data": [0.0, 500, 1500, "go_headphones "], "isController": true}, {"data": [0.0, 500, 1500, "go_special_offer"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-576"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 77155, 73, 0.09461473656924373, 5632.279683753418, 132, 74212, 279.0, 20542.9, 24999.800000000003, 40172.95000000001, 14.261713486972774, 145.75177500412897, 10.933094444029313], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["go_laptops/catalog/fetchImage-534", 725, 0, 0.0, 159.36275862068936, 136, 1382, 141.0, 148.39999999999998, 254.19999999999754, 556.0, 0.13686400946608124, 3.6372148827717283, 0.07324363006583252], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/all_data-556", 713, 0, 0.0, 28403.528751753158, 18006, 52936, 27737.0, 33620.8, 37127.49999999999, 49426.8, 0.13493552712383883, 1.982650278410978, 0.06694067165909191], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523", 728, 0, 0.0, 249.71153846153848, 197, 664, 251.0, 274.0, 280.54999999999995, 309.84000000000015, 0.13691377911180946, 0.1102374551339376, 0.19935394985908977], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-535", 725, 0, 0.0, 160.3186206896552, 137, 1879, 142.0, 157.19999999999993, 270.0, 535.0, 0.13686382860797594, 5.207548111529296, 0.07324353327848712], "isController": false}, {"data": ["checkout/app/order/views/orderPayment-page.html-650", 710, 0, 0.0, 144.7816901408449, 132, 419, 137.0, 141.0, 151.89999999999986, 410.0, 0.13673780948725442, 0.1832072994301885, 0.06316111707760873], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-536", 725, 0, 0.0, 154.83034482758617, 136, 1223, 141.0, 149.0, 216.89999999999952, 557.3200000000002, 0.13686382860797594, 3.892462222869625, 0.07324353327848712], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdRequest-645", 711, 0, 0.0, 884.971870604782, 332, 2307, 822.0, 1148.8000000000004, 1251.1999999999998, 1567.9599999999998, 0.13639680689511757, 0.2535481799059495, 0.15531120785127644], "isController": false}, {"data": ["go_tablets ", 729, 0, 0.0, 20585.072702331996, 11338, 31769, 20558.0, 24611.0, 25910.0, 29491.900000000016, 0.1360127407929263, 15.911046803157193, 3.2304742277079033], "isController": true}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521", 728, 0, 0.0, 249.4574175824174, 195, 527, 249.0, 275.0, 280.0, 366.3600000000006, 0.1369157360753593, 0.1097596699794758, 0.3475039043553309], "isController": false}, {"data": ["go_home/services.properties-352", 2941, 0, 0.0, 141.16763005780356, 132, 959, 137.0, 141.0, 146.0, 250.79999999999927, 0.5446971115495605, 0.7330006051907171, 0.2383049863029327], "isController": false}, {"data": ["go_home/app/views/home-page.html-358", 2920, 0, 0.0, 139.89794520547935, 132, 989, 137.0, 142.0, 145.0, 202.78999999999996, 0.5434856451853965, 1.4340815587573126, 0.24361319447275098], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-641", 719, 0, 0.0, 28921.755215577185, 19533, 50489, 28375.0, 34326.0, 36928.0, 42891.59999999998, 0.13523581345282237, 1.987182105614562, 0.06708964183011108], "isController": false}, {"data": ["go_mice", 725, 0, 0.0, 19785.47172413799, 11980, 36330, 19802.0, 24054.0, 24890.399999999998, 29636.34, 0.13647210387842426, 23.51483523387601, 0.7189282049202994], "isController": true}, {"data": ["add_to_cart", 945, 15, 1.5873015873015872, 38402.507936507944, 14336, 67430, 38198.0, 46159.0, 49153.09999999999, 56817.7, 0.1791764708112997, 0.1469297794731074, 0.1303601035265532], "isController": true}, {"data": ["go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353", 2939, 0, 0.0, 145.23953725757042, 135, 903, 141.0, 149.0, 162.0, 240.0, 0.5443805351451444, 3.707445764364265, 0.27112702433986685], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-527", 727, 0, 0.0, 145.37414030261368, 135, 1244, 140.0, 145.0, 156.80000000000007, 267.1600000000001, 0.1369452985473438, 2.310065799378622, 0.07328713242572694], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/4/products-581", 230, 0, 0.0, 17726.81739130435, 11584, 25243, 17483.5, 22060.9, 23205.0, 25028.38, 0.04355069167965929, 0.10256879464892651, 0.02105233630999155], "isController": false}, {"data": ["pay_now/order/api/v1/carts/142175287-654", 704, 0, 0.0, 7534.72869318182, 1566, 40705, 6421.0, 14392.5, 17237.75, 23180.05000000003, 0.13580144748139433, 0.08144967297699729, 0.08872485816561179], "isController": false}, {"data": ["checkout/order/api/v1/carts/142175287-647", 711, 0, 0.0, 18186.714486638535, 1668, 42812, 19525.0, 27925.600000000002, 31167.79999999999, 36361.079999999994, 0.13594609880585407, 0.09538375966823416, 0.07089451326038515], "isController": false}, {"data": ["checkout/order/api/v1/shippingcost/-648", 710, 0, 0.0, 287.02676056338026, 152, 605, 194.0, 452.0, 469.0, 548.78, 0.1367487126842135, 0.09000466823510378, 0.11464761235062369], "isController": false}, {"data": ["go_home/-349", 2941, 0, 0.0, 423.1791907514462, 396, 1825, 411.0, 423.0, 447.0, 789.5799999999999, 0.5446405224400784, 1.7913921646488487, 0.2935952816278548], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-537", 725, 0, 0.0, 157.54620689655172, 136, 1419, 142.0, 154.0, 259.89999999999884, 544.6200000000001, 0.13686395779228808, 4.50007365876625, 0.07324360241227917], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-538", 725, 0, 0.0, 168.47034482758608, 138, 1537, 143.0, 180.19999999999993, 278.0, 687.74, 0.13686390611853397, 6.741576436580192, 0.07324357475874668], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-528", 727, 0, 0.0, 231.50756533700138, 138, 1479, 268.0, 279.0, 289.80000000000007, 531.4800000000002, 0.13694166134534352, 6.574931455589085, 0.073285185954344], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-539", 725, 0, 0.0, 385.7710344827587, 266, 1535, 281.0, 552.0, 560.0, 626.74, 0.13686008236900463, 4.165195396201444, 0.07324152845528761], "isController": false}, {"data": ["sign_in", 2187, 0, 0.0, 16603.642432556026, 2513, 59416, 17660.0, 27860.600000000002, 30787.6, 38351.039999999986, 0.40639891537759976, 0.8871059886327232, 0.671437212656734], "isController": true}, {"data": ["go_headphones/catalog/fetchImage-529", 727, 0, 0.0, 287.7180192572214, 266, 1237, 276.0, 291.0, 341.20000000000005, 556.72, 0.13694251258806847, 5.038521954102785, 0.07328564150220851], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-517", 728, 0, 0.0, 322.14835164835245, 265, 1091, 276.0, 542.0, 552.55, 622.2700000000013, 0.13691102400794988, 3.8218681350546384, 0.07326879019175442], "isController": false}, {"data": ["go_home", 2941, 0, 0.0, 33345.130907854444, 538, 53705, 33358.0, 39102.4, 40758.8, 44734.34, 0.5437624292517192, 13.0671771270753, 2.4118263266989755], "isController": true}, {"data": ["go_home/catalog/api/v1/deals/search-356", 2930, 0, 0.0, 16307.3672354949, 8274, 27044, 16315.5, 20188.0, 21068.349999999995, 23071.110000000008, 0.5430360720514346, 0.4152208244371792, 0.26727556671281544], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-515", 728, 0, 0.0, 149.77060439560424, 137, 547, 143.0, 150.0, 176.0, 399.1300000000001, 0.13691135873427704, 6.131383734528593, 0.07326896932264046], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-514", 728, 0, 0.0, 216.08379120879127, 137, 1351, 245.0, 279.0, 291.0, 417.71000000000004, 0.13691138448252388, 4.929195338070975, 0.07326898310197566], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520", 728, 0, 0.0, 250.15109890109883, 193, 494, 251.0, 274.0, 282.0, 324.71000000000004, 0.13691256891234624, 0.10988918174663953, 0.27155217525485864], "isController": false}, {"data": ["go_tablets/catalog/api/v1/categories/3/products-513", 729, 0, 0.0, 17844.59533607681, 9175, 29086, 17903.0, 21919.0, 23243.0, 26779.000000000007, 0.1360127407929263, 0.2738788359231104, 0.06774072051210196], "isController": false}, {"data": ["go_mice/catalog/fetchImage-547", 718, 0, 0.0, 248.14484679665736, 136, 828, 270.0, 278.0, 282.04999999999995, 407.8599999999997, 0.13580326306113416, 3.7660894742304794, 0.07267596499756007], "isController": false}, {"data": ["pay_now", 710, 57, 8.028169014084508, 33499.452112676074, 16425, 77547, 32248.5, 44145.799999999996, 48865.09999999999, 60462.72999999999, 0.13631252353070938, 0.3292175055782541, 0.48124991690455765], "isController": true}, {"data": ["go_mice/catalog/fetchImage-549", 718, 0, 0.0, 143.80501392757674, 134, 970, 139.0, 144.0, 151.0, 273.6199999999999, 0.13580691056679903, 1.7009843624868024, 0.07267791698301355], "isController": false}, {"data": ["go_mice/catalog/fetchImage-546", 718, 0, 0.0, 142.15738161559895, 134, 364, 139.0, 144.0, 149.0, 272.42999999999984, 0.13580691056679903, 1.5579553582186259, 0.07267791698301355], "isController": false}, {"data": ["sign_out/accountservice/ws/AccountLogoutRequest-361", 1225, 0, 0.0, 2208.653061224492, 1060, 5682, 2141.0, 2664.4, 2884.1000000000004, 3532.640000000001, 0.22890252172098072, 0.2568447240794989, 0.25975071312478476], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522", 728, 0, 0.0, 247.64148351648333, 195, 380, 248.0, 273.0, 277.54999999999995, 334.71000000000004, 0.13691434559550497, 0.11019107761604666, 0.3190211216707763], "isController": false}, {"data": ["go_mini/app/views/product-page.html-643", 716, 0, 0.0, 268.2569832402234, 132, 536, 145.5, 414.0, 417.0, 443.47000000000037, 0.1361590261358772, 0.37470325747158395, 0.06143112311989772], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-579", 232, 0, 0.0, 28485.25, 18724, 45152, 28040.5, 35239.8, 37526.5, 42872.059999999976, 0.04371061687550105, 0.6424754887299146, 0.021684563840580595], "isController": false}, {"data": ["checkout/accountservice/ws/GetCountriesRequest-651", 710, 0, 0.0, 143.87746478873262, 136, 710, 141.0, 146.0, 152.0, 185.12999999999977, 0.1367375988145813, 0.6677185982826528, 0.14127771440022172], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-639", 1449, 0, 0.0, 289.2933057280881, 132, 1406, 399.0, 414.0, 420.0, 498.0, 0.2707902028141998, 0.3051678652808462, 0.12243736709274854], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-637", 1456, 0, 0.0, 18055.09065934062, 7455, 28068, 18228.5, 22243.5, 23275.6, 25526.54000000001, 0.2706872649264227, 0.6372633307784434, 0.13481494639890193], "isController": false}, {"data": ["go_home/catalog/api/v1/categories-355", 2939, 0, 0.0, 15746.39128955426, 8427, 27152, 15595.0, 19725.0, 20616.0, 22491.6, 0.5435337423675952, 3.666471680024146, 0.2569046204159337], "isController": false}, {"data": ["go_mini", 953, 0, 0.0, 63262.94018887728, 8936, 94141, 63115.0, 71990.8, 75252.29999999999, 81784.08, 0.17857149549224086, 3.6891633027777146, 0.3413538095549054], "isController": true}, {"data": ["go_headphones/catalog/api/v1/categories/2/products-526", 728, 0, 0.0, 17884.80769230769, 10007, 32689, 17857.5, 21925.0, 23029.899999999998, 25367.270000000004, 0.13637637481622908, 0.6120283871849856, 0.0679218273010516], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdNewRequest-646", 711, 0, 0.0, 818.9099859353016, 450, 1842, 785.0, 1009.6000000000001, 1148.6, 1364.4799999999998, 0.13639455664863037, 0.24435334808351258, 0.1549090521312081], "isController": false}, {"data": ["go_mice/catalog/api/v1/categories/5/products-545", 725, 0, 0.0, 18269.43724137931, 10340, 34637, 18274.0, 22492.2, 23425.49999999999, 27998.420000000002, 0.13647210387842426, 0.4599854394265273, 0.06796950486132458], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-638", 1452, 0, 0.0, 15822.752066115718, 6837, 26317, 15764.0, 19724.4, 20532.8, 23061.600000000006, 0.27044454601636303, 0.25987666811388027, 0.13073247097470672], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-580", 233, 0, 0.0, 15984.665236051509, 10392, 23996, 16114.0, 19464.4, 20152.9, 22669.739999999998, 0.04378937872644324, 0.040438809981347225, 0.021381532581271113], "isController": false}, {"data": ["go_mice/catalog/fetchImage-551", 718, 0, 0.0, 148.69777158774406, 135, 1320, 140.0, 145.0, 153.29999999999973, 291.0499999999997, 0.1358066023193044, 2.364343421241155, 0.07267775202244024], "isController": false}, {"data": ["go_mice/catalog/fetchImage-550", 718, 0, 0.0, 262.16155988857923, 134, 1267, 143.0, 415.0, 421.0, 500.47999999999956, 0.1358070390036681, 1.5252334145062536, 0.07267798571680677], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/products/3-557", 718, 0, 0.0, 15638.704735376037, 9598, 28218, 15552.0, 19303.6, 20046.1, 23441.72999999998, 0.13556139883504045, 0.14322751217173324, 0.06605970509637225], "isController": false}, {"data": ["go_mice/catalog/fetchImage-553", 718, 0, 0.0, 143.60445682451254, 135, 679, 140.0, 144.10000000000002, 151.0, 274.42999999999984, 0.13581777718507254, 2.27513582073283, 0.07268373232169897], "isController": false}, {"data": ["go_mice/catalog/fetchImage-552", 718, 0, 0.0, 146.8370473537604, 136, 1223, 141.0, 146.0, 155.04999999999995, 279.80999999999995, 0.13581780287653783, 3.371665614122044, 0.0726837460706472], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649", 710, 0, 0.0, 847.3760563380282, 379, 1669, 814.0, 1051.0, 1161.1999999999975, 1434.3899999999994, 0.1367195097199869, 0.12991023726322973, 0.16115278147658613], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 710, 57, 8.028169014084508, 25604.819718309896, 11141, 74212, 24505.0, 34491.2, 38350.349999999984, 46851.34, 0.13632338518230083, 0.09161308743618722, 0.22006183957560035], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518", 728, 0, 0.0, 297.68543956043914, 233, 1146, 293.0, 325.0, 349.0, 417.1300000000001, 0.13690785706293154, 0.10933921713106577, 0.29507386771278316], "isController": false}, {"data": ["go_mice/catalog/fetchImage-555", 718, 0, 0.0, 149.8593314763233, 136, 560, 141.0, 147.0, 166.04999999999995, 498.93999999999596, 0.1358178542594976, 4.104449353536333, 0.07268377356855926], "isController": false}, {"data": ["go_mice/catalog/fetchImage-554", 718, 0, 0.0, 145.54735376044596, 135, 1291, 140.0, 147.0, 161.04999999999995, 275.2399999999998, 0.13581772580217108, 2.5011692673097135, 0.07268370482381811], "isController": false}, {"data": ["go_speakers", 1689, 0, 0.0, 34168.61278863236, 14330, 53463, 34327.0, 40504.0, 42069.5, 45574.9, 0.313924532468049, 1.3923325948408947, 0.44909259471497176], "isController": true}, {"data": ["go_mini/catalog/api/v1/categories/4/products-642", 718, 0, 0.0, 18474.399721448484, 11552, 32579, 18578.0, 22349.0, 23090.3, 26641.25999999998, 0.1356788002819398, 0.3195026553503367, 0.06558692005816426], "isController": false}, {"data": ["go_laptops", 727, 0, 0.0, 19806.870701513068, 12585, 36064, 19803.0, 23664.2, 24728.4, 29664.600000000028, 0.13653159053668937, 54.53045037701124, 0.7967793753609308], "isController": true}, {"data": ["go_mini/app/views/product-page.html-582", 229, 0, 0.0, 248.61135371179043, 132, 820, 139.0, 414.0, 421.5, 564.7999999999987, 0.04376069055516264, 0.12042867543699064, 0.019743592809067522], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/1/products-558", 710, 0, 0.0, 18125.342253521125, 11639, 26989, 18024.0, 21839.399999999998, 22663.3, 24390.539999999997, 0.13505765820673105, 0.5425732991556613, 0.06528666094954284], "isController": false}, {"data": ["pay_now/accountservice/ws/UpdateSafePayMethodRequest-652", 710, 0, 0.0, 423.5774647887325, 212, 1096, 385.5, 562.8, 655.4499999999999, 924.56, 0.13673665079558583, 0.1570334973980556, 0.17343741935426407], "isController": false}, {"data": ["go_laptops/catalog/api/v1/categories/1/products-533", 727, 0, 0.0, 17949.99174690508, 10500, 34219, 18057.0, 21737.4, 22797.8, 27822.400000000027, 0.13653159053668937, 0.5484568229995634, 0.06799913200557771], "isController": false}, {"data": ["checkout", 711, 0, 0.0, 21311.656821378336, 4331, 46210, 22588.0, 31032.800000000007, 34548.2, 39044.159999999996, 0.13590054755878844, 1.6542439945481135, 0.8566047839334207], "isController": true}, {"data": ["sign_in/accountservice/ws/AccountLoginRequest-359", 2187, 0, 0.0, 1558.4796524919943, 420, 3409, 1518.0, 1861.2, 2004.599999999999, 2570.4799999999996, 0.4071385328417637, 0.6128953965910012, 0.46034497945551406], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519", 728, 0, 0.0, 263.24999999999955, 200, 586, 261.0, 295.0, 302.54999999999995, 397.4900000000007, 0.13691220843153523, 0.10990413606515818, 0.8722805154368515], "isController": false}, {"data": ["sign_out", 1225, 0, 0.0, 2208.653061224492, 1060, 5682, 2141.0, 2664.4, 2884.1000000000004, 3532.640000000001, 0.22890252172098072, 0.2568447240794989, 0.25975071312478476], "isController": true}, {"data": ["go_laptops/catalog/fetchImage-544", 725, 0, 0.0, 179.06896551724148, 139, 1468, 145.0, 269.4, 290.49999999999966, 698.1800000000001, 0.13686362191358373, 8.339222893546154, 0.0732434226646913], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-577", 233, 0, 0.0, 16106.377682403438, 8564, 26459, 15855.0, 20317.2, 21613.5, 23731.44, 0.04378360227050862, 0.042073305306816876, 0.021164924925685318], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-541", 725, 0, 0.0, 173.0137931034483, 138, 1695, 144.0, 199.0, 280.0, 773.100000000001, 0.1368635960768286, 6.962380732519923, 0.07324340883799031], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-542", 725, 0, 0.0, 170.04827586206883, 138, 1472, 144.0, 165.39999999999998, 278.0, 913.280000000002, 0.13686372526070179, 6.889662411463329, 0.07337713395324735], "isController": false}, {"data": ["go_home/app/tempFiles/popularProducts.json-357", 2920, 0, 0.0, 138.89212328767098, 132, 518, 137.0, 141.0, 144.0, 210.3699999999999, 0.5434863532810197, 0.5121721981603359, 0.2616589571948659], "isController": false}, {"data": ["sign_in/order/api/v1/carts/142175287-360", 2187, 0, 0.0, 15045.162322816637, 1322, 57515, 16159.0, 26175.0, 29190.8, 37003.31999999997, 0.40653149448003845, 0.27541381094324413, 0.21199764397153945], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524", 728, 0, 0.0, 248.23901098901095, 197, 457, 249.0, 274.0, 283.0, 316.3900000000003, 0.1369140108545729, 0.1102435188706249, 0.3139395483266964], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-543", 725, 0, 0.0, 153.5710344827584, 136, 1345, 141.0, 147.0, 170.89999999999952, 508.44000000000096, 0.13686385444481886, 3.9271656138768622, 0.07324354710523509], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525", 728, 0, 0.0, 250.10302197802181, 192, 566, 251.0, 276.0, 280.0, 360.5500000000002, 0.13691367611527755, 0.11009301514099758, 0.34950424742708547], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-530", 727, 0, 0.0, 146.6987620357636, 134, 1244, 140.0, 145.0, 157.0, 266.1600000000001, 0.13694522115805552, 2.270237232518858, 0.07328709101036564], "isController": false}, {"data": ["go_special_offer/app/views/product-page.html-559", 707, 0, 0.0, 240.6718528995757, 132, 969, 139.0, 413.0, 417.0, 485.7599999999999, 0.13528728743439428, 0.37230427342785455, 0.061037819135439604], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-640", 720, 0, 0.0, 16070.893055555553, 8857, 26580, 16160.0, 19828.3, 20308.9, 21895.939999999995, 0.13492810861712742, 0.12460682569911968, 0.06588286553570676], "isController": false}, {"data": ["go_home/accountservice/ws/GetAccountConfigurationRequest-354", 2939, 0, 0.0, 377.0401497107874, 144, 1994, 343.0, 502.0, 602.0, 812.7999999999993, 0.5443652088582426, 0.8346224393627353, 0.5858305275017416], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-531", 727, 0, 0.0, 280.50894085282, 142, 1894, 267.0, 411.20000000000005, 776.0000000000013, 1378.2800000000007, 0.13694148078006538, 12.58358767095552, 0.07328508932370686], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-578", 233, 0, 0.0, 191.08154506437776, 132, 543, 137.0, 408.0, 413.0, 424.32, 0.04389958713662965, 0.04947277690983458, 0.019849129730722195], "isController": false}, {"data": ["go_headphones ", 728, 0, 0.0, 18975.115384615372, 11119, 33741, 18951.5, 22960.2, 24114.6, 26672.33000000001, 0.13637637481622908, 29.231080943581677, 0.4323339193802069], "isController": true}, {"data": ["go_special_offer", 718, 0, 0.0, 62004.814763231225, 10136, 94999, 61894.0, 70234.1, 74488.09999999999, 87532.82999999999, 0.13556139883504045, 3.02707542312668, 0.25786704818169304], "isController": true}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 945, 15, 1.5873015873015872, 38402.507936507944, 14336, 67430, 38198.0, 46159.0, 49153.09999999999, 56817.7, 0.1791764708112997, 0.1469297794731074, 0.1303601035265532], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-576", 233, 0, 0.0, 18160.708154506447, 9154, 28559, 18500.0, 22339.4, 23646.6, 26414.799999999996, 0.04375023236443155, 0.10302131588071471, 0.021789666509628994], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 73, 100.0, 0.09461473656924373], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 77155, 73, "500", 73, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now", 7, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 710, 57, "500", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 945, 15, "500", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

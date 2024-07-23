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

    var data = {"OkPercent": 99.92701173894532, "KoPercent": 0.07298826105468037};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5949058805621797, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-534"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/all_data-556"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523"], "isController": false}, {"data": [0.9964285714285714, 500, 1500, "go_laptops/catalog/fetchImage-535"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/app/order/views/orderPayment-page.html-650"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-536"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/accountservice/ws/GetAccountByIdRequest-645"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets "], "isController": true}, {"data": [0.9964285714285714, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521"], "isController": false}, {"data": [1.0, 500, 1500, "go_home/services.properties-352"], "isController": false}, {"data": [1.0, 500, 1500, "go_home/app/views/home-page.html-358"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-641"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart"], "isController": true}, {"data": [0.999236641221374, 500, 1500, "go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353"], "isController": false}, {"data": [1.0, 500, 1500, "go_headphones/catalog/fetchImage-527"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-581"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "pay_now/order/api/v1/carts/142175287-654"], "isController": false}, {"data": [0.03273809523809524, 500, 1500, "checkout/order/api/v1/carts/142175287-647"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/order/api/v1/shippingcost/-648"], "isController": false}, {"data": [0.9923664122137404, 500, 1500, "go_home/-349"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-537"], "isController": false}, {"data": [0.9928571428571429, 500, 1500, "go_laptops/catalog/fetchImage-538"], "isController": false}, {"data": [1.0, 500, 1500, "go_headphones/catalog/fetchImage-528"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-539"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "sign_in"], "isController": true}, {"data": [1.0, 500, 1500, "go_headphones/catalog/fetchImage-529"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/catalog/fetchImage-517"], "isController": false}, {"data": [0.0, 500, 1500, "go_home"], "isController": true}, {"data": [0.0, 500, 1500, "go_home/catalog/api/v1/deals/search-356"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/catalog/fetchImage-515"], "isController": false}, {"data": [0.9964285714285714, 500, 1500, "go_tablets/catalog/fetchImage-514"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets/catalog/api/v1/categories/3/products-513"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-547"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now"], "isController": true}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-549"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-546"], "isController": false}, {"data": [0.5018050541516246, 500, 1500, "sign_out/accountservice/ws/AccountLogoutRequest-361"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-579"], "isController": false}, {"data": [1.0, 500, 1500, "go_mini/app/views/product-page.html-643"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/accountservice/ws/GetCountriesRequest-651"], "isController": false}, {"data": [1.0, 500, 1500, "go_speakers/app/views/category-page.html-639"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-637"], "isController": false}, {"data": [0.0, 500, 1500, "go_home/catalog/api/v1/categories-355"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini"], "isController": true}, {"data": [0.0, 500, 1500, "go_headphones/catalog/api/v1/categories/2/products-526"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/accountservice/ws/GetAccountByIdNewRequest-646"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice/catalog/api/v1/categories/5/products-545"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-638"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/products/24-580"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-551"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-550"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/products/3-557"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-553"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-552"], "isController": false}, {"data": [1.0, 500, 1500, "checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now/order/api/v1/orders/users/142175287-653"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518"], "isController": false}, {"data": [1.0, 500, 1500, "go_mice/catalog/fetchImage-555"], "isController": false}, {"data": [0.9964285714285714, 500, 1500, "go_mice/catalog/fetchImage-554"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers"], "isController": true}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-642"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops"], "isController": true}, {"data": [1.0, 500, 1500, "go_mini/app/views/product-page.html-582"], "isController": false}, {"data": [1.0, 500, 1500, "pay_now/accountservice/ws/UpdateSafePayMethodRequest-652"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/1/products-558"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops/catalog/api/v1/categories/1/products-533"], "isController": false}, {"data": [0.0, 500, 1500, "checkout"], "isController": true}, {"data": [0.6488095238095238, 500, 1500, "sign_in/accountservice/ws/AccountLoginRequest-359"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519"], "isController": false}, {"data": [0.5018050541516246, 500, 1500, "sign_out"], "isController": true}, {"data": [0.9892857142857143, 500, 1500, "go_laptops/catalog/fetchImage-544"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-577"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-541"], "isController": false}, {"data": [0.9964285714285714, 500, 1500, "go_laptops/catalog/fetchImage-542"], "isController": false}, {"data": [1.0, 500, 1500, "go_home/app/tempFiles/popularProducts.json-357"], "isController": false}, {"data": [0.34226190476190477, 500, 1500, "sign_in/order/api/v1/carts/142175287-360"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524"], "isController": false}, {"data": [1.0, 500, 1500, "go_laptops/catalog/fetchImage-543"], "isController": false}, {"data": [1.0, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525"], "isController": false}, {"data": [1.0, 500, 1500, "go_headphones/catalog/fetchImage-530"], "isController": false}, {"data": [1.0, 500, 1500, "go_special_offer/app/views/product-page.html-559"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/products/24-640"], "isController": false}, {"data": [1.0, 500, 1500, "go_home/accountservice/ws/GetAccountConfigurationRequest-354"], "isController": false}, {"data": [0.9785714285714285, 500, 1500, "go_headphones/catalog/fetchImage-531"], "isController": false}, {"data": [1.0, 500, 1500, "go_speakers/app/views/category-page.html-578"], "isController": false}, {"data": [0.0, 500, 1500, "go_headphones "], "isController": true}, {"data": [0.0, 500, 1500, "go_special_offer"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-576"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 16441, 12, 0.07298826105468037, 1469.0204975366394, 131, 15701, 249.0, 4755.600000000002, 5573.5999999999985, 8366.58, 13.66973468692059, 130.03226091631123, 10.354170499093728], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["go_laptops/catalog/fetchImage-534", 140, 0, 0.0, 141.6785714285715, 136, 268, 140.0, 144.0, 146.95, 230.2800000000003, 0.12245961894065432, 3.2542311165080817, 0.06553503044870954], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/all_data-556", 140, 0, 0.0, 7002.507142857139, 5639, 9305, 6957.5, 7793.0, 8024.449999999999, 9146.330000000002, 0.12151269417077568, 1.818347283062953, 0.06028168812378325], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523", 140, 0, 0.0, 240.17857142857142, 193, 293, 244.0, 262.0, 268.84999999999997, 288.49, 0.12245019338384114, 0.0993652228440457, 0.17829417806182338], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-535", 140, 0, 0.0, 152.02857142857144, 137, 1331, 142.0, 145.0, 147.0, 947.2400000000032, 0.12245961894065432, 4.659445847536463, 0.06553503044870954], "isController": false}, {"data": ["checkout/app/order/views/orderPayment-page.html-650", 168, 0, 0.0, 136.33928571428567, 131, 180, 136.0, 139.0, 140.0, 154.47000000000008, 0.14690001617648987, 0.19682306854896886, 0.06785518325339816], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-536", 140, 0, 0.0, 142.44285714285724, 136, 269, 140.5, 146.0, 151.89999999999998, 230.87000000000032, 0.1224598331747187, 3.4828213797046446, 0.06553514509740806], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdRequest-645", 168, 0, 0.0, 323.95833333333326, 262, 460, 320.0, 366.29999999999995, 388.19999999999993, 454.48, 0.14693213571981442, 0.27311482188851527, 0.16730749047783555], "isController": false}, {"data": ["go_tablets ", 142, 0, 0.0, 7093.4084507042235, 2666, 10066, 7050.5, 8119.900000000001, 8311.6, 9789.079999999996, 0.11979422389371722, 13.839712797566321, 2.809802652724981], "isController": true}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521", 140, 0, 0.0, 245.47142857142862, 194, 530, 244.0, 267.8, 271.9, 446.77000000000066, 0.12244580242670088, 0.09827864297034275, 0.31077796924511286], "isController": false}, {"data": ["go_home/services.properties-352", 655, 0, 0.0, 136.21984732824438, 132, 173, 136.0, 139.0, 141.0, 145.43999999999994, 0.5475270169056281, 0.7368088176718315, 0.23954306989621227], "isController": false}, {"data": ["go_home/app/views/home-page.html-358", 650, 0, 0.0, 137.00153846153862, 133, 177, 137.0, 140.0, 141.0, 148.49, 0.5457067153828846, 1.4399409618794474, 0.2446087718366641], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-641", 169, 0, 0.0, 7161.733727810652, 4443, 10657, 7100.0, 8374.0, 9169.5, 10183.800000000008, 0.14300510418218004, 2.139857325965327, 0.07094393840287838], "isController": false}, {"data": ["go_mice", 140, 0, 0.0, 5814.114285714288, 4491, 8222, 5779.0, 6924.4000000000015, 7216.9, 8086.700000000001, 0.12194006645733622, 21.21166849395308, 0.6480447672468982], "isController": true}, {"data": ["add_to_cart", 220, 1, 0.45454545454545453, 8732.731818181815, 3801, 12220, 8589.0, 10339.300000000001, 10898.9, 11844.08, 0.18782020142862874, 0.1532533807102677, 0.1366532030174169], "isController": true}, {"data": ["go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353", 655, 0, 0.0, 143.02748091603058, 135, 853, 140.0, 145.0, 161.0, 177.43999999999994, 0.5475265592177141, 3.7288499907317547, 0.27269389179788495], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-527", 140, 0, 0.0, 139.51428571428585, 135, 158, 139.0, 143.0, 145.0, 155.13000000000002, 0.12243038302345328, 2.0652475236268777, 0.06551938466489492], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/4/products-581", 52, 0, 0.0, 4768.307692307693, 3180, 6707, 4632.0, 6017.5, 6248.849999999999, 6707.0, 0.044566793624891576, 0.10493216741173203, 0.02154351840265755], "isController": false}, {"data": ["pay_now/order/api/v1/carts/142175287-654", 168, 0, 0.0, 837.7321428571428, 454, 1756, 762.5, 1232.6, 1415.0499999999997, 1712.5300000000002, 0.14665931042188995, 0.08791698466493586, 0.09582914670470498], "isController": false}, {"data": ["checkout/order/api/v1/carts/142175287-647", 168, 0, 0.0, 4271.970238095237, 529, 6715, 4414.0, 5322.7, 5672.8499999999985, 6249.250000000002, 0.14643815341488542, 0.10689869432517289, 0.07637882852963891], "isController": false}, {"data": ["checkout/order/api/v1/shippingcost/-648", 168, 0, 0.0, 169.1428571428572, 149, 423, 162.5, 188.0, 195.54999999999998, 278.7900000000005, 0.14689500679389406, 0.0966867525186373, 0.12314855183819864], "isController": false}, {"data": ["go_home/-349", 655, 0, 0.0, 413.70992366412236, 397, 795, 409.0, 418.0, 424.0, 688.5199999999936, 0.5472255663784612, 1.7999104897188432, 0.2949887818758893], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-537", 140, 0, 0.0, 142.96428571428567, 137, 399, 141.0, 144.0, 146.0, 304.7000000000008, 0.12245897624295861, 4.026253988117106, 0.06553468650502081], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-538", 140, 0, 0.0, 163.74285714285722, 138, 1358, 143.0, 149.0, 161.69999999999993, 1312.9000000000003, 0.12245897624295861, 6.032015163592072, 0.06553468650502081], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-528", 140, 0, 0.0, 222.0642857142858, 138, 304, 267.0, 277.0, 280.95, 301.13, 0.12243123955508488, 5.878265757665726, 0.0655198430431509], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-539", 140, 0, 0.0, 274.2285714285714, 265, 447, 273.0, 278.0, 280.0, 387.5500000000005, 0.12244515987402144, 3.726511164593408, 0.06552729258883178], "isController": false}, {"data": ["sign_in", 504, 0, 0.0, 2440.5515873015875, 837, 9002, 1323.0, 5319.5, 5830.5, 6370.849999999999, 0.42222477269814196, 0.9091573636544895, 0.6975794710901694], "isController": true}, {"data": ["go_headphones/catalog/fetchImage-529", 140, 0, 0.0, 274.73571428571444, 267, 314, 274.0, 280.9, 285.84999999999997, 310.31000000000006, 0.1224134689791154, 4.503921637072482, 0.06551033300835472], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-517", 140, 0, 0.0, 273.8999999999998, 266, 308, 274.0, 279.9, 282.0, 303.90000000000003, 0.12243038302345328, 3.417621596326039, 0.06551938466489492], "isController": false}, {"data": ["go_home", 655, 0, 0.0, 9435.102290076338, 4944, 14635, 9364.0, 10738.8, 11540.599999999999, 13382.679999999991, 0.5447510944922753, 13.164499197531736, 2.4173134892846213], "isController": true}, {"data": ["go_home/catalog/api/v1/deals/search-356", 654, 0, 0.0, 4270.1299694189565, 2348, 7627, 4188.5, 5150.0, 5551.0, 6910.300000000003, 0.5460023693497312, 0.4174835526178476, 0.2687355411643208], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-515", 140, 0, 0.0, 143.71428571428572, 137, 275, 142.0, 146.0, 149.89999999999998, 235.23000000000033, 0.12245994029203199, 5.484187674560085, 0.06553520242190773], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-514", 140, 0, 0.0, 181.8357142857143, 137, 679, 143.0, 274.0, 276.0, 515.8200000000013, 0.12244548114951817, 4.408308074853109, 0.06552746452142184], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520", 140, 0, 0.0, 244.3571428571428, 191, 457, 245.0, 267.9, 272.84999999999997, 393.8600000000005, 0.12244912238964709, 0.09804471164106313, 0.24286539802087231], "isController": false}, {"data": ["go_tablets/catalog/api/v1/categories/3/products-513", 142, 0, 0.0, 4529.359154929578, 2666, 7501, 4480.0, 5504.4, 5748.25, 7136.359999999994, 0.11979432495476076, 0.2411597311271212, 0.059663189186453115], "isController": false}, {"data": ["go_mice/catalog/fetchImage-547", 140, 0, 0.0, 241.27142857142854, 137, 296, 269.0, 277.0, 281.9, 295.59000000000003, 0.12246047588140928, 3.3960615139198196, 0.06553548904591043], "isController": false}, {"data": ["pay_now", 168, 11, 6.5476190476190474, 5808.886904761907, 4480, 8859, 5726.5, 6839.4, 7195.95, 8244.900000000001, 0.14616385141748484, 0.35429474582280246, 0.5168369487317241], "isController": true}, {"data": ["go_mice/catalog/fetchImage-549", 140, 0, 0.0, 138.33571428571423, 134, 175, 138.0, 141.0, 142.0, 163.9300000000001, 0.12247472427877698, 1.5340224053839013, 0.06554311416481423], "isController": false}, {"data": ["go_mice/catalog/fetchImage-546", 140, 0, 0.0, 138.44285714285718, 134, 165, 138.0, 142.0, 144.0, 163.77, 0.12247450999260778, 1.405030209923497, 0.06554299948823152], "isController": false}, {"data": ["sign_out/accountservice/ws/AccountLogoutRequest-361", 277, 0, 0.0, 700.5162454873646, 459, 1329, 685.0, 818.2, 892.4999999999989, 1062.9199999999973, 0.23361530222398394, 0.2621327951712476, 0.265098614437763], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522", 140, 0, 0.0, 244.65000000000003, 196, 362, 245.0, 267.0, 275.84999999999997, 331.2500000000002, 0.12244794431767193, 0.09869717710477083, 0.28531327650582544], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-579", 52, 0, 0.0, 7094.923076923077, 5507, 9768, 6930.0, 8470.3, 8779.699999999999, 9768.0, 0.04452611370941916, 0.6660069050797446, 0.02208912672303216], "isController": false}, {"data": ["go_mini/app/views/product-page.html-643", 168, 0, 0.0, 136.4642857142858, 132, 149, 136.0, 139.1, 141.0, 146.24, 0.147494179247569, 0.4058970674996576, 0.06654522540271178], "isController": false}, {"data": ["checkout/accountservice/ws/GetCountriesRequest-651", 168, 0, 0.0, 140.98214285714292, 136, 160, 140.0, 144.0, 149.0, 160.0, 0.14689975927676352, 0.7174171907257285, 0.1517772903464998], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-639", 312, 0, 0.0, 136.47435897435906, 132, 161, 136.0, 140.0, 141.0, 149.48000000000002, 0.263824800038559, 0.2973181828559542, 0.11928797111118439], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-637", 320, 0, 0.0, 4704.334375000004, 2887, 7874, 4650.0, 5686.700000000001, 6327.249999999998, 7332.180000000005, 0.2682574332458143, 0.6314815017113986, 0.13360477632359893], "isController": false}, {"data": ["go_home/catalog/api/v1/categories-355", 655, 0, 0.0, 4020.13740458015, 2426, 7290, 3977.0, 4879.2, 5143.599999999999, 6150.6399999999985, 0.5457432856911942, 3.7495261849503163, 0.25794897487747853], "isController": false}, {"data": ["go_mini", 222, 0, 0.0, 16138.608108108107, 3845, 24059, 16078.0, 18616.7, 19562.05, 23355.010000000013, 0.18718018116006183, 3.9080812250268337, 0.35719427447865687], "isController": true}, {"data": ["go_headphones/catalog/api/v1/categories/2/products-526", 140, 0, 0.0, 4572.092857142856, 2920, 7429, 4535.5, 5610.3, 6247.199999999994, 7372.830000000001, 0.12195143197113584, 0.5673693396569506, 0.06073752959499929], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdNewRequest-646", 168, 0, 0.0, 318.2380952380954, 253, 453, 315.0, 353.2, 379.19999999999993, 418.5000000000001, 0.14692686715187514, 0.26320468322829815, 0.1668710415015926], "isController": false}, {"data": ["go_mice/catalog/api/v1/categories/5/products-545", 140, 0, 0.0, 4451.678571428572, 3093, 6821, 4393.0, 5505.100000000001, 5827.75, 6698.410000000001, 0.12208542840648866, 0.41140983980211693, 0.060804266100887905], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-638", 314, 0, 0.0, 4092.8407643312075, 2735, 6790, 4016.0, 5059.5, 5303.0, 6278.900000000001, 0.2639081263531595, 0.2535910074356535, 0.12757277592266988], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-580", 52, 0, 0.0, 4150.538461538461, 2900, 7025, 4069.0, 5036.700000000001, 5720.849999999994, 7025.0, 0.04468175420567011, 0.04125812219772364, 0.02181726279573736], "isController": false}, {"data": ["go_mice/catalog/fetchImage-551", 140, 0, 0.0, 139.9499999999999, 135, 183, 139.0, 143.0, 145.95, 174.39000000000007, 0.12246079723728442, 2.1319838804961937, 0.06553566102151549], "isController": false}, {"data": ["go_mice/catalog/fetchImage-550", 140, 0, 0.0, 138.8000000000001, 134, 170, 138.0, 142.0, 144.95, 166.31000000000003, 0.12247472427877698, 1.3754391662030123, 0.06554311416481423], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/products/3-557", 140, 0, 0.0, 4033.935714285713, 2643, 5515, 3999.5, 4826.9, 4985.95, 5381.340000000001, 0.12211939962614018, 0.12901587464966996, 0.059509355872503854], "isController": false}, {"data": ["go_mice/catalog/fetchImage-553", 140, 0, 0.0, 139.94999999999996, 135, 162, 140.0, 143.0, 147.0, 161.59, 0.12246047588140928, 2.051392356476322, 0.06553548904591043], "isController": false}, {"data": ["go_mice/catalog/fetchImage-552", 140, 0, 0.0, 140.76428571428576, 136, 172, 140.0, 144.0, 147.95, 167.90000000000003, 0.12246026164509617, 3.0400811206294804, 0.0655353743960085], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649", 168, 0, 0.0, 333.87499999999994, 231, 460, 329.0, 382.99999999999994, 412.65, 448.96000000000004, 0.14687291820752094, 0.1395579584139823, 0.17312071511374783], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 168, 11, 6.5476190476190474, 4773.982142857142, 3375, 7609, 4798.5, 5518.5, 5847.549999999999, 7169.470000000001, 0.14629800729922557, 0.09890541959008693, 0.236166102882332], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518", 140, 0, 0.0, 286.25714285714304, 235, 349, 288.0, 311.0, 314.95, 344.90000000000003, 0.12244558824172508, 0.09826565936949268, 0.2639037238764524], "isController": false}, {"data": ["go_mice/catalog/fetchImage-555", 140, 0, 0.0, 141.62142857142857, 136, 268, 140.0, 144.0, 145.95, 227.00000000000034, 0.12246015452722071, 3.700796097610365, 0.06553531707120795], "isController": false}, {"data": ["go_mice/catalog/fetchImage-554", 140, 0, 0.0, 143.29999999999998, 135, 614, 139.0, 144.9, 147.95, 429.91000000000156, 0.12246036876315902, 2.2552021670346307, 0.06553543172090931], "isController": false}, {"data": ["go_speakers", 372, 0, 0.0, 8851.11827956989, 2887, 14797, 8651.0, 10580.8, 11642.0, 12748.179999999997, 0.3118492661482592, 1.3727858020981085, 0.44160144395850726], "isController": true}, {"data": ["go_mini/catalog/api/v1/categories/4/products-642", 168, 0, 0.0, 4726.553571428573, 3084, 7422, 4653.0, 5933.199999999999, 6568.399999999998, 7325.400000000001, 0.14695244251579082, 0.34601802479953675, 0.07103658109894186], "isController": false}, {"data": ["go_laptops", 140, 0, 0.0, 6024.292857142858, 4599, 8982, 5973.5, 7051.900000000001, 7559.849999999999, 8701.560000000003, 0.12182822394464125, 48.79024148719846, 0.7127664938011189], "isController": true}, {"data": ["go_mini/app/views/product-page.html-582", 52, 0, 0.0, 137.73076923076925, 133, 165, 137.0, 140.7, 150.69999999999987, 165.0, 0.04470384134950581, 0.12302287590127672, 0.020169115921359067], "isController": false}, {"data": ["pay_now/accountservice/ws/UpdateSafePayMethodRequest-652", 168, 0, 0.0, 197.17261904761904, 162, 243, 195.0, 216.1, 227.2999999999999, 242.31, 0.14689474991168827, 0.1686994393517045, 0.18630901447394194], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/1/products-558", 140, 0, 0.0, 4741.0071428571455, 2999, 7139, 4652.5, 5711.6, 6160.249999999999, 7112.35, 0.12183617559725833, 0.4893962685713142, 0.05889541691469031], "isController": false}, {"data": ["go_laptops/catalog/api/v1/categories/1/products-533", 140, 0, 0.0, 4400.635714285712, 3068, 6764, 4340.0, 5319.3, 5524.0, 6559.000000000002, 0.12199085591398598, 0.4901265148650215, 0.060757164566535994], "isController": false}, {"data": ["checkout", 168, 0, 0.0, 5694.505952380952, 1876, 8171, 5884.5, 6762.1, 7169.5999999999985, 7769.420000000001, 0.14626807455492713, 1.7862454655808584, 0.9226829433794542], "isController": true}, {"data": ["sign_in/accountservice/ws/AccountLoginRequest-359", 504, 0, 0.0, 543.5079365079371, 359, 822, 535.5, 634.5, 693.0, 749.0, 0.42319405714631175, 0.6368976425089194, 0.478501627754225], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519", 140, 0, 0.0, 257.64285714285717, 202, 312, 257.5, 286.0, 292.0, 310.77, 0.12245051468575262, 0.09934840063228198, 0.7801437087986818], "isController": false}, {"data": ["sign_out", 277, 0, 0.0, 700.5162454873646, 459, 1329, 685.0, 818.2, 892.4999999999989, 1062.9199999999973, 0.23361530222398394, 0.2621327951712476, 0.265098614437763], "isController": true}, {"data": ["go_laptops/catalog/fetchImage-544", 140, 0, 0.0, 161.2, 139, 1004, 144.0, 148.0, 165.64999999999992, 862.1400000000012, 0.12245886912733185, 7.46129008177191, 0.06553462918142369], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-577", 52, 0, 0.0, 4241.211538461539, 2690, 6818, 4067.5, 5830.400000000001, 6407.5999999999985, 6818.0, 0.044718757712910735, 0.042971931239750155, 0.02161697760536212], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-541", 140, 0, 0.0, 147.5785714285714, 138, 406, 143.0, 146.0, 154.79999999999995, 352.70000000000044, 0.12245897624295861, 6.22963914510514, 0.06553468650502081], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-542", 140, 0, 0.0, 155.2214285714285, 138, 1454, 143.0, 146.0, 149.95, 1020.2200000000037, 0.12245886912733185, 6.1645056685335815, 0.06565421792080585], "isController": false}, {"data": ["go_home/app/tempFiles/popularProducts.json-357", 650, 0, 0.0, 136.39230769230755, 132, 186, 136.0, 139.0, 140.0, 145.0, 0.5457039665122465, 0.5142620387542166, 0.262726616689978], "isController": false}, {"data": ["sign_in/order/api/v1/carts/142175287-360", 504, 0, 0.0, 1897.043650793651, 444, 8519, 751.0, 4804.0, 5293.5, 5803.4, 0.4224456080325015, 0.27386163507614497, 0.22028896138729795], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524", 140, 0, 0.0, 242.87142857142854, 201, 281, 243.0, 267.9, 271.95, 280.59000000000003, 0.12245158570430216, 0.09801251783201217, 0.2807776594079116], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-543", 140, 0, 0.0, 142.57142857142856, 136, 271, 141.0, 144.0, 156.84999999999997, 233.6900000000003, 0.12245908335877274, 3.513763341753124, 0.06553474382871823], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525", 140, 0, 0.0, 239.80000000000004, 195, 291, 243.0, 262.0, 266.0, 291.0, 0.1224582264375065, 0.09820234057032294, 0.3126033241285566], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-530", 140, 0, 0.0, 139.7928571428572, 134, 166, 139.0, 143.9, 146.0, 163.13000000000002, 0.12243091835431857, 2.0296033314764643, 0.06551967115055331], "isController": false}, {"data": ["go_special_offer/app/views/product-page.html-559", 140, 0, 0.0, 216.09285714285718, 133, 439, 138.0, 410.0, 413.95, 429.9800000000001, 0.12232415902140674, 0.3366303516819572, 0.05518922018348624], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-640", 170, 0, 0.0, 4209.25294117647, 2507, 6700, 4123.5, 5147.900000000001, 5557.199999999999, 6587.819999999999, 0.1436667472327249, 0.1326697377722696, 0.07014977892222896], "isController": false}, {"data": ["go_home/accountservice/ws/GetAccountConfigurationRequest-354", 655, 0, 0.0, 187.08396946564875, 145, 273, 185.0, 204.0, 212.19999999999993, 225.0, 0.5475123712719004, 0.8394476786102381, 0.5892174151773774], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-531", 140, 0, 0.0, 248.07142857142858, 143, 1363, 266.0, 278.9, 315.5499999999999, 1343.3200000000002, 0.12244515987402144, 11.251462338219334, 0.06552729258883178], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-578", 52, 0, 0.0, 137.0961538461538, 132, 149, 137.0, 141.0, 143.7, 149.0, 0.044842623948893205, 0.050535535192405036, 0.02027552235189214], "isController": false}, {"data": ["go_headphones ", 140, 0, 0.0, 5596.271428571426, 3759, 8505, 5508.5, 6790.700000000001, 7231.749999999996, 8453.75, 0.12186300683042153, 26.175443675190262, 0.386772238475459], "isController": true}, {"data": ["go_special_offer", 140, 0, 0.0, 15993.54285714286, 13081, 20020, 15822.5, 18103.8, 18541.699999999997, 19762.93, 0.12081557416307169, 2.7533292915849366, 0.2317204957580789], "isController": true}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 220, 1, 0.45454545454545453, 8732.72727272727, 3801, 12220, 8589.0, 10339.300000000001, 10898.9, 11844.08, 0.18782020142862874, 0.1532533807102677, 0.1366532030174169], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-576", 52, 0, 0.0, 4458.1538461538485, 3265, 6913, 4360.5, 5475.1, 5860.299999999997, 6913.0, 0.044761871149510676, 0.1053502850448867, 0.02229351004516645], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 12, 100.0, 0.07298826105468037], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 16441, 12, "500", 12, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 168, 11, "500", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 220, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

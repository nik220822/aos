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

    var data = {"OkPercent": 97.81380463842173, "KoPercent": 2.186195361578275};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.47243950581182836, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8055851063829788, 500, 1500, "go_laptops/catalog/fetchImage-534"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/all_data-556"], "isController": false}, {"data": [0.9965681098204857, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523"], "isController": false}, {"data": [0.813031914893617, 500, 1500, "go_laptops/catalog/fetchImage-535"], "isController": false}, {"data": [0.7768691588785047, 500, 1500, "checkout/app/order/views/orderPayment-page.html-650"], "isController": false}, {"data": [0.8069148936170213, 500, 1500, "go_laptops/catalog/fetchImage-536"], "isController": false}, {"data": [0.19009216589861752, 500, 1500, "checkout/accountservice/ws/GetAccountByIdRequest-645"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets "], "isController": true}, {"data": [0.9960401267159451, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521"], "isController": false}, {"data": [0.7559168553200247, 500, 1500, "go_home/services.properties-352"], "isController": false}, {"data": [0.7693974411886092, 500, 1500, "go_home/app/views/home-page.html-358"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-641"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart"], "isController": true}, {"data": [0.7691911916032106, 500, 1500, "go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353"], "isController": false}, {"data": [0.8160127253446448, 500, 1500, "go_headphones/catalog/fetchImage-527"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-581"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now/order/api/v1/carts/142175287-654"], "isController": false}, {"data": [0.0, 500, 1500, "checkout/order/api/v1/carts/142175287-647"], "isController": false}, {"data": [0.5502336448598131, 500, 1500, "checkout/order/api/v1/shippingcost/-648"], "isController": false}, {"data": [0.72880658436214, 500, 1500, "go_home/-349"], "isController": false}, {"data": [0.798936170212766, 500, 1500, "go_laptops/catalog/fetchImage-537"], "isController": false}, {"data": [0.7893617021276595, 500, 1500, "go_laptops/catalog/fetchImage-538"], "isController": false}, {"data": [0.773209549071618, 500, 1500, "go_headphones/catalog/fetchImage-528"], "isController": false}, {"data": [0.7737905369484317, 500, 1500, "go_laptops/catalog/fetchImage-539"], "isController": false}, {"data": [0.0, 500, 1500, "sign_in"], "isController": true}, {"data": [0.7449628844114529, 500, 1500, "go_headphones/catalog/fetchImage-529"], "isController": false}, {"data": [0.768479408658923, 500, 1500, "go_tablets/catalog/fetchImage-517"], "isController": false}, {"data": [0.0, 500, 1500, "go_home"], "isController": true}, {"data": [0.0, 500, 1500, "go_home/catalog/api/v1/deals/search-356"], "isController": false}, {"data": [0.779831045406547, 500, 1500, "go_tablets/catalog/fetchImage-515"], "isController": false}, {"data": [0.7779831045406547, 500, 1500, "go_tablets/catalog/fetchImage-514"], "isController": false}, {"data": [0.9978880675818373, 500, 1500, "go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520"], "isController": false}, {"data": [0.0, 500, 1500, "go_tablets/catalog/api/v1/categories/3/products-513"], "isController": false}, {"data": [0.8004820567755758, 500, 1500, "go_mice/catalog/fetchImage-547"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now"], "isController": true}, {"data": [0.807177289769684, 500, 1500, "go_mice/catalog/fetchImage-549"], "isController": false}, {"data": [0.8042313872522764, 500, 1500, "go_mice/catalog/fetchImage-546"], "isController": false}, {"data": [0.0016108247422680412, 500, 1500, "sign_out/accountservice/ws/AccountLogoutRequest-361"], "isController": false}, {"data": [0.9973600844772967, 500, 1500, "go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522"], "isController": false}, {"data": [0.8019187358916479, 500, 1500, "go_mini/app/views/product-page.html-643"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/all_data-579"], "isController": false}, {"data": [0.9976635514018691, 500, 1500, "checkout/accountservice/ws/GetCountriesRequest-651"], "isController": false}, {"data": [0.7630637079455977, 500, 1500, "go_speakers/app/views/category-page.html-639"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-637"], "isController": false}, {"data": [0.0, 500, 1500, "go_home/catalog/api/v1/categories-355"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini"], "isController": true}, {"data": [0.0, 500, 1500, "go_headphones/catalog/api/v1/categories/2/products-526"], "isController": false}, {"data": [0.29700115340253747, 500, 1500, "checkout/accountservice/ws/GetAccountByIdNewRequest-646"], "isController": false}, {"data": [0.0, 500, 1500, "go_mice/catalog/api/v1/categories/5/products-545"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-638"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/products/24-580"], "isController": false}, {"data": [0.8110932475884244, 500, 1500, "go_mice/catalog/fetchImage-551"], "isController": false}, {"data": [0.7929833958221746, 500, 1500, "go_mice/catalog/fetchImage-550"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/products/3-557"], "isController": false}, {"data": [0.8046623794212219, 500, 1500, "go_mice/catalog/fetchImage-553"], "isController": false}, {"data": [0.8064343163538874, 500, 1500, "go_mice/catalog/fetchImage-552"], "isController": false}, {"data": [0.24007009345794392, 500, 1500, "checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649"], "isController": false}, {"data": [0.0, 500, 1500, "pay_now/order/api/v1/orders/users/142175287-653"], "isController": false}, {"data": [0.9384899683210137, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518"], "isController": false}, {"data": [0.8108252947481244, 500, 1500, "go_mice/catalog/fetchImage-555"], "isController": false}, {"data": [0.806970509383378, 500, 1500, "go_mice/catalog/fetchImage-554"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers"], "isController": true}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/categories/4/products-642"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops"], "isController": true}, {"data": [0.7665816326530612, 500, 1500, "go_mini/app/views/product-page.html-582"], "isController": false}, {"data": [0.0, 500, 1500, "go_special_offer/catalog/api/v1/categories/1/products-558"], "isController": false}, {"data": [0.48598130841121495, 500, 1500, "pay_now/accountservice/ws/UpdateSafePayMethodRequest-652"], "isController": false}, {"data": [0.0, 500, 1500, "go_laptops/catalog/api/v1/categories/1/products-533"], "isController": false}, {"data": [5.76036866359447E-4, 500, 1500, "checkout"], "isController": true}, {"data": [0.010406004776526782, 500, 1500, "sign_in/accountservice/ws/AccountLoginRequest-359"], "isController": false}, {"data": [0.997624076029567, 500, 1500, "go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519"], "isController": false}, {"data": [0.0016108247422680412, 500, 1500, "sign_out"], "isController": true}, {"data": [0.7831646244006393, 500, 1500, "go_laptops/catalog/fetchImage-544"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/attributes-577"], "isController": false}, {"data": [0.7959020755721128, 500, 1500, "go_laptops/catalog/fetchImage-541"], "isController": false}, {"data": [0.7871603622802344, 500, 1500, "go_laptops/catalog/fetchImage-542"], "isController": false}, {"data": [0.76392901361948, 500, 1500, "go_home/app/tempFiles/popularProducts.json-357"], "isController": false}, {"data": [0.0, 500, 1500, "sign_in/order/api/v1/carts/142175287-360"], "isController": false}, {"data": [0.997624076029567, 500, 1500, "go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524"], "isController": false}, {"data": [0.8079787234042554, 500, 1500, "go_laptops/catalog/fetchImage-543"], "isController": false}, {"data": [0.996832101372756, 500, 1500, "go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525"], "isController": false}, {"data": [0.7945387062566278, 500, 1500, "go_headphones/catalog/fetchImage-530"], "isController": false}, {"data": [0.7438423645320197, 500, 1500, "go_special_offer/app/views/product-page.html-559"], "isController": false}, {"data": [0.0, 500, 1500, "go_mini/catalog/api/v1/products/24-640"], "isController": false}, {"data": [0.5441448857789669, 500, 1500, "go_home/accountservice/ws/GetAccountConfigurationRequest-354"], "isController": false}, {"data": [0.7076923076923077, 500, 1500, "go_headphones/catalog/fetchImage-531"], "isController": false}, {"data": [0.7448979591836735, 500, 1500, "go_speakers/app/views/category-page.html-578"], "isController": false}, {"data": [0.0, 500, 1500, "go_headphones "], "isController": true}, {"data": [0.0, 500, 1500, "go_special_offer"], "isController": true}, {"data": [0.0, 500, 1500, "add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584"], "isController": false}, {"data": [0.0, 500, 1500, "go_speakers/catalog/api/v1/categories/4/products-576"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 151862, 3320, 2.186195361578275, 13512.547194162855, 117, 227726, 3153.0, 43566.600000000006, 129412.45000000019, 180130.0, 15.68044447372285, 199.77742030922522, 12.446006978898485], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["go_laptops/catalog/fetchImage-534", 1880, 0, 0.0, 950.9829787234042, 122, 20129, 127.0, 2784.1000000000017, 4992.749999999999, 12000.550000000003, 0.19842151463374502, 5.2733500350641425, 0.1061865136907151], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/all_data-556", 1855, 0, 0.0, 56501.17358490559, 21241, 130106, 55109.0, 75131.6, 83965.4, 108379.00000000012, 0.19679459269990723, 2.891329275830643, 0.09762856747221961], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/b5366d45-01b6-407d-a8df-877292e40197-523", 1894, 0, 0.0, 227.9297782470961, 179, 720, 229.0, 248.0, 259.0, 359.0999999999999, 0.19889822564720158, 0.1601407529179966, 0.2896066937890406], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-535", 1880, 0, 0.0, 910.4718085106381, 123, 18174, 130.0, 2503.500000000004, 4706.149999999993, 11559.000000000005, 0.1984153997368463, 7.549719564766322, 0.10618324126542165], "isController": false}, {"data": ["checkout/app/order/views/orderPayment-page.html-650", 856, 0, 0.0, 1132.7359813084115, 118, 16834, 122.0, 4056.2000000000085, 6084.649999999997, 11540.13999999997, 0.09131960239274427, 0.12235399851840345, 0.042181808527117226], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-536", 1880, 0, 0.0, 915.263829787233, 122, 17492, 128.0, 2701.5000000000014, 4889.349999999998, 11311.560000000001, 0.19842151463374502, 5.643440090396831, 0.1061865136907151], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdRequest-645", 868, 0, 0.0, 1715.1013824884808, 512, 3869, 1622.5, 2347.0, 2614.6999999999994, 3378.9099999999967, 0.09222836806471627, 0.1714377304181802, 0.10501784879244058], "isController": false}, {"data": ["go_tablets ", 1904, 0, 0.0, 36598.081932773166, 15814, 94897, 34775.0, 51255.5, 58289.75, 70955.3, 0.19916888831332613, 23.21356534891795, 4.712516570820125], "isController": true}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/620ff323-cc1b-425b-9a59-8af48e17efaf-521", 1894, 0, 0.0, 228.73706441393867, 177, 1207, 229.0, 248.0, 259.0, 395.8499999999983, 0.19889839274556442, 0.16031266490635288, 0.504821213618869], "isController": false}, {"data": ["go_home/services.properties-352", 4859, 0, 0.0, 1410.5305618439997, 118, 20636, 121.0, 4971.0, 8673.0, 13090.8, 0.5044117602787002, 0.6787884820937977, 0.22068014512193132], "isController": false}, {"data": ["go_home/app/views/home-page.html-358", 4846, 0, 0.0, 1288.5474618241844, 118, 20871, 122.0, 4473.3, 8171.449999999988, 12622.71, 0.5037390619185327, 1.3292035162072795, 0.22579709904356107], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-641", 887, 0, 0.0, 59912.05186020296, 7740, 138006, 57727.0, 81788.00000000001, 91681.39999999992, 117093.44, 0.09287595364076356, 1.3644719237994685, 0.04607518012647255], "isController": false}, {"data": ["go_mice", 1876, 0, 0.0, 38429.80063965877, 13665, 143517, 34086.0, 57215.299999999996, 78439.34999999996, 108368.24, 0.19773015062273402, 34.218682774647284, 1.0458639418938964], "isController": true}, {"data": ["add_to_cart", 1278, 727, 56.88575899843506, 146498.29029733982, 34424, 180633, 180121.0, 180128.0, 180131.0, 180280.42, 0.13435547219956098, 0.259816723675316, 0.09775090759592013], "isController": true}, {"data": ["go_home/catalog/api/v1/DemoAppConfig/parameters/by_tool/ALL-353", 4859, 0, 0.0, 1348.7030253138519, 121, 20392, 126.0, 4834.0, 8460.0, 12809.199999999975, 0.504411917367383, 3.4352616007474306, 0.2512207791575833], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-527", 1886, 0, 0.0, 928.4199363732769, 121, 20208, 125.0, 2658.9999999999995, 4957.65, 12334.579999999945, 0.1985720082536887, 3.349696872518508, 0.10626705129201308], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/4/products-581", 392, 0, 0.0, 29317.50255102042, 14529, 54921, 28245.0, 38380.9, 44216.94999999999, 50287.58999999998, 0.04160211440623913, 0.09795672445513434, 0.020110397100672237], "isController": false}, {"data": ["pay_now/order/api/v1/carts/142175287-654", 829, 329, 39.68636911942099, 125300.44752714115, 3547, 181365, 151144.0, 180366.0, 180372.0, 180516.2, 0.08844741289183458, 0.131368938898308, 0.05778115731492646], "isController": false}, {"data": ["checkout/order/api/v1/carts/142175287-647", 867, 394, 45.444059976931946, 129122.44175317184, 2513, 180878, 165207.0, 180127.0, 180130.0, 180146.32, 0.0917346158827219, 0.15259509768943041, 0.04783320912921313], "isController": false}, {"data": ["checkout/order/api/v1/shippingcost/-648", 856, 0, 0.0, 5530.334112149534, 137, 58625, 480.0, 18404.0, 30330.59999999999, 47300.36999999999, 0.09130128110843168, 0.06008905971333104, 0.07654350578707197], "isController": false}, {"data": ["go_home/-349", 4860, 0, 0.0, 1708.09547325103, 354, 20540, 364.0, 5823.200000000015, 8999.349999999995, 13034.220000000032, 0.504464929826437, 1.6592486137269995, 0.27193812623456376], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-537", 1880, 0, 0.0, 909.0590425531921, 122, 20877, 128.0, 2462.5000000000005, 4387.0, 12437.190000000006, 0.19841900161679824, 6.52413843507725, 0.1061851688339897], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-538", 1880, 0, 0.0, 966.2872340425523, 124, 21655, 137.0, 2729.000000000001, 4654.749999999999, 11175.740000000009, 0.19841782889734041, 9.773643054241418, 0.10618454124584233], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-528", 1885, 0, 0.0, 1110.1183023872677, 124, 20041, 241.0, 3165.6000000000017, 6064.399999999998, 11474.579999999962, 0.1984366769088766, 9.527587548801211, 0.106194627877016], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-539", 1881, 0, 0.0, 1063.0265816055298, 238, 19409, 434.0, 2760.999999999998, 4406.0999999999985, 11090.880000000023, 0.1983717068161088, 6.037501328805691, 0.10615985872580821], "isController": false}, {"data": ["sign_in", 2931, 1306, 44.558171272603204, 133613.62811327193, 4203, 233087, 169919.0, 194294.6, 203143.2, 217415.63999999993, 0.303251840565888, 0.9531679026407948, 0.5010324326472593], "isController": true}, {"data": ["go_headphones/catalog/fetchImage-529", 1886, 0, 0.0, 1284.17126193001, 239, 19553, 481.0, 3267.5999999999995, 5991.449999999984, 11969.069999999972, 0.19857537435827569, 7.30645927407013, 0.10626885268392096], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-517", 1894, 0, 0.0, 1283.2914466737059, 238, 20730, 256.0, 3633.5, 7138.25, 12411.399999999998, 0.19892153858143108, 5.553040265522706, 0.10645410463146895], "isController": false}, {"data": ["go_home", 4860, 0, 0.0, 55926.36152263387, 2615, 137492, 51927.0, 81072.70000000001, 93624.0, 111874.06000000008, 0.5040623170375655, 12.124537869950366, 2.2387005544426195], "isController": true}, {"data": ["go_home/catalog/api/v1/deals/search-356", 4853, 0, 0.0, 24606.857819905243, 3541, 51281, 24183.0, 32100.4, 34712.6, 41513.520000000004, 0.5035581629393021, 0.3850383760114354, 0.24784503332168775], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-515", 1894, 0, 0.0, 1160.7761351636755, 124, 17173, 130.0, 3525.0, 7454.0, 12377.599999999999, 0.19889375587020114, 8.90726908929815, 0.10643923653991232], "isController": false}, {"data": ["go_tablets/catalog/fetchImage-514", 1894, 0, 0.0, 1179.7111932418175, 122, 21880, 240.0, 3580.0, 7292.25, 12357.749999999998, 0.19892402478127022, 7.162136916063724, 0.10645543513685164], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/events/1/d7c17c33-f711-4d24-9cd9-fcba222273ba-520", 1894, 0, 0.0, 226.72069693769805, 179, 694, 228.0, 248.0, 259.0, 337.2999999999997, 0.1988985180695208, 0.15962165608429937, 0.39449500996015313], "isController": false}, {"data": ["go_tablets/catalog/api/v1/categories/3/products-513", 1904, 0, 0.0, 30935.755252100847, 13692, 69647, 30105.0, 40380.5, 45208.25, 55164.10000000002, 0.19916888831332613, 0.40106875676928394, 0.09919544242167609], "isController": false}, {"data": ["go_mice/catalog/fetchImage-547", 1867, 0, 0.0, 1022.8264595607932, 122, 21206, 241.0, 3033.8000000000015, 5692.399999999992, 10526.679999999997, 0.1978076512889494, 5.485892064730726, 0.10585800088510183], "isController": false}, {"data": ["pay_now", 856, 593, 69.27570093457943, 267850.6507009344, 34984, 365048, 303860.5, 361882.3, 362234.45, 363268.59, 0.09080742439804543, 0.4158953599448239, 0.31920766003721196], "isController": true}, {"data": ["go_mice/catalog/fetchImage-549", 1867, 0, 0.0, 975.8194965184782, 120, 19030, 124.0, 2820.2000000000007, 5925.999999999996, 11811.03999999999, 0.19784999473318438, 2.4780716807775645, 0.10588066124393072], "isController": false}, {"data": ["go_mice/catalog/fetchImage-546", 1867, 0, 0.0, 962.2978039635773, 120, 20105, 124.0, 2858.4000000000005, 5758.999999999998, 11342.84, 0.1978500576329694, 2.269714296654967, 0.10588069490514376], "isController": false}, {"data": ["sign_out/accountservice/ws/AccountLogoutRequest-361", 1552, 0, 0.0, 4320.040592783499, 641, 12694, 4077.0, 5955.800000000001, 6907.35, 8872.070000000002, 0.1615918126259638, 0.18131737569065662, 0.1833688342493847], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/pageload/1/6ea04151-1bde-41c1-ba57-280a00daab1e-522", 1894, 0, 0.0, 227.6214361140445, 182, 731, 227.0, 248.0, 260.0, 405.2999999999997, 0.19889885226750995, 0.15953977858246868, 0.46344986475613154], "isController": false}, {"data": ["go_mini/app/views/product-page.html-643", 886, 0, 0.0, 1177.4514672686214, 118, 20288, 355.0, 3533.300000000003, 7118.099999999997, 12991.709999999997, 0.09414730014552453, 0.2590896832397616, 0.04247661393284407], "isController": false}, {"data": ["go_mini/catalog/api/v1/categories/all_data-579", 392, 0, 0.0, 57209.37755102037, 20582, 108624, 56722.0, 76278.4, 82669.29999999997, 96106.56999999996, 0.041499605171486, 0.6098294031425153, 0.020587694753041886], "isController": false}, {"data": ["checkout/accountservice/ws/GetCountriesRequest-651", 856, 0, 0.0, 133.02219626168224, 122, 960, 124.0, 133.0, 145.14999999999998, 362.42999999999995, 0.09131953419783204, 0.445986592484125, 0.09435162810674443], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-639", 2794, 0, 0.0, 1385.6066571224062, 117, 19999, 123.0, 5055.0, 8155.25, 12579.200000000019, 0.2920416660046777, 0.32911726813417774, 0.13204618296891188], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-637", 2805, 0, 0.0, 31080.533689839558, 4771, 81807, 30021.0, 40828.0, 46062.099999999984, 54127.4, 0.29163697445301695, 0.6866110847510044, 0.1452488837607799], "isController": false}, {"data": ["go_home/catalog/api/v1/categories-355", 4858, 0, 0.0, 23347.214697406307, 2505, 51771, 22948.5, 31041.1, 34075.25, 40591.37999999998, 0.5041299115178326, 3.4006997949767053, 0.23828015349085058], "isController": false}, {"data": ["go_mini", 1280, 0, 0.0, 115032.09296875006, 4237, 211507, 112761.5, 144948.9, 159252.1, 189382.84000000008, 0.13379091218957503, 2.7698743615468926, 0.2564902196883362], "isController": true}, {"data": ["go_headphones/catalog/api/v1/categories/2/products-526", 1894, 0, 0.0, 30364.508975712783, 12960, 66447, 29406.0, 39843.5, 43888.0, 52256.399999999994, 0.19862266611812973, 0.891410483365142, 0.0989233981643029], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountByIdNewRequest-646", 867, 0, 0.0, 1463.537485582467, 499, 3577, 1401.0, 2050.8, 2329.9999999999995, 3290.079999999999, 0.09225713628102863, 0.16527418794965376, 0.10478032177230108], "isController": false}, {"data": ["go_mice/catalog/api/v1/categories/5/products-545", 1876, 0, 0.0, 29361.506396588447, 12551, 63504, 28924.5, 37531.9, 40142.15, 47411.98, 0.19773015062273402, 0.6664100103049451, 0.09847888361093199], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-638", 2797, 0, 0.0, 24292.789417232765, 3469, 50655, 23967.0, 31387.200000000004, 33635.49999999999, 40528.259999999995, 0.29164359255273437, 0.28024871906083254, 0.14098005694687843], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-580", 392, 0, 0.0, 24396.201530612238, 12201, 42445, 23615.0, 31692.5, 35103.54999999999, 41979.67, 0.041671468098577684, 0.03848190987885934, 0.020347396532508638], "isController": false}, {"data": ["go_mice/catalog/fetchImage-551", 1866, 0, 0.0, 1006.7786709539113, 121, 20384, 125.0, 3074.999999999999, 6135.249999999991, 11931.249999999998, 0.19775106383925742, 3.4428467003496994, 0.1058277177577276], "isController": false}, {"data": ["go_mice/catalog/fetchImage-550", 1867, 0, 0.0, 1065.5286555972145, 120, 20424, 358.0, 3106.2000000000053, 5708.399999999999, 11602.759999999998, 0.19784997376659827, 2.222009523179179, 0.10588065002353111], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/products/3-557", 1865, 0, 0.0, 23494.463806970507, 11784, 44428, 23122.0, 29846.600000000002, 31816.6, 39175.65999999994, 0.19735869514261625, 0.20851499642346888, 0.09617381726188037], "isController": false}, {"data": ["go_mice/catalog/fetchImage-553", 1866, 0, 0.0, 1034.5375133976413, 121, 20275, 125.0, 3296.1999999999966, 6006.899999999994, 12131.179999999997, 0.1977511476666954, 3.312656999250061, 0.10582776261850496], "isController": false}, {"data": ["go_mice/catalog/fetchImage-552", 1865, 0, 0.0, 1046.521715817694, 122, 17953, 126.0, 3237.4, 6119.99999999998, 12441.219999999988, 0.19764527643155852, 4.906699018738892, 0.10577110496532624], "isController": false}, {"data": ["checkout/accountservice/ws/GetAccountPaymentPreferencesRequest-649", 856, 0, 0.0, 1622.4088785046745, 344, 5178, 1529.5, 2295.9, 2615.45, 3746.0999999999967, 0.09130118372624663, 0.08675395680238082, 0.1076177038648239], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 856, 539, 62.967289719626166, 145440.98364485992, 22523, 180854, 180122.0, 180128.0, 180131.0, 180277.31, 0.09082206916864491, 0.18101789643037436, 0.14660215282521355], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/00206fab-3501-416d-ae27-ac520cc8bd34-518", 1894, 0, 0.0, 472.5353748680034, 408, 1538, 460.0, 533.0, 588.0, 778.0999999999999, 0.19888924452330006, 0.1600155905304147, 0.42866070572551096], "isController": false}, {"data": ["go_mice/catalog/fetchImage-555", 1866, 0, 0.0, 1000.2727759914251, 122, 19270, 129.0, 2837.0, 5620.8999999999905, 12146.169999999996, 0.19771255264917867, 5.975165289243611, 0.10580710825366203], "isController": false}, {"data": ["go_mice/catalog/fetchImage-554", 1865, 0, 0.0, 1001.247721179624, 120, 20580, 125.0, 3150.0000000000023, 5870.399999999998, 11999.959999999968, 0.1976454649426754, 3.6398252048412436, 0.10577120584822863], "isController": false}, {"data": ["go_speakers", 3197, 0, 0.0, 56649.111667188, 4771, 117219, 55257.0, 72985.0, 80019.99999999999, 90376.68, 0.33239337159582716, 1.4744506556542432, 0.47559787642925516], "isController": true}, {"data": ["go_mini/catalog/api/v1/categories/4/products-642", 886, 0, 0.0, 30430.904063205406, 12426, 73036, 29667.5, 40879.50000000001, 46351.049999999996, 55289.02, 0.09377307614109186, 0.22079097255671656, 0.04532975848617233], "isController": false}, {"data": ["go_laptops", 1884, 0, 0.0, 39698.08917197445, 13985, 161605, 35471.0, 58277.5, 74074.0, 108349.40000000037, 0.19805510725672232, 79.11664513574054, 1.156149830035551], "isController": true}, {"data": ["go_mini/app/views/product-page.html-582", 392, 0, 0.0, 1416.1913265306127, 118, 15932, 355.5, 4987.099999999997, 9082.199999999993, 13308.23999999999, 0.0417166663615958, 0.11480303783930441, 0.018821386581110607], "isController": false}, {"data": ["go_special_offer/catalog/api/v1/categories/1/products-558", 1839, 0, 0.0, 29306.9624796084, 13926, 69616, 28672.0, 38225.0, 41055.0, 50018.99999999997, 0.1965847068429223, 0.7897789678763059, 0.09502874012426421], "isController": false}, {"data": ["pay_now/accountservice/ws/UpdateSafePayMethodRequest-652", 856, 0, 0.0, 1061.4415887850469, 138, 4553, 957.5, 1724.6000000000008, 2076.3, 3030.29, 0.09131853077018433, 0.10487362518138357, 0.11582567307144545], "isController": false}, {"data": ["go_laptops/catalog/api/v1/categories/1/products-533", 1884, 0, 0.0, 30174.938959660332, 12573, 70564, 29642.0, 38588.0, 41962.25, 51357.300000000025, 0.19805510725672232, 0.7955983842424664, 0.09864072724700036], "isController": false}, {"data": ["checkout", 868, 394, 45.39170506912443, 140452.75345622122, 512, 248303, 177428.0, 201526.80000000002, 215662.65, 236683.87, 0.09179399734939545, 1.1963931532279761, 0.5744073166689861], "isController": true}, {"data": ["sign_in/accountservice/ws/AccountLoginRequest-359", 2931, 0, 0.0, 6918.5789832821565, 462, 53150, 3565.0, 17708.600000000006, 24727.00000000001, 38153.99999999992, 0.30467658284474375, 0.45841281506375703, 0.3444994708700185], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/use-counters/1/6dddaf0e-5f82-42c7-8aa6-55ce25bd02b8-519", 1894, 0, 0.0, 229.22069693769782, 181, 813, 229.0, 249.0, 263.0, 378.0, 0.1988981003236137, 0.1602821759158134, 1.2671984438586483], "isController": false}, {"data": ["sign_out", 1552, 0, 0.0, 4320.040592783499, 641, 12694, 4077.0, 5955.800000000001, 6907.35, 8872.070000000002, 0.1615918126259638, 0.18131737569065662, 0.1833688342493847], "isController": true}, {"data": ["go_laptops/catalog/fetchImage-544", 1877, 0, 0.0, 999.7575919019706, 125, 19177, 238.0, 2869.8, 5062.899999999998, 11534.300000000014, 0.1981088781907984, 12.071140096177533, 0.10601920434429445], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/attributes-577", 392, 0, 0.0, 23444.336734693872, 10583, 40409, 23154.0, 30348.1, 32304.8, 37185.40999999998, 0.04176646578985501, 0.04013444297039482, 0.020189844302713113], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-541", 1879, 0, 0.0, 977.1633847791381, 124, 20149, 158.0, 2870.0, 4757.0, 11500.800000000012, 0.19834276648997376, 10.089942538324541, 0.10614437112940002], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-542", 1877, 0, 0.0, 960.3580181140111, 124, 18563, 132.0, 2923.800000000002, 5100.999999999998, 10548.58000000002, 0.1980502026136929, 9.969816254229142, 0.10618121214347402], "isController": false}, {"data": ["go_home/app/tempFiles/popularProducts.json-357", 4846, 0, 0.0, 1347.2723895996705, 118, 19817, 123.0, 4770.6, 8165.549999999983, 12597.729999999989, 0.5037392190087855, 0.4747151819760527, 0.24252288571419064], "isController": false}, {"data": ["sign_in/order/api/v1/carts/142175287-360", 2931, 1306, 44.558171272603204, 126695.042988741, 2313, 181150, 160764.0, 180133.0, 180361.0, 180376.36, 0.30331290964317736, 0.4969988039397149, 0.15817577276750935], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/messaging-system/1/84bca5fc-a974-4bd1-8ff2-416d5615d95e-524", 1894, 0, 0.0, 227.4540654699049, 181, 658, 229.0, 248.0, 261.0, 315.2999999999997, 0.19889881049269986, 0.16058261586065742, 0.4560687568719329], "isController": false}, {"data": ["go_laptops/catalog/fetchImage-543", 1880, 0, 0.0, 894.1218085106384, 122, 19933, 127.0, 2692.6000000000004, 4516.649999999995, 10944.580000000005, 0.19835967103103666, 5.692054364094768, 0.1061534177002032], "isController": false}, {"data": ["go_tablets/submit/firefox-desktop/newtab/1/7ec3ad75-b3b2-4907-a6dd-54ac9e4603e5-525", 1894, 0, 0.0, 228.2249208025339, 181, 742, 229.0, 248.0, 259.0, 379.14999999999986, 0.19889983398059793, 0.16021106699180596, 0.5077384433840654], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-530", 1886, 0, 0.0, 1004.458642629904, 121, 20381, 125.0, 2897.3, 5097.249999999991, 12301.239999999994, 0.19857307452291661, 3.2919332639827923, 0.10626762191265458], "isController": false}, {"data": ["go_special_offer/app/views/product-page.html-559", 1827, 0, 0.0, 1408.6316365626712, 118, 20311, 133.0, 4965.000000000002, 8230.999999999989, 12075.52, 0.1958896623331842, 0.5390799013574392, 0.08837990624797959], "isController": false}, {"data": ["go_mini/catalog/api/v1/products/24-640", 888, 0, 0.0, 24839.06531531532, 3104, 51859, 24500.0, 31831.0, 35295.899999999994, 43106.15, 0.09287222413498099, 0.08577529880435379, 0.04534776569090869], "isController": false}, {"data": ["go_home/accountservice/ws/GetAccountConfigurationRequest-354", 4859, 0, 0.0, 922.5379707758807, 129, 4418, 845.0, 1541.0, 1815.0, 2435.199999999999, 0.5044096657722797, 0.773362475842265, 0.5428314957822777], "isController": false}, {"data": ["go_headphones/catalog/fetchImage-531", 1885, 0, 0.0, 1195.5209549071621, 128, 20395, 270.0, 3031.0000000000005, 5543.49999999999, 12841.419999999975, 0.1983844872381943, 18.22928581959525, 0.10616669824856492], "isController": false}, {"data": ["go_speakers/app/views/category-page.html-578", 392, 0, 0.0, 1637.8571428571431, 118, 18096, 124.0, 6071.5, 10230.449999999988, 17445.32, 0.04179190912903743, 0.04709752259268475, 0.018896146412836257], "isController": false}, {"data": ["go_headphones ", 1894, 0, 0.0, 35862.65469904964, 13390, 121369, 32965.0, 50206.5, 62711.5, 85176.94999999997, 0.19862266611812973, 42.43963373777839, 0.6280371000975391], "isController": true}, {"data": ["go_special_offer", 1865, 0, 0.0, 109971.00965147455, 11784, 213779, 108534.0, 136301.4, 146687.0, 176882.3999999999, 0.19729808471694124, 4.405122426403848, 0.374743421576709], "isController": true}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 1278, 727, 56.88575899843506, 146498.28873239463, 34424, 180633, 180121.0, 180128.0, 180131.0, 180280.42, 0.13435547219956098, 0.259816723675316, 0.09775090759592013], "isController": false}, {"data": ["go_speakers/catalog/api/v1/categories/4/products-576", 392, 0, 0.0, 31315.750000000004, 13140, 64057, 30414.0, 41987.69999999999, 48337.1, 56292.1, 0.04173824011775294, 0.09824075048124084, 0.020787600058646487], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 3257, 98.10240963855422, 2.144710329114591], "isController": false}, {"data": ["500", 42, 1.2650602409638554, 0.027656688309122757], "isController": false}, {"data": ["504", 21, 0.6325301204819277, 0.013828344154561379], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 151862, 3320, "504/Gateway Time-out", 3257, "500", 42, "504", 21, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["add_to_cart", 33, 8, "504", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now/order/api/v1/carts/142175287-654", 829, 329, "504/Gateway Time-out", 328, "500", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["checkout/order/api/v1/carts/142175287-647", 867, 394, "504/Gateway Time-out", 394, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["sign_in", 97, 5, "504", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now", 30, 12, "504", 8, "500", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["pay_now/order/api/v1/orders/users/142175287-653", 856, 539, "504/Gateway Time-out", 521, "500", 18, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["sign_in/order/api/v1/carts/142175287-360", 2931, 1306, "504/Gateway Time-out", 1306, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["add_to_cart/order/api/v1/carts/142175287/product/24/color/C3C3C3?quantity=1-584", 1278, 727, "504/Gateway Time-out", 708, "500", 19, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

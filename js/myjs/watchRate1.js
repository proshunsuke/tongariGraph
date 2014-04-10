/**
 * Created by shunsuke on 14/04/09.
 */
window.onload = function(){
    chart.init();
}

{
    let mThZoka;
    let mThGen;
    let mT;

    let mStart;
    let mEnd;

    let csvData;

    let graph;

    let options = {
        chart: {
            renderTo: "container",
            type: "line"
        },
        title: {text: "オリンピック"},
        xAxis: {
            title: {text: "時間(m)"},
            plotLines: []
        },
        yAxis: {title: {text: "視聴率(%)"}},

        series: []
    }

    let createGraphFromCsv = function(csv) {
        $.get(csv, function (content) {
            let chartData = [];
            let chartDataX = [];
            let lines = content.split('\n');
            for(let i=0; i < lines.length-1; i++) {
                let items = lines[i].split('\t');
                chartDataX.push(parseFloat(items[0]));
                chartData.push(parseFloat(items[1]));
            }
            options.series.push({name: "視聴率", data: chartData});
            options.xAxis.categories = chartDataX;
            inputStartEnd(chartData);
            plotStart(mStart);
            plotEnd(mEnd);
            plotTongari(mStart,mEnd,chartData);
            graph = new Highcharts.Chart(options);
        });
    }

    let inputStartEnd = function(data) {
        let isZoka = true;
        for(let i=0; i < data.length-1; i++){
//            console.log((data[i+mT] - data[i]) / data[i]);
            if (isZoka) {
                if((data[i+mT] - data[i]) / data[i] > mThZoka){
                    // 始点の処理
//                    console.log("始点");
                    mStart.push(i+Math.round(mT/2));
                    isZoka = false;
                }
            }else{
                if((data[i+mT] - data[i]) / data[i] < mThGen){
                    // 終点の処理
//                    console.log("終点");
                    mEnd.push(i+Math.round(mT/2));
                    isZoka = true;
                }
            }
        }
    }

    let plotStart = function(data){
        for(let i=0; i < data.length; i++){
            options.xAxis.plotLines.push({
                value: data[i],
                width: 1,
                color: 'red',
                label: {
                    text: '始点'
                }
            });
        }
    }

    let plotEnd = function(data){
        for(let i=0; i < data.length; i++) {
            options.xAxis.plotLines.push({
                value:data[i],
                width: 1,
                color: 'blue',
                label: {
                    text: '終点'
                }
            });
        }
    }

    let plotTongari = function(start,end,data){
        for(let i=0; i < end.length; i++){
            let max = 0;
            let maxX = 0;
            for(let j=start[i]; j < end[i]+1; j++){
                if(data[j] > max){
                    max = data[j];
                    maxX = j;
                }
            }
            options.xAxis.plotLines.push({
                value: maxX,
                width: 2,
                color: 'green',
                label: {
                    text: 'とんがり'
                }
            });
        }
    }

    let mouseEvent = function(){
        $("select[name=thzoka]").change(function(){
            mThZoka = parseFloat($("select[name=thzoka]").children(':selected').attr("value"));
            initGraph();
            createGraphFromCsv("data/"+csvData);
        });

        $("select[name=thgen]").change(function(){
            mThGen = parseFloat($("select[name=thgen]").children(':selected').attr("value"));
            initGraph();
            createGraphFromCsv("data/"+csvData);
        });

        $("select[name=t]").change(function(){
            mT = Number($("select[name=t]").children(':selected').attr("value"));
            initGraph();
            createGraphFromCsv("data/"+csvData);
        });

        $("select[name=csv]").change(function(){
            csvData = $("select[name=csv]").children(':selected').attr("value");
            options.title.text = $("select[name=csv]").children(':selected').html();

            initGraph();
            createGraphFromCsv("data/"+csvData);
        });
    }

    let initGraph = function(){
        options.series = [];
        options.xAxis.plotLines = [];
        mStart = [];
        mEnd = [];
    }

    var chart = {
        init: function () {
            mThZoka = 0.1;
            mThGen = -0.1;
            mT = 3;
            mStart = [];
            mEnd = [];
            csvData = "watchData.csv";

            mouseEvent();
            createGraphFromCsv("data/"+csvData);
        }
    }
}
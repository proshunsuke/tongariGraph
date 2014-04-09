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

    let graph;

    let options = {
        chart: {
            renderTo: "container",
            type: "line"
        },
        title: {text: "グラフ"},
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
            plotStartFin(chartData);
            graph = new Highcharts.Chart(options);
        });
    }

    let plotStartFin = function(data) {
        let isZoka = true;
        for(let i=0; i < data.length-1; i++){
            console.log((data[i+mT] - data[i]) / data[i]);
            if (isZoka) {
                if((data[i+mT] - data[i]) / data[i] > mThZoka){
                    // 始点の処理
                    console.log("始点");
                    options.xAxis.plotLines.push({
                        value: i+Math.round(mT/2),
                        width: 1,
                        color: 'red',
                        label: {
                            text: '始点'
                        }
                    });
                    isZoka = false;
                }
            }else{
                if((data[i+mT] - data[i]) / data[i] < mThGen){
                    // 終点の処理
                    console.log("終点");
                    options.xAxis.plotLines.push({
                        value: i+Math.round(mT/2),
                        width: 1,
                        color: 'blue',
                        label: {
                            text: '終点'
                        }
                    });
                    isZoka = true;
                }
            }
        }
    }

    let mouseEvent = function(){
        $("select[name=thzoka]").change(function(){
            mThZoka = $("select[name=thzoka]").children(':selected').attr("value");
            initGraph();
            createGraphFromCsv("data/watchData.csv");
        });

        $("select[name=thgen]").change(function(){
            mThGen = $("select[name=thgen]").children(':selected').attr("value");
            initGraph();
            createGraphFromCsv("data/watchData.csv");
        });

        $("select[name=t]").change(function(){
            mT = Number($("select[name=t]").children(':selected').attr("value"));
            initGraph();
            createGraphFromCsv("data/watchData.csv");
        });

    }

    let initGraph = function(){
        options.series = [];
        options.xAxis.plotLines = [];
    }


    var chart = {
        init: function () {
            mThZoka = 0.1;
            mThGen = -0.1;
            mT = 3;

            mouseEvent();
            createGraphFromCsv("data/watchData.csv");
        }
    }
}
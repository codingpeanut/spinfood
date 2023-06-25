var w = document.getElementById("chart").offsetWidth,
    h = w,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20();//category20c()

function resizeChart() {
    // getBoundingClientRect().width return floating point
    w = document.getElementById("chart").getBoundingClientRect().width;
    h = w;
    r = Math.min(w, h) / 2;
    console.log(w, h, r);

    // 更新SVG元素的宽度和高度
    svg.attr("width", w)
        .attr("height", h);

    // 更新容器元素的位置
    container.attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");

    // 更新圆形和文本的相关属性
    arcs.attr("d", function (d) { return arc(d); });

    arcs.select("text")
        .attr("transform", function (d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle) / 2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
        });

    // 更新饼图生成器和路径生成器的半径
    pie = d3.layout.pie().sort(null).value(function (d) { return 1; });
    arc = d3.svg.arc().outerRadius(r);

    // 更新所有饼图路径的属性
    arcs.select("path")
        .attr("d", function (d) { return arc(d); });

    arrow.attr("transform", "translate(" + w + "," + (h / 2) + ")");
    arrow.select("path").attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z");
}

var chartTag = document.getElementById("chart");
var resizeObserver = new ResizeObserver(function (entries) {
    // Iterate over the observed entries
    for (var entry of entries) {
        if (entry.target === chartTag && !!document.querySelector(".chartholder")) {
            // Call the resizeChart() function when the observed div's width changes
            resizeChart();
        }
    }
});
resizeObserver.observe(chartTag);

//randomNumbers = getRandomNumbers();
//http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results

// [To Be Replaced] Use firebase to get data
// var data = food_list;
// var data = [];
// var data = [
//     { "label": "Dell LAPTOP", "value": 1, "question": "What CSS property is used for specifying the area between the content and its border?" }, // padding
//     { "label": "IMAC PRO", "value": 2, "question": "What CSS property is used for changing the font?" }, //font-family
//     { "label": "SUZUKI", "value": 3, "question": "What CSS property is used for changing the color of text?" }, //color
//     { "label": "HONDA", "value": 4, "question": "What CSS property is used for changing the boldness of text?" }, //font-weight
//     { "label": "FERRARI", "value": 5, "question": "What CSS property is used for changing the size of text?" }, //font-size
//     { "label": "APARTMENT", "value": 6, "question": "What CSS property is used for changing the background color of a box?" }, //background-color
//     { "label": "IPAD PRO", "value": 7, "question": "Which word is used for specifying an HTML tag that is inside another tag?" }, //nesting
//     { "label": "LAND", "value": 8, "question": "Which side of the box is the third number in: margin:1px 1px 1px 1px; ?" }, //bottom
//     { "label": "MOTOROLLA", "value": 9, "question": "What are the fonts that don't have serifs at the ends of letters called?" }, //sans-serif
//     { "label": "BMW", "value": 10, "question": "With CSS selectors, what character prefix should one use to specify a class?" },
// ];

var pieContainer, svg, container, vis, pie, arc, arcs, arrow;
function updatePieChart(data) { // on get new data
    pieContainer = d3.select("#chart");
    pieContainer.selectAll("svg").remove();
    // visible
    svg = d3.select('#chart')
        .append("svg")
        .data([data])
        .attr("width", w)
        .attr("height", h);
    container = svg.append("g")
        .attr("class", "chartholder")
        .attr("transform", "translate(" + (w / 2) + "," + (h / 2) + ")");
    vis = container
        .append("g");

    pie = d3.layout.pie().sort(null).value(function (d) { return 1; });
    // declare an arc generator function
    arc = d3.svg.arc().outerRadius(r);
    // select paths, use arc generator to draw
    arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "slice");

    arcs.append("path")
        .attr("fill", function (d, i) { return color(i); })
        .attr("d", function (d) { return arc(d); });
    // add the text
    arcs.append("text").attr("transform", function (d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
    })
        .attr("text-anchor", "end")
        .text(function (d, i) {
            return data[i].label;
        });

    // spin
    container.on("click", spin);
    function spin(d) {

        container.on("click", null);
        //all slices have been seen, all done
        console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
        if (oldpick.length == data.length) {
            console.log("done");
            container.on("click", null);
            return;
        }
        var ps = 360 / data.length,
            pieslice = Math.round(1440 / data.length),
            rng = Math.floor((Math.random() * 1440) + 360);

        rotation = (Math.round(rng / ps) * ps);

        picked = Math.round(data.length - (rotation % 360) / ps);
        picked = picked >= data.length ? (picked % data.length) : picked;
        if (oldpick.indexOf(picked) !== -1) {
            d3.select(this).call(spin);
            return;
        } else {
            oldpick.push(picked);
        }
        rotation += 90 - Math.round(ps / 2);
        vis.transition()
            .duration(3000)
            .attrTween("transform", rotTween)
            .each("end", function () {
                //mark question as seen
                d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                    .attr("fill", "#111");
                //populate question
                d3.select("#question h1")
                    .text(data[picked].message);
                oldrotation = rotation;

                /* Get the result value from object "data" */
                // console.log(data[picked].key);
                sendSpinResult(data[picked].key);

                /* Comment the below line for restrict spin to sngle time */
                container.on("click", spin);
            });
    }
    //make arrow
    arrow = svg.append("g")
        .attr("class", "arrow")
        .attr("transform", "translate(" + (w) + "," + (h / 2) + ")")
    arrow.append("path")
        .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
        .style({ "fill": "red" });
    //draw spin circle
    container.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 60)
        .style({ "fill": "white", "cursor": "pointer" });
    //spin text
    container.append("text")
        .attr("x", 0)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text("SPIN")
        .style({ "font-weight": "bold", "font-size": "30px" });
}


function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
        return "rotate(" + i(t) + ")";
    };
}


function getRandomNumbers() {
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
    if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function") {
        window.crypto.getRandomValues(array);
        console.log("works");
    } else {
        //no support for crypto, get crappy random numbers
        for (var i = 0; i < 1000; i++) {
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }
    return array;
}
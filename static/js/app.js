//set up URL 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data 
d3.json(url).then(function (data) {
    console.log(data);
    init(data);
});

function init(data) {
    let dropdown = d3.select("#selDataset");
    let sampleIDs = data.names;
    sampleIDs.forEach(function (id) {
        dropdown.append("option").text(id).property("value", id);
    });

    let selection = sampleIDs[0];
    updateCharts(selection, data);
}

function optionChanged() {
    let dropdownMenu = d3.select("#selDataset");
    let selection = dropdownMenu.property("value");
    d3.json(url).then(function (data) {
        updateCharts(selection, data);
    });
}

function updateCharts(selection, data) {
    barChart(selection, data);
    metaData(selection, data.metadata);
    bubbleChart(selection, data);
}

function metaData(selection, metadata) {
    let demographicInfoDiv = d3.select("#sample-metadata");
    demographicInfoDiv.html("");
    let selectedMetadata = metadata.find(item => item.id == selection);
    for (const [key, value] of Object.entries(selectedMetadata)) {
        demographicInfoDiv.append("p").text(`${key}: ${value}`);
    }
}

//barChart
function barChart(selection, data) {
    let sampleDataInfo = data.samples.find(sample => sample.id === selection);
    let sample_values = sampleDataInfo.sample_values.slice(0, 10);
    let otu_ids = sampleDataInfo.otu_ids.slice(0, 10);
    let otu_labels = sampleDataInfo.otu_labels.slice(0, 10);

    let trace1 = [{
        x: sample_values.reverse(),
        y: otu_ids.map(item => `OTU ${item}`).reverse(),
        text: otu_labels.reverse(),
        type: 'bar',
        orientation: 'h'
    }];
    let layout = {
        title: 'Bacteria Count ',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' },
        width: 600,
        height: 400
    };
    Plotly.newPlot('bar', trace1, layout);
}

//bubble chart
function bubbleChart(selection, data) {
    let sampleDataInfo = data.samples.find(sample => sample.id === selection);
    let sample_values = sampleDataInfo.sample_values;
    let otu_ids = sampleDataInfo.otu_ids;
    let otu_labels = sampleDataInfo.otu_labels;
    let maxMarkerSize = Math.max(...sample_values);
    let trace2 = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
            size: sample_values.map(value => value * .25),
            sizeref: 1,
            color: otu_ids,
            text: otu_labels,
        }
    };
    layout2 = {
        title: "Bacteria Count",
        showlegend: false,
        height: 600,
        width: 600,
        xaxis: { title: `OTU ID` },
    };
    Plotly.newPlot('bubble', [trace2], layout2);
}

init();
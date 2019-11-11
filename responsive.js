const margin = { top: 10, right: 20, bottom: 30, left: 30 };

// the exact dimensions of 400 x 400
// will only be used for the initial render
// but the width to height proportion 
// will be preserved as the chart is resized
const width = 400 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const data = [5, 15, 25, 35, 45, 55, 65, 76, 85, 95]

const xScale = d3.scaleBand()
  .padding(0.2)
  .domain(data)
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([0, 100])
  .range([height, 0]);

const svg = d3.select('#chart')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .call(responsivefy) // this is all it takes to make the chart responsive
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

svg.selectAll('rect')
  .data(data)
  .enter()
    .append('rect')
    .attr('x', d => xScale(d))
    .attr('y', d => yScale(d))
    .attr('width', d => xScale.bandwidth())
    .attr('height', d => height - yScale(d))

svg.append('g').call(d3.axisLeft(yScale));

svg.append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScale));

function responsivefy(svg) {
  // container will be the DOM element the svg is appended to
  // we then measure the container and find its aspect ratio
  const container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style('width'), 10),
      height = parseInt(svg.style('height'), 10),
      aspect = width / height;

  // add viewBox attribute and set its value to the initial size
  // add preserveAspectRatio attribute to specify how to scale
  // and call resize so that svg resizes on inital page load
  svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize);

  // add a listener so the chart will be resized when the window resizes
  // to register multiple listeners for same event type,
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on('resize.' + container.attr('id'), resize);

  // this is the code that actually resizes the chart
  // and will be called on load and in response to window resize
  // gets the width of the container and proportionally resizes the svg to fit
  function resize() {
      const targetWidth = parseInt(container.style('width'));
      svg.attr('width', targetWidth);
      svg.attr('height', Math.round(targetWidth / aspect));
  }
}

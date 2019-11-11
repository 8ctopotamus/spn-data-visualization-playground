const fileInput = document.getElementById('file')

const margin = { top: 10, right: 20, bottom: 30, left: 30 };
const width = 400 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

let headers, cities

const formatData = i => {
  return cities
    .map(city => (
      parseFloat(city[i]) 
        ? { label: city[0], value: parseFloat(city[i]) }
        : false)
    )
    .filter(res => !!res)
    .slice(0, 30) // limit to 30 for now
    .sort((a , b) => a.value - b.value)
}

const createChart = i => {
  if (headers[i].toLowerCase().includes('date'))
    return
  
  const className = 'chart-' + i

  d3.select('.container').append('h3').text(headers[i])
  d3.select('.container')
    .append('div').classed('chart', true)
    .append('svg')
    .classed(className, true)

  const dataset = formatData(i)

  const cityNames = dataset.map(d => d.label)
  const snowfall = dataset.map(d => d.value)
  const max = d3.max(snowfall)

  const xScale = d3.scaleBand()
    .padding(0.2)
    .domain(snowfall)
    .range([0, width]);
  
  const yScale = d3.scaleLinear()
    .domain([0, max])
    .range([height, 0]);
  
  const svg = d3.select('.' + className)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .call(responsivefy)
  
  svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  svg.selectAll('rect')
    .data(snowfall)
    .enter()
      .append('rect')
      .attr('x', d => xScale(d) + margin.left)
      .attr('y', d => yScale(d))
      .attr('width', d => xScale.bandwidth())
      .attr('height', d => height - yScale(d))

  svg.append('g')
  .attr('transform', `translate(${margin.left}, 0)`)
  .attr("class", "axis")
  .call(d3.axisLeft(yScale));

  svg.append('g')
    .attr('transform', `translate(${margin.left}, ${height})`)
    .attr("class", "axis")
    .call(d3.axisBottom(xScale));

}

const parseCSVFile = () => {
  const file = fileInput.files[0]
  if (!file) return
  Papa.parse(file, {
    complete: function(results) {
      headers = results.data[0]
      cities = results.data.slice(1)
      for (let i = 6; i < headers.length; i++) {
        createChart(i)
      }
    },
    error: function(err) { console.error(err) }
  })
}

function responsivefy(svg) {
  const container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style('width'), 10),
      height = parseInt(svg.style('height'), 10),
      aspect = width / height;

  svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize);

  d3.select(window).on('resize.' + container.attr('id'), resize);

  function resize() {
      const targetWidth = parseInt(container.style('width'));
      svg.attr('width', targetWidth);
      svg.attr('height', Math.round(targetWidth / aspect));
  }
}

fileInput.addEventListener('change', parseCSVFile)

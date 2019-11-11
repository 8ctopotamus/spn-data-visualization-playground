const fileInput = document.getElementById('file')
const loading = document.getElementById('loading')

const svgWidth = 1080, svgHeight = 300, barPadding = 5

let headers, cities, barWidth

const createChart = i => {
  if (headers[i].toLowerCase().includes('date'))
    return

  const className = 'chart-' + i

  d3.select('#charts').append('h3').text(headers[i])
  d3.select('#charts').append('svg').classed(className, true)

  const dataset = cities
    .map(city => parseFloat(city[i]) ? parseFloat(city[i]) : false)
    .filter(res => !!res)
    .slice(0, 30)
    .sort((a , b) => a - b)

  const barWidth = (svgWidth / dataset.length)
  
  const svg = d3.select('.' + className)
    .attr("width", svgWidth)
    .attr("height", svgHeight)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, svgHeight])
      
  const barChart = svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("y", d => svgHeight - yScale(d))
    .attr("height", d => yScale(d))
    .attr("width", barWidth - barPadding)
    .attr("transform", (d, i) => {
        var translate = [barWidth * i, 0] 
        return "translate("+ translate +")"
    })

  const text = svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(d => d + 'in')
    .attr('font-size', '10px')
    .attr('y', (d, i) => (svgHeight - d) - barPadding)
    .attr('x', (d, i) => barWidth * i)
    .attr('fill', "#A64C38")
}

const parseCSVFile = () => {
  const file = fileInput.files[0]
  if (!file) return
  setLoading(true)
  Papa.parse(file, {
    complete: function(results) {
      setLoading(false)
      headers = results.data[0]
      cities = results.data.slice(1)
      for (let i = 6; i < headers.length; i++) {
        createChart(i)
      }
    },
    error: function(err) { console.error(err) }
  })
}

const setLoading = bool => bool ? loading.style.display = 'block' : loading.style.display = 'none'

fileInput.addEventListener('change', parseCSVFile)

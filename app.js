const fileInput = document.getElementById('file')
const loading = document.getElementById('loading')

const svgWidth = 960, svgHeight = 300, barPadding = 1

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
  const barWidth = (svgWidth / dataset.length)
  const svg = d3.select('.' + className)
    .attr("width", svgWidth)
    .attr("height", svgHeight)
      
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("y", function(d) {
      return svgHeight - d 
    })
    .attr("height", function(d) { 
      return d 
    })
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d, i) {
        var translate = [barWidth * i, 0] 
        return "translate("+ translate +")"
    })
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

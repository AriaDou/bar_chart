const xhr = new XMLHttpRequest();
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

// xhr.responseType = 'json';
xhr.onreadystatechange = () => {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    if (xhr.status === 200) {
      const json = JSON.parse(xhr.responseText);
      const dataset = json["data"];
      const w = 700;
      const h = 400;
      const padding = 40;

      const formatDate = (string) => {
        const date = string.split('-');
        return  new Date(date[0], date[1], date[2]);
      }

      const tooltip = d3.select('#chart')
                        .append('div')
                        .attr('id', 'tooltip');
      const svg = d3.select('#chart')
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h);
      const xScale = d3.scaleTime()
                       .domain([formatDate(d3.min(dataset, d => d[0])), formatDate(d3.max(dataset, d => d[0]))])
                       .range([padding, w - padding]);
      const yScale = d3.scaleLinear()
                       .domain([0, d3.max(dataset, d => d[1])])
                       .range([h - padding, padding]);
      const rectWidth = (w - 2 * padding) / dataset.length;

      svg.append('text')
         .text('Gross Domestic Product')
         .attr('y', '60')
         .attr('x', '-200')
         .attr('transform', 'rotate(-90)')
         .attr('font-size', '12');

      svg.selectAll('rect')
         .data(dataset)
         .enter()
         .append('rect')
         .attr('width', 2)
         .attr('height', (d, index) => h - padding - yScale(d[1]))
         .attr('x', (d, index) => xScale(formatDate(d[0])))
         .attr('y', (d, index) => yScale(d[1]))
         .attr('data-date', d => d[0])
         .attr('data-gdp', d => d[1])
         .attr('fill', "#0099FF")
         .attr('class', 'bar')
         .on('mouseover', (d, i) => {
           const date = d[0].split('-');
           tooltip.html(date[0] + ' Q' + date[1] + '</br>$' + d[1] + ' Billion')
                  .attr('data-date', d[0])
                  .style('left', xScale(formatDate(d[0])) + 'px')
                  .style('top', yScale(d[1]) + 'px')
                  .style('opacity', 0.9);
         })
         .on('mouseout', () => {
           tooltip.style('opacity', 0);
         })

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append('g')
         .attr('transform', 'translate(0, ' + (h - padding) + ')')
         .attr('id', 'x-axis')
         .call(xAxis);

      svg.append('g')
         .attr('transform', 'translate(' + padding + ', 0)')
         .attr('id', 'y-axis')
         .call(yAxis);
    }
  }
}

xhr.open('GET', url);
xhr.send();

'use strict';
		var margin = {top: 30, right: 10, bottom: 30, left: 60},
			width = 960 - margin.right - margin.left,
			height  = 500 - margin.top - margin.bottom;

		var mounthName = d3.time.format('%B'),
			yearOnly = d3.time.format('%Y');

		// setup x
		var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .5),
			xAxis = d3.svg.axis()
				.scale(xScale)
				.orient('bottom');

		// setup y
		var yScale = d3.scale.linear().range([height, 0]),
			yAxis = d3.svg.axis()
				.scale(yScale)
				.orient('left');

		// add the graph canvas
		var svg = d3.select('#svg')
				.append("svg")
				.attr('width', width + margin.right + margin.left)
				.attr("height", height + margin.top + margin.bottom)
			   .append('g')
			    .attr('transform', 'translate(' + margin.left +","+ margin.top + ")");

		// add tooltip
		var tip = d3.select('body')
			.append('div')
			.attr('class', 'tooltip')
			.style('opacity', 0);

		// add heading
		svg.append('text')
			.style('font-size', '36px')
			.style('text-anchor', 'middle')
			.attr('x', width/2)
			.attr('y', 15)
			.style('fill', 'teal')
			.text('Gross Domestic Product');

		// load data
		d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(err, res){
			if(err) throw err;

			var data = res.data.map(function(d) {
				return {x: d[0], amount: d[1]};
			});

			xScale.domain(getUnique(data));
			yScale.domain(d3.extent(data, function(d){ return d.amount; }));

			// x-axis
			svg.append('g')
			   .attr('class', 'x-axis')
			   .attr('transform', 'translate(0,' + height + ')')
			   .call(xAxis);

			// y-axis
			svg.append('g')
			   .attr('class', 'y-axis')
			   .call(yAxis)
			  .append('text')
			   .attr('transform', 'rotate(-90)')
			   .attr('y', 6)
			   .attr('dy', '.71em')
			   .style('text-anchor', 'end')
			   .text('Gross Domestic Product, USA');

			svg.selectAll('.bar')
			   .data(data)
			   .enter()
			  .append('svg:rect')
			   .attr('class', 'bar')
			   .attr('x', function(d, i){ return i * (width/ data.length); })
			   .attr('y', function(d){ return yScale(d.amount); })
			   .attr('width', width/ data.length -1)
			   .style('fill', 'teal')
			   .on('mouseover', function(d){
			   	   tip.transition()
			   	   	  .duration(200).style('opacity', .9);

			   	   tip.html("<h3>$"+ d.amount +" <i>Billion<i></h3><p>"+ mounthName(new Date(d.x)) +" - "+ yearOnly(new Date(d.x)) +"</p>")
			   	   	  .style('left', d3.event.pageX +10 + 'px')
			   	   	  .style('top', d3.event.pageY -25 + 'px');
			   })
			   .on('mouseout', function(d){
			       tip.transition()
			       	  .duration(300).style('opacity', 0);
			   })
			   .transition()
			   .delay(function(d, i){ return i*25; })
			   .attr('height', function(d){
			   	   return height - yScale(d.amount);
			   });
		});
		/* Helpers */
		function getUnique(arr){
		   var a = [];

		   for(var i = 0, l = arr.length; i < l; ++i){
		      if(a.indexOf(parseInt(arr[i].x)) > -1) {
		         continue;
		      }
		      if(parseInt(arr[i].x) % 5 == 0){
		      	a.push(parseInt(arr[i].x));
		      }
		   }
		   return a;
		}
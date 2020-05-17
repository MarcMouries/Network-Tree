(function () {
  "use strict";

  console.log("Loading NetworkTree");

  var defaultWidth = 400,
    defaultHeight = 250;

  const margin = {     top: 10,     right: 50,    bottom: 10,     left: 50  }; 
  var display = function (containerId, tree_data, options) {

    var element = document.getElementById(containerId);
    if (!element) {
      alert(
        "Chart container not found. Did you misspell '" +
          containerId +
          "'? Make sure to run this method after the DOM is loaded."
      );
      return;
    }



    /***********
     *
     *   ORIENTATION : TOP
     *
     */




		
		// Dimensions: 400 x 400 
		// used for the initial rendering 
		// width to height proportion 
		// its preserved as the chart is resized 
		var width = 400 - margin.left - margin.right; 
		var height = 400 - margin.top - margin.bottom; 

    
		var svg = d3.select('#chart'). 
      append('svg'). 
      attr('width', width + margin.left + margin.right). 
      attr('height', height + margin.top + margin.bottom). 
      call(responsivefy); // Call responsivefy to make the chart responsive 
  var    g = svg.append("g").attr('transform', `translate(${margin.left}, ${margin.top})`); 


// Convert data for a tree layout
var root = d3.hierarchy(tree_data)
var tree = d3.tree().size([height, width]);
tree(root);



// Create links
var link = g.selectAll(".link")
  .data(root.descendants().slice(1))
  .enter().append("path")
  .attr("class", "link")
  .attr("d", function(d) {
    return "M" + d.y + "," + d.x + "C" + (d.y + d.parent.y) / 2 + "," + d.x + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x + " " + d.parent.y + "," + d.parent.x;
  });


  // Create nodes
var node = g.selectAll(".node")
.data(root.descendants())
.enter()
.append("g")
.attr("class", function(d) {
  return "node" + (d.children ? " node--internal" : " node--leaf");
})
.attr("transform", function(d) {
  return "translate(" + d.y + "," + d.x + ")";
})

node.append("circle")
.attr("r", 2.5);

node.append("text")
.attr("dy", 3)
.attr("x", function(d) {
  return d.children ? -10 : 10;
})
.style("text-anchor", function(d) {
  return d.children ? "end" : "start";
})
.text(function(d) {
  return d.data.name
});
		

		


		function responsivefy(svg) { 
			
			// Container is the DOM element, svg is appended. 
			// Then we measure the container and find its 
			// aspect ratio. 
			const container = d3.select(svg.node().parentNode), 
				width = parseInt(svg.style('width'), 10), 
				height = parseInt(svg.style('height'), 10), 
				aspect = width / height; 
				
			// Add viewBox attribute to set the value to initial size 
			// add preserveAspectRatio attribute to specify how to scale 
			// and call resize so that svg resizes on page load 
			svg.attr('viewBox', `0 0 ${width} ${height}`). 
			attr('preserveAspectRatio', 'xMinYMid'). 
			call(resize); 
			
			d3.select(window).on('resize.' + container.attr('id'), resize); 

			function resize() { 
				const targetWidth = parseInt(container.style('width')); 
				svg.attr('width', targetWidth); 
				svg.attr('height', Math.round(targetWidth / aspect)); 
			} 
		} 



    };

  // Exports
  window.NetworkTree = {
    Display: display,
  };
})();

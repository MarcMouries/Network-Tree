class NetworkTree {
  constructor() {
    console.log("Loading NetworkTree");

    var defaultWidth = 400,
      defaultHeight = 250;

    this.DEFAULT_MARGIN = { top: 20, right: 120, bottom: 20, left: 120 };
    this.DEFAULT_NODE = { width: 100, height: 60, textMargin: 8 };
  }

  display(tree_data) {
    this.tree_data = tree_data;
    return this;
  }

  inside(element) {
    this.svg_container = element;
    return this;
  }

  extra_connections(extra_connection_list) {
    this.extra_connection_list = extra_connection_list;
    return this;
  }

  show() {
    var margin = this.DEFAULT_MARGIN;
    var NODE = this.DEFAULT_NODE;

    // Dimensions: 400 x 400
    // used for the initial rendering
    // width to height proportion
    // its preserved as the chart is resized
    var width = 440 - margin.left - margin.right;
    var height = 440 - margin.top - margin.bottom;

    //const width = window.innerWidth - margin.left - margin.right;
    //const height = window.innerHeight - margin.top - margin.bottom;

    // Convert data for a tree layout
    var hierarchy = d3.hierarchy(this.tree_data);
    // Compute the new tree layout.
    var nodes = hierarchy.descendants();
    var links = hierarchy.descendants().slice(1);

    nodes.forEach(function (d) {
      d.y = d.depth * 680;
    });

    /* Dynamically set the height of the main svg container
     * breadthFirstTraversal returns the max number of node on a same level
     * and colors the nodes
     */
    var maxDepth = 0;

    var maxTreeWidth = breadthFirstTraversal(nodes, function (currentLevel) {
      maxDepth++;
      currentLevel.forEach(function (node) {
        console.log(node.data.name + " " + maxDepth);
      });
    });

    console.log("maxDepth = " + maxDepth);
    console.log("maxTreeWidth = " + maxTreeWidth);

    height = maxTreeWidth * (NODE.height + 200) - margin.right - margin.left;
    width = maxDepth * (NODE.width * 1.5) - margin.top - margin.bottom;

    console.log("height = " + height);
    console.log("width = " + width);

    var tree = d3.tree().size([height, width]);

    //var tree = d3.tree().nodeSize([NODE.height, NODE.width])
    //   .separation(function (a, b) {        return (a.depth * 2);      })
    tree(hierarchy);

    // create zoom handler
    var zoom = (this.zoom = d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on("zoom", function () {
        svgGroup.attr("transform", d3.event.transform);
      }));



/*
  //initilize svg or grab svg
  var svg_container = d3.select(".svg-container");
   // Container class to make it responsive.
  svg_container.classed("svg-TRUC", true) ;


var svg = svg_container
.append("svg")
   // Responsive SVG needs these 2 attributes and no width and height attr.
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 1400 900")
   // Class to make it responsive.
   .classed("svg-content-responsive", true);

   // Fill with a rectangle for visualization.
  // .append("rect")
  // .classed("rect", true)
  // .attr("width", 600)
  // .attr("height", 400);


*/

console.log("container:");
console.log(this.svg_container);

var w = this.svg_container.clientWidth,
h = this.svg_container.clientHeight;
console.log("dimension: " + w + " x " + h);

var __height = this.svg_container.style.height;
var __width = this.svg_container.style.width;
console.log("dimension: " + __width + " x " + __height);


if(this.svg_container) {
  var rect = this.svg_container.getBoundingClientRect();
  console.log(rect);  
}


var width = 1000;
var height = 400;
      
    var svg = d3
      .select(this.svg_container)
      .append("svg")
   // Responsive SVG needs these 2 attributes and no width and height attr.
  // .attr("preserveAspectRatio", "xMinYMin meet")
  // .attr("viewBox", "0 0 1400 900")
  //   .attr("viewBox", [0, 0, width, height])
    



  

//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)

      .call(zoom)
      .call(responsivefy); // Call responsivefy to make the chart responsive

    var rectBg = svg
      .append("rect")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .classed("chart-bg", true);

    var svgGroup = svg.append("g").attr("class", "tree-container");

    // set zoom identity
    svg.call(
      zoom.transform,
      // d3.zoomIdentity.translate(margin.top, -(height/2)).scale(1)
      d3.zoomIdentity.translate(margin.left, margin.top).scale(1)
    );


        // Stash the old positions for transition.
        nodes.forEach(function (d) {
          d.x0 = d.x;
          d.y0 = d.y;
          d.width = NODE.width;
        });


    // Create links
    var link = svgGroup
      .selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", function (d) {
        return diagonal(d, NODE.width);
        //return elbow(d);
      });

    // Create nodes
    var node = svgGroup
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", function (d) {
        //  return "node" + (d.children ? " node--internal" : " node--leaf");
      })
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      })
      
      .on('click', function(d)  {
        //console.log(d)
      })
      ;



    // RECTANGLES
    node
      .append("rect")
      .attr("x", function (d) {
        return -(NODE.width / 2);
      })
      .attr("y", function (d) {
        return -(NODE.height / 2);
      })
      .classed("countour_rect", true)
      .attr("width", NODE.width)
      .attr("height", NODE.height);

    // CIRCLES
    const circle_radius = 10;

    node
      .append("circle")
      .classed("countour_circle", true)
      .attr("r", circle_radius);

    node
      .append("text")
      .attr("dx", -(circle_radius / 2))
      .attr("dy", circle_radius / 2)
      .text(function (d) {
        return d.data.name;
      });



    if (this.extra_connection_list) {

      var multiParents = [];
      this.extra_connection_list.forEach(function (connection_pair) {
        var source = connection_pair.source;
        var target = connection_pair.target;

        console.log(connection_pair)
       var sourceNode = nodes.filter(function (d) {
        return d.data["name"] === source;
      })[0];

      console.log(sourceNode);
      var targetNode = nodes.filter(function (d) {
        return d.data["name"] === target;
      })[0];
      console.log(targetNode);

      multiParents.push(
        {
          parent: sourceNode,
          child: targetNode,
        },
      );

      });


      multiParents.forEach(function (multiPair) {
        svgGroup
          .append("path", "g")
          .attr("class", "additionalParentLink")
          .attr("d", function () {
            var oTarget = {
              x: multiPair.parent.x0,
              y: multiPair.parent.y0,
            };
            var oSource = {
              x: multiPair.child.x0,
              y: multiPair.child.y0,
            };
            return diagonal_st(oSource, oTarget);
          });
      });
    }
  } // display
}

function diagonal(d, node_width) {
  var orig_x = d.x; // + NODE.height / 2;
  var orig_y = d.y - d.width / 2;
  var dest_x = d.parent.x;
  var dest_y = d.parent.y + d.width / 2;

  var path = `
   M ${orig_y} ${orig_x}
   C ${(orig_y + dest_y) / 2} ${orig_x},
     ${(orig_y + dest_y) / 2} ${dest_x},
     ${dest_y} ${dest_x}`;

  return path;
}

/**
 * Creates a curved (diagonal) path from a node to another node
 */
function diagonal_st(s, d) {
  // console.log(s);
  // console.log(d);

  var path = `
  M ${s.y} ${s.x}
  C ${(s.y + d.y) / 2} ${s.x},
     ${(s.y + d.y) / 2} ${d.x},
     ${d.y} ${d.x}`;

  return path;
}

function line(s, d) {
  var path = `
  M ${s.y} ${s.x}
  C ${(s.y + d.y) / 2} ${s.x},
     ${(s.y + d.y) / 2} ${d.x},
     ${d.y} ${d.x}`;

  return path;
}

function elbow(d) {
  var path = `
  M${d.y},${d.x}
  H${d.parent.y},
  V${d.parent.x}${d.parent.children ? "" : "h" + margin.right}`;
  return path;
}

/**
 * Breadth-first traversal of the tree
 * func function is processed on every node of a same level
 * return the max level
 */
function breadthFirstTraversal(tree, func) {
  var max = 0;
  if (tree && tree.length > 0) {
    var currentDepth = tree[0].depth;
    var fifo = [];
    var currentLevel = [];

    fifo.push(tree[0]);
    while (fifo.length > 0) {
      var node = fifo.shift();
      if (node.depth > currentDepth) {
        func(currentLevel);
        currentDepth++;
        max = Math.max(max, currentLevel.length);
        currentLevel = [];
      }
      currentLevel.push(node);
      if (node.children) {
        for (var j = 0; j < node.children.length; j++) {
          fifo.push(node.children[j]);
        }
      }
    }
    func(currentLevel);
    return Math.max(max, currentLevel.length);
  }
  return 0;
}

function responsivefy(svg) {
  return;
  console.log("responsivefy");
  // Container is the DOM element, svg is appended.
  // Then we measure the container and find its aspect ratio.
  const container = d3.select(svg.node().parentNode),
    width = parseInt(svg.style("width"), 10),
    height = parseInt(svg.style("height"), 10),
    aspect = width / height;

  // Add viewBox attribute to set the value to initial size
  // add preserveAspectRatio attribute to specify how to scale
  // and call resize so that svg resizes on page load
  svg
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMid")
    .call(resize);

  d3.select(window).on("resize." + container.attr("id"), resize);

  function resize() {
    const targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
  }
}

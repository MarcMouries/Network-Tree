(function () {
  "use strict";

  var defaultWidth = 400,
    defaultHeight = 250;

  var margin = { top: 20, right: 120, bottom: 20, left: 120 };

  var display = function (containerId, data, options) {
    var element = document.getElementById(containerId);
    if (!element) {
      alert(
        "Chart container not found. Did you misspell '" +
          containerId +
          "'? Make sure to run this method when the DOM is loaded."
      );
      return;
    }

    /***********
     *
     *   ORIENTATION : TOP
     *
     */
    var clientWidth = element.clientWidth;
    var clientHeight = element.clientHeight;
    var width = clientWidth - margin.right - margin.left;
    var height = clientHeight - margin.top - margin.bottom;

    var svg = d3
      .select(element)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var circle_radius = Math.min(width, height) / 2;

    svg
      .append("circle")
      .attr("cx", clientWidth / 2)
      .attr("cy", clientHeight / 2)
      .attr("r", circle_radius)
      .style("fill", "#1E8BC3");
  };

  // Exports
  window.NetworkTree = {
    Display: display,
  };
})();

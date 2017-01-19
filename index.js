//View//
//Config
var width = 960,
    height = 500,
    margin = {
      top : 20,
      bottom : 20,
      rigth : 20,
      left : 20
    },
    depth = 100;


//Instance element
var svg = d3.select("body")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all")
    .append("svg:g")
    .attr("transform","translate("+margin.left+","+margin.top+")");





//Data structures
var treePatternRoot = {};
//Instance and configure layout computer
var treeComputer =
  d3.tree()
  .size([(width - margin.rigth -margin.left), (height - margin.top - margin.bottom)]);


function computeAndDraw() {
  var nodeRootHierarchy = d3.hierarchy(treePatternRoot);
  treeComputer(nodeRootHierarchy);
  var nodes = nodeRootHierarchy.descendants();

  nodesBind = svg.selectAll(".node")
     .data(nodes);

  nodesBind
      .transition()
      .attr("cx", function (d) {return d.x})
      .attr("cy", function (d) {return d.depth * depth});

  nodesBind
     .enter()
     .append("circle")
     .classed("node",true)
     .attr("cx", function (d) {return d.x})
     .attr("cy", function (d) {return d.depth * depth})
     .attr("r", 20)
     .style("fill", "none")
     .style("stroke", "purple")
     .style("stroke-width", "5px")
     .on("click",function (d) {
       addChild(d.data,{});
     });



}
  computeAndDraw();
//Add child to treeNode
function addChild (treeNode,childNode) {
  if(treeNode.children){
    treeNode.children.push(childNode);
  }else {
    treeNode.children = [childNode];
  }
  computeAndDraw();
}

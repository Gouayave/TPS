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

var events =
[
    {
      name : "Any",
      shape : d3.symbolCircle,
      color : "#1f77b4"
    }

,
    {
      name : "Duplication",
      shape : d3.symbolSquare,
      color : "#9467bd"
    }
,
    {
      name : "Speciation",
      shape : d3.symbolCircle,
      color : "#2ca02c"
    }
]

//Instance element
var svg = d3.select("body")
    .append("svg:svg")
    .style("border","1px solid black")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all")
    .append("svg:g")
    .attr("transform","translate("+margin.left+","+margin.top+")");

var glinks =
   svg.append("svg:g");

var gnodes =
    svg.append("svg:g");

var gconstraints =
    svg.append("svg:g");

//Data structures
var treePatternRoot = {};
//Instance and configure layout computer
var treeComputer =
  d3.tree()
  .size([(width - margin.rigth -margin.left), (height - margin.top - margin.bottom)]);

var symbol = d3.symbol();
symbol.size(256);
symbol.type(d3.symbolCross);


function computeAndDraw() {

  //Compute hierarchy and position
  var nodeRootHierarchy = d3.hierarchy(treePatternRoot);
  treeComputer(nodeRootHierarchy);

  //Bind data with element (nodes and links)
  nodes = gnodes.selectAll(".node")
    .data(nodeRootHierarchy.descendants());

  links = glinks.selectAll(".link")
    .data(nodeRootHierarchy.links());

  constraints = gconstraints.selectAll(".constraint")
    .data(nodeRootHierarchy.links());


  //Draw links
  links.exit().remove();

  links
    .attr("d",function (d) {
      var path = d3.path();
      path.moveTo(d.source.x,d.source.depth * depth);
      path.lineTo(d.target.x,d.target.depth * depth);
      path.closePath();
      return path.toString();
    });

  links
    .enter()
    .append("path")
    .classed("link",true)
    .attr("d",function (d) {
      var path = d3.path();
      path.moveTo(d.source.x,d.source.depth * depth);
      path.lineTo(d.target.x,d.target.depth * depth);
      path.closePath();
      return path.toString();
    })
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", "2px");

  //Draw links
  constraints.exit().remove();



  constraints
    .attr("transform",function(d) {
      var x = d.source.x + ((d.target.x - d.source.x) /2)
      var y =(d.source.depth * depth) + (((d.target.depth * depth) - (d.source.depth * depth)) / 2 )
      return "translate("+x+","+y+") rotate(45)";
    });

  constraints
    .enter()
    .append("g")
    .classed("constraint",true)
    .attr("transform",function(d) {
      var x = d.source.x + ((d.target.x - d.source.x) /2)
      var y =(d.source.depth * depth) + (((d.target.depth * depth) - (d.source.depth * depth)) / 2 )
      return "translate("+x+","+y+") rotate(45)";
    })
    .append("path")
    .style("fill","white")
    .style("stroke", "black")
    .style("stroke-width", "2px")
    .attr("d",function (d) {
      return symbol();
    });

  //Draw nodes
  nodes.exit().remove();

  nodes
    .enter()
    .append("circle")
    .classed("node",true)
    .attr("cx", function (d) {return d.x})
    .attr("cy", function (d) {return d.depth * depth})
    .attr("r", 10)
    .style("stroke","white")
    .style("stroke-width", "5px")
    .style("fill", function (d) {
      if(d.data.event){
        return d.data.event.color;
      }else {
        return "black";
      }
    })
    .on("click",function (d) {

      if (window.event.ctrlKey) {
        changeEvent(d.data)
      }
      else if (window.event.altKey) {
        removeChildren(d.data)
      }
      else {
        addChild(d.data,{});
      }

    });

  nodes
    .attr("cx", function (d) {return d.x})
    .attr("cy", function (d) {return d.depth * depth})
    .style("fill", function (d) {
      if(d.data.event){
        return d.data.event.color;
      }else {
        return "black";
      }
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

//Add child to treeNode
function removeChildren (treeNode) {
  if(treeNode.children){
    treeNode.children = []
  }
  computeAndDraw();
}

//Change node event
function changeEvent (treeNode) {
  if(!treeNode.eventId){
    treeNode.eventId = 0;
  }
  treeNode.eventId = (treeNode.eventId + 1) % events.length ;
  treeNode.event = events[treeNode.eventId];
  computeAndDraw();
}

//Change node event
function changeEventConstraint (treeNode) {
  if(!treeNode.eventId){
    treeNode.eventId = 0;
  }
  treeNode.eventId = (treeNode.eventId + 1) % events.length ;
  treeNode.event = events[treeNode.eventId];
  computeAndDraw();
}

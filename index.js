//View//
//Config
var width = 960,
    height = 500,
    margin = {
      top : 50,
      bottom : 50,
      rigth : 20,
      left : 50
    },
    depth = 100;


d3.symbolForbidden =  {
  draw: function(context, size) {
      var pi = Math.PI;
      var r = Math.sqrt(size / pi);
      context.arc(0, 0, r, 0, 2*pi);
      context.moveTo(Math.cos((pi)/4) * r, - Math.sin((pi)/4) * r);
      context.lineTo(Math.cos((5*pi)/4) * r, - Math.sin((5*pi)/4) * r);
      context.closePath();
      }
   }

 var symbolCircle = d3.symbol();
 symbolCircle.size(512);
 symbolCircle.type(d3.symbolCircle);

 var symbolForbidden = d3.symbol();
 symbolForbidden.size(512);
 symbolForbidden.type(d3.symbolForbidden);

var events =
[
    {
      id : 0,
      rights : "Allow",
      name : "Any",
      shape : symbolCircle,
      stroke : "green",
      fill : "white",
      textfill : "black",
      letter : 'A'
    }
,
    {
      id : 1,
      rights : "Must",
      name : "Duplication",
      shape : symbolCircle,
      stroke : "white",
      fill : "#005c99",
      textfill : "white",
      letter : 'D'
    }
,
    {
      id : 2,
      rights : "Forbidden",
      name : "Duplication",
      shape : symbolForbidden,
      stroke : "red",
      fill : "white",
      textfill : "black",
      letter : 'D'
    }
,
    {
      id : 3,
      rights : "Must",
      name : "Speciation",
      shape : symbolCircle,
      stroke : "white",
      fill : "#005c99",
      textfill : "white",
      letter : 'S'
    }
,
    {
      id : 4,
      rights : "Forbidden",
      name : "Speciation",
      shape : symbolForbidden,
      stroke : "red",
      fill : "white",
      textfill : "black",
      letter : 'S'
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
var treePatternRoot = { nodeEvent : events[0] };

//Instance and configure layout computer
var treeComputer =
  d3.tree()
  .size([(width - margin.rigth -margin.left), (height - margin.top - margin.bottom)]);

function computeAndDraw() {

  //Compute hierarchy and position
  var nodeRootHierarchy = d3.hierarchy(treePatternRoot);
  treeComputer(nodeRootHierarchy);

  allLinks = nodeRootHierarchy.links();
  allConstraints = allLinks.filter(function (d) {
    return d.target.data.linkEvent.rights !== "Allow";
  });

  //Bind data with element (nodes and links)
  nodes = gnodes.selectAll(".node")
    .data(nodeRootHierarchy.descendants());

  links = glinks.selectAll(".link")
    .data(allLinks);

  constraints = gconstraints.selectAll(".constraint")
    .data(allConstraints);


  //Draw links
  links.exit().remove();

  links
    .transition()
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
    .on("click",function (d) {
      window.event.cancelBubble = true;
      changeLinkEvent(d.target.data);
    });

  //Draw links
  constraints.exit().remove();

  constraints
    .attr("transform",function(d) {
      var x = d.source.x + ((d.target.x - d.source.x) /2)
      var y =(d.source.depth * depth) + (((d.target.depth * depth) - (d.source.depth * depth)) / 2 )
      return "translate("+x+","+y+")";
    });

  constraints.select("path")
    .transition()
    .style("stroke",function (d) {
      return d.target.data.linkEvent.stroke;
    })
    .style("fill",function (d) {
      return d.target.data.linkEvent.fill;
    })
    .attr("d",function (d) {
      return d.target.data.linkEvent.shape();
    });

  constraints.select("text")
    .transition()
    .style("fill",function (d) {
      return d.target.data.linkEvent.textfill;
    })
    .text(function (d) {
      return d.target.data.linkEvent.letter;
    });

  constraintsGroup =
    constraints
    .enter()
    .append("g")
    .classed("constraint",true)
    .attr("transform",function(d) {
      var x = d.source.x + ((d.target.x - d.source.x) /2)
      var y =(d.source.depth * depth) + (((d.target.depth * depth) - (d.source.depth * depth)) / 2 )
      return "translate("+x+","+y+")";
    })
    .on("click",function (d) {
      window.event.cancelBubble = true;
      changeLinkEvent(d.target.data);
    });

  constraintsGroup
    .append("path")
    .style("stroke-width", "2px")
    .style("stroke",function (d) {
      return d.target.data.linkEvent.stroke;
    })
    .style("fill",function (d) {
      return d.target.data.linkEvent.fill;
    })
    .attr("d",function (d) {
      return d.target.data.linkEvent.shape();
    });

  constraintsGroup
    .append("text")
    .style("text-anchor","middle")
    .style("alignment-baseline","middle")
    .style("fill",function (d) {
      return d.target.data.linkEvent.textfill;
    })
    .text(function (d) {
      return d.target.data.linkEvent.letter;
    });


  //Draw nodes
  nodes.exit().remove();

  var nodesGroup =
  nodes
    .enter()
    .append("g")
    .classed("node",true)
    .attr("transform",function(d) {
      var x = d.x;
      var y = d.depth * depth;
      return "translate("+x+","+y+")";
    })
    .on("click",function (d) {
      if (window.event.ctrlKey) {
        changeEvent(d.data);
      }
      else {
        addChild(d.data);
      }
    });

  nodesGroup
    .append("path")
    .attr("d",function (d) {
      return d.data.nodeEvent.shape();
    })
    .style("stroke",function (d) {
      return d.data.nodeEvent.stroke;
    })
    .style("fill",function (d) {
      return d.data.nodeEvent.fill;
    })
    .style("stroke-width", "2px");

  nodesGroup
    .append("text")
    .style("text-anchor","middle")
    .style("alignment-baseline","middle")
    .text(function (d) {
        return d.data.nodeEvent.letter;
    });


  nodes
  .transition()
  .attr("transform",function(d) {
    var x = d.x;
    var y = d.depth * depth;
    return "translate("+x+","+y+")";
  })

  nodes
  .select("path")
        .transition()
  .attr("d",function (d) {
    return d.data.nodeEvent.shape();
  })
  .style("stroke",function (d) {
    return d.data.nodeEvent.stroke;
  })
  .style("fill",function (d) {
    return d.data.nodeEvent.fill;
  });

  nodes
  .select("text")
        .transition()
  .style("fill",function (d) {
    return d.data.nodeEvent.textfill;
  })
  .text(function (d) {
      return d.data.nodeEvent.letter;
  });

}
computeAndDraw();

//Add child to treeNode
function addChild (treeNode,childNode) {
  if(!treeNode.children){
    treeNode.children = [
      {
        nodeEvent : events[0],
        linkEvent : events[0]
      },
      {
        nodeEvent : events[0],
        linkEvent : events[0]
      }
    ];
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
  var nodeEvent = treeNode.nodeEvent;
  newIdEvent = (nodeEvent.id + 1) %  events.length;
  treeNode.nodeEvent = events[newIdEvent];
  computeAndDraw();
}

//Change node forbidden Event
function changeLinkEvent (treeNode) {
  var linkEvent = treeNode.linkEvent;
  newIdEvent = (linkEvent.id + 1) %  events.length;
  treeNode.linkEvent = events[newIdEvent];
  computeAndDraw();
}

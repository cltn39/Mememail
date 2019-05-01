//d3org moving circle
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    angles = d3.range(0, 2 * Math.PI, Math.PI / 200);

var path = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .attr("fill", "none")
    .attr("stroke-width", 10)
    .attr("stroke-linejoin", "round")
  .selectAll("path")
  .data(["cyan", "magenta", "yellow"])
  .enter().append("path")
    .attr("stroke", function(d) { return d; })
    .style("mix-blend-mode", "darken")
    .datum(function(d, i) {
      return d3.radialLine()
          .curve(d3.curveLinearClosed)
          .angle(function(a) { return a; })
          .radius(function(a) {
            var t = d3.now() / 1000;
            return 200 + Math.cos(a * 8 - i * 2 * Math.PI / 3 + t) * Math.pow((1 + Math.cos(a - t)) / 2, 3) * 32;
          });
    });

d3.timer(function() {
  path.attr("d", function(d) {
    return d(angles);
  });
});

//choreography
var wrapperNode = document.getElementById('wrapper')
var scrollDownNode = document.querySelector('.scroll-down')
var linkNodes = document.querySelector('.links')

var vh = window.innerHeight

/* STORE SOME KEY LOCATIONS */

/* ~ le fin ~
 * The point where you cannot scroll down any further.
 */
var fin = wrapperNode.clientHeight - vh + linkNodes.clientHeight 

function calculateAnimations() {
  return [
    /* animate first M */
    { range: [-1, fin * 0.5],   selector: '.m', type: 'scale', style: 'transform:translateY', from: 0, to: 25, unit: 'px' },
    { range: [fin * 0.5, fin],  selector: '.m', type: 'scale', style: 'transform:translateY', from: 25, to: 0, unit: 'px' },
    { range: [fin * 0.4, fin],  selector: '.m', type: 'change', style: 'color', to: '#ffb515' },

    /* animate first E */
    { range: [-1, fin * 0.5],   selector: '.e', type: 'scale', style: 'transform:scaleX', from: 1, to: 0.5 },
    { range: [-1, fin * 0.5],   selector: '.e', type: 'scale', style: 'transform:scaleY', from: 1, to: 0.5 },
    { range: [fin * 0.5, fin],  selector: '.e', type: 'scale', style: 'transform:scaleX', from: 0.5, to: 1 },
    { range: [fin * 0.5, fin],  selector: '.e', type: 'scale', style: 'transform:scaleY', from: 0.5, to: 1 },
    { range: [fin * 0.3, fin],  selector: '.e', type: 'change', style: 'color', to: '#1fd1ec' },

    /* animate 2nd M */
    { range: [fin * 0.1, fin],  selector: '.mm', type: 'randomizeColor' },

    /* animate 2nd E and 1st A */
    { range: [-1, fin * 0.5],   selector: '.eea', type: 'scale', style: 'transform:rotateX', from: 0, to: 90, unit: 'deg' },
    { range: [fin * 0.5, fin],  selector: '.eea', type: 'scale', style: 'transform:rotateX', from: 90, to: 0, unit: 'deg' },
    { range: [fin * 0.3, fin],  selector: '.eea', type: 'change', style: 'color', to: '#8382f9' },

    /* animate 3rd M */
    { range: [-1, fin * 0.5],   selectors: ['.mmm', '.j'], type: 'scale', style: 'transform:rotateZ', from: 0, to: 180, unit: 'deg' },
    { range: [fin * 0.5, fin],  selectors: ['.mmm', '.j'], type: 'scale', style: 'transform:rotateZ', from: 180, to: 360, unit: 'deg' },
    { range: [fin * 0.4, fin],  selectors: ['.mmm', '.j'], type: 'change', style: 'color', to: '#ff8b1c' },

    /* animate I */
    { range: [-1, fin * 0.5],   selectors: ['.i'], type: 'scale', style: 'transform:rotateZ', from: 0, to: -180, unit: 'deg' },
    { range: [fin * 0.5, fin],  selectors: ['.i'], type: 'scale', style: 'transform:rotateZ', from: -180, to: -360, unit: 'deg' },
    { range: [fin * 0.4, fin],  selectors: ['.i'], type: 'change', style: 'color', to: '#c05bdb' },

    /* animate L */
    { range: [-1, fin * 0.5],   selectors: ['.l' ], type: 'scale', style: 'opacity', from: 1, to: 0.1 },
    { range: [fin * 0.5, fin],  selectors: ['.l' ], type: 'scale', style: 'opacity', from: 0.1, to: 1 },
    { range: [fin * 0.4, fin],  selectors: ['.l' ], type: 'change', style: 'color', to: '#ff537c' },

    /* animate line */
    { range: [-1, fin],         selector: '.line', type: 'scale', style: 'width', from: 0.01, to: 50, unit: '%' },
    { range: [-1, fin],         selector: '.line', type: 'scale', style: 'opacity', from: 0, to: 1 },

    /* animate arrow */
    { range: [0.6 * fin, fin], selector: '.scroll-down', type: 'scale', style: 'opacity', from: 1, to: 0 },
    { range: [fin - 30, fin],   selector: '.scroll-down', type: 'change', style: 'display', to: 'none' },

    /* animate links */
    { range: [0.8 * fin, fin], selector: '.links', type: 'scale', style: 'opacity', from: 0, to: 1 }
  ]
}

// Instantiate choreographer.
var choreographer = new Choreographer({
  animations: calculateAnimations(),
  customFunctions: {
    randomizeColor: function(data) {
      var chars = '0123456789abcdef'.split('')
      var hex = '#'

      while (hex.length < 7) {
        hex += chars[Math.round(Math.random() * (chars.length - 1))]
      }

      data.node.style.color = hex
    }
  }
})

function animate() {
  var scrollPosition = (wrapperNode.getBoundingClientRect().top - wrapperNode.offsetTop) * - 1
  choreographer.runAnimationsAt(scrollPosition)
}

document.body.addEventListener('scroll', animate)

animate()

window.addEventListener('resize', function() {
  choreographer.updateAnimations(calculateAnimations())
})
//  Hexagon grid

!function () { d3.hexbin = function () { function u(n) { var r = {}; return n.forEach(function (n, t) { var a = s.call(u, n, t) / o, e = Math.round(a), c = h.call(u, n, t) / i - (1 & e ? .5 : 0), f = Math.round(c), l = a - e; if (3 * Math.abs(l) > 1) { var v = c - f, g = f + (f > c ? -1 : 1) / 2, m = e + (e > a ? -1 : 1), M = c - g, d = a - m; v * v + l * l > M * M + d * d && (f = g + (1 & e ? 1 : -1) / 2, e = m) } var j = f + "-" + e, p = r[j]; p ? p.push(n) : (p = r[j] = [n], p.i = f, p.j = e, p.x = (f + (1 & e ? .5 : 0)) * i, p.y = e * o) }), d3.values(r) } function a(r) { var t = 0, u = 0; return n.map(function (n) { var a = Math.sin(n) * r, e = -Math.cos(n) * r, i = a - t, o = e - u; return t = a, u = e, [i, o] }) } var e, i, o, c = 1, f = 1, h = r, s = t; return u.x = function (n) { return arguments.length ? (h = n, u) : h }, u.y = function (n) { return arguments.length ? (s = n, u) : s }, u.hexagon = function (n) { return arguments.length < 1 && (n = e), "m" + a(n).join("l") + "z" }, u.centers = function () { for (var n = [], r = 0, t = !1, u = 0; f + e > r; r += o, t = !t, ++u)for (var a = t ? i / 2 : 0, h = 0; c + i / 2 > a; a += i, ++h) { var s = [a, r]; s.i = h, s.j = u, n.push(s) } return n }, u.mesh = function () { var n = a(e).slice(0, 4).join("l"); return u.centers().map(function (r) { return "M" + r + "m" + n }).join("") }, u.size = function (n) { return arguments.length ? (c = +n[0], f = +n[1], u) : [c, f] }, u.radius = function (n) { return arguments.length ? (e = +n, i = 2 * e * Math.sin(Math.PI / 3), o = 1.5 * e, u) : e }, u.radius(1) }; var n = d3.range(0, 2 * Math.PI, Math.PI / 3), r = function (n) { return n[0] }, t = function (n) { return n[1] } }();

(function (a, b, c, d, e, f) { function k(a) { var b, c = a.length, e = this, f = 0, g = e.i = e.j = 0, h = e.S = []; for (c || (a = [c++]); d > f;)h[f] = f++; for (f = 0; d > f; f++)h[f] = h[g = j & g + a[f % c] + (b = h[f])], h[g] = b; (e.g = function (a) { for (var b, c = 0, f = e.i, g = e.j, h = e.S; a--;)b = h[f = j & f + 1], c = c * d + h[j & (h[f] = h[g = j & g + b]) + (h[g] = b)]; return e.i = f, e.j = g, c })(d) } function l(a, b) { var e, c = [], d = (typeof a)[0]; if (b && "o" == d) for (e in a) try { c.push(l(a[e], b - 1)) } catch (f) { } return c.length ? c : "s" == d ? a : a + "\0" } function m(a, b) { for (var d, c = a + "", e = 0; c.length > e;)b[j & e] = j & (d ^= 19 * b[j & e]) + c.charCodeAt(e++); return o(b) } function n(c) { try { return a.crypto.getRandomValues(c = new Uint8Array(d)), o(c) } catch (e) { return [+new Date, a, a.navigator.plugins, a.screen, o(b)] } } function o(a) { return String.fromCharCode.apply(0, a) } var g = c.pow(d, e), h = c.pow(2, f), i = 2 * h, j = d - 1; c.seedrandom = function (a, f) { var j = [], p = m(l(f ? [a, o(b)] : 0 in arguments ? a : n(), 3), j), q = new k(j); return m(o(q.S), b), c.random = function () { for (var a = q.g(e), b = g, c = 0; h > a;)a = (a + c) * d, b *= d, c = q.g(1); for (; a >= i;)a /= 2, b /= 2, c >>>= 1; return (a + c) / b }, p }, m(c.random(), b) })(this, [], Math, 256, 6, 52);

var data = [
    { title: "Radial Tidy Tree", url: "https://observablehq.com/@d3/radial-tidy-tree" },
    { title: "Factorisation Diagrams", url: "https://www.jasondavies.com/factorisation-diagrams/" },
    { title: "Phylogenetic Tree of Life", url: "https://observablehq.com/@mbostock/tree-of-life" },
    { title: "Geographic Clipping", url: "https://www.jasondavies.com/maps/clip/" },
    { title: "Les Misérables Co-occurrence Matrix", url: "https://bost.ocks.org/mike/miserables/" },
    { title: "L*a*b* and HCL color spaces", url: "https://bl.ocks.org/mbostock/3014589" },
    { title: "Treemap", url: "https://observablehq.com/@d3/treemap" },
    { title: "Map Projection Transitions", url: "https://www.jasondavies.com/maps/transition/" },
    { title: "Across U.S. Companies, Tax Rates Vary Greatly", url: "http://www.nytimes.com/interactive/2013/05/25/sunday-review/corporate-taxes.html" },
    { title: "Rotating Voronoi", url: "https://observablehq.com/@mbostock/rotating-voronoi" },
    { title: "Zoomable Geography", url: "https://bl.ocks.org/mbostock/2374239" },
    { title: "Fisheye Distortion", url: "https://bost.ocks.org/mike/fisheye/" },
    { title: "Geodesic Rainbow", url: "https://observablehq.com/@mbostock/geodesic-rainbow" },
    { title: "Hierarchical Bar Chart", url: "https://bl.ocks.org/mbostock/1283663" },
    { title: "Exoplanets", url: "https://observablehq.com/@mbostock/exoplanets" },
    { title: "Crossfilter", url: "http://square.github.io/crossfilter/" },
    { title: "Alaska’s villages on the frontline of climate change", url: "http://www.guardian.co.uk/environment/interactive/2013/may/14/alaska-villages-frontline-global-warming" },
    { title: "The federal health-care exchange’s abysmal success rate", url: "http://www.washingtonpost.com/wp-srv/special/politics/state-vs-federal-exchanges/" },
    { title: "Counties Blue and Red, Moving Right and Left", url: "http://www.nytimes.com/interactive/2012/11/11/sunday-review/counties-moving.html" },
    { title: "At the National Conventions, the Words They Used", url: "http://www.nytimes.com/interactive/2012/09/06/us/politics/convention-word-counts.html" },
    { title: "Reprojected Raster Tiles", url: "https://www.jasondavies.com/maps/raster/" },
    { title: "Hive Plots", url: "https://bost.ocks.org/mike/hive/" },
    { title: "Donut Transitions", url: "https://bl.ocks.org/mbostock/4341417" },
    { title: "Non-Contiguous Cartogram", url: "https://bl.ocks.org/mbostock/4055908" },
    { title: "Tadpoles", url: "https://observablehq.com/@mbostock/tadpoles" },
    { title: "Zoomable Circle Packing", url: "https://observablehq.com/@d3/zoomable-circle-packing" },
    { title: "Transform Transitions", url: "https://bl.ocks.org/mbostock/1345853" },
    { title: "Scatterplot Matrix", url: "https://observablehq.com/@d3/scatterplot-matrix" },
    { title: "Janet L. Yellen, on the Economy’s Twists and Turns", url: "http://www.nytimes.com/interactive/2013/10/09/us/yellen-fed-chart.html" },
    { title: "Front Row to Fashion Week", url: "http://www.nytimes.com/newsgraphics/2013/09/13/fashion-week-editors-picks/index.html" },
    { title: "Interrupted Sinu-Mollweide", url: "https://observablehq.com/@d3/interrupted-sinu-mollweide" },
    { title: "Streamgraph", url: "https://observablehq.com/@mbostock/streamgraph-transitions" },
    { title: "Force-Directed Graph", url: "https://observablehq.com/@d3/force-directed-graph" },
    { title: "Zoomable Icicle", url: "https://observablehq.com/@d3/zoomable-icicle" },
    { title: "Collision Detection", url: "https://bl.ocks.org/mbostock/3231298" },
    { title: "Waterman Butterfly", url: "https://bl.ocks.org/mbostock/4458497" },
    { title: "Airocean projection", url: "https://observablehq.com/@fil/airocean-projection" },
    { title: "Countries by Area", url: "https://www.jasondavies.com/maps/countries-by-area/" },
    { title: "Zoomable Sunburst", url: "https://observablehq.com/@d3/zoomable-sunburst" },
    { title: "Map Zooming", url: "https://bl.ocks.org/mbostock/6242308" },
    { title: "Fisher–Yates Shuffle", url: "https://bost.ocks.org/mike/shuffle/" },
    { title: "Sphere Spirals", url: "https://www.jasondavies.com/maps/sphere-spirals/" },
    { title: "World Tour", url: "https://observablehq.com/@mbostock/world-tour" },
    { title: "Zoomable Treemaps", url: "https://bost.ocks.org/mike/treemap/" },
    { title: "Clipped Map Tiles", url: "https://bl.ocks.org/mbostock/4150951" },
    { title: "Horizon Chart", url: "https://observablehq.com/@d3/horizon-chart" },
    { title: "Voronoi Labels", url: "https://observablehq.com/@mbostock/d3-voronoi-labels" },
    { title: "Hexbin Map", url: "https://observablehq.com/@d3/hexbin-map" },
    { title: "OMG Particles!", url: "https://bl.ocks.org/mbostock/1062544" },
    { title: "Calendar View", url: "https://observablehq.com/@d3/calendar-view" },
    { title: "The Wealth & Health of Nations", url: "https://bost.ocks.org/mike/nations/" },
    { title: "Collapsible Tree", url: "https://observablehq.com/@d3/collapsible-tree" },
    { title: "Hexagonal Binning", url: "https://observablehq.com/@d3/hexbin" },
    { title: "Over the Decades, How States Have Shifted", url: "http://www.nytimes.com/interactive/2012/10/15/us/politics/swing-history.html" },
    { title: "China Still Dominates, but Some Manufacturers Look Elsewhere", url: "http://www.nytimes.com/interactive/2013/04/08/business/global/asia-map.html" },
    { title: "Strikeouts on the Rise", url: "http://www.nytimes.com/interactive/2013/03/29/sports/baseball/Strikeouts-Are-Still-Soaring.html?ref=baseball" },
    { title: "Epicyclic Gearing", url: "https://observablehq.com/@mbostock/epicyclic-gearing" },
    { title: "Voronoi Particles", url: "https://observablehq.com/@mbostock/voronoi-particles" },
    { title: "The state of our union is … dumber", url: "http://www.guardian.co.uk/world/interactive/2013/feb/12/state-of-the-union-reading-level" },
    { title: "Chord Dependency Diagram", url: "https://observablehq.com/@d3/chord-dependency-diagram" },
    { title: "Floating Landmasses", url: "https://observablehq.com/@mbostock/floating-landmasses" },
    { title: "How the Tax Burden Has Changed", url: "http://www.nytimes.com/interactive/2012/11/30/us/tax-burden.html" },
    { title: "Prime Number Patterns", url: "https://www.jasondavies.com/primos/" },
    { title: "Koalas to the Max", url: "http://www.koalastothemax.com/" },
    { title: "Constellations of Directors and Their Stars", url: "http://www.nytimes.com/newsgraphics/2013/09/07/director-star-chart/index.html" },
    { title: "Drought and Deluge in the Lower 48", url: "http://www.nytimes.com/interactive/2012/08/11/sunday-review/drought-history.html" },
    { title: "Animated Bézier Curves", url: "https://www.jasondavies.com/animated-bezier/" },
    { title: "Histogram", url: "https://observablehq.com/@d3/histogram" },
    { title: "Stacked-to-Grouped Bars", url: "https://observablehq.com/@d3/stacked-to-grouped-bars" },
    { title: "Force-Directed States of America", url: "https://bl.ocks.org/mbostock/1073373" },
    { title: "Faux-3D Arcs", url: "http://bl.ocks.org/dwtkns/4973620" },
    { title: "512 Paths to the White House", url: "http://www.nytimes.com/interactive/2012/11/02/us/politics/paths-to-the-white-house.html" },
    { title: "Polar Clock", url: "https://observablehq.com/@mbostock/polar-clock" },
    { title: "Population Pyramid", url: "https://observablehq.com/@mbostock/u-s-population-by-age-and-sex/3" },
    { title: "The America’s Cup Finale: Oracle’s Path to Victory", url: "http://www.nytimes.com/interactive/2013/09/25/sports/americas-cup-course.html" },
    { title: "Rainbow Worm", url: "https://observablehq.com/@mbostock/rainbow-worm" },
    { title: "Four Ways to Slice Obama’s 2013 Budget Proposal", url: "http://www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html" },
    { title: "Quadtree", url: "https://bl.ocks.org/mbostock/4343214" },
    { title: "Bubble Chart", url: "https://observablehq.com/@d3/bubble-chart" },
    { title: "Women as Academic Authors, 1665-2010", url: "http://chronicle.com/article/Woman-as-Academic-Authors/135192/" },
    { title: "Choropleth", url: "https://observablehq.com/@d3/choropleth" },
    { title: "Gilbert’s Two-World Perspective", url: "https://www.jasondavies.com/maps/gilbert/" },
    { title: "For Eli Manning, 150 Games and Counting", url: "http://www.nytimes.com/newsgraphics/2013/09/28/eli-manning-milestone/index.html" },
    { title: "Word Tree", url: "https://www.jasondavies.com/wordtree/" },
    { title: "Mobile Patent Suits", url: "https://bl.ocks.org/mbostock/1153292" },
    { title: "Mitchell’s Best-Candidate", url: "https://bl.ocks.org/mbostock/1893974" },
    { title: "Sankey Diagrams", url: "https://observablehq.com/@d3/sankey-diagram" },
    { title: "van Wijk Smooth Zooming", url: "https://bl.ocks.org/mbostock/3828981" },
    { title: "Bryce Harper: A swing of beauty", url: "http://www.washingtonpost.com/wp-srv/special/sports/bryce-harper-swing-of-beauty/" },
    { title: "Dissecting a Trailer: The Parts of the Film That Make the Cut", url: "http://www.nytimes.com/interactive/2013/02/19/movies/awardsseason/oscar-trailers.html" },
    { title: "Violence and guns in best-selling video games", url: "http://www.guardian.co.uk/world/interactive/2013/apr/30/violence-guns-best-selling-video-games" },
    { title: "Hierarchical Edge Bundling", url: "https://observablehq.com/@d3/hierarchical-edge-bundling" },
    { title: "Geographic Bounding Boxes", url: "https://www.jasondavies.com/maps/bounds/" },
    { title: "Live Results: Massachusetts Senate Special Election", url: "http://elections.huffingtonpost.com/2013/massachusetts-senate-results" },
    { title: "Zoomable Map Tiles", url: "https://bl.ocks.org/mbostock/4132797" },
    { title: "D3 Show Reel", url: "https://bl.ocks.org/mbostock/1256572" },
    { title: "Building Hamiltonian Graphs from LCF Notation", url: "http://christophermanning.org/projects/building-cubic-hamiltonian-graphs-from-lcf-notation" },
    { title: "Sequences sunburst", url: "https://bl.ocks.org/kerryrodden/766f8f6d31f645c39f488a0befa1e3c8" },
    { title: "Azimuth and Distance from London", url: "https://www.jasondavies.com/maps/azimuth-distance/" },
    { title: "Parallel Sets", url: "https://www.jasondavies.com/parallel-sets/" }
];

data.forEach(function (d, i) {
    d.i = i % 10;
    d.j = i / 10 | 0;
});

Math.seedrandom(+d3.timeHour(new Date));

d3.shuffle(data);

var height = 400,
    imageWidth = 132,
    imageHeight = 142,
    radius = 85,
    depth = 5;

var currentFocus = [innerWidth / 2, height / 2],
    desiredFocus,
    idle = true;

var style = document.body.style,
    transform = ("webkitTransform" in style ? "-webkit-"
        : "MozTransform" in style ? "-moz-"
            : "msTransform" in style ? "-ms-"
                : "OTransform" in style ? "-o-"
                    : "") + "transform";

var hexbin = d3.hexbin()
    .radius(radius);

if (!("ontouchstart" in document)) d3.select("#examples")
    .on("mousemove", mousemoved);

var deep = d3.select("#examples-deep");

var canvas = deep.append("canvas")
    .attr("height", height);

var context = canvas.node().getContext("2d");

var svg = deep.append("svg")
    .attr("height", height);

var mesh = svg.append("path")
    .attr("class", "example-mesh");

var anchor = svg.append("g")
    .attr("class", "example-anchor")
    .selectAll("a");

var graphic = deep.selectAll("svg,canvas");

var image = new Image;
image.src = "https://d3js.org/ex.jpg?3f2d00ffdba6ced9c50f02ed42f12f6156368bd2";
image.onload = resized;

d3.select(window)
    .on("resize", resized)
    .each(resized);

function drawImage(d) {
    context.save();
    context.beginPath();
    context.moveTo(0, -radius);

    for (var i = 1; i < 6; ++i) {
        var angle = i * Math.PI / 3,
            x = Math.sin(angle) * radius,
            y = -Math.cos(angle) * radius;
        context.lineTo(x, y);
    }

    context.clip();
    context.drawImage(image,
        imageWidth * d.i, imageHeight * d.j,
        imageWidth, imageHeight,
        -imageWidth / 2, -imageHeight / 2,
        imageWidth, imageHeight);
    context.restore();
}

function resized() {
    var deepWidth = innerWidth * (depth + 1) / depth,
        deepHeight = height * (depth + 1) / depth,
        centers = hexbin.size([deepWidth, deepHeight]).centers();

    desiredFocus = [innerWidth / 2, height / 2];
    moved();

    graphic
        .style("left", Math.round((innerWidth - deepWidth) / 2) + "px")
        .style("top", Math.round((height - deepHeight) / 2) + "px")
        .attr("width", deepWidth)
        .attr("height", deepHeight);

    centers.forEach(function (center, i) {
        center.j = Math.round(center[1] / (radius * 1.5));
        center.i = Math.round((center[0] - (center.j & 1) * radius * Math.sin(Math.PI / 3)) / (radius * 2 * Math.sin(Math.PI / 3)));
        context.save();
        context.translate(Math.round(center[0]), Math.round(center[1]));
        drawImage(center.example = data[(center.i % 10) + ((center.j + (center.i / 10 & 1) * 5) % 10) * 10]);
        context.restore();
    });

    mesh.attr("d", hexbin.mesh);

    anchor = anchor.data(centers, function (d) { return d.i + "," + d.j; });

    anchor.exit().remove();

    var anchorEnter = anchor.enter().append("a")
        .attr("xlink:href", function (d) { return d.example.url; })
        .attr("xlink:title", function (d) { return d.example.title; });

    anchorEnter.append("path")
        .attr("d", hexbin.hexagon());

    anchor = anchorEnter.merge(anchor)
        .attr("transform", function (d) { return "translate(" + d + ")"; });
}

function mousemoved() {
    var m = d3.mouse(this);

    desiredFocus = [
        Math.round((m[0] - innerWidth / 2) / depth) * depth + innerWidth / 2,
        Math.round((m[1] - height / 2) / depth) * depth + height / 2
    ];

    moved();
}

function moved() {
    var t = d3.timer(function () {
        if (Math.abs(desiredFocus[0] - currentFocus[0]) < .5 && Math.abs(desiredFocus[1] - currentFocus[1]) < .5) currentFocus = desiredFocus, t.stop();
        else currentFocus[0] += (desiredFocus[0] - currentFocus[0]) * .14, currentFocus[1] += (desiredFocus[1] - currentFocus[1]) * .14;
        deep.style(transform, "translate(" + (innerWidth / 2 - currentFocus[0]) / depth + "px," + (height / 2 - currentFocus[1]) / depth + "px)");
    });
}

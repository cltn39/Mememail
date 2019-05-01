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

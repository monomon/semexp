

var render = function(r, n) {
    /* the Raphael set is obligatory, containing all you want to display */
    var set = r.set().push(
        /* custom objects go here */
        //use a face shape instead of rect?
        r.rect(n.point[0]-30, n.point[1]-13, 62, 62)
            .attr({"fill": n.fill || "#d0d0d0", "stroke-width": 1, "stroke": "#fff", r : "10px"}))
            .push(r.text(n.point[0], n.point[1] + 20, n.label)
                .attr({"font-size":"15px"}));
        console.log(set);
    return set;
};
var g = new Graph();
{% for p in ppl %}
    g.addNode('{{p.key}}', {label: "{{p.name}}", render: render, fill: '{{p.get_color}}'});
{% endfor %}
{% for l in links %}
    g.addEdge('{{l.p1.key}}', '{{l.p2.key}}', {'id':'{{l.key}}', 'fill':'{{ l.get_color }}|5', 'label': "{{l.description}}", 'stroke':'{{l.get_color}}'});
    //console.log('{{l.get_color}}');
{% endfor %}
var layouter = new Graph.Layout.Spring(g);
layouter.layout(); 
var renderer = new Graph.Renderer.Raphael('viewport', g, $(window).width()*0.75, $(window).height()*0.75);
$.ajax({
    async:false,
    url:'img/icons_plain.svg',
    dataType: "xml",
    success: function(data){
        console.log(renderer.r.importSVG(data));
    },
    error:function(xhr, status, err){
        console.log(err);
    }
});
renderer.draw();
redraw = function() {
    layouter.layout();
    renderer.draw();
};
//for(key in g.edges){
//    console.log(g.edges[key]);
//}
//TODO: write a custom render function

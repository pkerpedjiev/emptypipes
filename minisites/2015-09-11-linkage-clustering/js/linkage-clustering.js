function linkageClustering(selection) {
    var width = 550;
    var height = 350;

    var numCircles = 20;

    function chart(selection) {
        var svg = selection.append('svg')
        .attr('width', width)
        .attr('height', height);

        var rootG = svg.append('g');

        var xScale = d3.scale.linear().domain([0,1])
        .range([0, width]);

        var yScale = d3.scale.linear().domain([0,1])
        .range([height, 0]);

        // create random positions for all of the nodes that we'll
        // be clustering
        var positions = [];
        for (var i = 0; i < numCircles; i++) 
            positions.push([Math.random(), Math.random()]);

        var clusterLinks = proximityCluster(positions, 0.2);
        var clusters = clusterLinks.clusters;
        var links = clusterLinks.links;

        var clusterColors = d3.scale.category10()
        .domain(d3.set(clusters).values());

        console.log('clusters', clusters);

        rootG.selectAll('circle')
        .data(positions)
        .enter()
        .append('circle')
        .attr('cx', function(d) { return xScale(d[0]); })
        .attr('cy', function(d) { return yScale(d[1]); })
        .attr('r', function(d) { return 6; })
        .style('fill', function(d,i) { return clusterColors(clusters[i]);});

        console.log('links:', links)
        rootG.selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('x1', function(d) { console.log('d', d); return xScale(positions[d[0]][0]); })
        .attr('y1', function(d) { return yScale(positions[d[0]][1]); })
        .attr('x2', function(d) { return xScale(positions[d[1]][0]); })
        .attr('y2', function(d) { return yScale(positions[d[1]][1]); })
        .style('stroke', 'black')
        .style('stroke-width', 1);
    }

    function proximityCluster(points, distance) {
        //cluster points such that whenever two points are
        //within distance of each other, they are placed in
        //the same cluster

        //take m n-d points as input and
        //return an array of length m containing integers
        //where each integers encodes the cluster that the ith
        //point is in
        
        var clusters = [], links = [];
        var linksDict = {};

        // all points are in their own cluster
        for (var i = 0; i < points.length; i++) {
            clusters.push(i);
            linksDict[i] = [];
        }

        console.log('points:', points);

        // sort the points by x values
        points = points.sort(function(a,b) { return a[0] - b[0]; });

        function dist(a,b) {
            return Math.sqrt(Math.pow((a[0] - b[0]),2) + Math.pow((a[1] - b[1]),2));
        }

        for (i = 0; i < points.length; i++) {
            //check for points to the right
            for (j = i+1; j < points.length; j++) {
                if (Math.abs(points[j][0] - points[i][0]) > distance)
                    break;  // gone too far

                if (dist(points[i], points[j]) < distance) {
                    // the two points are close enough to be linked
                    links.push([i,j]);
                    linksDict[i].push(j);
                    linksDict[j].push(i);
                }
            }
        }

        var visited = d3.set();

        // traverse the list of links and assign clusters
        function dfs(currNode, prevNode) {
            visited.add(currNode);
            clusters[currNode] = Math.min(clusters[currNode], clusters[prevNode]);

            console.log('currNode', currNode);
            for (var i = 0; i < linksDict[currNode].length; i++) {
                if (visited.has(linksDict[currNode][i]))
                    continue;
                
                dfs(linksDict[currNode][i], currNode);
            }
        }

        // go through every point and traverse its list of links
        // assigning clusters
        for (i = 0; i < points.length; i++) {
            if (visited.has(i))
                continue;
            
            dfs(i, i);
        }

        return {"clusters": clusters, "links": links};
    }

    chart.width = function(_) {
        if (!arguments.length) return _;
        else width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return _;
        else height = _;
        return chart;
    };

    chart.numCircles = function(_) {
        if (!arguments.length) return _;
        else numCircles = _;
        return chart;
    };

    return chart;
}

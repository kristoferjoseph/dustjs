(function(exports){

var benches = {

  string: {
    source:  "Hello World!",
    context: {}
  },

  replace: {
    source:  "Hello <%= data.name %>! You have <%= data.count %> new messages.",
    context: { name: "Mick", count: 30 }
  },

  array: {
    source:   "<% _.each(data.names, function(item) { %> <%= item.name %> <% }); %>",
    context:  { names: [{name: "Moe"}, {name: "Larry"}, {name: "Curly"}, {name: "Shemp"}] }
  },

  object: {
    source:   "<%= data.person.name %> <%= data.person.age %>",
    context:  { person: { name: "Larry", age: 45 } }
  },

  partial: {
    source:   "<% _.each(data.peeps, function(peep) { %> <%= data.partials.myPartialTemplate(peep) %> <% }); %>",
    context:  { peeps: [{name: "Moe", count: 15}, {name: "Larry", count: 5}, {name: "Curly", count: 1}] },
    partials: { myPartialTemplate: "Hello <%= data.name %>! You have <%= data.count %> new messages." }
  },

  recursion: {
    source:   "<%= data.name %> <% _.each(data.kids, function(kid) { %> <%= data.partials.recursion({data:data.kid, partials:data.partials}) %> <% }); %>",
    context:  {
                name: '1',
                kids: [
                  {
                    name: '1.1',
                    kids: [
                      {name: '1.1.1'}
                    ]
                  }
                ]
              },
    partials: { recursion: "<%= data.name %> <% _.each(data.kids, function(kid) { %> <%= partials.recursion({data:kid, partials:partials}) %> <% }); %>" }
  },

  filter: {
    source:   "foo <%= data.filter(data.bar) %>",
    context:  {
                filter: function(str) {
                  return str.toUpperCase();
                },
                bar: "bar"
              }
  },

  complex: {
    source:  "<h1><%= data.header() %></h1>\n" +
             "<% if(data.hasItems) { %>" +
             "  <% _.each(data.items, function(item) { %>\n" +
             "    <ul>\n" +
             "        <% if(item.current) { %>\n" +
             "          <li><strong> <%- item.name %> </strong></li>\n" +
             "        <% } else { %>\n" +
             "          <li><a href=\" <%- item.url %> \"> <%- item.name %> </a></li>\n" +
             "        <% } %>\n" +
             "    </ul>\n" +
             "  <% }); %>" +
             "<% } else { %>\n" +
             "  <p>The list is empty.</p>\n" +
             "<% } %>",
    context: {
               header: function() {
                 return "Colors";
               },
               items: [
                 {name: "red", current: true, url: "#Red"},
                 {name: "green", current: false, url: "#Green"},
                 {name: "blue", current: false, url: "#Blue"}
               ],
               hasItems: function(ctx) {
                  return ctx.items.length ? true : false;
               }
             }
  }

};

exports.underscoreBench = function(suite, name, id) {
  var bench = benches[name],
      fn = _.template(bench.source, null, {variable:'data'}),
      ctx = bench.context,
      partials = {};

  if (bench.partials) {
    for (var key in bench.partials) {
      partials[key] = _.template(bench.partials[key], null, {variable:'data'});
    }
  }

  ctx.partials = partials;

  suite.bench(id || name, function(next) {
    fn(ctx);
    next();
  });
};

exports.underscoreBench.benches = benches;

})(typeof exports !== "undefined" ? exports : window);

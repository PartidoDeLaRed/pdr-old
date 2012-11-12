// var ghm = require("ghm");
var marked = require('marked');

exports.restrict = function(req, res, next){
  if(req.isAuthenticated()) next();
  else res.redirect('/');
};

// exports.md = function(source, options) {
//   return ghm.parse(source);
// }

exports.md = function(source, options) {
  options = options || {};
  options.sanitize = options.sanitize || true;

  // github like mardown for tabs and newlines
  source = source
  // \r\n and \r -> \n
  .replace(/\r\n?/g, '\n')

  // 2 newline to paragraph
  .replace(/\n\n+/, "\n\n")

  // 1 newline to br
  .replace(/([^\n]\n)(?=[^\n])/g, function(m) {
    return /\n{2}/.test(m) ? m : m.replace(/\s+$/,"") + "  \n";
  })

  // tabs to four spaces
  .replace(/\t/g, '    ');

  return marked(source, options);
};

exports.actions = {
  vote: {
    template: 'Voto en %voteTitle%.',
    params: ['voteTitle']
  },
  comment: {
    template: 'Opino en la votacion sobre %ideaTitle%.',
    params: ['ideaTitle']
  },
  proxy: {
    template: 'Delego su voto en %hashTitle% a %citizenName%.',
    params: ['hashTitle', 'citizenName']
  },
  profileEdit: {
    template: 'Editó su perfil.',
    params: []
  }
}

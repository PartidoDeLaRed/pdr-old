exports.restrict = function(req, res, next){
  if(req.isAuthenticated()) next();
  else res.redirect('/');
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

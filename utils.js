exports.restrict = function(req, res, next){
  if(req.isAuthenticated()) next();
  else res.redirect('/');
};

exports.actions = {
	vote: {
		template: 'Voto en %ideaTitle%. %timeAgo%',
		params: ['ideaTitle', 'timeAgo']
	},
	comment: {
		template: 'Opino en la votacion sobre %ideaTitle%. %timeAgo%',
		params: ['ideaTitle', 'timeAgo']
	},
	proxy: {
		template: 'Delego su voto en %hashTitle% en %citizenName%. %timeAgo%',
		params: ['hashTitle', 'citizenName', 'timeAgo']
	},
	profileEdit: {
		template: 'Editó su perfil. %timeAgo%',
		params: ['timeAgo']
	}
}

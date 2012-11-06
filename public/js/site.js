$(document).ready(function(){

	$('.compose-text').focus(function(){
		$('.insertion-point').css('visibility', 'hidden');
		$(this).prev('.insertion-point').css('visibility', 'visible');
	});

	$('.expand').autosize();

	$('form.compose-modal-inner').sisyphus({timeout: 1, autoRelease: true});

	$('.tt').tooltip();

	$('a.tt.options').click(function(){
		$(this).toggleClass('active');
		$('.options-dropdown').toggle();
		return false;
	});

	$('.time').livequery(function() {
		$(this).timeago();
	});


	$('.box-homepage-list').masonry({
	    // options
	    itemSelector : '.box-homepage'

  	});
});
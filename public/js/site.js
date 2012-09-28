$(document).ready(function(){

	$('.compose-link').click(function(){
		$('.compose-modal').fadeIn();

		return false;
	});

	$('.close-compose').click(function(){
		$('.compose-modal').fadeOut('fast');
		return false;
	});


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

	$('span.time').timeago();
});
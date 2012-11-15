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

	// $('.issue-content-description').livequery(function() {
	// 	$(this).expander({
	// 		slicePoint:900,
	// 		widow:2,
	// 		expandEffect: 'show',
	// 		expandText: 'Leer Más',
	// 		userCollapseText: 'Menos'
	// 	});
	// });

	$('.box-homepage-list').masonry({
	    // options
	    itemSelector : '.box-homepage'

  	});
});
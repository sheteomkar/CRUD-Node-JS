//$.noConflict();

jQuery(document).ready(function($) {

//	"use strict";

	[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el);
	} );

	jQuery('.selectpicker').selectpicker;


	$('#menuToggle').on('click', function(event) {
		$('body').toggleClass('open');
	});

	$('.search-trigger').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').addClass('open');
	});

	$('.search-close').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').removeClass('open');
	});

	// $('.user-area> a').on('click', function(event) {
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	$('.user-menu').parent().removeClass('open');
	// 	$('.user-menu').parent().toggleClass('open');
	// });


});


//---------collapsible accordation-------
  $(document).ready(function(){
   $(".cust-accordion").click(function(){
			$(this).addClass("active");
			var panel=$(this).next().css("display");
			if( panel==="block"){
				$(this).next().hide(300);
				
			}else{
				$(this).next().show(300);
			}
		});
});
//----popover -------

		$(document).ready(function(){
			$('[data-toggle="popover"]').popover();   
		});



//---------------------carsoul popup------------------

        function PopUp(hideOrshow) {
            if (hideOrshow == 'hide') document.getElementById('inner').style.display = "none";
            else document.getElementById('inner').removeAttribute('style');
        }

        window.onload = function() {
            setTimeout(function() {
                PopUp('show');
            }, 500);
        }

        function closepopup() {
            document.getElementById("inner").style.display = "none";
        }

        document.getElementById('sa-close').addEventListener("click", myFunction);

        function myFunction() {
            document.getElementById("inner").style.display = "none";
        }

        function closeinner() {
            document.getElementById("inner").style.display = "none";

        }

        $('body').click(function(e) {
            if (!$(e.target).closest('.outer').length) {
                $(".inner").hide();
            }
        });
   
//------popup play-------------

   $("document").ready(function(){
	$(".ac-play-tutorial").dblclick(function(event){
		$(".inner").fadeIn("fast").css({opacity:1});
	})
})

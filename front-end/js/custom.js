(function($) {
"use strict";

/* ==============================================
LOADER -->
=============================================== */

    $(window).load(function() {
        $('#loader').delay(300).fadeOut('slow');
        $('#loader-container').delay(200).fadeOut('slow');
        $('body').delay(300).css({'overflow':'visible'});
    })

/* ==============================================
ANIMATION -->
=============================================== */

    new WOW({
	    boxClass:     'wow',      // default
	    animateClass: 'animated', // default
	    offset:       0,          // default
	    mobile:       true,       // default
	    live:         true        // default
    }).init();

/* ==============================================
MENU HOVER -->
=============================================== */

    jQuery('.hovermenu .dropdown').hover(function() {
        jQuery(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn();
    }, function() {
        jQuery(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut();
    });
    jQuery('.topbar .dropdown').hover(function() {
        jQuery(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn();
    }, function() {
        jQuery(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut();
    });

/* ==============================================
ACCORDION -->
=============================================== */

    function toggleChevron(e) {
        $(e.target)
            .prev('.panel-heading')
            .find("i.indicator")
            .toggleClass('fa-minus fa-plus');
    }
    $('#accordion').bind('hidden.bs.collapse', toggleChevron);
    $('#accordion').bind('shown.bs.collapse', toggleChevron);


/* ==============================================
FUN -->
=============================================== */

    function count($this){
        var current = parseInt($this.html(), 10);
        current = current + 10;
        $this.html(++current);
        if(current > $this.data('count')){
        $this.html($this.data('count'));
        } 
        else {    
        setTimeout(function(){count($this)}, 10);
        }
        }        
        $(".stat-count").each(function() {
        $(this).data('count', parseInt($(this).html(), 10));
        $(this).html('0');
        count($(this));
    });

/* ==============================================
AFFIX -->
=============================================== */

    $('.header').affix({
      offset: {
        top: 65,
        bottom: function () {
          return (this.bottom = $('.footer').outerHeight(true))
        }
      }
    })

})(jQuery);

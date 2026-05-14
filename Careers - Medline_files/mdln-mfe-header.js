
/**
*  Triggers the mobile nav when the mfe header hamburger icon is clicked
* 
*/
(function($, window, document) {
    $(document).on('click', '.hamburger-menu-section', function(){
       
        $('.fusion-secondary-main-menu').find('.mdln-mobile-nav-holder').slideToggle(300, 'easeOutQuad');
    });
})(jQuery, window, document);


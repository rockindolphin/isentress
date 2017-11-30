

(function(){

	var mySwiper = new Swiper('.swiper-container', {
		speed: 400,
		spaceBetween: 100,
		direction: 'horizontal',
		loop: false,
		slidesPerView: 'auto',
		prevButton: $('.swiper__prev'),
		nextButton: $('.swiper__next'),
		onInit: function(swiper){
			swiper.slideTo(swiper.slides.length);
		},
		onSlideChangeStart: function(swiper){
			var slide = swiper.slides[swiper.activeIndex];
			$(slide).find('[data-nav]').removeClass('nav__item--active');
			
		},
		onSlideChangeEnd: function(swiper){
			var slide = swiper.slides[swiper.activeIndex];
			$(slide).find('[data-nav='+(swiper.activeIndex+1)+']').addClass('nav__item--active');
		}
	});



	var page__popups = $('.page__popups');
	var page__header = $('.page__header');
	var page__footer = $('.page__footer');

	function showPopup(popup, type){
		$(popup).removeClass('popup--hidden');
		switch(type){
			case 'menu':
				$(page__header).removeClass('page__header--shadow-hidden');
				$(page__footer).removeClass('page__footer--shadow-hidden');
				$(popup).parent().removeClass('popup__wrapper--shadow-hidden');
				$(popup).closest('.list__item').css({
					zIndex: 4
				});
				$(mySwiper.container).addClass('swiper-no-swiping');
			break;
			case 'page':
				$(page__popups).removeClass('page__popups--shadow-hidden');
			break;
		}
	}

	function hidePopup(popup, type){
		$(popup).addClass('popup--hidden');
		switch(type){
			case 'menu':
				$(page__header).addClass('page__header--shadow-hidden');
				$(page__footer).addClass('page__footer--shadow-hidden');
				$(popup).parent().addClass('popup__wrapper--shadow-hidden');
				$(popup).closest('.list__item').css({
					zIndex: 2
				});	
				$(mySwiper.container).removeClass('swiper-no-swiping');			
			break;
			case 'page':
				$(page__popups).addClass('page__popups--shadow-hidden');
			break;
		}
	}

	$('[data-popup]').click(function(){
		var popup = $(this).attr('data-popup');
		popup = $('#'+popup);
		$(popup).hasClass('popup--hidden') ? showPopup(popup,'page') : hidePopup(popup,'page');
	});

	$('[data-popup-menu]').click(function(){
		var popup = $(this).attr('data-popup-menu');
		popup = $('#'+popup);
		$(popup).hasClass('popup--hidden') ? showPopup(popup,'menu') : hidePopup(popup,'menu');
	});


})();
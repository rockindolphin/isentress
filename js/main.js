

(function(){

	var hlpSlider = new Swiper('#hlp_slider', {
		speed: 400,
		spaceBetween: 100,
		direction: 'horizontal',
		loop: false,
		slidesPerView: 'auto',
	});

	var mainSlider = new Swiper('#main_slider', {
		speed: 400,
		spaceBetween: 100,
		direction: 'horizontal',
		loop: false,
		slidesPerView: 'auto',
		//prevButton: $('.swiper__prev'),
		//nextButton: $('.swiper__next'),
		keyboard: true,
		preloadImages: false,
		lazy: true,
		on: {
			init: function(){

			},
			slideChange: function(){
				if( (this.activeIndex > 0) && (this.previousIndex === 0) ){
					hlpSlider.slideTo(1);
					$('.page__footer').css('zIndex',1);
				}
				if( (this.activeIndex === 0) && (this.previousIndex > 0) ){
					hlpSlider.slideTo(0);
					$('.page__footer').css('zIndex',0);
				}
			}
		}
	});

	window.hlp = mainSlider;


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

	$('[data-goto]').click(function(){
		var target = $(this).attr('data-goto');
		var translateDuration = 0;
		switch(target){
			case 'next':
				target = mainSlider.activeIndex+2;
				translateDuration = 400;
			break;
			case 'prev':
				target = mainSlider.activeIndex;
				translateDuration = 400;
			break;
			case 'bear':
				target = 10;
			break;
			case 'lungs':
				target = 5;
			break;
			case 'brain':
				target = 8;
			break;
			case 'liver':
				target = 6;
			break;
			case 'heart':
				target = 7;
			break;
			case 'man':
				target = 9;
			break;
			default:
			break;
		}
		mainSlider.slideTo( parseInt(target)-1, translateDuration );
	});

})();
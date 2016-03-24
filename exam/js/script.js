(function($) {

	$.support.cors = true;

	$(function() {

		$('.jcarousel').jcarousel({
			animation: 'slow',
			wrap: 'circular'
		})

		.jcarouselAutoscroll({
			interval: 5000,
			target: '+=1',
			autostart: true
		});

		$('.jcarousel-control-prev')
			.on('jcarouselcontrol:active', function() {
				$(this).removeClass('inactive');
			})
			.on('jcarouselcontrol:inactive', function() {
				$(this).addClass('inactive');
			})
			.jcarouselControl({
				target: '-=1'
			});

		$('.jcarousel-control-next')
			.on('jcarouselcontrol:active', function() {
				$(this).removeClass('inactive');
			})
			.on('jcarouselcontrol:inactive', function() {
				$(this).addClass('inactive');
			})
			.jcarouselControl({
				target: '+=1'
			});



		var queryPic = '';

		function renderList(queryPic) {

			$.ajax({
				type: "GET",
				dataType: "json",
				cache: false,
				url: 'http://api.pixplorer.co.uk/image?word=' + queryPic + '&amount=7&size=tb',
				success: function(data) {

					var piclist = tmpl($('#piclist-template').html(), data);

					$('.grid').remove();

					$('.ideas .wrapper').append(piclist);
					$('.grid').isotope({
						itemSelector: '.grid-item',
						layoutMode: 'masonry',
						masonry: {
							gutter: 20
						}
					});

				}
			});
		}

		$('#f').submit(function(e) {

			e.preventDefault();
			var query = encodeURIComponent($('.search__input').val());
			renderList(query);

		});

		renderList();


		crossDomainAjax('http://www.somecrossdomaincall.com/?blah=123', function(data) {
			console.log(data);
		});

		function crossDomainAjax(url, successCallback) {

			// IE8 & 9 only Cross domain JSON GET request
			if ('XDomainRequest' in window && window.XDomainRequest !== null) {

				var xdr = new XDomainRequest(); // Use Microsoft XDR
				xdr.open('get', url);
				xdr.onload = function() {
					var dom = new ActiveXObject('Microsoft.XMLDOM'),
						JSON = $.parseJSON(xdr.responseText);

					dom.async = false;

					if (JSON == null || typeof(JSON) == 'undefined') {
						JSON = $.parseJSON(data.firstChild.textContent);
					}

					successCallback(JSON); // internal function
				};

				xdr.onerror = function() {
					_result = false;
				};

				xdr.send();
			}

			// IE7 and lower can't do cross domain
			else if (navigator.userAgent.indexOf('MSIE') != -1 &&
				parseInt(navigator.userAgent.match(/MSIE ([\d.]+)/)[1], 10) < 8) {
				return false;
			}

			// Do normal jQuery AJAX for everything else          
			else {
				$.ajax({
					url: url,
					cache: false,
					dataType: 'json',
					type: 'GET',
					async: false, // must be set to false
					success: function(data, success) {
						successCallback(data);
					}
				});
			}
		}



	});

})(jQuery);

const app = {}; 
const $result = $('.result');

app.displayWine = (listOfWine) => {
	listOfWine.forEach(({image, name, price, volume, style, suggestion}) => {
		const wine = `<div class="flex-basis">
						<div class="flex img-padding">
						<img src="${image}">
						</div>
						<h2>${name}</h2>
						<h3>$${price}</h3>
						<p>${volume}</p>
						<h3>Style</h3>
						<p>${style}</p>
						<p class="suggestion">${suggestion||''}</p>
					</div>`;

		$result.append(wine);
	});
};

app.getWineList = (wine_type) => {
	$.ajax({
		url: 'http://lcboapi.com/products',
		method:'GET',
		dataType: 'jsonp',
		data: {
			q: wine_type,
			where: 'has_limited_time_offer',
			where_not: 'is_dead,is_discontinued',
			order: 'price_in_cents.asc',
			per_page: 100
		}
	}).then((res) => {
		const wineOnSale = res.result.map((product) => {
			return {
				name: product.name,
				style: product.style,
				image: product.image_thumb_url,
				suggestion: product.serving_suggestion,
				price: (product.price_in_cents/100).toFixed(2),
				volume: product.package
			};
		});

		app.displayWine(wineOnSale);

		$(document).scrollTop($result.offset().top);
	});
};


$('select').on('change', function(e) {
	let wine_type = $("select#wine_type option:checked").val();
	
	e.preventDefault();

	$result.html('');

	if (wine_type === 'Select wine style') {
		return false;
	}

	app.getWineList(wine_type);

	return false;
});


document.querySelector('#createSticker').addEventListener('submit', async e => {
	e.preventDefault();

	const inputs = Array.from(e.target.elements).filter(
		element => element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA'
	);

	const body = {};

	inputs
		.filter(element => !element.name.includes('Address1') && element.tagName !== 'TEXTAREA')
		.forEach(input => {
			body[input.name] = input.value;
		});

	body['AddressSender1'] = inputs
		.filter(element => element.name.includes('SenderAddress1'))
		.map(element => element.value)
		.join(' ');

	body['AddressReceiver1'] = inputs
		.filter(element => element.name.includes('ReceiverAddress1'))
		.map(element => element.value)
		.join(' ');

	if (inputs.find(element => element.tagName === 'TEXTAREA').value) {
		body['Text'] = inputs
			.find(element => element.tagName === 'TEXTAREA')
			.value.split('\n')
			.join('(cr)');
	}

	body['LanguageSender'] = inputs.find(element => element.name === 'CountrySender').value;
	body['LangReceiver'] = inputs.find(element => element.name === 'CountryReceiver').value;

	try {
		const { data: url } = await axios.post('https://mighty-citadel-34235.herokuapp.com/mr/createSticker', body);
		if (localStorage.getItem('Authorization')) {
			const { data } = await axios.put(
				'https://mighty-citadel-34235.herokuapp.com/user/me',
				{ createdSticker: url },
				{ headers: { Authorization: 'Bearer ' + localStorage.getItem('Authorization') } }
			);
			localStorage.setItem('Authorization', data);
		}
		window.open(url, '_blank');
	} catch (err) {
		alert(err.response.data);
	}
});

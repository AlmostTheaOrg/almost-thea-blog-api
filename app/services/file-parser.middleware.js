const Busboy = require('busboy'),
	Readable = require('stream').Readable;

module.exports = (request, response, next) => {
	const busboy = new Busboy({
		headers: request.headers
	});

	const formData = {};
	busboy.on('file', (fieldName, file, fileName, encoding) => {
		const fileStream = new Readable();
		file.on('data', (data) => {
			fileStream.push(data, encoding);
		});

		file.on('end', () => {
			fileStream.push(null);
			if (!formData.streams) {
				formData.streams = [];
			}

			formData.streams.push(fileStream);
		});
	});

	busboy.on('field', (fieldName, value) => {
		if (fieldName === 'streams') {
			response.json(400, {
				success: false,
				message: 'Invalid request!',
				errors: [`Invalid body's field name: ${fieldName}!`]
			});
			return;
		}

		formData[fieldName] = value;
	});

	busboy.on('finish', () => {
		request.formData = formData;
		next();
	});

	request.pipe(busboy);
};

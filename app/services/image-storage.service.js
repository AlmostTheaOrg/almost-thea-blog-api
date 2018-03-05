const cloudinary = require('cloudinary').v2;
cloudinary.config();

module.exports = {
	upload(fileStream) {
		return new Promise((resolve, reject) => {
			const onUploadFinished = (error, result) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(result);
			};

			const uploadStream = cloudinary.uploader.upload_stream(onUploadFinished);
			fileStream.pipe(uploadStream);
		});
	},

	remove(id) {
		return new Promise((resolve, reject) => {
			cloudinary.uploader.destroy(id, (error, result) => {
				if (error) {
					reject(error);
					return;
				}

				resolve(result);
			});
		});
	}
};

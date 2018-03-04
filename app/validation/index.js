module.exports = {
	validateField: (value, valueName, minLength, maxLength) => {
		let result = {
			errors: []
		};
		if (!value) {
			result.errors.push(`${valueName} is empty!`);
		} else if (typeof value === String) {
			result.errors.push(`${valueName} value is not valid!`);
		} else if (value.length < minLength) {
			result.errors.push(`${valueName} length too small!`);
		} else if (value.length > maxLength) {
			result.errors.push(`${valueName} length too big!`);
		}

		return result;
	}
};

import moment from 'moment';

export const bufferToBase64 = buffer => {
	return Buffer.isBuffer(buffer) ? Buffer.from(buffer).toString('base64') : null;
}

export const getLastIndex = arr => {
	if(!arr.length) return [];
	return arr[arr.length - 1];
}

export const convertTimstampToHumanTime = timestamp => {
	if(!timestamp) return '';
	return moment(timestamp).locale('vi').startOf('seconds').fromNow();
}

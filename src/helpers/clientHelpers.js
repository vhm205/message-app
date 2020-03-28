export const bufferToBase64 = buffer => {
	return Buffer.isBuffer(buffer) ? Buffer.from(buffer).toString('base64') : null;
}

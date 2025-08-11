function openBase64NewTab(base64Pdf: string, mimeType: string): void {
    if (base64Pdf) {
        var blob = base64toBlob(base64Pdf, mimeType);
        const blobUrl = URL.createObjectURL(blob);
        const tab = window.open(blobUrl, "_blank");
        if (mimeType === 'image/jpeg' && tab) {
            tab.print();
        }
    }
}

function base64toBlob(base64Data: string, mimeType: string) {
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        const begin = sliceIndex * sliceSize;
        const end = Math.min(begin + sliceSize, bytesLength);

        const bytes = new Array(end - begin);
        for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: mimeType }); // application/pdf, image/jpeg etc...
}

export default openBase64NewTab;

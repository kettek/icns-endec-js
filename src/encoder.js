/**
 * Encoder provides a method to encode PNG images into an ICNS file.
 */
class Encoder {
  /**
   * 
   * @param {[Buffer]} imageBuffers An array of buffers containing PNG or JPEG 2000 data.
   */
  constructor(imageBuffers) {
    this._buffer = Buffer.alloc(0)
    this._bufferOffset = 0
    this._imageBuffers = imageBuffers.map(b => {
      if (b instanceof ArrayBuffer) {
        return Buffer.from(new Uint8Array(b))
      } else if (b instanceof Buffer) {
        return b
      } else {
        throw 'Encoder requires ArrayBuffers or Buffers'
      }
    })
  }
  get buffer() {
    return this._buffer
  }
  /**
   * encode writes the stored image buffers into the internal buffer storage.
   * 
   * @returns Buffer The resulting Buffer ready to be written to a file.
   */
  encode() {
    this._writeHeader()
    for (const imageBuffer of this._imageBuffers) {
      this._writeImage(imageBuffer)
    }
    return this._buffer
  }
  _writeHeader() {
    let totalSize = 0
    const buffer = Buffer.alloc(8)
    buffer.write('icns', 0, 4, 'ascii')
    totalSize += 8
    // Get our total size
    for (const imageBuffer of this._imageBuffers) {
      totalSize += imageBuffer.length
      totalSize += 8
    }
    buffer.writeUInt32BE(totalSize, 4)
    this._bufferOffset += 8
    this._buffer = Buffer.concat([this._buffer, buffer])
  }
  _writeImage(imageBuffer) {
    let type
    const jpegMagic = Buffer.from([0x00,0x00,0x00,0x0C,0x6A,0x50,0x20,0x20,0x0D,0x0A,0x87,0x0A,0x00,0x00,0x00,0x14,0x66,0x74,0x79,0x70,0x6A,0x70,0x32])
    const pngMagic = Buffer.from([0x89,0x50,0x4E,0x47])
    if (pngMagic.compare(Buffer.from(imageBuffer.buffer, this._bufferOffset, pngMagic.length)) === 0) {
      type = 'png'
    } else if (jpegMagic.compare(Buffer.from(imageBuffer.buffer, this._bufferOffset, jpegMagic.byteLength))) {
      type = 'jpeg'
    } else {
      throw 'only PNG and/or jpeg2000 files are supported'
    }
    // Allocate our buffer
    const buffer = Buffer.alloc(8 + imageBuffer.length)
    // Write our OSType
    buffer.write('ic09', 0)
    // Write our full image entry length
    buffer.writeUInt32BE(buffer.length, 4)
    // Write our image data
    imageBuffer.copy(buffer, 8)
    this._bufferOffset += buffer.length
    this._buffer = Buffer.concat([this._buffer, buffer])
  }
}

export default Encoder

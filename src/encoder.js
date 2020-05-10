/**
 * Encoder provides a method to encode PNG images into an ICNS file.
 */
class Encoder {
  /**
   * 
   * @param {[Buffer]} imageBuffers An array of image buffers containing images.
   */
  constructor(imageBuffers) {
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
    this._buffer = Buffer.alloc(0)
    this._bufferOffset = 0
    return this._buffer
  }
}

export default Encoder

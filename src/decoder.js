import IconEntry from './iconentry'

/**
 * Decoder provides a method to decode ICNS files into an object structure
 * containing image data.
 */
class Decoder {
  /**
   * @param {Buffer} buffer A Buffer containing the contents of an ICNS file
   */
  constructor(buffer) {
    this._bufferOffset = 0
    this._buffer = buffer
    this._iconEntries = []
  }
  /**
   * decode reads in the file passed in the constructor and decodes it to the
   * internal _iconEntries object array.
   * 
   * @returns [IconEntries]
   */
  decode() {
  }
}

export default Decoder

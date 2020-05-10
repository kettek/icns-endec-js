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
    // Read 0,4 for "icns"
    // Read 4,4 for file length in bytes (msb first)
    // Start read loop
    // Read 0,4 Icon type
    // For now, just icp4,icp5,icp6,ic07,ic08,ic09,ic10,ic11,ic12,ic13,ic14 as these are JPEG 2000 or PNG.
    // Probably also just for 'name', 'TOC ', 'icnV', 'info'
    // Read 4,4 Length of icon in bytes, including type and length, msb
    // Read 8,(length-8)
    // End read loop
  }
}

export default Decoder

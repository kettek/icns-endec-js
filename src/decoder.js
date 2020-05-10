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
    let offset = 0, magicNumbers, fileLength
    // Read 0,4 for "icns"
    magicNumbers = this._buffer.toString('utf8', offset, 4)
    if (magicNumbers !== 'icns') {
      throw 'passed buffer does match magic number'
    }
    offset += 4
    // Read 4,4 for file length in bytes (msb first)
    fileLength = this._buffer.readUInt32BE(offset), offset += 4
    if (fileLength !== this._buffer.length) {
      throw `professed file length of ${fileLength} does not match buffer length of ${this._buffer.length}`
    }
    // Start read loop
    while(offset < fileLength) {
      let iconType, iconLength, iconBuffer
      // Read 0,4 Icon type
      iconType = this._buffer.toString('utf8', offset, 4), offset += 4
      // Read 4,4 Length of icon in bytes, including type and length, msb
      iconLength = this._buffer.readUInt32BE(offset), offset += 4
      // Read content 8,(length-8)
      iconBuffer = Buffer.from(this._buffer.buffer, offset, iconLength)
      // For now, just icp4,icp5,icp6,ic07,ic08,ic09,ic10,ic11,ic12,ic13,ic14 as these are JPEG 2000 or PNG.
      switch(iconType) {
        case 'icp4': case 'icp5': case 'icp6':
        case 'ic07': case 'ic08': case 'ic09': 
        case 'ic10': case 'ic11': case 'ic12': 
        case 'ic13': case 'ic14':
          break;
        case 'name':
          break;
        case 'TOC ':
          break;
        case 'icnV':
          break;
        case 'info':
          break;
      }
    }
    // End read loop
  }
}

export default Decoder

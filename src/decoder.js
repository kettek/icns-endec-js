import { supportedOSTypes, extensions, pngMagic, jpegMagic } from './common'
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
    magicNumbers = this._buffer.toString('ascii', offset, offset+4)
    if (magicNumbers !== 'icns') {
      throw 'passed buffer does match magic number'
    }
    offset += 4
    // Read 4,4 for file length in bytes (msb first)
    fileLength = this._buffer.readUInt32BE(offset), offset += 4
    if (fileLength !== this._buffer.length) {
      throw `professed file length of ${fileLength} does not match buffer length of ${this._buffer.length}`
    }
    while(offset < fileLength) {
      let iconType, iconLength, iconBuffer
      let iconEntry = new IconEntry()
      // Read 0,4 Icon type
      iconType = this._buffer.toString('ascii', offset, offset+4), offset += 4
      iconEntry._OSType = iconType
      // Read 4,4 Length of icon in bytes, including type and length, msb
      iconLength = this._buffer.readUInt32BE(offset)-8, offset += 4
      // Read content 8,(length-8)
      iconBuffer = Buffer.from(this._buffer.buffer, offset, iconLength)
      if (supportedOSTypes.includes(iconType)) {
        if (pngMagic.compare(Buffer.from(this._buffer.buffer, offset, pngMagic.length)) === 0) {
          iconEntry._type = 'PNG'
        } else if (jpegMagic.compare(Buffer.from(this._buffer.buffer, offset, jpegMagic.length)) === 0) {
          iconEntry._type = 'JPEG2000'
        } else {
          throw `${iconType} must be PNG or JPEG 2000`
        }
        iconEntry._ext = extensions[iconEntry._type]
        iconEntry._buffer = iconBuffer
        this._iconEntries.push(iconEntry)
      } else {
        switch(iconType) {
          case 'name':
          case 'TOC ':
          case 'icnV':
          case 'info':
          default:
            console.log('skipping', iconType)
            break;
        }
      }
      offset += iconLength
    }
    return this._iconEntries
  }
}

export default Decoder

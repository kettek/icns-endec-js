import { supportedOSTypes, extensions, pngMagic, jpegMagic } from './common'
import IconEntry from './iconentry'
/**
 * Encoder provides a method to encode PNG images into an ICNS file.
 */
class Encoder {
  /**
   * 
   * @param {[IconEntry], [Object]} iconEntries An array of buffers, icon entries, or objects that provide {type, buffer} containing PNG or JPEG 2000 data.
   */
  constructor(iconEntries) {
    this._buffer = Buffer.alloc(0)
    this._iconEntries = iconEntries.map(b => {
      // TODO: We could accept ArrayBuffer and Buffer and do some intelligent guessing to find OSType based upon image type and size.
      /*if (b instanceof ArrayBuffer) {
        return new IconEntry('', Buffer.from(new Uint8Array(b)))
      } else if (b instanceof Buffer) {
        return new IconEntry('', b)
      }*/
      if (b instanceof IconEntry) {
        return b
      } else if (typeof b === 'object') {
        if (!b.OSType) {
          throw 'object definitions require OSType'
        } else if (!b.buffer) {
          throw 'object definitions require buffer'
        }
        return new IconEntry(b.OSType, b.buffer)
      } else {
        throw 'encoder requires IconEntries or conformant objects'
      }
    })
    for (let iconEntry of iconEntries) {
      if (iconEntry.buffer instanceof ArrayBuffer) {
        iconEntry.buffer = Buffer.from(new Uint8Array(iconEntry.buffer))
      } else if (iconEntry.buffer instanceof Buffer) {
      } else {
        throw 'icon buffer must be Buffer or ArrayBuffer'
      }
    }
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
    this._writeHeader()
    for (const iconEntry of this._iconEntries) {
      this._writeIcon(iconEntry)
    }
    return this._buffer
  }
  _writeHeader() {
    let totalSize = 0
    const buffer = Buffer.alloc(8)
    buffer.write('icns', 0, 4, 'ascii')
    totalSize += 8
    // Get our total size
    for (const iconEntry of this._iconEntries) {
      totalSize += iconEntry.buffer.length
      totalSize += 8
    }
    buffer.writeUInt32BE(totalSize, 4)
    this._buffer = Buffer.concat([this._buffer, buffer])
  }
  _writeIcon(iconEntry) {
    // Allocate our buffer
    const buffer = Buffer.alloc(8 + iconEntry.buffer.length)
    // Write our OSType
    if (!iconEntry.OSType) {
      throw 'image must have an OSType'
    }
    if (!supportedOSTypes.includes(iconEntry.OSType)) {
      throw `OSType '${iconEntry.OSType}' is unsupported, must be one of ${supportedOSTypes.join(', ')}`
    } else {
      if (pngMagic.compare(Buffer.from(iconEntry.buffer.buffer, 0, pngMagic.length)) === 0) {
        iconEntry._type = 'PNG'
      } else if (jpegMagic.compare(Buffer.from(iconEntry.buffer.buffer, 0, jpegMagic.length)) === 0) {
        iconEntry._type = 'JPEG2000'
      } else {
        throw 'only PNG and JPEG 2000 files are supported'
      }
      iconEntry._ext = extensions[iconEntry._type]
    }
    buffer.write(iconEntry.OSType, 0)
    // Write our full image entry length
    buffer.writeUInt32BE(buffer.length, 4)
    // Write our image data
    iconEntry.buffer.copy(buffer, 8)
    this._buffer = Buffer.concat([this._buffer, buffer])
  }
}

export default Encoder

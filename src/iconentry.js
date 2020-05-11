class IconEntry {
  constructor(OSType='', buffer='') {
    this._buffer = buffer
    this._type = ''
    this._ext = ''
    this._OSType = OSType
  }
  get buffer() {
    return this._buffer
  }
  get type() {
    return this._type
  }
  get ext() {
    return this._ext
  }
  get OSType() {
    return this._OSType
  }
}

export default IconEntry
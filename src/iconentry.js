class IconEntry {
  constructor() {
    this._buffer = null
    this._type = ''
    this._OSType = ''
  }
  get buffer() {
    return this._buffer
  }
  get type() {
    return this._type
  }
  get OSType() {
    return this._OSType
  }
}

export default IconEntry

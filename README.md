# ICNS encoder & decoder
This JavaScript library provides an encoder and decoder for ICNS files. At the moment the library is limited to PNG and JPEG 2000-based ICNS entries but it wouldn't be too difficult to expand it further in the future. This limits support to Mac OS 10.5 and up.

## Encoding
### icnsEndec.encode([IconEntry||Object])
The encode function takes an array of [IconEntries](#iconentry) or objects that provide an *OSType* and *buffer* field. It returns a Buffer containing the binary data of the ICNS file.

The OSType must match one of the supported ones on the [Supported OSType Table](#supported-ostype-table). The buffer field must be a [Buffer](https://nodejs.org/api/buffer.html) or an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

#### Example
```
const fsPromises = require('fs').promises
const icnsEndec  = require('icns-endec')

(async () => {
  // Encode ic07 and ic08 from PNG images.
  let icnsBuffer = icnsEndec.encode([
    {
      OSType: 'ic07',
      buffer: await fsPromises.readFile('myIcon-128x128.png'),
    },
    new icnsEndec.IconEntry('ic08', await fsPromises.readFile('myIcon-256x256.png')),
  ])
  
  // Write out our ICNS file.
  await fsPromises.writeFile('myIcon.icns', icnsBuffer)
})()
```

## Decoding

### icnsEndec.decode(Buffer||ArrayBuffer)
The decode function takes a Buffer or an ArrayBuffer that holds the binary data of an ICNS file. It returns an array of IconEntries.

#### Example
```
const fsPromises = require('fs').promises
const icnsEndec  = require('icns-endec')

(async () => {
  // Retrieve the icons as an array of IconEntries.
  let icns = icnsEndec.decode(await fsPromises.readFile('myIcon.icns'))
  
  // Write out all icons.
  for (let icn of icns) {
    await fsPromises.writeFile(`myIcon-${icn.OSType}.${icn.ext}`)
  }
})()
```

## IconEntry
The IconEntry class stores a Buffer, OSType, extension, and image type, where applicable.

### constructor(String, Buffer)
#### Example
```
let iconEntry = new IconEntry('ic14', await fsPromises.readFile('myPNG-1024x1024.png'))
```

### buffer
Returns the IconEntry's buffer.

### type
Returns the IconEntry's image data type. May be 'PNG' or 'JPEG2000'.

### ext
Returns the IconEntry's file extension. May be 'png' or 'jp2'.

### OSType
Returns the OSType of the IconEntry.

## Supported OSType Table

| OSType | Supported|
|-|-|
| ICON |   |
| ICN# |   |
| icm# |   |
| icm4 |   |
| icm8 |   |
| ics# |   |
| ics4 |   |
| ics8 |   |
| is32 |   |
| s8mk |   |
| icl4 |   |
| icl8 |   |
| il32 |   |
| l8mk |   |
| ich# |   |
| ich4 |   |
| ich8 |   |
| ih32 |   |
| h8mk |   |
| it32 |   |
| t8mk |   |
| icp4 |   |
| icp5 |   |
| icp6 |   |
| ic07 | x |
| ic08 | x |
| ic09 | x |
| ic10 | x |
| ic11 | x |
| ic12 | x |
| ic13 | x |
| ic14 | x |
| ic04 |   |
| ic05 |   |
| icsB |   |
| icsb |   |
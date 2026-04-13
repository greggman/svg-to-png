# svg-to-png

Make a texture from an .svg file

## Usage:

```
npx @greggman/svg-to-png <svg> <png> [width] [height]
```

If you don't pass in a width it will use the width defined in the svg.
If you don't pass in a height it will use the aspect of the height svg's
internal height to chose a height. So for example, assume the svg's
size is 640x480, then:

* `npx @greggman/svg-to-png my.svg my.png`

  makes a 640x480 png

* `npx @greggman/svg-to-png my.svg my.png 1280`

  makes a 1280x960 png

* `npx @greggman/svg-to-png my.svg my.png 256 256`

  make makes a 256x256 png with the svg
  scaled to 256 across and centered vertically.

## License: MIT


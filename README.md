## How to use this extension?
 // Set up the palette ONCE at startup
image.setDrawingPalette([
    0x000000,  // 0: Black
    0xFF0000,  // 1: Red
    0x00FF00,  // 2: Green
    0x0000FF,  // 3: Blue
    0xFFFF00,  // 4: Yellow
    0xFF00FF,  // 5: Magenta
    0x00FFFF,  // 6: Cyan
    0xFFFFFF,  // 7: White
    0x808080,  // 8: Gray
    0xC0C0C0,  // 9: Light Gray
    0x800000,  // 10: Maroon
    0x008000,  // 11: Dark Green
    0x000080,  // 12: Navy
    0x808000,  // 13: Olive
    0x800080,  // 14: Purple
    0x008080   // 15: Teal
]);

// Create colorful images with unlimited RGB
let sprite = image.createColorfulImage(16, 16);

// Draw with any RGB color
sprite.setPixel(0, 0, 0xFF0000);    // Red
sprite.setPixel(1, 0, 0x00FF00);    // Green
sprite.setPixel(2, 0, 0x0000FF);    // Blue

sprite.fillRect(5, 5, 6, 6, 0xFFFF00);  // Yellow rect
sprite.drawLine(0, 0, 15, 15, 0xFF00FF); // Magenta line

// Draw to screen - automatically converts to palette indices
image.drawColorful(screen, sprite, 10, 10);

// Or convert explicitly first
let standardImg = image.toStandardImage(sprite);
screen.drawImage(standardImg, 20, 20);
sprites.create(standardImg)


> Open this page at [https://developertryingtocodelikeotherofthem.github.io/palette/](https://developertryingtocodelikeotherofthem.github.io/palette/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/developertryingtocodelikeotherofthem/palette** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/developertryingtocodelikeotherofthem/palette** and click import

#### Metadata (used for search, rendering)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>

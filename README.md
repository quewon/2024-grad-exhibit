# Play. Net - 데이터가든 Data Garden

미디어 전시 <데이터 가든>의 전시를 위한 4가지 프로그램입니다.

This is a collection of programs created for the media art installation *Data Garden*.

**Data Garden** is a piece which we produced and exhibited during my last student exhibition in 2024.

The theme of the exhibition was "carbon neutrality." As one of many teams within this exhibit, we decided to create a work about the environmental cost of data transmission, archival, and the human desire to keep things.

![Polaroids lay strewn across a transparent acrylic pane, underlit in green fluorescent light. Behind the acrylic stand, a digital 3d garden is projected onto the back wall.](https://quewon.github.io/projects/media/datagarden-main.jpg)

Data Garden was comprised of a mobile web app, a printer, a custom physical interface, and a projected visualization of the Garden. One could approach the Garden, scan the QR code to use the app, and upload a picture of their choosing. Then the printer would produce a copy of the picture, and they could place it down on the interface and watch as the video projection updated to 'plant' this picture in the form of a textured 3d flower.

![A person holds up a phone to scan the QR code.](https://quewon.github.io/projects/media/datagarden-qr.jpg)
![A phone showing the main screen of the app. Behind the phone is the video projection of a glowing garden.](https://quewon.github.io/projects/media/datagarden-app.jpg)
![A printer automatically prints a photo.](https://quewon.github.io/projects/media/datagarden-printer.jpg)
![Someone places their photo on the interface. They're moving it around and watching the position of their plant change on the video.](https://quewon.github.io/projects/media/datagarden-plant.jpg)

We authored and designed the overall piece together. I was responsible for the technical implementation: hosting a Node.js server on a virtual machine for the shared photo database, linking it to the Unreal project, developing the mobile web app, and automating the printer. My teammates took on UI design, 3d modeling, and lighting.

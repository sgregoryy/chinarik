import { fromArrayBuffer } from "geotiff";

const HomePage = () =>{
    return(
        <div cla>
            <input type="file" id="file-input" onChange={async (e) => await imageTiff(e.target.files[0])}></input>
            <canvas id='canvas'></canvas>
        </div>
    )
}

export default HomePage;



async function imageTiff(file){
        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const tiff = await fromArrayBuffer(arrayBuffer);
                const image = await tiff.getImage();
                const width = image.getWidth();
                const height = image.getHeight();
                const rasters = await image.readRasters();

                console.log(rasters);

                // Создаем Canvas
                const canvas = document.getElementById('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                const imageData = ctx.createImageData(width, height);

                const newRasters = [];

                for (let i = 0; i < rasters.length; i++) {
                    const raster = rasters[i];

                    const rasterMin = Math.min(...raster);
                    const rasterMax = Math.max(...raster);
                    console.log(rasterMin, rasterMax);

                    const newBCoeff = (32767) / (rasterMax - rasterMin);
                    const newACoeff = -rasterMin * newBCoeff;

                    newRasters.push([]);

                    for (const subpixel of raster) {
                        newRasters[i].push(newACoeff + newBCoeff * subpixel);
                    }
                }

                console.log(newRasters);

                const [red, green, blue, gray] = newRasters;  // Выбор каналов для отображения (например, R=0, G=1, B=2)

                // Заполняем данные для Canvas
                for (let i = 0; i < width * height; i++) {
                    imageData.data[i * 4] = red[i] / 256;
                    imageData.data[i * 4 + 1] = green[i] / 256;
                    imageData.data[i * 4 + 2] = blue[i] / 256;
                    imageData.data[i * 4 + 3] = 255;
                }

                // Отображаем изображение на Canvas
                ctx.putImageData(imageData, 0, 0);
            } catch (error) {
                console.error('Error processing the GeoTIFF file:', error);
            }
        }
}
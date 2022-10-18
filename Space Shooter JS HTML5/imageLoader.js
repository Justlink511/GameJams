class ImageLoader {
    constructor() {
        this.lstPaths = [];
        this.callBack = null;
        this.loadedImageCount = 0;
        this.lstImages = [];
    }

    add(pPathImg) {
        this.lstPaths.push(pPathImg);

    }

    getTotalImages() {
        return this.lstPaths.length;
    }

    getlstImages() {
        return this.lstImages;
    }

    getLoadedRatio() {
        return this.loadedImageCount / this.getTotalImages();
    }

    getTotalImagesLoaded() {
        return this.loadedImageCount;
    }

    start(pCallback) {
        this.callBack = pCallback;
        this.lstPaths.forEach(path => {
            let img = new Image();
            img.onload = this.imageLoaded.bind(this);
            img.src = path;
            this.lstImages[path] = img;
        })
    }
    imageLoaded(e) {
        this.loadedImageCount += 1;
        console.log("image chargée");
        if (this.loadedImageCount == this.lstPaths.length) {
            console.log("toutes les images ont été chargée")
            this.callBack();

        }

    }

    getImage(pPath) {
        return this.lstImages[pPath];
    }
}


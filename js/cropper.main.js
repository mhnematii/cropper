class CropperCreator {
    constructor() {
        console.log("ok!");
    }

    Create = (title, cropperPlaceId) => {
        this.PlaceId = cropperPlaceId;
        const uploadInput = `<label class="select-picture" for="${cropperPlaceId}SelectImage">انتخاب عکس</label>`
            + `<input id="${cropperPlaceId}SelectImage" data-for="${cropperPlaceId}Modal" type="file" hidden/>`;
        const cardContent = `<div class='cropper-card-title'>${title}</div>`
            +`<div class="export-box"><img src='' id='${cropperPlaceId}PreviewCroppedImage' alt='preview'></div>`
            + `<div class='cropper-card-footer'>${uploadInput}</div>`;
        const modal = `<div id=\"${cropperPlaceId}Modal\" open="false" class=\"modal\">`
            + `<div id="${cropperPlaceId}ModalContent" class="modal-content row">`
            + `<div class="w-30 display-flex"><span class="close">&times;</span>`
            + `<div class="tools-box"><button class="tools-operations${cropperPlaceId}" operation="zoom" data-operations="0.2">بزرگ نمایی</button></div>`
            + `<div class="tools-box"><button class="tools-operations${cropperPlaceId}" operation="zoomOut" data-operations="-0.2">کوچک نمایی</button></div>`
            + `<div class="tools-box"><button class="tools-operations${cropperPlaceId}" operation="export">اعمال تغییرات</button></div>`
            + `</div>`
            + `<div class="w-70" id="${cropperPlaceId}cropBoxPlace"></div>`
            + "</div>"
            + "</div>";
        document.body.insertAdjacentHTML("beforeend", modal);
        const place = document.getElementById(cropperPlaceId);
        const card = document.createElement("div");
        const img = document.createElement("img");
        this.Image = img;
        const cropBoxPlace = document.getElementById(`${cropperPlaceId}cropBoxPlace`);
        cropBoxPlace.insertAdjacentElement('beforeend', img);
        card.classList.add("cropper-card");
        card.insertAdjacentHTML("beforeend", cardContent);
        place.appendChild(card);
        document.getElementById(`${cropperPlaceId}SelectImage`).addEventListener("change", this.OpenModal);
        let toolsOperations = document.querySelectorAll(`.tools-operations${cropperPlaceId}`);
        toolsOperations.forEach(item => {
            item.addEventListener("click", this.ToolsConfig);
        })
    }

    OpenModal = (e) => {
        if (e.target.value != "") {
            const modalId = e.target.getAttribute("data-for");
            const modal = document.getElementById(modalId);
            const open = modal.getAttribute("open");
            var cropper;
            let initOpacity = 0.1;
            let modalSetOpacity = (element, type) => {
                if(type == "show"){
                    element.style.display = "block";
                    const timer = setInterval(function () {
                        if (initOpacity >= 1) {
                            clearInterval(timer);
                        }
                        modal.style.opacity = initOpacity;
                        initOpacity += 0.1;
                    }, 15)
                } else{
                    const timer = setInterval(function () {
                        if (initOpacity <= 0) {
                            element.style.display = "none";
                            clearInterval(timer);
                        }
                        modal.style.opacity = initOpacity;
                        initOpacity -= 0.1;
                    }, 15)
                }

            };
            if (open == "false") {
                modalSetOpacity(modal, "show");
                modal.setAttribute("open", "true");
                const file = e.target.files[0];
                const blob = new Blob([file], {type: 'image/png'})
                const url = URL.createObjectURL(blob);
                this.Image.src = url;
                cropper = new Cropper(this.Image, {
                    aspectRatio: 16 / 9,
                    responsive: true,
                    minContainerHeight: 100
                });
                this.Cropper = cropper;
            } else {
                modalSetOpacity(modal, "hide");
                modal.setAttribute("open", "false");
                this.Image.src = "";
                cropper.destroy();
            }
            window.onclick = (event) => {
                if (event.target == modal) {
                    modal.setAttribute("open", "false");
                    modalSetOpacity(modal, "hide");
                    this.Image.src = "";
                    cropper.destroy();
                }
            }
        }
    }

    ToolsConfig = (e) => {
        const target = e.target;
        let cropper = this.Cropper;
        const operationData = Number(target.getAttribute("data-operations"));
        (async ()=>{
            if(cropper){
                switch (target.getAttribute("operation")) {
                    case "zoom":
                        cropper.zoom(operationData);
                        break;
                    case "zoomOut":
                        cropper.zoom(operationData);
                        break;
                    case "export":
                        let canvas = await cropper.getCroppedCanvas();
                        let previewImage = document.getElementById(`${this.PlaceId}PreviewCroppedImage`);
                        previewImage.src = canvas.toDataURL();
                        break;
                }
            }
        })()
    }
}
const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");


const apiKey = "k1Muy3VVuneWbSCgXkotchZevnS6C6CYrlvejGQkGFR98Xgi4zlUO1eK";
const perPage = 20;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    fetch(imgURL).then(res => res.blob()).then(file =>{
            const a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = new Date().getTime();
            a.click();
    }).catch(()=>alert("Failed to Download images "));
}

const showLightbox = (name,img) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden"; 
}


const hidelightBox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto"; 
}
 const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img => 
        `<li class="card" onclick = "showLightbox('${img.photographer}' , '${img.src.large2x}')">
        <img src="${img.src.large2x}.jpg" alt="">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span>${img.photographer}</span>
            </div>
            <button onclick = "downloadImg('${img.src.large2x}');event.stopPropagation();"><i class = "uil uil-import"></i></button>
        </div>
        </li>`
        ).join("");
 }
const getImages = (apiURL) => {
    loadMoreBtn.innerHTML = "Loading...";
    loadMoreBtn.classList.add("disabled");

fetch(apiURL,{
    headers: {Authorization: apiKey}
}).then(res => res.json()).then(data =>{
    generateHTML(data.photos);
    loadMoreBtn.innerHTML = "Load More";
    loadMoreBtn.classList.remove("disabled");
})
}
const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
    getImages(apiURL);
}

const loadSearchImages = (e) =>{
    if(e.key == "Enter"){
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click",hidelightBox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));
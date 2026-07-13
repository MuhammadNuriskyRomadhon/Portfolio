// Smooth active navbar
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });

});


// Reveal Animation

const cards = document.querySelectorAll(".card");

const reveal = () => {

    cards.forEach(card => {

        const windowHeight = window.innerHeight;

        const cardTop = card.getBoundingClientRect().top;

        if(cardTop < windowHeight - 100){

            card.style.opacity = "1";
            card.style.transform = "translateY(0px)";

        }

    });

};

cards.forEach(card=>{

    card.style.opacity="0";
    card.style.transform="translateY(40px)";
    card.style.transition=".7s";

});

window.addEventListener("scroll", reveal);

reveal();


// Typing Effect

const typingText = document.querySelector(".typing-text");

const words = [

"Hospitality",

"Customer Service",

"Front Office",

"Housekeeping",

"Barista",

"Waiter"

];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typing(){

    const currentWord = words[wordIndex];

    if(!deleting){

        typingText.textContent =
        currentWord.substring(0,charIndex++);

        if(charIndex > currentWord.length){

            deleting = true;

            setTimeout(typing,1500);

            return;

        }

    }else{

        typingText.textContent =
        currentWord.substring(0,charIndex--);

        if(charIndex < 0){

            deleting = false;

            wordIndex++;

            if(wordIndex >= words.length){

                wordIndex = 0;

            }

        }

    }

    setTimeout(typing,deleting ? 60 : 120);

}

typing();


// Scroll To Top Button

const topBtn = document.createElement("button");

topBtn.innerHTML = "↑";

document.body.appendChild(topBtn);

topBtn.style.position="fixed";
topBtn.style.right="20px";
topBtn.style.bottom="20px";
topBtn.style.width="50px";
topBtn.style.height="50px";
topBtn.style.borderRadius="50%";
topBtn.style.border="none";
topBtn.style.background="#38bdf8";
topBtn.style.color="#fff";
topBtn.style.fontSize="22px";
topBtn.style.cursor="pointer";
topBtn.style.display="none";
topBtn.style.boxShadow="0 0 15px #38bdf8";

window.addEventListener("scroll",()=>{

    if(window.scrollY>400){

        topBtn.style.display="block";

    }else{

        topBtn.style.display="none";

    }

});

topBtn.onclick=()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};


// Current Year Footer

const footer = document.querySelector("footer p");

footer.innerHTML =
`© ${new Date().getFullYear()} Muhammad Nurisky Romadhon | Portfolio`;

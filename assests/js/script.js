const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const closeBtn = document.getElementById("closeBtn");
const navLinks = document.querySelectorAll(".nav-link, .side-link");
const mainNavLinks = document.querySelectorAll(".nav-link");
const navbar = document.querySelector(".header");
const typingText = document.getElementById("typingText");
const contactForm = document.getElementById("contactForm");
const backTop = document.getElementById("backTop");
const footerYear = document.getElementById("footerYear");
const sections = document.querySelectorAll("section[id]");
const animElements = document.querySelectorAll("[data-animate]");
const skillFills = document.querySelectorAll(".skill-fill");

if (menuBtn && sideMenu && closeBtn) {
    menuBtn.addEventListener("click", function() {
        sideMenu.classList.add("active");
    });
    
    closeBtn.addEventListener("click", function() {
        sideMenu.classList.remove("active");
    });
}

for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function() {
        if (sideMenu) {
            sideMenu.classList.remove("active");
        }
    });
}

window.addEventListener("scroll", function() {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
    } else {
        navbar.style.boxShadow = "0 2px 20px rgba(79, 70, 229, 0.10)";
    }
    
    if (window.scrollY > 300) {
        backTop.classList.add("show");
    } else {
        backTop.classList.remove("show");
    }

    let currentSection = "";
    
    for (let i = 0; i < sections.length; i++) {
        const sectionTop = sections[i].offsetTop;
        if (window.scrollY >= sectionTop - 150) {
            currentSection = sections[i].getAttribute("id");
        }
    }
    
    for (let i = 0; i < mainNavLinks.length; i++) {
        mainNavLinks[i].classList.remove("active");
        const href = mainNavLinks[i].getAttribute("href");
        if (href === "#" + currentSection || (currentSection === "" && href === "#home")) {
            mainNavLinks[i].classList.add("active");
        }
    }
});

if (backTop) {
    backTop.addEventListener("click", function() {
        window.scrollTo(0, 0);
    });
}

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

if (typingText) {
    const roles = ["PHP Full Stack Developer", "Web Developer", "Frontend Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500;
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect();
}

if (animElements.length > 0) {
    const observer = new IntersectionObserver(function(entries) {
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                const element = entries[i].target;
                const delay = element.getAttribute("data-delay") || 0;
                
                setTimeout(function() {
                    element.classList.add("animated");
                }, parseInt(delay));
                
                observer.unobserve(element);
            }
        }
    }, { threshold: 0.15 });

    for (let i = 0; i < animElements.length; i++) {
        observer.observe(animElements[i]);
    }
}

if (skillFills.length > 0) {
    const skillObserver = new IntersectionObserver(function(entries) {
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                const fill = entries[i].target;
                const width = fill.getAttribute("data-width");
                
                setTimeout(function() {
                    fill.style.width = width + "%";
                }, 150);
                
                skillObserver.unobserve(fill);
            }
        }
    }, { threshold: 0.3 });

    for (let i = 0; i < skillFills.length; i++) {
        skillObserver.observe(skillFills[i]);
    }
}

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const nameInput = document.getElementById("contactName").value;
        const emailInput = document.getElementById("contactEmail").value;
        const subjectInput = document.getElementById("contactSubject").value;
        const messageInput = document.getElementById("contactMessage").value;
        
        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const subjectError = document.getElementById("subjectError");
        const messageError = document.getElementById("messageError");
        
        const formSuccess = document.getElementById("formSuccess");
        const sendBtn = document.getElementById("sendBtn");
        const sendText = document.getElementById("sendText");
        
        nameError.style.display = "none";
        emailError.style.display = "none";
        subjectError.style.display = "none";
        messageError.style.display = "none";
        formSuccess.style.display = "none";
        
        let isValid = true;
        
        if (nameInput === "") {
            nameError.style.display = "block";
            isValid = false;
        }
        
        if (emailInput === "" || emailInput.indexOf("@") === -1) {
            emailError.style.display = "block";
            isValid = false;
        }
        
        if (subjectInput === "") {
            subjectError.style.display = "block";
            isValid = false;
        }
        
        if (messageInput === "") {
            messageError.style.display = "block";
            isValid = false;
        }
        
        if (isValid) {
            sendText.textContent = "Sending...";
            sendBtn.disabled = true; // Disable button during request
            
            const formData = new FormData(contactForm);
            const formError = document.getElementById("formError");
            if (formError) formError.style.display = "none"; // Hide previous errors
            
            fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(function(response) {
                if (response.ok) {
                    sendText.textContent = "Send Message";
                    sendBtn.disabled = false;
                    contactForm.reset();
                    formSuccess.style.display = "flex";
                    
                    setTimeout(function() {
                        formSuccess.style.display = "none";
                    }, 4000);
                } else {
                    response.json().then(function(data) {
                        console.error("Formspree API Error:", data);
                        showSubmissionError();
                    });
                }
            })
            .catch(function(error) {
                console.error("Fetch Error:", error);
                showSubmissionError();
            });
            
            function showSubmissionError() {
                sendText.textContent = "Send Message";
                sendBtn.disabled = false;
                if (formError) {
                    formError.style.display = "flex";
                    setTimeout(function() {
                        formError.style.display = "none";
                    }, 5000);
                }
            }
        }
    });
}

window.addEventListener("load", function() {
    document.body.style.opacity = "1";
});
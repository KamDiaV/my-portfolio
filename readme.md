# Diana St. — Frontend Developer Portfolio

Welcome to my personal portfolio! This site showcases my skills, technologies I work with, and a selection of my projects. It’s built with plain HTML, SCSS (compiled to CSS), and vanilla JavaScript, following the BEM methodology for maintainable, modular styles.

---

## ✨ Features

- **Responsive Layout** — works across desktop and mobile  
- **CSS Grid & Flexbox** — for flexible layout  
- **SVG Sprite** — icons served from a single optimized sprite 
- **Burger‑menu** — mobile navigation with animated overlay  
- **Technologies Animation** — icons fade/slide into view  
- **Projects Slider** — automatic image carousel with thumbnails  
- **Project Selector** — click a project on the home page to highlight it on the full “Projects” page  
- **Snake‑background** — a procedurally generated “snake” animation that hunts down and “eats” pixels  
- **Scroll‑to‑Top Button** — appears when you reach the bottom of the page  
- **Contact Popup** — modal prompt guiding users to Telegram for faster replies  

---

## 🛠 Technologies

- **HTML5** & **SCSS** (compiled to CSS)  
- **CSS Grid** & **Flexbox** for layout  
- **SVG Sprite** for icons 
- **Vanilla JavaScript** (ES6+)  
- **Anime.js** for certain animations  

---

## 🎛 Usage & Interactivity

### Navigation & Burger Menu
- Desktop: full nav links appear in the header.
- Mobile: burger icon toggles a full‑screen overlay menu.

### Technologies Animation
As you scroll, the “Technologies” section icons fade/slide into view via technologies-animation.js.

### Projects Slider
On projects.html, each card has a slider:
- Auto‑rotate images every few seconds
- Thumbnails below let you jump to specific slides

### Project Selector
On the home page:
selectProject('airy-balloons');

- Stores your selection in localStorage
- Navigates to projects.html
- Brings the chosen project card to the top

### Snake Background
snake-bg.js draws into a <canvas id="snake-bg"> inside .wrapper:
- 100 points scattered as 4×4px “food”
- A snake that “eats” them and grows
- Always starts just below the logo

### Scroll‑to‑Top
scroll-top-button.js watches window.scroll, and when you’re 95% down, toggles the .visible state on the circular “up” button. Clicking it scrolls smoothly to top.

### Contact Popup
Click Contact Me:
- Shows a modal with a Telegram link
- Can close via the “×” button, backdrop click, or Esc key
- Styled and animated via SCSS in contact-popup block

---

## 👩‍💻 Author
Diana Stepanova

- Telegram: [@kamikodi](https://t.me/kamikodi)
- [LinkedIn](https://www.linkedin.com/in/diana-stepanova-9a08a335b/)

--- 

### Enjoy coding!
If you have any questions or suggestions for improving the project, please feel free to open a pull request on GitHub.

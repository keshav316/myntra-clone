function unlimited_slider(slideClass, circleClass, colorToFilled='grey') {
    const slides = document.querySelectorAll(`.${slideClass}`); // Select all slides using the class name
    const circles = document.querySelectorAll(`.${circleClass}`); // Select all circles
    let counter = 0;
    const totalSlides = slides.length; // Number of slides
    let autoSlideInterval; // Variable to hold the interval ID
    let userInteractedTimeout; // Variable to hold the timeout ID
  
    // Function to start automatic sliding
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(goNext, 3000); // Slide every 3 seconds
    };
  
    // Function to stop automatic sliding
    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };
  
    // Function to reset the automatic slide after user interaction
   const resetAutoSlide=() => {
     clearTimeout(userInteractedTimeout);
     userInteractedTimeout=setTimeout(startAutoSlide,3000);
   }
  
    const slideImage = () => {
        slides.forEach((s) => {
            s.style.transform = `translateX(-${counter * 100}%)`; // Update slide position
        });
        circles.forEach((circle, index) => {
          circle.style.fill=index===counter ? colorToFilled : 'rgb(183, 183, 183)';
        });
    };
  
    const goNext = () => {
        counter = (counter + 1) % totalSlides; // Wrap around using modulo
        slideImage();
    };
  
    const goPrev = () => {
        counter = (counter - 1 + totalSlides) % totalSlides; // Wrap around using modulo
        slideImage();
    };
  
    slides.forEach((s, index) => {
        s.style.left = `${index * 100}%`; // Position each slide
    });
  
    circles.forEach((circle, index) => {
        circle.addEventListener('click', () => {
            if (counter !== index) {
                counter = index; // Update counter to clicked circle index
                slideImage(); // Update slides and circles
                stopAutoSlide(); // Stop automatic sliding
                resetAutoSlide(); // Reset automatic sliding
            }
        });
    });
  
    // Start the automatic sliding when the function is called
    startAutoSlide();
  }
  
// Call the function with the class name of the slides
unlimited_slider('slide','circle');
unlimited_slider('page1slide','page1circle')

// Handle list item clicks to show/hide corresponding sections
let previouslist = '';
let lists = document.getElementsByTagName('li');
Array.from(lists).forEach((list, index) => {
  list.addEventListener('click', () => {
      // First, reset the opacity of all elements
      document.querySelectorAll('.men, .women, .kids, .home, .beauty, .studio').forEach(el => {
          el.style.opacity = '0';
      });

      // Then, set the opacity of the clicked element
      if (index == 0) {
          let men = document.querySelector('.men');
          men.style.opacity = '1';
      }
      if (index == 1) {
          let women = document.querySelector('.women');
          women.style.opacity = '1';
      }
      if (index == 2) {
          let kids = document.querySelector('.kids');
          kids.style.opacity = '1';
      }
      if (index == 3) {
          let home = document.querySelector('.home');
          home.style.opacity = '1';
      }
      if (index == 4) {
          let beauty = document.querySelector('.beauty');
          beauty.style.opacity = '1';
      }
      if (index == 5) {
          let studio = document.querySelector('.studio');
          studio.style.opacity = '1';
      }
  });
});
function MyntraSearch() {
    let searchinput = document.querySelector(".searchInput"); // Select the search bar element
    let searchbar = document.querySelector(".search-bar"); // Select the search-bar element

    // Function to add styles to the search input and search bar
    const addStyles = () => {
        searchinput.style.border = 'none'; // Set border to 2px solid white
        searchinput.style.backgroundColor = 'white'; // Set background color to white
        searchbar.style.backgroundColor = 'white'; // Set background color to white
    };

    // Function to remove styles from the search input and search bar
    const removeStyles = () => {
        searchinput.style.border = ''; // Reset border
        searchinput.style.backgroundColor = ''; // Reset background color
        searchbar.style.backgroundColor = ''; // Reset background color
    };

    // Event listener for the search bar click
    searchinput.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click from propagating to the document
        let white = document.querySelector('.white');
       white.style.backgroundColor = 'white'
        white.addEventListener('mouseenter', () => {
            white.style.backgroundColor = '#f2f2f2'; // Change background color on hover
        });
    
        white.addEventListener('mouseleave', () => {
            white.style.backgroundColor = '#f2f2f2'; // Revert background color when not hovering
        });
        addStyles();
    });

    // Event listener for the document click
    document.addEventListener('click', () => {
        removeStyles();
    });

    // Preventing styles removal when clicking on the search input
    searchinput.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click from propagating to the document
    });
}

// Initialize the MyntraSearch function
MyntraSearch();
async function getProduct() {
    try {
        // Fetch the HTML content of the product list page
        let productListResponse = await fetch(`http://127.0.0.1:3000/products/`);
        if (!productListResponse.ok) {
            throw new Error(`HTTP error! status: ${productListResponse.status}`);
        }
        let productListText = await productListResponse.text(); // Read the response as text
        let productListDiv = document.createElement('div');
        productListDiv.innerHTML = productListText;

        // Assuming product URLs are within <a> tags
        let productLinks = productListDiv.getElementsByTagName('a');

        for (let i = 0; i < productLinks.length; i++) {
            let productURL = productLinks[i].href;
            let response = await fetch(productURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let text = await response.text();
            let div = document.createElement('div');
            div.innerHTML = text;
            console.log(div);

            let links = div.getElementsByTagName('a');
            let productInfo = {
                imgSrc: null,
                title: null,
                description: null,
                price: null,
                originalPrice: null
            };

            for (let j = 0; j < links.length; j++) {
                let linkHref = links[j].href;
                console.log(linkHref);

                if (linkHref.endsWith('.webp')) {
                    productInfo.imgSrc = linkHref;
                } else if (linkHref.endsWith('.txt')) {
                    let textResponse = await fetch(linkHref);
                    let textContent = await textResponse.text();
                    let lines = textContent.split('\n');

                    productInfo.title = lines[0]?.trim() || 'No title'; // Handle potential null values
                    productInfo.description = lines[1]?.trim() || 'No description';
                    productInfo.price = lines[2]?.trim() || 'No price';
                    productInfo.originalPrice = lines[3]?.trim() || 'No original price';
                }
            }

            if (productInfo.imgSrc && productInfo.title && productInfo.description && productInfo.price && productInfo.originalPrice) {
                let div2 = document.createElement('div');
                div2.classList.add('product'); // Adding class for the search filtering
                div2.innerHTML = `
                    <div class="product-image">
                        <img src="${productInfo.imgSrc}" alt="">
                        <img src="${productInfo.imgSrc}" alt="">
                        <img src="${productInfo.imgSrc}" alt="">
                        <img src="${productInfo.imgSrc}" alt="">
                        <img src="${productInfo.imgSrc}" alt="">
                    </div>
                    <h3>${productInfo.title}</h3>
                    <p class="firstp">${productInfo.description}</p>
                    <p class="Secondp">Price: <span class="price">₹${productInfo.price}</span> <span class="original-price">₹${productInfo.originalPrice}</span></p>
                    <div class="countersvg">
                        <!-- SVG circles here -->
                    </div>
                    <button class="wishlistbutton"><div class="wishlist icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000000" fill="none">
                            <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                        </svg>
                      </div>
                    Wishlist</button>
                `;

                let productsSection = document.querySelector('.products-section');
                if (productsSection) {
                    productsSection.appendChild(div2);
                } else {
                    console.log('Products section not found.');
                }
            } else {
                console.log('Incomplete product info.');
            }
        }

        // Initialize the search functionality
        setupSearchFunctionality();
        initLogoclick();

        // Get query parameter from URL and filter products
        let query = getQueryParam('query');
        if (query) {
            let resultContainer = document.getElementById('result-container');
            let result = document.createElement('div');
            result.innerHTML = `<div class="result">
                <p>The result of <b>${query}</b> is</p>
            </div>`;
            resultContainer.appendChild(result);

            filterProducts(query);
        }

    } catch (error) {
        console.error('Failed to fetch the product:', error);
    }
}



function setupSearchFunctionality() {
    let searchInput = document.querySelector('.searchInput');
    let searchIcon = document.querySelector('.search-bar svg'); // Select the SVG inside search-bar

    // Add event listener for pressing Enter
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            searchbarinput();
        }
    });

    // Add event listener for clicking on the SVG
    searchIcon.addEventListener('click', () => {
        searchbarinput();
    });
}

function filterProducts(query) {
    query = query.toLowerCase();
    let products = document.querySelectorAll('.product');
    products.forEach(product => {
        let title = product.querySelector('h3').textContent.toLowerCase();
        let description = product.querySelector('p').textContent.toLowerCase();
        if (title.includes(query) || description.includes(query)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function searchbarinput() {
    let searchInput = document.querySelector('.searchInput');
    let query = searchInput.value; // Retrieve the input value

    // Open the URL with the query parameter
    window.open(`http://127.0.0.1:3000/store.html?query=${encodeURIComponent(query)}`);

    // Call filterProducts to filter the current page's products
    filterProducts(query);
}



function getQueryParam(param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fetch and display products
getProduct();
function logoclick() {
    let logo = document.querySelector('.Logobutton');
    let left = document.querySelector('.left');
    let hideornot = 0;

    function showMenu(event) {
        event.stopPropagation(); // Prevent the click event from propagating to the document
        left.style.left = '0%';
        hideornot = 1;
    }

    function hideMenu() {
        left.style.left = '-100%';
        hideornot = 0;
    }

    function preventHide(event) {
        event.stopPropagation(); // Prevent hiding when clicking on the 'left' element itself
    }

    // Add event listeners
    document.addEventListener("click", hideMenu);
    left.addEventListener("click", preventHide);

    // Add logo event listener if screen width is less than or equal to 600px
    if (window.matchMedia("(max-width: 600px)").matches) {
        logo.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click event from propagating to the document
            if (hideornot === 0) {
                showMenu(event);
            } else {
                hideMenu();
            }
        });
    }

    // Function to remove event listeners
    function removeEventListeners() {
        logo.removeEventListener('click', showMenu);
        logo.removeEventListener('click', hideMenu);
        document.removeEventListener("click", hideMenu);
        left.removeEventListener("click", preventHide);
    }

    return removeEventListeners; // Return the function to remove event listeners
}

function initLogoclick() {
    let removeListeners; // Variable to store the function to remove event listeners

    function checkWidth() {
        if (window.matchMedia("(max-width: 600px)").matches) {
            if (!removeListeners) {
                removeListeners = logoclick(); // Add event listeners and store the remove function
            }
        } else {
            if (removeListeners) {
                removeListeners(); // Remove event listeners if screen width is more than 600px
                removeListeners = null;
            }
        }
    }

    checkWidth(); // Initialize on page load
    window.addEventListener('resize', checkWidth); // Re-check on window resize
}

// Initialize logo click handling
initLogoclick();
 // The query will be obtained from the input field

// Example Usage:

document.querySelectorAll('.Menu a').forEach(link => {
    link.addEventListener('click', function(e) {
      this.classList.add('clicked');
      
      setTimeout(() => {
        this.classList.remove('clicked');
      }, 300);
    });
  });
  
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });
  
  fadeElements.forEach(el => observer.observe(el));

  const scrollBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add("show");
  } else {
    scrollBtn.classList.remove("show");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

const toggleSwitch = document.getElementById("toggleModeBtn");
const toggleLabel = document.querySelector(".toggle-switch");

if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark-mode");
  toggleSwitch.checked = true;
  toggleLabel.title = "Beralih ke Light Mode";
} else {
  toggleLabel.title = "Beralih ke Dark Mode";
}

toggleSwitch.addEventListener("change", () => {
  if (toggleSwitch.checked) {
    document.documentElement.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    toggleLabel.title = "Beralih ke Light Mode";
  } else {
    document.documentElement.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
    toggleLabel.title = "Beralih ke Dark Mode";
  }
});

const searchInput = document.getElementById("searchinput");
const suggestionBox = document.getElementById("suggestionBox");
const searchBtn = document.querySelector(".search-btn");

const pages = {
  "Beranda": "index.html",
  "Profil Jurusan": "profjur.html",
  "Album": "album.html",
  "Buku Tamu": "bukutamu.html"
};

searchInput.addEventListener("input", function() {
  const query = this.value.toLowerCase().trim();
  suggestionBox.innerHTML = "";
  
  if (query.length === 0) {
    suggestionBox.style.display = "none";
    return;
  }

  const matches = Object.keys(pages).filter(item => 
    item.toLowerCase().includes(query)
  );
  
  if (matches.length > 0) {
    matches.forEach(match => {
      const li = document.createElement("li");
      li.textContent = match;
      li.addEventListener("click", () => {
        searchInput.value = match;
        suggestionBox.style.display = "none";
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = pages[match];
        }, 500);
      });
      suggestionBox.appendChild(li);
    });
    suggestionBox.style.display = "block";
  } else {
    const li = document.createElement("li");
    li.textContent = "Tidak ditemukan";
    li.style.color = "#999";
    li.style.cursor = "default";
    suggestionBox.appendChild(li);
    suggestionBox.style.display = "block";
  }
});

searchBtn.addEventListener("click", function() {
  const query = searchInput.value.toLowerCase().trim();
  if (query.length === 0) return;
  
  const matchedPage = Object.keys(pages).find(item => 
    item.toLowerCase() === query
  );
  
  if (matchedPage) {
    document.body.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = pages[matchedPage];
    }, 500);
  }
});

document.addEventListener("click", function(e) {
  if (!searchInput.contains(e.target)){
    suggestionBox.style.display = "none";
  }
});

searchInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    searchBtn.click();
  }
  
  if (e.key === "ArrowDown" && suggestionBox.children.length > 0) {
    e.preventDefault();
    suggestionBox.children[0].focus();
  }
});

const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.Menu a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const guestForm = document.getElementById('guestForm');
  const messagesContainer = document.getElementById('messagesContainer');
  const notification = document.getElementById('notification');
  
  loadMessages();
  
  guestForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nama = document.getElementById('nama').value.trim();
      const tanggal = document.getElementById('tanggal').value;
      const email = document.getElementById('email').value.trim();
      const pesan = document.getElementById('pesan').value.trim();
      
      if (!validateForm(nama, email, pesan)) {
          return;
      }
      
      const message = {
          nama,
          tanggal: tanggal || new Date().toISOString().split('T')[0],
          email,
          pesan,
          timestamp: new Date().toISOString()
      };
      
      saveMessage(message);
      
      addMessageToDisplay(message);
      
      showNotification('Pesan Anda telah terkirim! Terima kasih.');
      
      guestForm.reset();
  });
  
  function validateForm(nama, email, pesan) {
      let isValid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      document.querySelectorAll('.input-feedback').forEach(el => {
          el.textContent = '';
      });
      
      if (!nama) {
          document.getElementById('nama').nextElementSibling.textContent = 'Nama harus diisi';
          isValid = false;
      }
      
      if (!email) {
          document.getElementById('email').nextElementSibling.textContent = 'Email harus diisi';
          isValid = false;
      } else if (!emailRegex.test(email)) {
          document.getElementById('email').nextElementSibling.textContent = 'Email tidak valid';
          isValid = false;
      }
      
      if (!pesan) {
          document.getElementById('pesan').nextElementSibling.textContent = 'Pesan harus diisi';
          isValid = false;
      } else if (pesan.length < 10) {
          document.getElementById('pesan').nextElementSibling.textContent = 'Pesan terlalu pendek';
          isValid = false;
      }
      
      return isValid;
  }
  
  function saveMessage(message) {
      let messages = JSON.parse(localStorage.getItem('guestMessages')) || [];
      messages.unshift(message); 
      localStorage.setItem('guestMessages', JSON.stringify(messages));
  }
  
  function loadMessages() {
      const messages = JSON.parse(localStorage.getItem('guestMessages')) || [];
      messages.forEach(message => {
          addMessageToDisplay(message);
      });
  }
  
  function addMessageToDisplay(message) {
      const messageCard = document.createElement('div');
      messageCard.className = 'message-card';
      
      const formattedDate = new Date(message.timestamp).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
      });
      
      messageCard.innerHTML = `
          <div class="message-header">
              <span class="message-name">${message.nama}</span>
              <span class="message-date">${formattedDate}</span>
          </div>
          <div class="message-content">${message.pesan}</div>
      `;
      
      messagesContainer.prepend(messageCard);
  }
  
  function showNotification(text) {
      notification.textContent = text;
      notification.classList.add('show');
      
      setTimeout(() => {
          notification.classList.remove('show');
      }, 3000);
  }
  
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.Menu a').forEach(link => {
      if (link.getAttribute('href') === currentPage) {
          link.classList.add('active');
      }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.querySelector('.close-btn');
  
  galleryItems.forEach(item => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.image-caption').textContent;
      
      item.addEventListener('click', function() {
          modal.style.display = 'block';
          modalImg.src = img.src;
          modalCaption.textContent = caption;
      });
  });
  
  closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
  });
  
  modal.addEventListener('click', function(e) {
      if (e.target === modal) {
          modal.style.display = 'none';
      }
  });
  
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.Menu a').forEach(link => {
      if (link.getAttribute('href') === currentPage) {
          link.classList.add('active');
      }
  });
});
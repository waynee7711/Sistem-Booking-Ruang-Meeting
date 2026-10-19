const API_BASE = 'http://127.0.0.1:8000/api';

const state = {
  currentStep: 1,
  selectedRoom: null,
  selectedDate: '',
  selectedSlot: null,
  rooms: [],
  slots: []
};

const elements = {
  btnNext: document.getElementById('btn-next'),
  btnBack: document.getElementById('btn-back'),
  btnReset: document.getElementById('btn-reset'),
  alertContainer: document.getElementById('alert-container'),

  steps: [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4')
  ],
  indicators: [
    document.getElementById('step-indicator-1'),
    document.getElementById('step-indicator-2'),
    document.getElementById('step-indicator-3'),
    document.getElementById('step-indicator-4')
  ],

  roomsGrid: document.getElementById('rooms-grid'),
  slotsGrid: document.getElementById('slots-grid'),
  bookingDate: document.getElementById('booking-date'),
  bookingForm: document.getElementById('booking-form'),

  inputName: document.getElementById('input-name'),
  inputEmail: document.getElementById('input-email'),
  inputPhone: document.getElementById('input-phone'),
  inputParticipants: document.getElementById('input-participants'),

  resCode: document.getElementById('res-booking-code'),
  resRoom: document.getElementById('res-room-name'),
  resDate: document.getElementById('res-date'),
  resTime: document.getElementById('res-time'),
  resName: document.getElementById('res-name')
};

document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  initIntersectionObserver();
  initDateConstraints();
  fetchRooms();
  setupEventListeners();
  if (window.lucide) lucide.createIcons();
});

function initHeroCarousel() {
  const wordEl = document.getElementById('word-carousel');
  if (!wordEl) return;

  const words = ['productive.', 'efficient.', 'fast.', 'successful.', 'unstoppable.'];

  let wordIndex = 0;
  let charIndex = words[0].length;
  let isDeleting = true;
  let isStopped = false;

  setTimeout(typeEffect, 2000);

  function typeEffect() {
    if (isStopped) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
      wordEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      wordEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 80 : 150;

    if (!isDeleting && charIndex === currentWord.length) {
      if (wordIndex === words.length - 1) {
        isStopped = true;
        wordEl.classList.remove('border-r-4', 'animate-blink');
        return;
      }

      typeSpeed = 2500;
      isDeleting = true;

    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex++;
      typeSpeed = 600;
    }

    setTimeout(typeEffect, typeSpeed);
  }
}

function initIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
}

function initDateConstraints() {
  const today = new Date().toISOString().split('T')[0];
  elements.bookingDate.min = today;
}

async function fetchRooms() {
  try {
    showAlert('', 'hide');
    const res = await fetch(`${API_BASE}/rooms`);
    if (!res.ok) throw new Error('Gagal mengambil data ruangan.');

    state.rooms = await res.json();
    renderRooms(state.rooms);
  } catch (err) {
    showAlert(err.message || 'Gagal terhubung ke API backend.', 'error');
    elements.roomsGrid.innerHTML = `<p class="col-span-3 text-center text-red-500 py-8">Gagal memuat data. Pastikan json-server berjalan di port 3001.</p>`;
  }
}

async function fetchSlots(roomId, date) {
  try {
    elements.slotsGrid.innerHTML = `
      <div class="col-span-3 text-center py-6 text-gray-400">
        <i data-lucide="loader-2" class="w-6 h-6 animate-spin mx-auto mb-1 text-sage-green"></i>
        Memuat slot waktu...
      </div>`;
    if (window.lucide) lucide.createIcons();

    let url = `${API_BASE}/slots?roomId=${roomId}`;
    if (date) url += `&date=${date}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal mengambil data slot.');

    state.slots = await res.json();
    renderSlots(state.slots);
  } catch (err) {
    showAlert('Gagal memuat slot jam.', 'error');
    elements.slotsGrid.innerHTML = `<p class="col-span-3 text-center text-red-500 py-4 text-xs">Gagal mengambil slot jam.</p>`;
  }
}

function renderRooms(rooms) {
  if (rooms.length === 0) {
    elements.roomsGrid.innerHTML = `<p class="col-span-3 text-center py-8 text-gray-500">Tidak ada ruangan tersedia.</p>`;
    return;
  }

  elements.roomsGrid.innerHTML = rooms.map(room => {
    const isSelected = state.selectedRoom && String(state.selectedRoom.id) === String(room.id);
    return `
      <div data-room-id="${room.id}"
           class="room-card cursor-pointer bg-white rounded-2xl p-5 border border-gray-200 transition-all hover:border-sage-green hover:shadow-md flex flex-col justify-between ${isSelected ? 'room-card-selected' : ''}">
        <div>
          <img src="${room.image ? `./assets/${room.image}` : './assets/alpha.jpg'}" alt="${room.name}" class="w-full h-36 object-cover rounded-xl mb-4" />
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-playfair font-bold text-lg text-dark-green">${room.name}</h3>
            <span class="text-xs px-2.5 py-1 bg-sage-green/10 text-sage-green font-semibold rounded-full">
              Cap: ${room.capacity} org
            </span>
          </div>
          <p class="text-xs text-gray-500 mb-3">
            <strong>Fasilitas:</strong> ${Array.isArray(room.facilities) ? room.facilities.join(', ') : room.facilities}
          </p>
        </div>
        <div class="pt-3 border-t border-gray-100 flex justify-between items-center mt-2">
          <span class="text-xs text-gray-400">Harga per jam</span>
          <span class="font-bold text-dark-green text-sm">Rp ${Number(room.pricePerHour || room.price).toLocaleString('id-ID')}</span>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.room-card').forEach(card => {
    card.addEventListener('click', () => {
      const roomId = card.getAttribute('data-room-id');
      state.selectedRoom = state.rooms.find(r => String(r.id) === String(roomId));

      document.querySelectorAll('.room-card').forEach(c => c.classList.remove('room-card-selected'));
      card.classList.add('room-card-selected');

      validateCurrentStep();
    });
  });
}

function renderSlots(slots) {
  if (!slots || slots.length === 0) {
    elements.slotsGrid.innerHTML = `<p class="col-span-3 text-center py-6 text-gray-400 text-sm">Tidak ada slot jam untuk ruangan ini.</p>`;
    return;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayString = `${year}-${month}-${day}`;

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  elements.slotsGrid.innerHTML = slots.map(slot => {
    const isSelected = state.selectedSlot && String(state.selectedSlot.id) === String(slot.id);
    let isAvailable = slot.isAvailable !== false;

    if (state.selectedDate === todayString) {
      const [startHourStr, startMinStr] = slot.time.split('-')[0].split(':');
      const startHour = parseInt(startHourStr, 10);
      const startMin = parseInt(startMinStr, 10);

      if (startHour < currentHour || (startHour === currentHour && startMin <= currentMinute)) {
        isAvailable = false;
      }
    }

    if (!isAvailable) {
      const reason = slot.isAvailable === false ? 'Penuh' : 'Lewat';
      return `
        <button type="button" disabled class="p-3 border border-gray-200 bg-gray-100 text-gray-400 rounded-xl text-xs font-semibold line-through cursor-not-allowed">
          ${slot.time} (${reason})
        </button>
      `;
    }

    return `
      <button type="button" data-slot-id="${slot.id}"
              class="slot-btn p-3 border rounded-xl text-xs font-semibold transition-all text-center ${isSelected ? 'bg-dark-green text-white border-dark-green shadow-sm' : 'bg-white border-gray-200 text-dark-green hover:border-sage-green'}">
        ${slot.time}
      </button>
    `;
  }).join('');

  document.querySelectorAll('.slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const slotId = btn.getAttribute('data-slot-id');
      state.selectedSlot = state.slots.find(s => String(s.id) === String(slotId));
      renderSlots(state.slots);
      validateCurrentStep();
    });
  });
}

function validateNameInput(name) {
  const trimmed = name.trim();
  if (!trimmed) return 'Nama lengkap wajib diisi.';
  if (trimmed.length < 3) return 'Nama minimal terdiri dari 3 karakter.';
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) return 'Nama hanya boleh berisi huruf dan spasi.';
  return '';
}

function validatePhoneInput(phone) {
  const trimmed = phone.trim();
  if (!trimmed) return 'Nomor HP wajib diisi.';
  if (!/^[0-9]+$/.test(trimmed)) return 'Nomor HP hanya boleh berisi angka.';
  if (trimmed.length < 10 || trimmed.length > 13) return 'Nomor HP harus terdiri dari 10 hingga 13 digit.';
  return '';
}

function validateParticipantsInput(val, capacity) {
  if (val === '' || val === null) return 'Jumlah peserta wajib diisi.';
  const num = parseInt(val, 10);
  if (isNaN(num) || num <= 0) {
    return 'Jumlah peserta minimal 1 orang.';
  }
  if (capacity && num > capacity) {
    return `Kapasitas maksimal ruangan ini adalah ${capacity} orang.`;
  }
  return '';
}

function setupEventListeners() {
  elements.bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
  });

  elements.btnNext.addEventListener('click', handleNextStep);
  elements.btnBack.addEventListener('click', handlePrevStep);
  elements.btnReset.addEventListener('click', resetBooking);

  elements.bookingDate.addEventListener('change', (e) => {
    state.selectedDate = e.target.value;
    state.selectedSlot = null;
    if (state.selectedRoom && state.selectedDate) {
      fetchSlots(state.selectedRoom.id, state.selectedDate);
    }
    validateCurrentStep();
  });

  [elements.inputName, elements.inputEmail, elements.inputPhone, elements.inputParticipants].forEach(input => {
    input.addEventListener('input', validateCurrentStep);
  });
}

function handleNextStep() {
  if (state.currentStep === 3) {
    submitBooking();
    return;
  }

  if (state.currentStep < 4) {
    state.currentStep++;
    updateStepVisibility();
  }
}

function handlePrevStep() {
  if (state.currentStep > 1) {
    state.currentStep--;
    updateStepVisibility();
  }
}

function updateStepVisibility() {
  elements.steps.forEach((stepEl, idx) => {
    if (idx + 1 === state.currentStep) {
      stepEl.classList.remove('hidden');
    } else {
      stepEl.classList.add('hidden');
    }
  });

  elements.indicators.forEach((indEl, idx) => {
    const stepNum = idx + 1;
    const circle = indEl.querySelector('.step-circle');

    if (stepNum === state.currentStep) {
      indEl.classList.remove('opacity-40');
      circle.className = 'step-circle w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-dark-green text-white shadow-md transition-all';
    } else if (stepNum < state.currentStep) {
      indEl.classList.remove('opacity-40');
      circle.className = 'step-circle w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-sage-green text-white transition-all';
    } else {
      indEl.classList.add('opacity-40');
      circle.className = 'step-circle w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-gray-200 text-gray-600 transition-all';
    }
  });

  if (state.currentStep === 1) {
    elements.btnBack.classList.add('hidden');
  } else if (state.currentStep === 4) {
    document.getElementById('stepper-nav').classList.add('hidden');
  } else {
    elements.btnBack.classList.remove('hidden');
    document.getElementById('stepper-nav').classList.remove('hidden');
  }

  const btnNextSpan = elements.btnNext.querySelector('span');
  if (state.currentStep === 3) {
    btnNextSpan.textContent = 'Konfirmasi';
  } else {
    btnNextSpan.textContent = 'Lanjut';
  }

  validateCurrentStep();
  if (window.lucide) lucide.createIcons();
}

function validateCurrentStep() {
  let isValid = false;

  if (state.currentStep === 1) {
    isValid = state.selectedRoom !== null;
  } else if (state.currentStep === 2) {
    isValid = state.selectedDate !== '' && state.selectedSlot !== null;
  } else if (state.currentStep === 3) {
    const nameVal = elements.inputName.value;
    const emailVal = elements.inputEmail.value.trim();
    const phoneVal = elements.inputPhone.value;
    const partVal = elements.inputParticipants.value;

    const nameErrorMsg = validateNameInput(nameVal);
    const isNameValid = nameErrorMsg === '';

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

    const phoneErrorMsg = validatePhoneInput(phoneVal);
    const isPhoneValid = phoneErrorMsg === '';

    const partErrorMsg = validateParticipantsInput(partVal, state.selectedRoom?.capacity);
    const isPartValid = partErrorMsg === '';

    const errNameEl = document.getElementById('err-name');
    if (errNameEl) {
      errNameEl.textContent = nameErrorMsg;
      errNameEl.classList.toggle('hidden', isNameValid || nameVal === '');
    }

    const errPhoneEl = document.getElementById('err-phone');
    if (errPhoneEl) {
      errPhoneEl.textContent = phoneErrorMsg;
      errPhoneEl.classList.toggle('hidden', isPhoneValid || phoneVal === '');
    }

    const errPartEl = document.getElementById('err-participants');
    if (errPartEl) {
      errPartEl.textContent = partErrorMsg;
      errPartEl.classList.toggle('hidden', isPartValid || partVal === '');
    }

    const errEmailEl = document.getElementById('err-email');
    if (errEmailEl) {
      errEmailEl.classList.toggle('hidden', emailVal === '' || isEmailValid);
    }

    isValid = isNameValid && isEmailValid && isPhoneValid && isPartValid;
  }

  elements.btnNext.disabled = !isValid;
}

async function submitBooking() {
  const errorDiv = document.getElementById('bookingErrorMessage');

  const payload = {
    roomId: state.selectedRoom.id,
    slotId: state.selectedSlot.id,
    date: state.selectedDate,
    name: elements.inputName.value.trim(),
    email: elements.inputEmail.value.trim(),
    phone: elements.inputPhone.value.trim(),
    participants: parseInt(elements.inputParticipants.value, 10)
  };

  try {
    elements.btnNext.disabled = true;
    elements.btnNext.querySelector('span').textContent = 'Memproses...';

    if (errorDiv) {
      errorDiv.classList.add('hidden');
      errorDiv.innerHTML = '';
    }

    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      let errorMessage = data.message || `Gagal memproses booking. Status: ${res.status}`;

      if (data.errors) {
        const firstErrorKey = Object.keys(data.errors)[0];
        errorMessage = data.errors[firstErrorKey][0];
      }

      throw new Error(errorMessage);
    }

    elements.resCode.textContent = data.id ? `SNDR-${data.id}` : `SNDR-${Math.floor(1000 + Math.random() * 9000)}`;
    elements.resRoom.textContent = state.selectedRoom.name;
    const [year, month, day] = state.selectedDate.split('-');
    elements.resDate.textContent = `${day}-${month}-${year}`;
    elements.resTime.textContent = state.selectedSlot.time;
    elements.resName.textContent = payload.name;

    state.currentStep = 4;
    updateStepVisibility();

    if (typeof showAlert === 'function') showAlert('', 'hide');

  } catch (err) {
    if (errorDiv) {
      errorDiv.innerHTML = err.message;
      errorDiv.classList.remove('hidden');
    } else if (typeof showAlert === 'function') {
      showAlert(err.message, 'error');
    } else {
      alert(err.message);
    }
  } finally {
    elements.btnNext.disabled = false;
    const btnNextSpan = elements.btnNext.querySelector('span');
    if (btnNextSpan) btnNextSpan.textContent = 'Konfirmasi';
  }
}

function resetBooking() {
  state.currentStep = 1;
  state.selectedRoom = null;
  state.selectedDate = '';
  state.selectedSlot = null;
  state.slots = [];

  elements.bookingForm.reset();
  elements.bookingDate.value = '';

  elements.slotsGrid.innerHTML = `<p class="col-span-3 text-center py-6 text-gray-400 text-sm">Silakan pilih ruangan dan tanggal terlebih dahulu.</p>`;

  renderRooms(state.rooms);
  updateStepVisibility();
  document.getElementById('stepper-nav').classList.remove('hidden');
}

function showAlert(message, type) {
  if (type === 'hide') {
    elements.alertContainer.classList.add('hidden');
    return;
  }

  elements.alertContainer.classList.remove('hidden');
  if (type === 'error') {
    elements.alertContainer.className = 'mb-6 p-4 rounded-xl text-sm font-medium bg-red-50 text-coral-accent border border-red-200';
  } else {
    elements.alertContainer.className = 'mb-6 p-4 rounded-xl text-sm font-medium bg-sage-green/10 text-sage-green border border-sage-green/20';
  }
  elements.alertContainer.textContent = message;
}

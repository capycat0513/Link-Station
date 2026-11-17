// ==========================================
// 2. DOM 요소 선택
// ==========================================

const addBtn = document.getElementById('add-btn');
const addModal = document.getElementById('add-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const saveShortcutBtn = document.getElementById('save-shortcut-btn');

const iconToggle = document.getElementById('icon-toggle');
const customIconGroup = document.getElementById('custom-icon-group');
const shortcutGrid = document.getElementById('shortcut-grid');
const emptyState = document.getElementById('empty-state');

const siteNameInput = document.getElementById('site-name');
const siteUrlInput = document.getElementById('site-url');
const customIconUrlInput = document.getElementById('custom-icon-url');
const customIconFileInput = document.getElementById('custom-icon-file');
const customIconPreview = document.getElementById('custom-icon-preview');
const customIconPreviewImage = document.getElementById('custom-icon-preview-image');
const removeCustomIconFileBtn = document.getElementById('remove-custom-icon-file');

// 업로드한 이미지의 압축 완료 Data URL
let selectedIconData = '';

const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const modalTitle = document.getElementById('modal-title');

// 오류 알림 모달
const alertModal = document.getElementById('alert-modal');
const alertTitle = document.getElementById('alert-title');
const alertMessage = document.getElementById('alert-message');
const alertConfirmBtn = document.getElementById('alert-confirm-btn');


// ==========================================
// 3. 모달 제어
// ==========================================

// 새 바로가기 추가
addBtn.addEventListener('click', () => {
  editingShortcutId = null;
  modalTitle.textContent = '새 바로가기 추가';
  addModal.classList.add('active');
  siteNameInput.focus();
});

// 업로드 상태 초기화
function clearCustomIconUpload() {
  selectedIconData = '';
  customIconFileInput.value = '';
  customIconPreviewImage.removeAttribute('src');
  customIconPreview.classList.add('hidden');
}

// 미리보기 표시
function showCustomIconPreview(dataUrl) {
  selectedIconData = dataUrl;
  customIconPreviewImage.src = dataUrl;
  customIconPreview.classList.remove('hidden');
}

// 모달 닫기
function closeModal() {
  addModal.classList.remove('active');
  siteNameInput.value = '';
  siteUrlInput.value = '';
  customIconUrlInput.value = '';
  iconToggle.checked = false;
  customIconGroup.classList.add('hidden');
  clearCustomIconUpload();
  editingShortcutId = null;
}

closeModalBtn.addEventListener('click', closeModal);

// 모달 바깥 클릭 시 닫기
addModal.addEventListener('click', (e) => {
  if (e.target === addModal) closeModal();
});


// ==========================================
// 오류 알림 모달
// ==========================================

function showAlert(message, title = '입력 오류') {
  alertTitle.textContent = title;
  alertMessage.textContent = message;
  alertModal.classList.add('active');
  alertConfirmBtn.focus();
}

function closeAlert() {
  alertModal.classList.remove('active');
}

alertConfirmBtn.addEventListener('click', closeAlert);
alertModal.addEventListener('click', (e) => {
  if (e.target === alertModal) closeAlert();
});


// ==========================================
// 4. 커스텀 아이콘 토글
// ==========================================

iconToggle.addEventListener('change', (e) => {
  if (e.target.checked) {
    customIconGroup.classList.remove('hidden');
  } else {
    customIconGroup.classList.add('hidden');
    customIconUrlInput.value = '';
    clearCustomIconUpload();
  }
});

// URL 입력을 사용하면 업로드 이미지 선택은 해제
customIconUrlInput.addEventListener('input', () => {
  if (customIconUrlInput.value.trim()) clearCustomIconUpload();
});

// 파일을 Data URL로 읽기
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('이미지 파일을 읽지 못했습니다.'));
    reader.readAsDataURL(file);
  });
}

// 아이콘 이미지 압축: 최대 256×256, WebP
async function compressIconImage(file) {
  const sourceDataUrl = await readFileAsDataURL(file);

  const image = new Image();
  image.src = sourceDataUrl;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error('이미지 파일을 열 수 없습니다.'));
  });

  const maxDimension = 256;
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('이미지를 처리할 수 없습니다.');
  context.drawImage(image, 0, 0, width, height);

  // WebP 품질을 단계적으로 낮춰 LocalStorage 사용량을 줄임
  for (const quality of [0.82, 0.72, 0.62, 0.52]) {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob) break;
    if (blob.size <= 100 * 1024) return await readFileAsDataURL(blob);
  }

  throw new Error('이미지 용량을 충분히 줄이지 못했습니다. 더 작은 이미지를 선택해주세요.');
}

// 이미지 파일 선택
customIconFileInput.addEventListener('change', async () => {
  const file = customIconFileInput.files?.[0];
  if (!file) return;

  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    clearCustomIconUpload();
    showAlert('PNG, JPG, WEBP 형식의 이미지만 업로드할 수 있습니다.');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    clearCustomIconUpload();
    showAlert('이미지 파일은 5MB 이하만 업로드할 수 있습니다.');
    return;
  }

  try {
    customIconUrlInput.value = '';
    const compressedDataUrl = await compressIconImage(file);
    showCustomIconPreview(compressedDataUrl);
  } catch (error) {
    clearCustomIconUpload();
    showAlert(error.message || '이미지를 처리하지 못했습니다.');
  }
});

// 선택한 업로드 이미지 제거
removeCustomIconFileBtn.addEventListener('click', () => {
  clearCustomIconUpload();
});

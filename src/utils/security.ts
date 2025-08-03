// Network isteklerini gizleme ve medya URL koruması
export const protectMediaUrls = () => {
  // Console metodlarını tamamen devre dışı bırak
  const noop = () => {};

  console.log = noop;
  console.warn = noop;
  console.error = noop;
  console.info = noop;
  console.debug = noop;
  console.trace = noop;
  console.table = noop;
  console.group = noop;
  console.groupEnd = noop;
  console.time = noop;
  console.timeEnd = noop;
  console.count = noop;
  console.assert = noop;

  // Network isteklerini gizle
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    // DevTools açıksa isteği engelle
    if (isDevToolsOpen()) {
      throw new Error('Network access blocked');
    }

    return response;
  };

  // XMLHttpRequest'i override et
  const originalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    const xhr = new originalXHR();

    const originalOpen = xhr.open;
    xhr.open = function(...args) {
      if (isDevToolsOpen()) {
        throw new Error('Network access blocked');
      }
      return originalOpen.apply(this, args);
    };

    return xhr;
  };
};

// DevTools açık mı kontrol et
const isDevToolsOpen = () => {
  const threshold = 160;
  return (
    window.outerHeight - window.innerHeight > threshold ||
    window.outerWidth - window.innerWidth > threshold
  );
};

// DevTools açılma tespiti ve agresif engelleme
export const detectDevTools = () => {
  let devtools = { open: false };

  // Çoklu tespit yöntemi
  const checkDevTools = () => {
    const threshold = 160;

    // Yöntem 1: Pencere boyutu kontrolü
    const heightDiff = window.outerHeight - window.innerHeight;
    const widthDiff = window.outerWidth - window.innerWidth;

    // Yöntem 2: Console.table trick
    let isOpen = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function() {
        isOpen = true;
        throw new Error('DevTools detected');
      }
    });

    try {
      console.log(element);
    } catch (e) {
      isOpen = true;
    }

    // Yöntem 3: Timing attack
    const start = performance.now();
    debugger;
    const end = performance.now();
    const timingCheck = end - start > 100;

    if (heightDiff > threshold || widthDiff > threshold || isOpen || timingCheck) {
      if (!devtools.open) {
        devtools.open = true;

        // Sayfayı yeniden yönlendir
        window.location.href = 'about:blank';

        // Alternatif: Sayfayı kapat
        // window.close();

        // Alternatif: İçeriği gizle
        document.body.style.display = 'none';
        document.body.innerHTML = `
          <div style="
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: #000;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial;
            font-size: 24px;
            z-index: 999999;
          ">
            🔒 Erişim Engellendi<br>
            <small style="font-size: 14px; margin-top: 20px;">
              Geliştirici araçları tespit edildi.<br>
              Lütfen sayfayı yenileyin.
            </small>
          </div>
        `;
      }
    } else {
      devtools.open = false;
    }
  };

  // Her 100ms kontrol et
  setInterval(checkDevTools, 100);

  // Sayfa odağı değiştiğinde kontrol et
  window.addEventListener('focus', checkDevTools);
  window.addEventListener('blur', checkDevTools);
};

// Agresif klavye kısayolları engelleme
export const disableKeyboardShortcuts = () => {
  document.addEventListener('keydown', (e) => {
    // Tüm F tuşları
    const fKeys = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
    if (fKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl kombinasyonları
    if (e.ctrlKey) {
      const blockedKeys = ['I', 'J', 'U', 'S', 'A', 'C', 'V', 'X', 'Z', 'Y', 'F', 'G', 'H', 'P', 'R', 'N', 'T'];
      if (blockedKeys.includes(e.key.toUpperCase())) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift kombinasyonları
      if (e.shiftKey) {
        const shiftBlockedKeys = ['I', 'J', 'C', 'K', 'E', 'R', 'T', 'N', 'P'];
        if (shiftBlockedKeys.includes(e.key.toUpperCase())) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    }

    // Alt kombinasyonları
    if (e.altKey) {
      const altBlockedKeys = ['Tab', 'F4', 'Left', 'Right'];
      if (altBlockedKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Özel tuşlar
    const specialKeys = ['Escape', 'PrintScreen', 'Insert', 'Delete'];
    if (specialKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);
};

// Sağ tık ve diğer etkileşimleri engelle (video oynatıcıyı etkilemeden)
export const disableContextMenu = () => {
  // Sağ tık engelleme (sadece img elementlerinde)
  document.addEventListener('contextmenu', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG' || target.closest('img')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // Drag & Drop engelleme (sadece medya elementlerinde)
  document.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // Seçim engelleme (sadece medya elementlerinde)
  document.addEventListener('selectstart', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG' || target.closest('img')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);

  // Kopyalama engelleme (sadece medya içeriği)
  document.addEventListener('copy', (e) => {
    const selection = window.getSelection();
    if (selection && selection.toString().includes('http')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);
};

// Medya elementlerine ek koruma
export const protectMediaElements = () => {
  // Mevcut medya elementlerini koru
  const protectElement = (element: HTMLImageElement | HTMLVideoElement) => {
    // Sürükleme engelleme
    element.draggable = false;
    element.ondragstart = () => false;

    // Seçim engelleme
    element.style.userSelect = 'none';
    element.style.webkitUserSelect = 'none';

    // Sağ tık engelleme
    element.oncontextmenu = () => false;

    // Video için minimal koruma (sadece indirme engelleme)
    if (element.tagName === 'VIDEO') {
      const video = element as HTMLVideoElement;
      // Sadece indirmeyi engelle, diğer kontrolleri bırak
      if (video.controlsList) {
        video.controlsList.add('nodownload');
      }
      // Sağ tık korumasını kaldır - video kontrollerinin çalışması için
      video.oncontextmenu = null;
    }
  };

  // Mevcut elementleri koru
  document.querySelectorAll('img, video').forEach(protectElement);

  // Yeni eklenen elementleri izle
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.tagName === 'IMG' || element.tagName === 'VIDEO') {
            protectElement(element as HTMLImageElement | HTMLVideoElement);
          }
          element.querySelectorAll('img, video').forEach(protectElement);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

// Tüm koruma önlemlerini başlat
export const initializeMediaProtection = () => {
  protectMediaUrls();
  detectDevTools();
  disableKeyboardShortcuts();
  disableContextMenu();
  protectMediaElements();

  // CSS ile ek koruma
  const style = document.createElement('style');
  style.textContent = `
    img {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-user-drag: none !important;
      -khtml-user-drag: none !important;
      -moz-user-drag: none !important;
      -o-user-drag: none !important;
      user-drag: none !important;
      -webkit-touch-callout: none !important;
    }

    /* Video için minimal koruma - sadece sürükleme engelleme */
    video {
      -webkit-user-drag: none !important;
      -khtml-user-drag: none !important;
      -moz-user-drag: none !important;
      -o-user-drag: none !important;
      user-drag: none !important;
    }

    /* Print engelleme */
    @media print {
      * {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  // Sayfa başlığını normal bırak (değiştirme)
  // document.title değiştirilmedi
};

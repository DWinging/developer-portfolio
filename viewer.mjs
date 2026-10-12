import { getDocument, GlobalWorkerOptions } from './vendor/pdfjs/build/pdf.mjs';
import { EventBus, PDFLinkService, PDFViewer } from './vendor/pdfjs/web/pdf_viewer.mjs';

GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/build/pdf.worker.mjs', import.meta.url).href;

const container = document.getElementById('viewerContainer');
// Preserve the previous PDF width when moving the scrollbar to the document.
function syncScrollbarWidth() {
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;width:100px;height:100px;overflow:scroll;visibility:hidden;pointer-events:none';
  document.body.append(probe);
  document.documentElement.style.setProperty('--scrollbar-width',
    `${probe.offsetWidth - probe.clientWidth}px`);
  probe.remove();
}
syncScrollbarWidth();
window.addEventListener('resize', syncScrollbarWidth);
const status = document.getElementById('status');
const eventBus = new EventBus();
const linkService = new PDFLinkService({
  eventBus,
  externalLinkTarget: 2,
  externalLinkRel: 'noopener noreferrer',
  ignoreDestinationZoom: true,
});
const viewer = new PDFViewer({
  container,
  eventBus,
  linkService,
  imageResourcesPath: new URL('./vendor/pdfjs/web/images/', import.meta.url).href,
  // An unconstrained container lets all 11 pages render in the document flow.
  removePageBorders: true,
  maxCanvasPixels: 8388608,
});
linkService.setViewer(viewer);

eventBus.on('pagesinit', () => {
  viewer.currentScaleValue = 'page-width';
});
let renderFailed = false;
eventBus.on('pagerendered', ({ error }) => {
  container.setAttribute('aria-busy', 'false');
  if (error) {
    renderFailed = true;
    status.textContent = '일부 페이지를 표시하지 못했습니다. 페이지를 새로고침해 주세요.';
    console.error(error);
  }
  status.hidden = !renderFailed;
});

// Refit after rotation or resizing while preserving the viewer's scroll location.
let resizeFrame;
let previousWidth = container.clientWidth;
new ResizeObserver(() => {
  // Page rendering changes height; refit only when the available width changes.
  const width = container.clientWidth;
  if (width === previousWidth) return;
  previousWidth = width;
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => {
    if (viewer.pdfDocument) viewer.currentScaleValue = 'page-width';
  });
}).observe(container);

// Fetch PDF data without navigating to the file or invoking a native PDF plugin.
const loadingTask = getDocument({
  url: new URL('./portfolio.pdf', import.meta.url).href,
  cMapUrl: new URL('./vendor/pdfjs/cmaps/', import.meta.url).href,
  cMapPacked: true,
  standardFontDataUrl: new URL('./vendor/pdfjs/standard_fonts/', import.meta.url).href,
  wasmUrl: new URL('./vendor/pdfjs/wasm/', import.meta.url).href,
  isEvalSupported: false,
});
const pdf = await loadingTask.promise;
linkService.setDocument(pdf);
viewer.setDocument(pdf);

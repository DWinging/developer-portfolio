# Developer Portfolio

`최동욱_portfolio.pdf`를 PDF.js로 웹페이지 안에 표시하는 GitHub Pages용 정적 사이트입니다.

- 11페이지를 세로 스크롤로 탐색하며, 최초 표시와 화면 크기 변경 시 뷰어 너비에 맞춥니다. PC에서는 최대 960px 너비와 좌우 최소 48px 여백을 적용하고, 600px 이하 모바일에서도 좌우 16px 여백을 유지합니다.
- PDF.js의 텍스트 및 주석 레이어로 텍스트 선택과 PDF 하이퍼링크를 지원합니다.
- 우측 상단의 고정된 `PDF 다운로드` 버튼을 클릭하면 기존 PDF를 저장합니다. 최초 접속 시 자동 다운로드는 발생하지 않습니다.
- 뷰어 높이를 제한하지 않아 11페이지를 웹페이지 전체 스크롤로 탐색합니다. 별도의 내부 스크롤바는 없습니다. 기존 페이지 간격과 PDF 표시 너비를 유지하며, 스크롤바 너비는 브라우저에 맞게 보정합니다.
- PDF 원본은 수정하지 않았습니다.

## 배포

`index.html`, `viewer.css`, `viewer.mjs`, `최동욱_portfolio.pdf`, `vendor/`를 함께 GitHub Pages 배포 브랜치에 반영합니다. 빌드나 서버 설정은 필요하지 않습니다. 모든 리소스는 상대 경로를 사용하므로 저장소 이름이 포함된 프로젝트 Pages 경로에서도 동작합니다.

Windows에서는 `start-local.cmd`를 더블클릭한 뒤 `http://localhost:8000`에 접속합니다. 실행한 창은 열어 두세요. Python이 필요합니다. 터미널에서는 저장소 루트에서 `python -m http.server 8000 --bind 127.0.0.1`을 실행해도 됩니다. ES 모듈과 PDF worker를 사용하므로 `index.html`을 더블클릭하여 `file://`로 직접 열면 PDF를 표시할 수 없습니다.

## PDF.js

Mozilla의 [PDF.js](https://mozilla.github.io/pdf.js/) 공식 `pdfjs-dist` **6.4.299** 배포본에서 필요한 런타임 파일을 `vendor/pdfjs/`에 포함했습니다. 외부 CDN에 의존하지 않습니다. 원본 Apache-2.0 라이선스와 글꼴, CMap, WASM의 라이선스 파일을 함께 보존했습니다. 업데이트할 때는 core, worker, viewer, CSS 및 보조 리소스를 동일 버전으로 교체해야 합니다.

## 검증

로컬 Edge에서 1440px 및 390px 화면으로 최초 표시, 11페이지 전체 렌더링, 이중 스크롤 및 가로 넘침 없음, 마지막 페이지까지 문서 스크롤, 다운로드 버튼 고정 위치를 확인했습니다. PDF 링크 8개의 주석 영역 생성과 GitHub 링크의 실제 클릭 동작도 확인했습니다. 버튼 클릭 전 다운로드 이벤트는 없었고, 클릭 후 다운로드된 파일은 원본과 바이트 단위로 일치했습니다. JavaScript 오류는 없었습니다. 모바일 실기기와 실제 GitHub Pages 배포 주소에서의 검증은 포함하지 않습니다.

원본 `최동욱_portfolio.pdf` SHA-256: `C1E9D0365CD3CD36DC7BF10B13CE4D65C061D480CED683561F60A9D3B1C413CB`

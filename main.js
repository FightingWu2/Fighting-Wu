// main.js
// 页面导航与内容加载、markdown渲染、运动记录、图片放大、返回功能等

// 页面栈用于返回功能
let pageStack = [];

// 动态加载页面内容
function loadPage(page, options = {}) {
    pageStack.push(() => loadPage(page, options));
    animateMainContent(() => {
        fetch(page)
            .then(res => res.text())
            .then(html => {
                document.getElementById('main-content').innerHTML = html;
                if (options.onLoad) options.onLoad();
            });
    });
}

// 动画切换主内容
function animateMainContent(callback) {
    const mainContent = document.getElementById('main-content');
    mainContent.style.opacity = '1';
    mainContent.style.transform = 'scale(1)';
    mainContent.style.transition = 'opacity 0.4s, transform 0.4s';
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'scale(0.98)';
    setTimeout(() => {
        callback();
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'scale(1.02)';
        setTimeout(() => {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'scale(1)';
        }, 60);
    }, 300);
}

// 返回上一页
function goBack() {
    if (pageStack.length > 1) {
        pageStack.pop(); // 当前页
        const prev = pageStack.pop();
        prev && prev();
    } else {
        // 无页面栈历史，整页跳转首页，保证首页原貌
        window.location.href = 'index.html';
    }
}

// 渲染返回按钮
function renderBackButton() {
    return `<button onclick="goBack()" class="back-btn"><i class="fa fa-arrow-left"></i></button>`;
}

// markdown渲染（使用marked.js CDN）
function renderMarkdown(md, container) {
    if (!window.marked) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.onload = () => {
            container.innerHTML = '<div class="markdown-body">' + marked.parse(md) + '</div>';
        };
        document.body.appendChild(script);
    } else {
        container.innerHTML = '<div class="markdown-body">' + marked.parse(md) + '</div>';
    }
}

// 图片放大
function showPhotoModal(src, title) {
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <button class="close-btn" title="关闭" onclick="this.parentNode.remove()">×</button>
        <img src="${src}" alt="photo">
        <div class="photo-title">${title}</div>
    `;
    document.body.appendChild(modal);
}

// Sport记录（本地存储）
function addSportRecord(type, date, duration, note) {
    const key = 'sport_' + type;
    const records = JSON.parse(localStorage.getItem(key) || '[]');
    records.push({date, duration, note});
    localStorage.setItem(key, JSON.stringify(records));
}
function getSportRecords(type) {
    const key = 'sport_' + type;
    return JSON.parse(localStorage.getItem(key) || '[]');
}

// 主页导航事件
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('site-title').onclick = () => loadPage('pages/about.html');
    document.getElementById('nav-code').onclick = () => loadPage('pages/code.html');
    document.getElementById('nav-sport').onclick = () => loadPage('pages/sport.html');
    document.getElementById('nav-art').onclick = () => loadPage('pages/art.html');
    document.getElementById('nav-reading').onclick = () => loadPage('pages/books.html');
    document.getElementById('nav-writing').onclick = () => loadPage('pages/writing.html');
});

// 供子页面调用的全局方法
window.renderBackButton = renderBackButton;
window.renderMarkdown = renderMarkdown;
window.showPhotoModal = showPhotoModal;
window.addSportRecord = addSportRecord;
window.getSportRecords = getSportRecords;
window.goBack = goBack;

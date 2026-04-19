document.addEventListener('DOMContentLoaded', function() {
    // ========== 1. 全局配置：所有模块的内容数据 ==========
    const moduleData = {
        '题库学习': {
            title: '题库学习',
            items: []
        },
        '每日一练': {
            title: '每日一练',
            items: []
        },
        '章节测试': {
            title: '章节测试',
            items: []
        },
        '视频讲解': {
            title: '视频讲解',
            items: []
        },
        'AI辅导': {
            title: 'AI辅导',
            content: `
                <ul style="list-style: disc inside; line-height: 1.8;">
                    <li>公式考点系统梳理</li>
                    <li>解题步骤详细讲解</li>
                    <li>薄弱环节分析</li>
                    <li>错题归类强化训练</li>
                </ul>
                <p style="margin-top: 15px; color: #666;">点击下方按钮，即可开启AI智能辅导对话。</p>
                <button style="margin-top:10px; padding: 8px 20px; background: #1677ff; color: #fff; border: none; border-radius: 4px; cursor: pointer;" onclick="alert('AI辅导功能已激活！')">开启AI辅导</button>
            `
        },
        '数学书籍': {
            title: '数学书籍',
            books: [
                { category: '初中', name: '初中数学知识清单' },
                { category: '初中', name: '几何辅助线秘籍' },
                { category: '高中', name: '高中数学基础知识手册' },
                { category: '高中', name: '高考题型与技巧' }
            ]
        },
        '课外阅读': {
            title: '全年龄段课外阅读',
            books: [
                { category: '小学故事', name: '夏洛的网' },
                { category: '小学故事', name: '小王子' },
                { category: '小学故事', name: '草房子' },
                { category: '初中文学', name: '朝花夕拾' },
                { category: '初中文学', name: '钢铁是怎样炼成的' },
                { category: '人物传记', name: '苏东坡传' },
                { category: '人物传记', name: '居里夫人传' },
                { category: '人物传记', name: '毛泽东传' }
            ]
        },
        '错题本': {
            title: '错题本',
            items: []
        },
        '作业上传': {
            title: '作业上传',
            items: []
        },
        '留言板': {
            title: '留言板',
            items: []
        },
        '统计': {
            title: '统计',
            items: []
        }
    };

    // ========== 2. 核心功能：标签切换修复 ==========
    const tabs = document.querySelectorAll('[data-tab]');
    const mainContent = document.getElementById('main-content'); // 你的页面主内容容器

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');

            // 切换标签高亮状态
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // 渲染对应模块内容
            renderModuleContent(targetTab);
        });
    });

    // ========== 3. 内容渲染函数（解决空白/加载失败问题） ==========
    function renderModuleContent(tabName) {
        const module = moduleData[tabName];
        if (!module || !mainContent) return;

        // 清空原有内容
        mainContent.innerHTML = '';

        // 渲染标题
        const titleEl = document.createElement('h3');
        titleEl.className = 'module-title';
        titleEl.textContent = module.title;
        mainContent.appendChild(titleEl);

        // 分支渲染不同类型的模块
        if (tabName === 'AI辅导') {
            // 渲染AI辅导内容
            const contentEl = document.createElement('div');
            contentEl.className = 'ai-tutor-content';
            contentEl.innerHTML = module.content;
            mainContent.appendChild(contentEl);
        } else if (module.books) {
            // 渲染书籍列表（课外阅读/数学书籍）
            const bookListEl = document.createElement('div');
            bookListEl.className = 'book-list';

            // 按分类分组渲染
            const categories = [...new Set(module.books.map(b => b.category))];
            categories.forEach(cat => {
                // 分类标题
                const catEl = document.createElement('div');
                catEl.className = 'book-category';
                catEl.textContent = cat;
                bookListEl.appendChild(catEl);

                // 书籍项
                module.books.filter(b => b.category === cat).forEach(book => {
                    const bookEl = document.createElement('div');
                    bookEl.className = 'book-item';
                    bookEl.textContent = book.name;
                    // 书籍点击事件
                    bookEl.addEventListener('click', function() {
                        alert(`已打开：${book.name}\n（如需对接阅读功能，可在此添加跳转链接）`);
                    });
                    bookListEl.appendChild(bookEl);
                });
            });

            mainContent.appendChild(bookListEl);
        } else {
            // 其他空模块（可后续扩展内容）
            const placeholderEl = document.createElement('div');
            placeholderEl.className = 'placeholder-content';
            placeholderEl.textContent = `${tabName}模块内容加载中，敬请期待...`;
            mainContent.appendChild(placeholderEl);
        }
    }

    // ========== 4. 页面初始化：加载默认激活的标签 ==========
    const activeTab = document.querySelector('[data-tab].active');
    if (activeTab) {
        const defaultTab = activeTab.getAttribute('data-tab');
        renderModuleContent(defaultTab);
    }

    // ========== 5. 强制修复：缓存/后退导致的渲染问题 ==========
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            const activeTab = document.querySelector('[data-tab].active');
            if (activeTab) {
                renderModuleContent(activeTab.getAttribute('data-tab'));
            }
        }
    });
});

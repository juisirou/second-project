// ========================================
// ハンバーガーメニューの開閉制御
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navOverlay = document.querySelector('.nav-overlay');
    const navClose = document.querySelector('.nav-close');
    
    if (hamburger && navOverlay) {
        // ハンバーガーボタンをクリックでメニューを開く
        hamburger.addEventListener('click', function() {
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // スクロール防止
        });
        
        // 閉じるボタンをクリックでメニューを閉じる
        if (navClose) {
            navClose.addEventListener('click', function() {
                navOverlay.classList.remove('active');
                document.body.style.overflow = ''; // スクロール復活
            });
        }
        
        // オーバーレイの背景をクリックでメニューを閉じる
        navOverlay.addEventListener('click', function(e) {
            if (e.target === navOverlay) {
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // アニメーション機能の初期化
    // ========================================
    initAnimations();
    
    // ========================================
    // 検索・絞り込み機能の初期化
    // ========================================
    initSearchAndFilter();
    
    // ========================================
    // テーブル行クリック機能の初期化
    // ========================================
    initTableRowClick();
    
    // ========================================
    // お問い合わせフォーム自動入力の初期化
    // ========================================
    initContactFormAutoFill();
});

// ========================================
// アニメーション初期化メイン関数
// ========================================
function initAnimations() {
    // アクセシビリティ: ユーザーが視差効果を減らす設定をしている場合はアニメーションを無効化
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        initScrollAnimations();
        initParallaxEffect();
        initHoverAnimations();
        initFormAnimations();
        initTableAnimations();
        initSmoothScroll();
        initScrollProgress();
    }
    
    // ページロードアニメーションは常に実行（軽量）
    initPageLoadAnimation();
}

// ========================================
// スクロールアニメーション (IntersectionObserver)
// ========================================
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('[data-animation]');
    
    if (animateElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || index * 100;
                
                setTimeout(() => {
                    entry.target.classList.add('animate-visible');
                }, delay);
                
                // 一度アニメーションしたら監視を解除（パフォーマンス向上）
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

// ========================================
// パララックス効果
// ========================================
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// ========================================
// ホバーアニメーション（カード3Dチルト効果）
// ========================================
function initHoverAnimations() {
    const cards = document.querySelectorAll('.product-card, .news-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ========================================
// フォーム入力アニメーション
// ========================================
function initFormAnimations() {
    const formInputs = document.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    formInputs.forEach(input => {
        // フォーカス時のアニメーション
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('form-focused');
            
            // ラベルのアニメーション
            const label = this.parentElement.querySelector('.form-label');
            if (label) {
                label.style.transform = 'translateY(-5px)';
                label.style.transition = 'transform 0.3s ease';
            }
        });
        
        // フォーカスアウト時
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('form-focused');
            
            const label = this.parentElement.querySelector('.form-label');
            if (label && !this.value) {
                label.style.transform = 'translateY(0)';
            }
        });
        
        // 入力時のフィードバック
        input.addEventListener('input', function() {
            if (this.value) {
                this.parentElement.classList.add('form-filled');
            } else {
                this.parentElement.classList.remove('form-filled');
            }
        });
    });
    
    // 送信ボタンのアニメーション
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            // 実際の送信処理はここでは実装しない（既存の処理を維持）
            this.classList.add('button-loading');
            
            setTimeout(() => {
                this.classList.remove('button-loading');
            }, 2000);
        });
    }
}

// ========================================
// テーブル行アニメーション（製品一覧）
// ========================================
function initTableAnimations() {
    const tableRows = document.querySelectorAll('.chip-table tbody tr');
    
    if (tableRows.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const rows = Array.from(tableRows);
                const index = rows.indexOf(entry.target);
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 30); // スタッガードアニメーション
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        row.style.transition = `opacity 0.5s ease ${index * 0.03}s, transform 0.5s ease ${index * 0.03}s`;
        observer.observe(row);
    });
    
    // ホバーアニメーション
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
            this.style.transform = 'translateX(0) scale(1.01)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
}

// ========================================
// スムーズスクロール
// ========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 空のハッシュや外部リンクは除外
            if (href === '#' || href.startsWith('http')) return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 80; // ヘッダーの高さ
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// スクロール進捗バー
// ========================================
function initScrollProgress() {
    // 進捗バー要素を作成
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
    
    let ticking = false;
    
    const updateProgress = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = `${scrollPercent}%`;
        
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateProgress);
            ticking = true;
        }
    });
    
    // 初期値設定
    updateProgress();
}

// ========================================
// ページロードアニメーション
// ========================================
function initPageLoadAnimation() {
    // ページ全体のフェードイン
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // ヘッダーのアニメーション
    const header = document.querySelector('.header');
    if (header) {
        header.style.transform = 'translateY(-100%)';
        header.style.transition = 'transform 0.6s ease';
        
        setTimeout(() => {
            header.style.transform = 'translateY(0)';
        }, 300);
    }
}

// ========================================
// ユーティリティ関数
// ========================================

// スロットル関数（パフォーマンス最適化）
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// デバウンス関数（パフォーマンス最適化）
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// 検索・絞り込み機能
// ========================================
function initSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const filterSize = document.getElementById('filterSize');
    const filterAngle = document.getElementById('filterAngle');
    const filterMaterial = document.getElementById('filterMaterial');
    const filterUsage = document.getElementById('filterUsage');
    const resultCount = document.getElementById('resultCount');
    const table = document.querySelector('.chip-table');
    
    if (!table) {
        console.log('テーブルが見つかりません');
        return;
    }
    
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    if (rows.length === 0) {
        console.log('テーブルの行が見つかりません');
        return;
    }
    
    console.log(`検索・絞り込み機能を初期化しました。行数: ${rows.length}`);
    
    // 検索・フィルター実行関数
    function filterTable() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const sizeFilter = filterSize ? filterSize.value : '';
        const angleFilter = filterAngle ? filterAngle.value : '';
        const materialFilterValue = filterMaterial ? filterMaterial.value : '';
        const usageFilterValue = filterUsage ? filterUsage.value : '';
        
        let visibleCount = 0;
        
        rows.forEach((row, index) => {
            const cells = Array.from(row.querySelectorAll('td'));
            if (cells.length === 0) return;
            
            // 各セルのテキストを取得
            const rowText = cells.map(cell => {
                // ツールチップ内のテキストは除外
                const tooltip = cell.querySelector('.chip-tooltip');
                if (tooltip) {
                    const clone = cell.cloneNode(true);
                    const tooltipEl = clone.querySelector('.chip-tooltip');
                    if (tooltipEl) tooltipEl.remove();
                    return clone.textContent.trim();
                }
                return cell.textContent.trim();
            }).join(' ').toLowerCase();
            
            // 検索条件チェック
            const matchesSearch = !searchTerm || rowText.includes(searchTerm);
            
            // フィルター条件チェック
            let matchesFilters = true;
            
            if (sizeFilter && cells.length > 1) {
                const sizeCell = cells[1]; // サイズ列
                const sizeText = sizeCell ? sizeCell.textContent.trim() : '';
                matchesFilters = matchesFilters && sizeText === sizeFilter;
            }
            
            if (angleFilter && cells.length > 2) {
                const angleCell = cells[2]; // 角度列
                const angleText = angleCell ? angleCell.textContent.trim() : '';
                matchesFilters = matchesFilters && angleText === angleFilter;
            }
            
            if (materialFilterValue && cells.length > 3) {
                const materialCell = cells[3]; // 材質列（hyou.html）
                const materialText = materialCell ? materialCell.textContent.trim() : '';
                matchesFilters = matchesFilters && materialText === materialFilterValue;
            }
            
            if (usageFilterValue && cells.length > 3) {
                const usageCell = cells[3]; // 用途列（holder.html）
                const usageText = usageCell ? usageCell.textContent.trim() : '';
                matchesFilters = matchesFilters && usageText === usageFilterValue;
            }
            
            // 表示/非表示の切り替え
            if (matchesSearch && matchesFilters) {
                row.style.display = '';
                row.classList.remove('hidden');
                visibleCount++;
            } else {
                row.style.display = 'none';
                row.classList.add('hidden');
            }
        });
        
        // 結果数の表示
        if (resultCount) {
            resultCount.textContent = `${visibleCount}件表示 / 全${rows.length}件`;
        }
        
        // クリアボタンの表示/非表示
        if (clearSearchBtn) {
            if (searchTerm || sizeFilter || angleFilter || materialFilterValue || usageFilterValue) {
                clearSearchBtn.style.display = 'block';
            } else {
                clearSearchBtn.style.display = 'none';
            }
        }
    }
    
    // イベントリスナーの設定
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterTable, 300));
    }
    
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (filterSize) filterSize.value = '';
            if (filterAngle) filterAngle.value = '';
            if (filterMaterial) filterMaterial.value = '';
            if (filterUsage) filterUsage.value = '';
            filterTable();
        });
    }
    
    if (filterSize) {
        filterSize.addEventListener('change', filterTable);
    }
    
    if (filterAngle) {
        filterAngle.addEventListener('change', filterTable);
    }
    
    if (filterMaterial) {
        filterMaterial.addEventListener('change', filterTable);
    }
    
    if (filterUsage) {
        filterUsage.addEventListener('change', filterTable);
    }
    
    // 初期表示
    filterTable();
}

// ========================================
// テーブル行クリックでお問い合わせページに遷移
// ========================================
function initTableRowClick() {
    const tableRows = document.querySelectorAll('.chip-table tbody tr');
    
    tableRows.forEach(row => {
        // クリック可能なスタイルを追加
        row.style.cursor = 'pointer';
        
        row.addEventListener('click', function(e) {
            // 画像やリンクなどの子要素をクリックした場合は除外
            if (e.target.tagName === 'IMG' || e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            const cells = Array.from(this.querySelectorAll('td'));
            if (cells.length === 0) return;
            
            // 型番を取得（最初のセル）
            const productCode = cells[0] ? cells[0].textContent.trim() : '';
            
            // その他の情報を取得
            let productInfo = '';
            if (cells.length > 1) {
                const size = cells[1] ? cells[1].textContent.trim() : '';
                const angle = cells.length > 2 && cells[2] ? cells[2].textContent.trim() : '';
                const material = cells.length > 3 && cells[3] ? cells[3].textContent.trim() : '';
                const usage = cells.length > 4 && cells[4] ? cells[4].textContent.trim() : '';
                const price = cells.length > 0 && cells[cells.length - 1] ? cells[cells.length - 1].textContent.trim() : '';
                
                // お問い合わせ内容のテキストを生成
                productInfo = `製品についてお問い合わせがあります。\n\n`;
                productInfo += `型番: ${productCode}\n`;
                if (size) productInfo += `サイズ: ${size}\n`;
                if (angle) productInfo += `角度: ${angle}\n`;
                if (material) productInfo += `材質: ${material}\n`;
                if (usage && usage !== material && !usage.includes('..')) productInfo += `用途: ${usage}\n`;
                if (price && price.startsWith('¥')) productInfo += `価格: ${price}\n`;
            }
            
            // URLパラメータでお問い合わせページに遷移
            const params = new URLSearchParams();
            params.set('product', productCode);
            if (productInfo) {
                params.set('message', encodeURIComponent(productInfo));
            }
            
            window.location.href = `toiawase.html?${params.toString()}`;
        });
        
        // ホバー時の視覚的フィードバック
        row.addEventListener('mouseenter', function() {
            if (!this.style.backgroundColor || this.style.backgroundColor === '') {
                this.style.transition = 'background-color 0.2s ease';
            }
        });
    });
}

// ========================================
// お問い合わせページでURLパラメータから自動入力
// ========================================
function initContactFormAutoFill() {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');
    const message = urlParams.get('message');
    
    if (message) {
        const messageTextarea = document.getElementById('message');
        if (messageTextarea) {
            // 既存の内容がある場合は追加、ない場合は設定
            if (messageTextarea.value) {
                messageTextarea.value = messageTextarea.value + '\n\n' + decodeURIComponent(message);
            } else {
                messageTextarea.value = decodeURIComponent(message);
            }
        }
    }
    
    if (product) {
        // お問い合わせ種類を「見積もり依頼」に設定
        const inquiryType = document.getElementById('inquiry-type');
        if (inquiryType) {
            inquiryType.value = 'quotation';
        }
    }
}

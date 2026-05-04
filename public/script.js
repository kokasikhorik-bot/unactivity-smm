// Навигация между страницами
document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`${page}-page`).classList.add('active');
    });
});

// Форматирование пинкода с дефисами
function formatPincode(input) {
    let value = input.value.replace(/[^A-Z0-9]/g, '');
    let formatted = '';
    for (let i = 0; i < value.length && i < 16; i++) {
        if (i > 0 && i % 4 === 0) formatted += '-';
        formatted += value[i];
    }
    input.value = formatted;
}

document.getElementById('pincode-input').addEventListener('input', (e) => {
    formatPincode(e.target);
});

document.getElementById('status-pincode-input').addEventListener('input', (e) => {
    formatPincode(e.target);
});

// Проверка пинкода
document.getElementById('verify-btn').addEventListener('click', async () => {
    const pincode = document.getElementById('pincode-input').value.replace(/-/g, '');
    const errorDiv = document.getElementById('pincode-error');
    
    if (pincode.length !== 16) {
        showError(errorDiv, 'Введите корректный пинкод');
        return;
    }
    
    try {
        const response = await fetch('/api/verify-pincode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pincode })
        });
        
        const data = await response.json();
        
        if (data.valid) {
            document.getElementById('order-form').style.display = 'block';
            
            // Отображение доступных услуг
            const servicesHtml = data.services.map(s => `
                <div class="service-option" data-service-id="${s.serviceId}">
                    <h4>${s.serviceName}</h4>
                    <p>${s.description || 'Количество: ' + s.quantity}</p>
                </div>
            `).join('');
            
            document.getElementById('service-name').innerHTML = 'Выберите услугу:';
            document.getElementById('service-description').innerHTML = servicesHtml;
            
            // Обработка выбора услуги
            document.querySelectorAll('.service-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.service-option').forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                    
                    const serviceId = option.dataset.serviceId;
                    const service = data.services.find(s => s.serviceId === serviceId);
                    
                    document.getElementById('available-quantity').textContent = service.quantity;
                    document.getElementById('quantity-input').value = service.quantity;
                    document.getElementById('quantity-input').max = service.quantity;
                    document.getElementById('quantity-input').dataset.serviceId = serviceId;
                });
            });
            
            errorDiv.style.display = 'none';
        } else {
            showError(errorDiv, data.message);
        }
    } catch (error) {
        showError(errorDiv, 'Ошибка соединения с сервером');
    }
});

// Создание заказа
document.getElementById('submit-order-btn').addEventListener('click', async () => {
    const pincode = document.getElementById('pincode-input').value.replace(/-/g, '');
    const link = document.getElementById('link-input').value;
    const quantity = document.getElementById('quantity-input').value;
    const serviceId = document.getElementById('quantity-input').dataset.serviceId;
    const errorDiv = document.getElementById('order-error');
    
    if (!serviceId) {
        showError(errorDiv, 'Выберите услугу');
        return;
    }
    
    if (!link) {
        showError(errorDiv, 'Введите ссылку');
        return;
    }
    
    if (!quantity || quantity <= 0) {
        showError(errorDiv, 'Введите корректное количество');
        return;
    }
    
    try {
        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pincode, serviceId, link, quantity })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('order-form').style.display = 'none';
            document.getElementById('order-result').style.display = 'block';
            document.getElementById('result-order-id').textContent = data.orderId;
        } else {
            showError(errorDiv, data.error || 'Ошибка создания заказа');
        }
    } catch (error) {
        showError(errorDiv, 'Ошибка соединения с сервером');
    }
});

// Проверка статуса
document.getElementById('check-status-btn').addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector('.nav-link[data-page="status"]').classList.add('active');
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('status-page').classList.add('active');
    
    const pincode = document.getElementById('pincode-input').value;
    document.getElementById('status-pincode-input').value = pincode;
    loadOrdersByPincode(pincode.replace(/-/g, ''));
});

// Загрузка заказов по пинкоду
document.getElementById('check-orders-btn').addEventListener('click', async () => {
    const pincode = document.getElementById('status-pincode-input').value.replace(/-/g, '');
    loadOrdersByPincode(pincode);
});

async function loadOrdersByPincode(pincode) {
    if (pincode.length !== 16) return;
    
    try {
        const response = await fetch(`/api/orders-by-pincode/${pincode}`);
        const orders = await response.json();
        
        const container = document.getElementById('orders-list');
        
        if (orders.length === 0) {
            container.innerHTML = '<div class="card"><p style="text-align: center;">Заказы не найдены</p></div>';
            return;
        }
        
        // Обновляем статусы
        for (let order of orders) {
            try {
                const statusResponse = await fetch(`/api/order-status/${order.orderId}`);
                const statusData = await statusResponse.json();
                order.status = statusData.status;
                order.charge = statusData.charge;
                order.start_count = statusData.start_count;
                order.remains = statusData.remains;
            } catch (e) {
                console.error('Ошибка получения статуса:', e);
            }
        }
        
        container.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id">Заказ #${order.orderId}</div>
                    <div class="status-badge status-${order.status.toLowerCase().replace(' ', '-')}">${getStatusText(order.status)}</div>
                </div>
                <div class="order-info">
                    <div class="info-item">
                        <span class="info-label">Услуга:</span>
                        <span class="info-value">${order.serviceName}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Ссылка:</span>
                        <span class="info-value">${order.link}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Количество:</span>
                        <span class="info-value">${order.quantity}</span>
                    </div>
                    ${order.remains !== undefined ? `
                    <div class="info-item">
                        <span class="info-label">Осталось:</span>
                        <span class="info-value">${order.remains}</span>
                    </div>
                    ` : ''}
                    <div class="info-item">
                        <span class="info-label">Дата создания:</span>
                        <span class="info-value">${new Date(order.createdAt).toLocaleString('ru-RU')}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
    }
}

function getStatusText(status) {
    const statusMap = {
        'Awaiting': 'Ожидание',
        'In progress': 'В процессе',
        'Completed': 'Завершен',
        'Partial': 'Частично',
        'Canceled': 'Отменен',
        'Fail': 'Ошибка'
    };
    return statusMap[status] || status;
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => element.classList.remove('show'), 5000);
}

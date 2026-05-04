const { ipcRenderer } = require('electron');

let config = {};
let services = [];

// Загрузка конфигурации при старте
(async () => {
  config = await ipcRenderer.invoke('load-config');
  document.getElementById('project-path').value = config.projectPath || '';
  document.getElementById('api-key').value = config.apiKey || '';
  document.getElementById('github-repo').value = config.githubRepo || '';
  document.getElementById('github-token').value = config.githubToken || '';
  
  if (config.apiKey) {
    await loadServices();
  }
})();

// Навигация по табам
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(`${tab}-tab`).classList.add('active');
    
    if (tab === 'pincodes') loadPincodes();
    if (tab === 'orders') loadOrders();
  });
});

// Настройки
document.getElementById('settings-btn').addEventListener('click', () => {
  document.getElementById('settings-modal').classList.add('show');
});

document.getElementById('close-settings-btn').addEventListener('click', () => {
  document.getElementById('settings-modal').classList.remove('show');
});

document.getElementById('save-settings-btn').addEventListener('click', async () => {
  config = {
    projectPath: document.getElementById('project-path').value,
    apiKey: document.getElementById('api-key').value,
    githubRepo: document.getElementById('github-repo').value,
    githubToken: document.getElementById('github-token').value
  };
  
  await ipcRenderer.invoke('save-config', config);
  document.getElementById('settings-modal').classList.remove('show');
  
  if (config.apiKey) {
    await loadServices();
  }
  
  alert('Настройки сохранены!');
});

// Загрузка услуг
async function loadServices() {
  if (!config.apiKey) {
    console.log('API ключ не настроен');
    return;
  }
  
  try {
    const result = await ipcRenderer.invoke('load-services', config.apiKey);
    
    if (result.success && Array.isArray(result.services)) {
      services = result.services;
      updateServiceSelects();
      console.log('Загружено услуг:', services.length);
    } else {
      console.error('Ошибка загрузки услуг:', result.error);
      alert('Ошибка загрузки услуг: ' + (result.error || 'Неизвестная ошибка'));
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Ошибка загрузки услуг: ' + error.message);
  }
}

function updateServiceSelects() {
  const selects = document.querySelectorAll('.service-select');
  selects.forEach(select => {
    select.innerHTML = '<option value="">Выберите услугу</option>' + 
      services.map(s => `
        <option value="${s.service}" data-name="${s.name}" data-min="${s.min}" data-max="${s.max}">
          ${s.name} (${s.rate} USD, ${s.min}-${s.max})
        </option>
      `).join('');
  });
}

// Добавление услуги
document.getElementById('add-service-btn').addEventListener('click', () => {
  const container = document.getElementById('services-container');
  const serviceItem = document.createElement('div');
  serviceItem.className = 'service-item';
  serviceItem.innerHTML = `
    <div class="form-group">
      <label>Услуга:</label>
      <select class="service-select input">
        <option value="">Выберите услугу</option>
      </select>
    </div>
    <div class="form-group">
      <label>Количество:</label>
      <input type="number" class="service-quantity input" placeholder="1000">
    </div>
    <div class="form-group">
      <label>Описание:</label>
      <input type="text" class="service-description input" placeholder="Опционально">
    </div>
    <button class="btn btn-danger remove-service-btn">Удалить</button>
  `;
  
  container.appendChild(serviceItem);
  updateServiceSelects();
  
  serviceItem.querySelector('.remove-service-btn').addEventListener('click', () => {
    serviceItem.remove();
  });
});

// Генерация пинкода
document.getElementById('generate-pincode-btn').addEventListener('click', async () => {
  if (!config.projectPath) {
    alert('Укажите путь к проекту в настройках!');
    return;
  }
  
  const serviceItems = document.querySelectorAll('.service-item');
  const servicesData = [];
  
  for (let item of serviceItems) {
    const select = item.querySelector('.service-select');
    const serviceId = select.value;
    const serviceName = select.options[select.selectedIndex]?.dataset.name;
    const quantity = item.querySelector('.service-quantity').value;
    const description = item.querySelector('.service-description').value;
    
    if (serviceId && quantity) {
      servicesData.push({ serviceId, serviceName, quantity, description });
    }
  }
  
  if (servicesData.length === 0) {
    alert('Добавьте хотя бы одну услугу!');
    return;
  }
  
  if (servicesData.length > 3) {
    alert('Максимум 3 услуги на один пинкод!');
    return;
  }
  
  const result = await ipcRenderer.invoke('create-pincode', {
    projectPath: config.projectPath,
    services: servicesData
  });
  
  if (result.success) {
    const formatted = result.pincode.match(/.{1,4}/g).join('-');
    document.getElementById('pincode-display').textContent = formatted;
    document.getElementById('result-container').style.display = 'block';
    
    // АВТОМАТИЧЕСКИЙ ПУШ В GITHUB ПОСЛЕ СОЗДАНИЯ ПИНКОДА
    if (config.githubRepo && config.githubToken) {
      console.log('Автоматический пуш в GitHub...');
      const pushResult = await ipcRenderer.invoke('git-push', {
        projectPath: config.projectPath,
        message: `Add pincode ${result.pincode}`,
        githubToken: config.githubToken,
        githubRepo: config.githubRepo
      });
      
      if (pushResult.success) {
        console.log('✅ Автоматически загружено на GitHub!');
        alert('✅ Пинкод создан и автоматически загружен на GitHub!');
      } else {
        console.error('Ошибка автопуша:', pushResult.error);
        alert('⚠️ Пинкод создан, но не удалось загрузить на GitHub: ' + pushResult.error);
      }
    } else {
      alert('✅ Пинкод создан! (Настройте GitHub для автопуша)');
    }
  } else {
    alert('Ошибка создания пинкода: ' + result.error);
  }
});

// Копирование пинкода
document.getElementById('copy-pincode-btn').addEventListener('click', () => {
  const pincode = document.getElementById('pincode-display').textContent;
  navigator.clipboard.writeText(pincode);
  alert('Пинкод скопирован!');
});

// Пуш в GitHub
document.getElementById('push-github-btn').addEventListener('click', async () => {
  if (!config.githubRepo) {
    alert('Настройте GitHub Repository URL в настройках!');
    return;
  }
  
  const result = await ipcRenderer.invoke('git-push', {
    projectPath: config.projectPath,
    message: 'Add new pincode',
    githubToken: config.githubToken,
    githubRepo: config.githubRepo
  });
  
  if (result.success) {
    alert('Успешно залито на GitHub!');
  } else {
    alert('Ошибка: ' + result.error);
  }
});

// Загрузка пинкодов
document.getElementById('refresh-pincodes-btn').addEventListener('click', loadPincodes);

async function loadPincodes() {
  if (!config.projectPath) {
    alert('Укажите путь к проекту в настройках!');
    return;
  }
  
  const result = await ipcRenderer.invoke('load-pincodes', config.projectPath);
  
  if (result.success) {
    const container = document.getElementById('pincodes-list');
    
    if (result.pincodes.length === 0) {
      container.innerHTML = '<p>Пинкоды не найдены</p>';
      return;
    }
    
    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Пинкод</th>
            <th>Услуги</th>
            <th>Дата создания</th>
          </tr>
        </thead>
        <tbody>
          ${result.pincodes.map(pin => `
            <tr>
              <td><code>${pin.pincode.match(/.{1,4}/g).join('-')}</code></td>
              <td>
                ${pin.services.map(s => `
                  <div>
                    ${s.serviceName} (${s.quantity}) 
                    <span class="status-badge ${s.used ? 'status-used' : 'status-active'}">
                      ${s.used ? 'Использовано' : 'Активно'}
                    </span>
                  </div>
                `).join('')}
              </td>
              <td>${new Date(pin.createdAt).toLocaleString('ru-RU')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else {
    alert('Ошибка загрузки пинкодов: ' + result.error);
  }
}

// Загрузка заказов
document.getElementById('refresh-orders-btn').addEventListener('click', loadOrders);

async function loadOrders() {
  if (!config.projectPath) {
    alert('Укажите путь к проекту в настройках!');
    return;
  }
  
  const result = await ipcRenderer.invoke('load-orders', config.projectPath);
  
  if (result.success) {
    const container = document.getElementById('orders-list');
    
    if (result.orders.length === 0) {
      container.innerHTML = '<p>Заказы не найдены</p>';
      return;
    }
    
    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Пинкод</th>
            <th>Услуга</th>
            <th>Ссылка</th>
            <th>Количество</th>
            <th>Статус</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          ${result.orders.map(order => `
            <tr>
              <td>${order.orderId}</td>
              <td><code>${order.pincode.match(/.{1,4}/g).join('-')}</code></td>
              <td>${order.serviceName}</td>
              <td><a href="${order.link}" style="color: #38ef7d;">${order.link.substring(0, 30)}...</a></td>
              <td>${order.quantity}</td>
              <td>${order.status}</td>
              <td>${new Date(order.createdAt).toLocaleString('ru-RU')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else {
    alert('Ошибка загрузки заказов: ' + result.error);
  }
}

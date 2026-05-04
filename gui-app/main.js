const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const simpleGit = require('simple-git');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools(); // Для отладки
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Загрузка конфигурации
ipcMain.handle('load-config', async () => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  const defaultPath = path.join(__dirname, '..');
  const defaultConfig = { 
    projectPath: defaultPath, 
    apiKey: 'zhLKUyf12DwMSsuStEfI9eo99AwvdBEL7pDZ9Fv8CnoUzxGUP7CiuhwdWPSR', 
    githubRepo: 'https://github.com/kokasikhorik-bot/unactivity-smm.git',
    githubToken: '' // Пользователь должен ввести свой токен
  };
  
  if (fs.existsSync(configPath)) {
    const savedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    // Объединяем с дефолтными значениями (дефолты заполняют пустые поля)
    return {
      projectPath: savedConfig.projectPath || defaultConfig.projectPath,
      apiKey: savedConfig.apiKey || defaultConfig.apiKey,
      githubRepo: savedConfig.githubRepo || defaultConfig.githubRepo,
      githubToken: savedConfig.githubToken || defaultConfig.githubToken
    };
  }
  
  // Если файла нет - сохраняем дефолтную конфигурацию
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  return defaultConfig;
});

// Сохранение конфигурации
ipcMain.handle('save-config', async (event, config) => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return { success: true };
});

// ПРЯМАЯ загрузка услуг из OPTSMM API
ipcMain.handle('load-services', async (event, apiKey) => {
  try {
    console.log('🔄 Загрузка услуг напрямую из OPTSMM API...');
    console.log('API ключ:', apiKey ? apiKey.substring(0, 15) + '...' : 'НЕТ');
    
    const url = `https://optsmm.ru/api/v2?action=services&key=${apiKey}`;
    console.log('URL:', url.substring(0, 60) + '...');
    
    const response = await axios.get(url, {
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    console.log('✅ Ответ получен, статус:', response.status);
    console.log('Тип данных:', typeof response.data);
    console.log('Это массив?', Array.isArray(response.data));
    
    if (Array.isArray(response.data)) {
      console.log('✅ Загружено услуг:', response.data.length);
      return { success: true, services: response.data };
    } else {
      console.log('❌ Данные не массив:', response.data);
      return { success: false, error: 'API вернул не массив: ' + JSON.stringify(response.data).substring(0, 100) };
    }
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    if (error.response) {
      console.error('Статус:', error.response.status);
      console.error('Данные:', error.response.data);
    }
    return { success: false, error: error.message };
  }
});

// Создание пинкода
ipcMain.handle('create-pincode', async (event, { projectPath, services }) => {
  try {
    const dbPath = path.join(projectPath, 'database.json');
    
    let database = { pincodes: {}, orders: {} };
    if (fs.existsSync(dbPath)) {
      database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pincode = '';
    do {
      pincode = '';
      for (let i = 0; i < 16; i++) {
        pincode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (database.pincodes[pincode]);
    
    database.pincodes[pincode] = {
      pincode,
      services: services.map(s => ({
        serviceId: s.serviceId,
        serviceName: s.serviceName,
        quantity: s.quantity,
        description: s.description,
        used: false
      })),
      createdAt: new Date().toISOString()
    };
    
    fs.writeFileSync(dbPath, JSON.stringify(database, null, 2));
    
    return { success: true, pincode, data: database.pincodes[pincode] };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Загрузка пинкодов
ipcMain.handle('load-pincodes', async (event, projectPath) => {
  try {
    const dbPath = path.join(projectPath, 'database.json');
    if (!fs.existsSync(dbPath)) {
      return { success: true, pincodes: [] };
    }
    
    const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return { success: true, pincodes: Object.values(database.pincodes) };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Загрузка заказов
ipcMain.handle('load-orders', async (event, projectPath) => {
  try {
    const dbPath = path.join(projectPath, 'database.json');
    if (!fs.existsSync(dbPath)) {
      return { success: true, orders: [] };
    }
    
    const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    return { success: true, orders: Object.values(database.orders) };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Git push
ipcMain.handle('git-push', async (event, { projectPath, message, githubToken, githubRepo }) => {
  try {
    const git = simpleGit(projectPath);
    
    if (githubToken && githubRepo) {
      const repoUrl = githubRepo.replace('https://', `https://${githubToken}@`);
      try {
        await git.removeRemote('origin');
      } catch (e) {}
      await git.addRemote('origin', repoUrl);
    }
    
    await git.add('database.json');
    await git.commit(message || 'Update database');
    await git.push('origin', 'main');
    
    return { success: true };
  } catch (error) {
    console.error('Git error:', error);
    return { success: false, error: error.message };
  }
});

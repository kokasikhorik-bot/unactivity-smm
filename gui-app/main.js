const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const simpleGit = require('simple-git');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'icon.png')
  });

  mainWindow.loadFile('index.html');
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
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  // Путь по умолчанию - родительская папка от gui-app
  const defaultPath = path.join(__dirname, '..');
  return { 
    projectPath: defaultPath, 
    apiKey: 'zhLKUyf12DwMSsuStEfI9eo99AwvdBEL7pDZ9Fv8CnoUzxGUP7CiuhwdWPSR', 
    githubRepo: 'https://github.com/kokasikhorik-bot/unactivity-smm.git',
    githubToken: ''
  };
});

// Сохранение конфигурации
ipcMain.handle('save-config', async (event, config) => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return { success: true };
});

// Загрузка услуг из OPTSMM
ipcMain.handle('load-services', async (event, apiKey) => {
  try {
    console.log('Загрузка услуг с API ключом:', apiKey.substring(0, 10) + '...');
    const response = await axios.get(`https://optsmm.ru/api/v2`, {
      params: {
        action: 'services',
        key: apiKey
      },
      timeout: 10000
    });
    
    console.log('Ответ получен, услуг:', Array.isArray(response.data) ? response.data.length : 'не массив');
    
    if (Array.isArray(response.data)) {
      return { success: true, services: response.data };
    } else {
      return { success: false, error: 'API вернул неверный формат данных' };
    }
  } catch (error) {
    console.error('Ошибка загрузки услуг:', error.message);
    return { success: false, error: error.message };
  }
});

// Создание пинкода
ipcMain.handle('create-pincode', async (event, { projectPath, services }) => {
  try {
    const dbPath = path.join(projectPath, 'database.json');
    
    // Загрузка базы данных
    let database = { pincodes: {}, orders: {} };
    if (fs.existsSync(dbPath)) {
      database = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
    
    // Генерация пинкода
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pincode = '';
    do {
      pincode = '';
      for (let i = 0; i < 16; i++) {
        pincode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (database.pincodes[pincode]);
    
    // Добавление пинкода
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
    
    // Сохранение базы данных
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

// Коммит и пуш в GitHub
ipcMain.handle('git-push', async (event, { projectPath, message, githubToken, githubRepo }) => {
  try {
    const git = simpleGit(projectPath);
    
    // Если есть токен, настраиваем remote с токеном
    if (githubToken && githubRepo) {
      const repoUrl = githubRepo.replace('https://', `https://${githubToken}@`);
      try {
        await git.removeRemote('origin');
      } catch (e) {
        // Игнорируем если remote не существует
      }
      await git.addRemote('origin', repoUrl);
    }
    
    await git.add('database.json');
    await git.commit(message || 'Update database');
    await git.push('origin', 'main');
    
    return { success: true };
  } catch (error) {
    console.error('Git push error:', error);
    return { success: false, error: error.message };
  }
});

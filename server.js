require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Путь к файлу базы данных
const DB_FILE = path.join(__dirname, 'database.json');

// Загрузка базы данных из файла
function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Ошибка загрузки базы данных:', error);
      return { pincodes: {}, orders: {} };
    }
  }
  return { pincodes: {}, orders: {} };
}

// Сохранение базы данных в файл
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), 'utf8');
  } catch (error) {
    console.error('Ошибка сохранения базы данных:', error);
  }
}

// База данных
let database = loadDatabase();

// Генерация уникального 16-значного пинкода
function generatePincode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pincode = '';
  do {
    pincode = '';
    for (let i = 0; i < 16; i++) {
      pincode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (database.pincodes[pincode]);
  return pincode;
}

// API для получения списка услуг OPTSMM
app.get('/api/services', async (req, res) => {
  try {
    const response = await axios.get(`https://optsmm.ru/api/v2?action=services&key=${process.env.OPTSMM_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения списка услуг' });
  }
});

// Создание нового пинкода с несколькими услугами
app.post('/api/admin/create-pincode', (req, res) => {
  const { services } = req.body; // services - массив объектов {serviceId, serviceName, quantity, description}
  
  if (!services || !Array.isArray(services) || services.length === 0) {
    return res.status(400).json({ error: 'Необходимо указать хотя бы одну услугу' });
  }
  
  const pincode = generatePincode();
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
  
  saveDatabase();
  res.json({ success: true, pincode, data: database.pincodes[pincode] });
});

// Получение всех пинкодов
app.get('/api/admin/pincodes', (req, res) => {
  res.json(Object.values(database.pincodes));
});

// Проверка пинкода
app.post('/api/verify-pincode', (req, res) => {
  const { pincode } = req.body;
  
  if (!database.pincodes[pincode]) {
    return res.json({ valid: false, message: 'Неверный пинкод' });
  }
  
  const availableServices = database.pincodes[pincode].services.filter(s => !s.used);
  
  if (availableServices.length === 0) {
    return res.json({ valid: false, message: 'Все услуги по этому пинкоду использованы' });
  }
  
  res.json({ 
    valid: true, 
    services: availableServices
  });
});

// Создание заказа
app.post('/api/create-order', async (req, res) => {
  const { pincode, serviceId, link, quantity } = req.body;
  
  if (!database.pincodes[pincode]) {
    return res.status(400).json({ error: 'Неверный пинкод' });
  }
  
  const pincodeData = database.pincodes[pincode];
  const service = pincodeData.services.find(s => s.serviceId === serviceId && !s.used);
  
  if (!service) {
    return res.status(400).json({ error: 'Услуга не найдена или уже использована' });
  }
  
  try {
    // Создание заказа через OPTSMM API
    const response = await axios.post('https://optsmm.ru/api/v2', null, {
      params: {
        key: process.env.OPTSMM_API_KEY,
        action: 'add',
        service: service.serviceId,
        link: link,
        quantity: quantity || service.quantity
      }
    });
    
    if (response.data.order) {
      const orderId = response.data.order;
      
      // Сохранение заказа
      database.orders[orderId] = {
        orderId,
        pincode,
        link,
        quantity: quantity || service.quantity,
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        status: 'Awaiting',
        createdAt: new Date().toISOString()
      };
      
      // Отметка услуги как использованной
      service.used = true;
      service.orderId = orderId;
      
      saveDatabase();
      
      res.json({ 
        success: true, 
        orderId,
        message: 'Заказ успешно создан!' 
      });
    } else {
      res.status(400).json({ error: response.data.error || 'Ошибка создания заказа' });
    }
  } catch (error) {
    console.error('Ошибка API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Ошибка при создании заказа' });
  }
});

// Получение статуса заказа
app.get('/api/order-status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  
  try {
    const response = await axios.get(`https://optsmm.ru/api/v2?action=status&key=${process.env.OPTSMM_API_KEY}&order=${orderId}`);
    
    // Обновление статуса в базе
    if (database.orders[orderId]) {
      database.orders[orderId].status = response.data.status;
      database.orders[orderId].charge = response.data.charge;
      database.orders[orderId].start_count = response.data.start_count;
      database.orders[orderId].remains = response.data.remains;
      saveDatabase();
    }
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения статуса' });
  }
});

// Получение всех заказов по пинкоду
app.get('/api/orders-by-pincode/:pincode', (req, res) => {
  const { pincode } = req.params;
  
  const orders = Object.values(database.orders).filter(order => order.pincode === pincode);
  res.json(orders);
});

// Получение всех заказов
app.get('/api/admin/orders', (req, res) => {
  res.json(Object.values(database.orders));
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});

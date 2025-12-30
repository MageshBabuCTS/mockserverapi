const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const path = require('path');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// Define the API prefix
const API_PREFIX = '/api/v1';

// Directory for JSON files
const dataDir = path.join(__dirname, 'data');

// Create a map of resource names to lowdb instances
const dbMap = {};
fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.json')) {
    const resourceName = file.replace('.json', ''); // e.g., 'customer', 'product'
    const adapter = new FileSync(path.join(dataDir, file));
    dbMap[resourceName] = low(adapter);
  }
});

// Create a merged DB for json-server router
const db = {};
Object.keys(dbMap).forEach(resource => {
  db[resource] = dbMap[resource].get(resource).value() || [];
});

// Create router with merged data
const router = jsonServer.router(db, { id: 'id' });

// Custom ID generation
router.db._.id = 'id';
router.db._.createId = function (coll) {
  return String(coll.length + 1);
};

// Apply middlewares
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Import response constants
const { loginResponses, profileResponses } = require('./responses');

// Custom API handlers
const apiHandlers = {
  'auth/login': (req, res) => {
    const { username, password } = req.body;
    console.log("username and password ",username,password);
    if (!username || !password || username.length <= 3 || password.length <= 6) {
      return res.status(400).jsonp(loginResponses.badRequest);
    }
    const users = dbMap.users.get('users').value() || [];   
    const user = users.find(u => u.username === username && u.password === password);
     console.log(loginResponses.success['jwt'],"users details ",user);

    if (user) {
      // Use the success response constant and add the token dynamically
      res.jsonp({ ...user, ['jwt']:loginResponses.success['jwt'] });
    } else {
      // Use the failure response constant
      res.status(401).jsonp(loginResponses.failure);
    }
  },

  'profile': (req, res) => {
    const userProfile = db.users[0];

    if (userProfile) {
      // Use the success response constant and add the profile data
      res.jsonp({ ...profileResponses.success, profile: { username: userProfile.username, id: userProfile.id } });
    } else {
      res.status(404).jsonp(profileResponses.failure);
    }
  }
};

// Register custom routes with API prefix
Object.entries(apiHandlers).forEach(([path, handler]) => {
  const fullPath = `${API_PREFIX}/${path}`;
  // Use POST for login, GET for profile
  if (path === 'auth/login') {
    server.post(fullPath, handler);
  } else {
    server.get(fullPath, handler);
  }
  console.log(`Registered handler for: ${fullPath}`);
});

// Custom middleware to handle POST requests and write to correct file
// Custom middleware to handle POST, PUT, and DELETE requests
server.use((req, res, next) => {
  const resource = req.path.replace(`${API_PREFIX}/`, '').split('/')[0]; // e.g., 'products'
  if (!dbMap[resource]) return next(); // Skip if resource doesn't exist
  
  if (req.method === 'GET') {
    const pathParts = req.path.replace(`${API_PREFIX}/`, '').split('/');
    const resource = pathParts[0];
    const id = pathParts[1]; // This will be '1' in /products/1
    
    // 1. If there is an ID in the URL (e.g., /api/v1/products/1)
    if (id) {
      const item = dbMap[resource].get(resource).find({ id: String(id) }).value();
      return item ? res.jsonp(item) : res.status(404).jsonp({ error: 'Not found' });
    }

    // 2. If there are Query Params (e.g., /api/v1/products?category=electronics)
    const queryKeys = Object.keys(req.query);
    if (queryKeys.length > 0) {
       let data = dbMap[resource].get(resource).value() || [];
       data = data.filter(item => {
         return queryKeys.every(key => String(item[key]).toLowerCase() === String(req.query[key]).toLowerCase());
       });
       return res.jsonp(data);
    }
    
    // 3. Otherwise, let the default router handle it (Standard list fetch)
    return next();
  }

  if (req.method === 'POST') {
    const data = req.body;
    // Ensure the data has an 'id' (string, per createId)
    if (!data.id) {
      data.id = String(dbMap[resource].get(resource).value().length + 1);
    }
    try {
      // Persist to the correct JSON file
      dbMap[resource].get(resource).push(data).write();
      // Update in-memory db for router consistency
      db[resource] = dbMap[resource].get(resource).value();
      return res.jsonp(data);
    } catch (e) {
      return res.status(500).jsonp({ error: 'Failed to save data' });
    }
  } else if (req.method === 'PUT') {
    const id = req.path.split('/').pop(); // e.g., '/api/v1/products/1' -> '1'
    const data = req.body;
    try {
      // Update the resource in the correct JSON file
      const resourceData = dbMap[resource].get(resource);
      const index = resourceData.findIndex(item=> String(item.id) === String(id)).value();
      //const index = resourceData.findIndex({ id }).value();
      if (index === -1) {
        return res.status(404).jsonp({ error: `${resource} not found` });
      }
      resourceData.splice(index, 1, { ...data, id }).write();
      // Update in-memory db
      db[resource] = dbMap[resource].get(resource).value();
      return res.jsonp(data);
    } catch (e) {
      return res.status(500).jsonp({ error: 'Failed to update data' });
    }
  } else if (req.method === 'DELETE') {
    const id = req.path.split('/').pop();
    try {
      // Delete from the correct JSON file
      const resourceData = dbMap[resource].get(resource);
     const index = resourceData.findIndex(item=> String(item.id) === String(id)).value();
      if (index === -1) {
        return res.status(404).jsonp({ error: `${resource} not found` });
      }
      resourceData.splice(index, 1).write();
      // Update in-memory db
      db[resource] = dbMap[resource].get(resource).value();
      return res.status(204).jsonp({});
    } catch (e) {
      return res.status(500).jsonp({ error: 'Failed to delete data' });
    }
  }

  next();
});

// Apply router for other CRUD operations
server.use(API_PREFIX, router);

server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});
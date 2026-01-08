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
if (fs.existsSync(dataDir)) {
    fs.readdirSync(dataDir).forEach(file => {
        if (file.endsWith('.json')) {
            const resourceName = file.replace('.json', '');
            const adapter = new FileSync(path.join(dataDir, file));
            dbMap[resourceName] = low(adapter);
        }
    });
}

// Create a merged DB for json-server router
const db = {};
Object.keys(dbMap).forEach(resource => {
    db[resource] = dbMap[resource].get(resource).value() || [];
});

const router = jsonServer.router(db, { id: 'id' });

/**
 * Reusable function to extract path parameters from request
 * Uses optional chaining for safe access
 */
const extractPathParams = (req) => {
    const cleanPath = req?.path?.replace(`${API_PREFIX}/`, '') || '';
    const pathParts = cleanPath.split('/');
    
    return {
        parentResource: pathParts?.[0],
        parentId: pathParts?.[1],
        childResource: pathParts?.[2],
        childId: pathParts?.[3],
        isNested: pathParts?.length >= 3,
        pathParts
    };
};

server.use(middlewares);
server.use(jsonServer.bodyParser);

const { loginResponses, profileResponses } = require('./responses');

// Custom API handlers (Auth/Profile)
const apiHandlers = {
    'auth/login': (req, res) => {
        const { username, password } = req.body;
        if (!username || !password || username.length <= 3 || password.length <= 6) {
            return res.status(400).jsonp(loginResponses.badRequest);
        }
        const users = dbMap.users ? dbMap.users.get('users').value() : [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            res.jsonp({ ...user, jwt: loginResponses.success.jwt });
        } else {
            res.status(401).jsonp(loginResponses.failure);
        }
    },
    'profiles': (req, res) => {
        // const { parentId } = extractPathParams(req);
        //const profileId = req.parentResource.parentId ;
        console.log("profileId",req)
        
        const userProfile = db.users ? db.users[0] : null;
        if (userProfile) {
            res.jsonp({ ...profileResponses.success, profile: { username: userProfile.username, id: userProfile.id } });
        } else {
            res.status(404).jsonp(profileResponses.failure);
        }
    }
};

Object.entries(apiHandlers).forEach(([path, handler]) => {
    const fullPath = `${API_PREFIX}/${path}`;
    path === 'auth/login' ? server.post(fullPath, handler) : server.get(fullPath, handler);
});





/**
 * CORE LOGIC: Nested Resource Handler & CRUD Middleware
 */
server.use((req, res, next) => {
    const { parentResource, parentId, childResource, childId, isNested, pathParts } = extractPathParams(req);

    // GET Logic with Nested Support
    if (req.method === 'GET') {
        if (isNested && dbMap[childResource]) {
            let data = dbMap[childResource].get(childResource).value() || [];
            const parentKey = parentResource.endsWith('s') 
                ? `${parentResource.slice(0, -1)}Id` 
                : `${parentResource}Id`;

            let filtered = data.filter(item => String(item[parentKey]) === String(parentId));

            if (childId) {
                const specificChild = filtered.find(item => String(item.id) === String(childId));
                return specificChild ? res.jsonp(specificChild) : res.status(404).jsonp({ error: 'Child resource not found' });
            }

            return res.jsonp(filtered);
        }

        if (pathParts.length === 2 && dbMap[parentResource]) {
            const item = dbMap[parentResource].get(parentResource).find({ id: String(parentId) }).value();
            return item ? res.jsonp(item) : res.status(404).jsonp({ error: 'Not found' });
        }
    }

    // CRUD Persistence Logic (POST, PUT, DELETE)
    const resource = parentResource; 
    if (!dbMap[resource]) return next();

    if (req.method === 'POST') {
        const data = req.body;
        const targetColl = isNested ? childResource : parentResource;
        
        // SEQUENTIAL ID GENERATION: Look at the specific file's existing data length
        if (!data.id) {
            const currentData = dbMap[targetColl].get(targetColl).value() || [];
            data.id = String(currentData.length + 1);
        }
        
        if (isNested) {
            const parentKey = parentResource.endsWith('s') ? `${parentResource.slice(0, -1)}Id` : `${parentResource}Id`;
            data[parentKey] = parentId;
            
            dbMap[childResource].get(childResource).push(data).write();
            db[childResource] = dbMap[childResource].get(childResource).value();
            return res.status(201).jsonp(data);
        }

        dbMap[resource].get(resource).push(data).write();
        db[resource] = dbMap[resource].get(resource).value();
        return res.status(201).jsonp(data);
    }

    if (req.method === 'PUT' || req.method === 'DELETE') {
        const targetResource = isNested ? childResource : parentResource;
        const targetId = isNested ? childId : parentId;
        const resourceData = dbMap[targetResource].get(targetResource);
        
        const index = resourceData.findIndex(item => String(item.id) === String(targetId)).value();
        if (index === -1) return res.status(404).jsonp({ error: 'Resource not found' });

        if (req.method === 'PUT') {
            resourceData.splice(index, 1, { ...req.body, id: targetId }).write();
            db[targetResource] = dbMap[targetResource].get(targetResource).value();
            return res.jsonp(req.body);
        } else {
            resourceData.splice(index, 1).write();
            db[targetResource] = dbMap[targetResource].get(targetResource).value();
            return res.status(204).jsonp({});
        }
    }

    next();
});

server.use(API_PREFIX, router);

server.listen(3000, () => {
    console.log('Mock Server is running on http://localhost:3000');
    //console.log(`Example: ${API_PREFIX}/trails/9/phases/2`);
});
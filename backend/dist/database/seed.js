"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const audit_log_entity_1 = require("./audit-log.entity");
const task_entity_1 = require("./task.entity");
const user_entity_1 = require("./user.entity");
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'taskdb',
    entities: [user_entity_1.User, task_entity_1.Task, audit_log_entity_1.AuditLog],
    synchronize: true,
});
const SEED_USERS = [
    { id: 'a0000000-0000-0000-0000-000000000001', firstName: 'Admin', lastName: 'User', email: 'admin@app.com', password: 'admin123', role: user_entity_1.Role.ADMIN },
    { id: 'a0000000-0000-0000-0000-000000000002', firstName: 'Regular', lastName: 'User', email: 'user@app.com', password: 'user123', role: user_entity_1.Role.USER },
];
async function seed() {
    await dataSource.initialize();
    const usersRepo = dataSource.getRepository(user_entity_1.User);
    for (const seedUser of SEED_USERS) {
        const exists = await usersRepo.findOne({ where: { email: seedUser.email } });
        if (exists) {
            console.log(`User ${seedUser.email} already exists, skipping.`);
            continue;
        }
        const hashed = await bcrypt.hash(seedUser.password, 10);
        await usersRepo.save(usersRepo.create({ id: seedUser.id, firstName: seedUser.firstName, lastName: seedUser.lastName, email: seedUser.email, password: hashed, role: seedUser.role }));
        console.log(`Created user: ${seedUser.email}`);
    }
    console.log('Seeding complete.');
    await dataSource.destroy();
}
seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map
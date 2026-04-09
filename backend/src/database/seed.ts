import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { Task } from './task.entity';
import { Role, User } from './user.entity';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'taskdb',
  entities: [User, Task, AuditLog],
  synchronize: true,
});

const SEED_USERS = [
  { id: 'a0000000-0000-0000-0000-000000000001', firstName: 'Admin', lastName: 'User', email: 'admin@app.com', password: 'admin123', role: Role.ADMIN },
  { id: 'a0000000-0000-0000-0000-000000000002', firstName: 'Regular', lastName: 'User', email: 'user@app.com', password: 'user123', role: Role.USER },
];

async function seed() {
  await dataSource.initialize();
  const usersRepo = dataSource.getRepository(User);

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

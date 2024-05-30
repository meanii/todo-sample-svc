import fs from 'node:fs/promises';
import path from 'node:path';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';

/**
 * @description A class to represent a Swagger
 */
export class Swagger {
    public static async setup(app: Express) {
        const docpath = path.resolve(process.cwd(), `src`, 'docs', 'swagger.yaml');
        const swaggerDocument = await fs.readFile(docpath, 'utf8');
        const swaggerDoc = yaml.parse(swaggerDocument);
        app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    }
}
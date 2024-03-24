import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as fs from 'node:fs';

function generateApiSpecs(doc: OpenAPIObject) {
  const filePath = join(__dirname, 'swagger');
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }
  fs.writeFileSync(join(filePath, 'swagger-spec.json'), JSON.stringify(doc));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservice = app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_ENDPOINT],
        },
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  const config = new DocumentBuilder()
    .setTitle('Awards Service')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  generateApiSpecs(document);

  await app.startAllMicroservices();
  await app.listen(3003);
}
bootstrap();

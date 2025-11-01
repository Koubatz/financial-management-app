import 'reflect-metadata';
import { describe, beforeEach, it, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService]
    }).compile();

    controller = moduleRef.get(AppController);
  });

  it('returns the hello message', () => {
    expect(controller.getHello()).toBe('Hello World!');
  });
});

import request from 'supertest';
import { app } from '../server';
import { prisma } from '../libs/prisma';

// Mock prisma client
jest.mock('../libs/prisma', () => ({
  prisma: {
    pet: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as unknown as {
  pet: {
    create: jest.Mock;
    findFirst: jest.Mock;
  };
  user: {
    findUnique: jest.Mock;
  };
};

describe('Pet Endpoints', () => {
  const validPetData = {
    breed: 'Golden Retriever',
    color: 'Golden',
    dateOfBirth: '2020-05-15T00:00:00.000Z',
    gender: 'MALE',
    groomingPreference: {
      coatType: 'LONG',
      notes: 'Allergic to some shampoos',
      specialInstructions: 'Prefers warm water',
      temperament: 'FRIENDLY',
    },
    name: 'Buddy',
    size: 'MEDIUM',
    species: 'DOG',
    weight: 27,
  };

  const fakeUser = {
    clerkId: 'clerk-user-123',
    id: 'user-id-123',
    isActive: true,
  };

  const fakePet = {
    ...validPetData,
    createdAt: new Date(),
    id: 'pet-id-123',
    ownerId: fakeUser.id,
    PetGroomingPreference: {
      id: 'pref-id-123',
      petId: 'pet-id-123',
      ...validPetData.groomingPreference,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should add a new pet successfully', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(fakeUser);
    mockedPrisma.pet.findFirst.mockResolvedValue(null); // No duplicate name
    mockedPrisma.pet.create.mockResolvedValue(fakePet);

    const token = 'test-valid-jwt';

    const response = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(validPetData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(validPetData.name);
    expect(mockedPrisma.pet.create).toHaveBeenCalled();
  });

  test('should fail if pet name already exists for owner', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue(fakeUser);
    mockedPrisma.pet.findFirst.mockResolvedValue(fakePet); // Duplicate found

    const token = 'test-valid-jwt';

    const response = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${token}`)
      .send(validPetData)
      .expect(409);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/already exists/i);
    expect(mockedPrisma.pet.create).not.toHaveBeenCalled();
  });

  test('should fail if validation fails', async () => {
    const token = 'test-valid-jwt';

    const response = await request(app)
      .post('/api/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validPetData, name: '' }) // Invalid name
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/validation/i);
    expect(mockedPrisma.pet.create).not.toHaveBeenCalled();
  });
});

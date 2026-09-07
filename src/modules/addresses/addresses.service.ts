import prisma from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

interface AddressData {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function createAddress(userId: string, data: AddressData) {
  const count = await prisma.address.count({ where: { userId } });
  const isDefault = count === 0; // First address auto-default

  return prisma.address.create({
    data: { ...data, userId, isDefault },
  });
}

export async function updateAddress(userId: string, addressId: string, data: Partial<AddressData>) {
  await getOwnedAddress(userId, addressId);
  return prisma.address.update({ where: { id: addressId }, data });
}

export async function deleteAddress(userId: string, addressId: string) {
  const address = await getOwnedAddress(userId, addressId);
  await prisma.address.delete({ where: { id: addressId } });

  // If deleted address was default, set the next one as default
  if (address.isDefault) {
    const next = await prisma.address.findFirst({ where: { userId }, orderBy: { createdAt: 'asc' } });
    if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
  }
}

export async function setDefaultAddress(userId: string, addressId: string) {
  await getOwnedAddress(userId, addressId);

  await prisma.$transaction([
    prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
    prisma.address.update({ where: { id: addressId }, data: { isDefault: true } }),
  ]);

  return prisma.address.findUnique({ where: { id: addressId } });
}

export async function getAddressById(userId: string, addressId: string) {
  return getOwnedAddress(userId, addressId);
}

async function getOwnedAddress(userId: string, addressId: string) {
  const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!address) throw new AppError('Address not found', 404);
  return address;
}

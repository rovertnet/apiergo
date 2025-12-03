import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async create(createPartnerDto: CreatePartnerDto) {
    const partner = await this.prisma.partner.create({
      data: createPartnerDto,
    });

    return this.transformPartner(partner);
  }

  async findAll() {
    const partners = await this.prisma.partner.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return partners.map((partner) => this.transformPartner(partner));
  }

  async findOne(id: number) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: BigInt(id) },
    });

    if (!partner) {
      throw new NotFoundException(`Partenaire #${id} non trouvé`);
    }

    return this.transformPartner(partner);
  }

  async update(id: number, updatePartnerDto: UpdatePartnerDto) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: BigInt(id) },
    });

    if (!partner) {
      throw new NotFoundException(`Partenaire #${id} non trouvé`);
    }

    const updatedPartner = await this.prisma.partner.update({
      where: { id: BigInt(id) },
      data: updatePartnerDto,
    });

    return this.transformPartner(updatedPartner);
  }

  async remove(id: number) {
    const partner = await this.prisma.partner.findUnique({
      where: { id: BigInt(id) },
    });

    if (!partner) {
      throw new NotFoundException(`Partenaire #${id} non trouvé`);
    }

    // Hard delete as per schema (no deletedAt)
    return this.prisma.partner.delete({
      where: { id: BigInt(id) },
    });
  }

  private transformPartner(partner: any) {
    return {
      ...partner,
      id: partner.id.toString(),
    };
  }
}

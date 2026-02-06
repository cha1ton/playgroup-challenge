import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { unlink } from 'fs/promises';
import { join } from 'path';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  private readonly uploadDir = join(process.cwd(), 'uploads', 'products');

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  private imageUrl(filename: string) {
    const base = process.env.API_BASE_URL || 'http://localhost:3001';
    return `${base}/uploads/products/${filename}`;
  }

  private async safeDeleteFile(filename?: string) {
    if (!filename) return;
    try {
      await unlink(join(this.uploadDir, filename));
    } catch {
      // si no existe no rompemos nada
    }
  }

  async create(dto: CreateProductDto, imageFilename: string) {
    return this.productModel.create({ ...dto, imageFilename });
  }

  async findAll() {
    const products = await this.productModel.find().sort({ createdAt: -1 }).lean();
    return products.map((p) => ({
      ...p,
      imageUrl: this.imageUrl(p.imageFilename),
    }));
  }

  async findOne(id: string) {
    const p = await this.productModel.findById(id).lean();
    if (!p) throw new NotFoundException('Product not found');

    return {
      ...p,
      imageUrl: this.imageUrl(p.imageFilename),
    };
  }

  async update(id: string, dto: UpdateProductDto, newImage?: string) {
    const current = await this.productModel.findById(id);
    if (!current) throw new NotFoundException('Product not found');

    // Si se sube nueva imagen se borra la anterior
    if (newImage && current.imageFilename) {
      await this.safeDeleteFile(current.imageFilename);
      current.imageFilename = newImage;
    }

    current.name = dto.name ?? current.name;
    current.description = dto.description ?? current.description;

    await current.save();

    const saved = current.toObject();
    return {
      ...saved,
      imageUrl: this.imageUrl(saved.imageFilename),
    };
  }

  async remove(id: string) {
    const p = await this.productModel.findById(id);
    if (!p) throw new NotFoundException('Product not found');

    await this.safeDeleteFile(p.imageFilename);

    await p.deleteOne();
    return { deleted: true };
  }
}

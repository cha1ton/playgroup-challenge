import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  private withImageUrl(p: any) {
    const base = process.env.API_BASE_URL || 'http://localhost:3001';
    return {
      ...p,
      imageUrl: `${base}/uploads/products/${p.imageFilename}`,
    };
  }

  create(dto: CreateProductDto, imageFilename: string) {
    return this.productModel.create({ ...dto, imageFilename });
  }

  async findAll() {
    const products = await this.productModel.find().sort({ createdAt: -1 }).lean();
    return products.map((p) => this.withImageUrl(p));
  }

  async findOne(id: string) {
    const p = await this.productModel.findById(id).lean();
    if (!p) throw new NotFoundException('Product not found');
    return this.withImageUrl(p);
  }

  async update(id: string, dto: UpdateProductDto, imageFilename?: string) {
    const update: any = { ...dto };
    if (imageFilename) update.imageFilename = imageFilename;

    const p = await this.productModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean();

    if (!p) throw new NotFoundException('Product not found');
    return this.withImageUrl(p);
  }

  async remove(id: string) {
    const p = await this.productModel.findByIdAndDelete(id).lean();
    if (!p) throw new NotFoundException('Product not found');
    return { deleted: true };
  }
}

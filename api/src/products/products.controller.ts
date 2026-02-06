import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

function fileNameFactory(_: any, file: Express.Multer.File, cb: Function) {
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  cb(null, `${unique}${extname(file.originalname)}`);
}

function imageFileFilter(_: any, file: Express.Multer.File, cb: Function) {
  if (!file.mimetype?.startsWith('image/')) {
    return cb(new BadRequestException('Only image files are allowed'), false);
  }
  cb(null, true);
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: fileNameFactory,
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
    }),
  )
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Image is required');
    return this.productsService.create(dto, file.filename);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: fileNameFactory,
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 3 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.update(id, dto, file?.filename);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

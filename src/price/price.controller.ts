import {
  Controller,
  Put,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Delete,
} from '@nestjs/common'
import { PriceService } from './price.service'
import { priceDto } from './dto'
import { AuthGuard } from '../auth/auth.guard'
import { PermissionsGuard } from '../auth/permissions.guard'
import { AuthPermissions } from '../auth/auth.permissions'

@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Put(':id/price')
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  async updatePrice(@Param('id') id: string, @Body() priceData: priceDto) {
    return this.priceService.updatePrice(id, priceData)
  }

  @Delete(':id')
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  async deleteBook(@Param('id') id: number) {
    const deletedBook = await this.priceService.deletePrice(id)
    if (!deletedBook) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return {
      message: 'Book marked as deleted successfully',
      data: deletedBook,
    }
  }
}

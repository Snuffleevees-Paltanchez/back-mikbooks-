import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
} from '@nestjs/common'
import { BookService } from './book.service'
import { BookDto, GetBooksDto, GetBookByISBNDto, BooksResponse } from './dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiTags('Books')
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({
    status: 200,
    description: 'List of books',
    type: BooksResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'No books found',
  })
  async getAllBooks(@Query() query: GetBooksDto) {
    const { page, limit, ...filters } = query
    const books = await this.bookService.getAllBooks(page, limit, filters)
    if (!books || books.total === 0) {
      throw new NotFoundException('No books found')
    }
    return books
  }

  @Get(':id')
  @ApiTags('Books')
  @ApiOperation({ summary: 'Get book by id' })
  @ApiResponse({ status: 200, description: 'Book found', type: BookDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getBookById(@Param('id') id: number) {
    const book = await this.bookService.getBookById(id)
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return book
  }

  @Get('isbn/:isbn')
  @ApiTags('Books')
  @ApiOperation({ summary: 'Get book by ISBN' })
  @ApiResponse({ status: 200, description: 'Book found', type: BookDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getBookByISBN(@Param() { isbn }: GetBookByISBNDto) {
    const book = await this.bookService.getBookByISBN(isbn)
    if (!book) {
      throw new NotFoundException(`Book with isbn ${isbn} not found`)
    }
    return book
  }

  @Post()
  async createBook(@Body() bookDto: BookDto) {
    return this.bookService.createBook(bookDto)
  }

  @Put(':id')
  @ApiTags('Books')
  @ApiOperation({ summary: 'Update book by id' })
  @ApiResponse({ status: 200, description: 'Book updated', type: BookDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async updateBook(@Param('id') id: number, @Body() bookDto: BookDto) {
    const updatedBook = await this.bookService.updateBook(id, bookDto)
    if (!updatedBook) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return updatedBook
  }

  @Delete(':id')
  @ApiTags('Books')
  @ApiOperation({ summary: 'Delete book by id' })
  @ApiResponse({ status: 200, description: 'Book deleted', type: BookDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async deleteBook(@Param('id') id: number) {
    const deletedBook = await this.bookService.deleteBook(id)
    if (!deletedBook) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return {
      message: 'Book deleted successfully',
      data: deletedBook,
    }
  }
}

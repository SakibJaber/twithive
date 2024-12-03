import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PrismaService } from 'src/database/database.service';

@Injectable()
export class TweetService {
  constructor(private prisma: PrismaService) {}

  async create(createTweetDto: CreateTweetDto) {
    const createTweet = await this.prisma.tweet.create({
      data: {
        content: createTweetDto.content,
        image: createTweetDto.image,
        userId: createTweetDto.userId,
      },
    });
    return {
      statusCode: 201,
      message: 'Tweet created successfully',
      data: createTweet,
    };
  }

  async findAll() {
    const tweets = await this.prisma.tweet.findMany({});
    return {
      statusCode: 200,
      message: 'Fetched all tweets successfully',
      data: tweets,
    };
  }

  async findOne(id: number) {
    const tweet = await this.prisma.tweet.findUnique({
      where: {
        id,
      },
    });

    if (!tweet) {
      throw new HttpException(
        `Tweet with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      statusCode: 200,
      message: 'Tweet fetched successfully',
      data: tweet,
    };
  }

  async update(id: number, updateTweetDto: UpdateTweetDto) {
    const tweet = await this.prisma.tweet.findUnique({ where: { id } });

    if (!tweet) {
      throw new HttpException(
        `Tweet with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedTweet = await this.prisma.tweet.update({
      where: { id },
      data: updateTweetDto,
    });

    return {
      statusCode: 200,
      message: 'Tweet updated successfully',
      data: updatedTweet,
    };
  }

  async remove(id: number) {
    const tweet = await this.prisma.tweet.findUnique({ where: { id } });

    if (!tweet) {
      throw new HttpException(
        `tweet with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const deletedTweet = await this.prisma.tweet.delete({ where: { id } });

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: `Successfully deleted tweet with ID ${id}`,
      data: deletedTweet,
    };
  }
}
